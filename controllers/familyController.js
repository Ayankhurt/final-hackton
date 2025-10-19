import FamilyMember from '../models/FamilyMember.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Add a new family member
// @route   POST /api/family
// @access  Private
export const addFamilyMember = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const familyMemberData = {
    ...req.body,
    managedBy: userId
  };

  // Create family member
  const familyMember = await FamilyMember.create(familyMemberData);

  // Add family member to user's family list
  await User.findByIdAndUpdate(userId, {
    $push: { familyMembers: familyMember._id }
  });

  res.status(201).json({
    success: true,
    message: 'Family member added successfully',
    data: {
      familyMember: {
        id: familyMember._id,
        name: familyMember.name,
        relationship: familyMember.relationship,
        dateOfBirth: familyMember.dateOfBirth,
        gender: familyMember.gender,
        bloodGroup: familyMember.bloodGroup,
        phone: familyMember.phone,
        email: familyMember.email,
        allergies: familyMember.allergies,
        medicalConditions: familyMember.medicalConditions,
        medications: familyMember.medications,
        emergencyContact: familyMember.emergencyContact,
        notes: familyMember.notes,
        createdAt: familyMember.createdAt
      }
    }
  });
});

// @desc    Get all family members
// @route   GET /api/family
// @access  Private
export const getFamilyMembers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const familyMembers = await FamilyMember.find({ 
    managedBy: userId, 
    isActive: true 
  }).sort({ relationship: 1, name: 1 });

  res.json({
    success: true,
    data: {
      familyMembers: familyMembers.map(member => ({
        id: member._id,
        name: member.name,
        relationship: member.relationship,
        age: member.age,
        gender: member.gender,
        bloodGroup: member.bloodGroup,
        phone: member.phone,
        email: member.email,
        allergies: member.allergies,
        medicalConditions: member.medicalConditions,
        medications: member.medications,
        emergencyContact: member.emergencyContact,
        notes: member.notes,
        createdAt: member.createdAt
      }))
    }
  });
});

// @desc    Get single family member
// @route   GET /api/family/:id
// @access  Private
export const getSingleFamilyMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const familyMember = await FamilyMember.findOne({ 
    _id: id, 
    managedBy: userId 
  });

  if (!familyMember) {
    return res.status(404).json({
      success: false,
      message: 'Family member not found'
    });
  }

  res.json({
    success: true,
    data: {
      familyMember: {
        id: familyMember._id,
        name: familyMember.name,
        relationship: familyMember.relationship,
        dateOfBirth: familyMember.dateOfBirth,
        age: familyMember.age,
        gender: familyMember.gender,
        phone: familyMember.phone,
        email: familyMember.email,
        bloodGroup: familyMember.bloodGroup,
        allergies: familyMember.allergies,
        medicalConditions: familyMember.medicalConditions,
        medications: familyMember.medications,
        emergencyContact: familyMember.emergencyContact,
        notes: familyMember.notes,
        createdAt: familyMember.createdAt,
        updatedAt: familyMember.updatedAt
      }
    }
  });
});

// @desc    Update family member
// @route   PUT /api/family/:id
// @access  Private
export const updateFamilyMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const familyMember = await FamilyMember.findOneAndUpdate(
    { _id: id, managedBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!familyMember) {
    return res.status(404).json({
      success: false,
      message: 'Family member not found'
    });
  }

  res.json({
    success: true,
    message: 'Family member updated successfully',
    data: {
      familyMember: {
        id: familyMember._id,
        name: familyMember.name,
        relationship: familyMember.relationship,
        dateOfBirth: familyMember.dateOfBirth,
        age: familyMember.age,
        gender: familyMember.gender,
        phone: familyMember.phone,
        email: familyMember.email,
        bloodGroup: familyMember.bloodGroup,
        allergies: familyMember.allergies,
        medicalConditions: familyMember.medicalConditions,
        medications: familyMember.medications,
        emergencyContact: familyMember.emergencyContact,
        notes: familyMember.notes,
        createdAt: familyMember.createdAt,
        updatedAt: familyMember.updatedAt
      }
    }
  });
});

// @desc    Delete family member (soft delete)
// @route   DELETE /api/family/:id
// @access  Private
export const deleteFamilyMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const familyMember = await FamilyMember.findOneAndUpdate(
    { _id: id, managedBy: userId },
    { isActive: false },
    { new: true }
  );

  if (!familyMember) {
    return res.status(404).json({
      success: false,
      message: 'Family member not found'
    });
  }

  // Remove from user's family list
  await User.findByIdAndUpdate(userId, {
    $pull: { familyMembers: familyMember._id }
  });

  res.json({
    success: true,
    message: 'Family member removed successfully'
  });
});

// @desc    Get family member's health summary
// @route   GET /api/family/:id/health-summary
// @access  Private
export const getFamilyMemberHealthSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const familyMember = await FamilyMember.findOne({ 
    _id: id, 
    managedBy: userId,
    isActive: true 
  });

  if (!familyMember) {
    return res.status(404).json({
      success: false,
      message: 'Family member not found'
    });
  }

  // Get recent reports and vitals for this family member
  const File = (await import('../models/File.js')).default;
  const Vitals = (await import('../models/Vitals.js')).default;

  const recentReports = await File.find({
    familyMember: id,
    user: userId
  })
    .populate('aiInsight', 'summaryEnglish abnormalValues doctorQuestions')
    .sort({ uploadDate: -1 })
    .limit(5);

  const recentVitals = await Vitals.find({
    familyMember: id,
    user: userId
  })
    .sort({ measurementDate: -1 })
    .limit(5);

  const healthSummary = {
    familyMember: {
      id: familyMember._id,
      name: familyMember.name,
      relationship: familyMember.relationship,
      age: familyMember.age,
      bloodGroup: familyMember.bloodGroup
    },
    medicalInfo: {
      allergies: familyMember.allergies,
      activeConditions: familyMember.medicalConditions.filter(c => c.status === 'active'),
      activeMedications: familyMember.medications.filter(m => !m.endDate || m.endDate > new Date())
    },
    recentActivity: {
      reportsCount: recentReports.length,
      vitalsCount: recentVitals.length,
      lastReportDate: recentReports.length > 0 ? recentReports[0].uploadDate : null,
      lastVitalsDate: recentVitals.length > 0 ? recentVitals[0].measurementDate : null
    },
    recentReports: recentReports.map(report => ({
      id: report._id,
      fileName: report.fileName,
      reportType: report.reportType,
      uploadDate: report.uploadDate,
      hasAbnormalValues: report.aiInsight && report.aiInsight.abnormalValues && report.aiInsight.abnormalValues.length > 0
    })),
    recentVitals: recentVitals.map(vital => ({
      id: vital._id,
      measurementDate: vital.measurementDate,
      bloodPressure: vital.bloodPressure,
      bloodSugar: vital.bloodSugar,
      weight: vital.weight
    }))
  };

  res.json({
    success: true,
    data: {
      healthSummary
    }
  });
});

// @desc    Get family overview
// @route   GET /api/family/overview
// @access  Private
export const getFamilyOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const familyMembers = await FamilyMember.find({ 
    managedBy: userId, 
    isActive: true 
  }).sort({ relationship: 1, name: 1 });

  // Get user's own profile
  const user = await User.findById(userId).select('name email profile emergencyContact');

  const File = (await import('../models/File.js')).default;
  const Vitals = (await import('../models/Vitals.js')).default;

  // Get counts for each family member
  const familyOverview = await Promise.all(
    familyMembers.map(async (member) => {
      const reportsCount = await File.countDocuments({
        familyMember: member._id,
        user: userId
      });
      
      const vitalsCount = await Vitals.countDocuments({
        familyMember: member._id,
        user: userId
      });

      const lastReport = await File.findOne({
        familyMember: member._id,
        user: userId
      }).sort({ uploadDate: -1 });

      const lastVitals = await Vitals.findOne({
        familyMember: member._id,
        user: userId
      }).sort({ measurementDate: -1 });

      return {
        id: member._id,
        name: member.name,
        relationship: member.relationship,
        age: member.age,
        bloodGroup: member.bloodGroup,
        reportsCount,
        vitalsCount,
        lastReportDate: lastReport ? lastReport.uploadDate : null,
        lastVitalsDate: lastVitals ? lastVitals.measurementDate : null,
        activeConditions: member.medicalConditions.filter(c => c.status === 'active').length,
        activeMedications: member.medications.filter(m => !m.endDate || m.endDate > new Date()).length
      };
    })
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        emergencyContact: user.emergencyContact
      },
      familyOverview,
      totalMembers: familyMembers.length + 1 // +1 for the main user
    }
  });
});
