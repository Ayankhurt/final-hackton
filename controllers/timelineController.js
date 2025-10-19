import File from '../models/File.js';
import Vitals from '../models/Vitals.js';
import FamilyMember from '../models/FamilyMember.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get user's health timeline (reports + vitals)
// @route   GET /api/timeline
// @access  Private
export const getHealthTimeline = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, startDate, endDate, type, familyMemberId } = req.query;

  // Build date filter
  const dateFilter = {};
  if (startDate) {
    dateFilter.$gte = new Date(startDate);
  }
  if (endDate) {
    dateFilter.$lte = new Date(endDate);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let timeline = [];

  // Get reports if type is 'reports' or 'all'
  if (!type || type === 'reports' || type === 'all') {
    const reportQuery = { user: userId };
    if (Object.keys(dateFilter).length > 0) {
      reportQuery.uploadDate = dateFilter;
    }
    if (familyMemberId) {
      reportQuery.familyMember = familyMemberId;
    }

    const reports = await File.find(reportQuery)
      .populate('aiInsight', 'summaryEnglish summaryRomanUrdu abnormalValues doctorQuestions foodRecommendations disclaimer processingDate')
      .sort({ uploadDate: -1 })
      .skip(type === 'reports' ? skip : 0)
      .limit(type === 'reports' ? parseInt(limit) : 1000);

    // Transform reports for timeline
    const reportTimeline = reports.map(report => ({
      id: report._id,
      type: 'report',
      date: report.uploadDate,
      title: report.fileName,
      subtitle: `${report.reportType.replace('-', ' ').toUpperCase()} Report`,
      data: {
        fileName: report.fileName,
        cloudinaryUrl: report.cloudinaryUrl,
        reportType: report.reportType,
        fileSize: report.fileSize,
        mimeType: report.mimeType,
        isProcessed: report.isProcessed,
        aiInsight: report.aiInsight
      }
    }));

    timeline = timeline.concat(reportTimeline);
  }

  // Get vitals if type is 'vitals' or 'all'
  if (!type || type === 'vitals' || type === 'all') {
    const vitalsQuery = { user: userId };
    if (Object.keys(dateFilter).length > 0) {
      vitalsQuery.measurementDate = dateFilter;
    }
    if (familyMemberId) {
      vitalsQuery.familyMember = familyMemberId;
    }

    const vitals = await Vitals.find(vitalsQuery)
      .sort({ measurementDate: -1 })
      .skip(type === 'vitals' ? skip : 0)
      .limit(type === 'vitals' ? parseInt(limit) : 1000);

    // Transform vitals for timeline
    const vitalsTimeline = vitals.map(vital => ({
      id: vital._id,
      type: 'vitals',
      date: vital.measurementDate,
      title: 'Health Vitals',
      subtitle: generateVitalsSubtitle(vital),
      data: {
        bloodPressure: vital.bloodPressure,
        bloodSugar: vital.bloodSugar,
        weight: vital.weight,
        notes: vital.notes
      }
    }));

    timeline = timeline.concat(vitalsTimeline);
  }

  // Sort timeline by date (newest first)
  timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Apply pagination to combined timeline
  let paginatedTimeline = timeline;
  let totalCount = timeline.length;

  if (type === 'all') {
    paginatedTimeline = timeline.slice(skip, skip + parseInt(limit));
  }

  res.json({
    success: true,
    data: {
      timeline: paginatedTimeline,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        hasNext: skip + paginatedTimeline.length < totalCount,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// Helper function to generate vitals subtitle
const generateVitalsSubtitle = (vitals) => {
  const parts = [];
  
  if (vitals.bloodPressure?.systolic && vitals.bloodPressure?.diastolic) {
    parts.push(`BP: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`);
  }
  
  if (vitals.bloodSugar?.value) {
    parts.push(`Sugar: ${vitals.bloodSugar.value} ${vitals.bloodSugar.unit || 'mg/dL'}`);
  }
  
  if (vitals.weight?.value) {
    parts.push(`Weight: ${vitals.weight.value} ${vitals.weight.unit || 'kg'}`);
  }
  
  return parts.length > 0 ? parts.join(' | ') : 'Health measurements';
};

// @desc    Get health summary/dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  // Get recent reports
  const recentReports = await File.find({
    user: userId,
    uploadDate: { $gte: startDate }
  })
    .populate('aiInsight', 'summaryEnglish abnormalValues')
    .sort({ uploadDate: -1 })
    .limit(5);

  // Get recent vitals
  const recentVitals = await Vitals.find({
    user: userId,
    measurementDate: { $gte: startDate }
  })
    .sort({ measurementDate: -1 })
    .limit(5);

  // Count total reports, vitals, and family members
  const totalReports = await File.countDocuments({ user: userId });
  const totalVitals = await Vitals.countDocuments({ user: userId });
  const totalFamilyMembers = await FamilyMember.countDocuments({ user: userId });

  // Get reports by type
  const reportsByType = await File.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$reportType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get latest vitals values
  const latestVitals = await Vitals.findOne({ user: userId })
    .sort({ measurementDate: -1 });

  // Get last activity (most recent report or vital)
  const lastReport = await File.findOne({ user: userId })
    .sort({ uploadDate: -1 });
  const lastVital = await Vitals.findOne({ user: userId })
    .sort({ measurementDate: -1 });
  
  let lastActivity = null;
  if (lastReport && lastVital) {
    lastActivity = new Date(lastReport.uploadDate) > new Date(lastVital.measurementDate) 
      ? lastReport.uploadDate 
      : lastVital.measurementDate;
  } else if (lastReport) {
    lastActivity = lastReport.uploadDate;
  } else if (lastVital) {
    lastActivity = lastVital.measurementDate;
  }

  // Count abnormal values in recent reports
  const reportsWithAbnormalValues = recentReports.filter(report => 
    report.aiInsight && report.aiInsight.abnormalValues && report.aiInsight.abnormalValues.length > 0
  );

  res.json({
    success: true,
    data: {
      summary: {
        totalReports,
        totalVitals,
        totalFamilyMembers,
        recentReportsCount: recentReports.length,
        recentVitalsCount: recentVitals.length,
        abnormalValuesCount: reportsWithAbnormalValues.length,
        lastActivity,
        period: `${days} days`
      },
      recentReports: recentReports.map(report => ({
        id: report._id,
        fileName: report.fileName,
        reportType: report.reportType,
        uploadDate: report.uploadDate,
        isProcessed: report.isProcessed,
        hasAbnormalValues: report.aiInsight && report.aiInsight.abnormalValues && report.aiInsight.abnormalValues.length > 0
      })),
      recentVitals: recentVitals.map(vital => ({
        id: vital._id,
        measurementDate: vital.measurementDate,
        bloodPressure: vital.bloodPressure,
        bloodSugar: vital.bloodSugar,
        weight: vital.weight
      })),
      reportsByType,
      latestVitals: latestVitals ? {
        bloodPressure: latestVitals.bloodPressure,
        bloodSugar: latestVitals.bloodSugar,
        weight: latestVitals.weight,
        measurementDate: latestVitals.measurementDate
      } : null
    }
  });
});
