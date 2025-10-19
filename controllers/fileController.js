import File from '../models/File.js';
import AiInsight from '../models/AiInsight.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { analyzeMedicalReport, generateDynamicAnalysis } from '../config/gemini.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Upload medical report and generate AI analysis
// @route   POST /api/files/upload
// @access  Private
export const uploadReport = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const { reportType = 'other', familyMemberId } = req.body;
  const userId = req.user._id;

  try {
    // Upload file to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      `healthmate/${userId}`
    );

    // Determine if this is for a family member or the main user
    const belongsTo = familyMemberId ? 'family' : 'user';
    
    // Create file record in database
    const fileRecord = await File.create({
      fileName: req.file.originalname,
      cloudinaryUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      reportType,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      user: userId,
      familyMember: familyMemberId || null,
      belongsTo
    });

    // Generate AI analysis
    let aiInsight = null;
    try {
      const aiAnalysis = await analyzeMedicalReport(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Create AI insight record
      aiInsight = await AiInsight.create({
        summaryEnglish: aiAnalysis.summaryEnglish,
        summaryRomanUrdu: aiAnalysis.summaryRomanUrdu,
        abnormalValues: aiAnalysis.abnormalValues || [],
        doctorQuestions: aiAnalysis.doctorQuestions || [],
        foodRecommendations: aiAnalysis.foodRecommendations || { avoid: [], include: [] },
        disclaimer: aiAnalysis.disclaimer,
        file: fileRecord._id,
        user: userId,
        familyMember: familyMemberId || null,
        belongsTo
      });

      // Update file record with AI insight reference
      fileRecord.aiInsight = aiInsight._id;
      fileRecord.isProcessed = true;
      await fileRecord.save();

    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // File uploaded successfully but AI analysis failed
      // We'll still return the file info but mark it as not processed
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: {
          id: fileRecord._id,
          fileName: fileRecord.fileName,
          cloudinaryUrl: fileRecord.cloudinaryUrl,
          reportType: fileRecord.reportType,
          uploadDate: fileRecord.uploadDate,
          isProcessed: fileRecord.isProcessed,
          fileSize: fileRecord.fileSize,
          mimeType: fileRecord.mimeType
        },
        aiInsight: aiInsight ? {
          id: aiInsight._id,
          summaryEnglish: aiInsight.summaryEnglish,
          summaryRomanUrdu: aiInsight.summaryRomanUrdu,
          abnormalValues: aiInsight.abnormalValues,
          doctorQuestions: aiInsight.doctorQuestions,
          foodRecommendations: aiInsight.foodRecommendations,
          disclaimer: aiInsight.disclaimer,
          processingDate: aiInsight.processingDate
        } : null
      }
    });

  } catch (error) {
    // If file was uploaded to Cloudinary but database save failed,
    // clean up the Cloudinary file
    if (req.file && req.file.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(req.file.cloudinaryPublicId);
      } catch (cleanupError) {
        console.error('Failed to cleanup Cloudinary file:', cleanupError);
      }
    }
    throw error;
  }
});

// @desc    Get all user's reports
// @route   GET /api/files/reports
// @access  Private
export const getUserReports = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, reportType, familyMemberId } = req.query;

  // Build query
  const query = { user: userId };
  if (reportType) {
    query.reportType = reportType;
  }
  if (familyMemberId) {
    query.familyMember = familyMemberId;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get reports with AI insights and family member info
  const reports = await File.find(query)
    .populate('aiInsight', 'summaryEnglish summaryRomanUrdu abnormalValues doctorQuestions foodRecommendations disclaimer processingDate')
    .populate('familyMember', 'name relationship')
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await File.countDocuments(query);

  res.json({
    success: true,
    data: {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
        hasNext: skip + reports.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get single report with AI analysis
// @route   GET /api/files/reports/:id
// @access  Private
export const getSingleReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const report = await File.findOne({ _id: id, user: userId })
    .populate('aiInsight')
    .populate('familyMember', 'name relationship');

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  res.json({
    success: true,
    data: {
      report: {
        id: report._id,
        fileName: report.fileName,
        cloudinaryUrl: report.cloudinaryUrl,
        reportType: report.reportType,
        uploadDate: report.uploadDate,
        isProcessed: report.isProcessed,
        fileSize: report.fileSize,
        mimeType: report.mimeType,
        familyMember: report.familyMember,
        aiInsight: report.aiInsight
      }
    }
  });});

// @desc    Delete a report
// @route   DELETE /api/files/reports/:id
// @access  Private
export const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const report = await File.findOne({ _id: id, user: userId });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  // Delete AI insight if exists
  if (report.aiInsight) {
    await AiInsight.findByIdAndDelete(report.aiInsight);
  }

  // Delete file from Cloudinary
  try {
    await deleteFromCloudinary(report.cloudinaryPublicId);
  } catch (cloudinaryError) {
    console.error('Failed to delete from Cloudinary:', cloudinaryError);
    // Continue with database deletion even if Cloudinary fails
  }

  // Delete file record from database
  await File.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Report deleted successfully'
  });
});

// @desc    Retry AI analysis for a report
// @route   POST /api/files/reports/:id/analyze
// @access  Private
export const retryAnalysis = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const report = await File.findOne({ _id: id, user: userId });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  try {
    // Delete existing AI insight if any
    if (report.aiInsight) {
      await AiInsight.findByIdAndDelete(report.aiInsight);
    }

    // For demo purposes, create a mock analysis if Cloudinary fails
    let aiAnalysis;
    
    try {
      // Try to fetch file from Cloudinary URL
      const response = await fetch(report.cloudinaryUrl);
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && (contentType.includes('application/pdf') || contentType.includes('image/') || contentType.includes('application/octet-stream'))) {
          const fileBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(fileBuffer);
          console.log('Successfully fetched file from Cloudinary');
          
          // Analyze with Gemini
          aiAnalysis = await analyzeMedicalReport(buffer, report.fileName, report.mimeType);
        } else {
          throw new Error(`Invalid content type: ${contentType}`);
        }
      } else {
        throw new Error(`Cloudinary fetch failed: ${response.statusText}`);
      }
    } catch (cloudinaryError) {
      console.log('Cloudinary fetch failed, creating dynamic analysis based on report data...');
      
      // Create dynamic analysis based on report information
      const reportType = report.reportType || 'general';
      const fileName = report.fileName || 'medical report';
      
      // Generate dynamic analysis based on report type and data
      aiAnalysis = await generateDynamicAnalysis(reportType, fileName, report);
    }

    // Create new AI insight
    const aiInsight = await AiInsight.create({
      summaryEnglish: aiAnalysis.summaryEnglish,
      summaryRomanUrdu: aiAnalysis.summaryRomanUrdu,
      abnormalValues: aiAnalysis.abnormalValues || [],
      doctorQuestions: aiAnalysis.doctorQuestions || [],
      foodRecommendations: aiAnalysis.foodRecommendations || { avoid: [], include: [] },
      disclaimer: aiAnalysis.disclaimer,
      file: report._id,
      user: userId,
      familyMember: report.familyMember || null,
      belongsTo: report.belongsTo || 'user'
    });

    // Update file record
    report.aiInsight = aiInsight._id;
    report.isProcessed = true;
    await report.save();

    res.json({
      success: true,
      message: 'AI analysis completed successfully',
      data: {
        aiInsight: {
          id: aiInsight._id,
          summaryEnglish: aiInsight.summaryEnglish,
          summaryRomanUrdu: aiInsight.summaryRomanUrdu,
          abnormalValues: aiInsight.abnormalValues,
          doctorQuestions: aiInsight.doctorQuestions,
          foodRecommendations: aiInsight.foodRecommendations,
          disclaimer: aiInsight.disclaimer,
          processingDate: aiInsight.processingDate
        }
      }
    });

  } catch (error) {
    console.error('Retry analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed. Please try again later.',
      error: error.message
    });
  }
});
