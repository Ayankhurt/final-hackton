import Vitals from '../models/Vitals.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Add new vitals entry
// @route   POST /api/vitals
// @access  Private
export const addVitals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { familyMemberId } = req.body;
  
  const vitalsData = {
    ...req.body,
    user: userId,
    familyMember: familyMemberId || null,
    belongsTo: familyMemberId ? 'family' : 'user'
  };

  const vitals = await Vitals.create(vitalsData);

  res.status(201).json({
    success: true,
    message: 'Vitals added successfully',
    data: {
      vitals: {
        id: vitals._id,
        bloodPressure: vitals.bloodPressure,
        bloodSugar: vitals.bloodSugar,
        weight: vitals.weight,
        notes: vitals.notes,
        measurementDate: vitals.measurementDate,
        createdAt: vitals.createdAt
      }
    }
  });
});

// @desc    Get all user's vitals
// @route   GET /api/vitals
// @access  Private
export const getUserVitals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20, startDate, endDate, familyMemberId } = req.query;

  // Build query
  const query = { user: userId };
  
  if (startDate || endDate) {
    query.measurementDate = {};
    if (startDate) {
      query.measurementDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.measurementDate.$lte = new Date(endDate);
    }
  }
  
  if (familyMemberId) {
    query.familyMember = familyMemberId;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get vitals with family member info
  const vitals = await Vitals.find(query)
    .populate('familyMember', 'name relationship')
    .sort({ measurementDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Vitals.countDocuments(query);

  res.json({
    success: true,
    data: {
      vitals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalVitals: total,
        hasNext: skip + vitals.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get single vitals entry
// @route   GET /api/vitals/:id
// @access  Private
export const getSingleVitals = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const vitals = await Vitals.findOne({ _id: id, user: userId });

  if (!vitals) {
    return res.status(404).json({
      success: false,
      message: 'Vitals entry not found'
    });
  }

  res.json({
    success: true,
    data: {
      vitals: {
        id: vitals._id,
        bloodPressure: vitals.bloodPressure,
        bloodSugar: vitals.bloodSugar,
        weight: vitals.weight,
        notes: vitals.notes,
        measurementDate: vitals.measurementDate,
        createdAt: vitals.createdAt,
        updatedAt: vitals.updatedAt
      }
    }
  });
});

// @desc    Update vitals entry
// @route   PUT /api/vitals/:id
// @access  Private
export const updateVitals = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const vitals = await Vitals.findOneAndUpdate(
    { _id: id, user: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!vitals) {
    return res.status(404).json({
      success: false,
      message: 'Vitals entry not found'
    });
  }

  res.json({
    success: true,
    message: 'Vitals updated successfully',
    data: {
      vitals: {
        id: vitals._id,
        bloodPressure: vitals.bloodPressure,
        bloodSugar: vitals.bloodSugar,
        weight: vitals.weight,
        notes: vitals.notes,
        measurementDate: vitals.measurementDate,
        createdAt: vitals.createdAt,
        updatedAt: vitals.updatedAt
      }
    }
  });
});

// @desc    Delete vitals entry
// @route   DELETE /api/vitals/:id
// @access  Private
export const deleteVitals = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const vitals = await Vitals.findOneAndDelete({ _id: id, user: userId });

  if (!vitals) {
    return res.status(404).json({
      success: false,
      message: 'Vitals entry not found'
    });
  }

  res.json({
    success: true,
    message: 'Vitals deleted successfully'
  });
});

// @desc    Get vitals statistics
// @route   GET /api/vitals/stats
// @access  Private
export const getVitalsStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const vitals = await Vitals.find({
    user: userId,
    measurementDate: { $gte: startDate }
  }).sort({ measurementDate: 1 });

  // Calculate statistics
  const stats = {
    totalEntries: vitals.length,
    bloodPressure: {
      latest: null,
      average: null,
      trends: []
    },
    bloodSugar: {
      latest: null,
      average: null,
      trends: []
    },
    weight: {
      latest: null,
      average: null,
      trends: []
    }
  };

  if (vitals.length > 0) {
    // Blood Pressure stats
    const bpReadings = vitals.filter(v => v.bloodPressure?.systolic && v.bloodPressure?.diastolic);
    if (bpReadings.length > 0) {
      stats.bloodPressure.latest = bpReadings[bpReadings.length - 1].bloodPressure;
      stats.bloodPressure.average = {
        systolic: bpReadings.reduce((sum, v) => sum + v.bloodPressure.systolic, 0) / bpReadings.length,
        diastolic: bpReadings.reduce((sum, v) => sum + v.bloodPressure.diastolic, 0) / bpReadings.length
      };
      stats.bloodPressure.trends = bpReadings.map(v => ({
        date: v.measurementDate,
        systolic: v.bloodPressure.systolic,
        diastolic: v.bloodPressure.diastolic
      }));
    }

    // Blood Sugar stats
    const sugarReadings = vitals.filter(v => v.bloodSugar?.value);
    if (sugarReadings.length > 0) {
      stats.bloodSugar.latest = sugarReadings[sugarReadings.length - 1].bloodSugar;
      stats.bloodSugar.average = sugarReadings.reduce((sum, v) => sum + v.bloodSugar.value, 0) / sugarReadings.length;
      stats.bloodSugar.trends = sugarReadings.map(v => ({
        date: v.measurementDate,
        value: v.bloodSugar.value,
        type: v.bloodSugar.type
      }));
    }

    // Weight stats
    const weightReadings = vitals.filter(v => v.weight?.value);
    if (weightReadings.length > 0) {
      stats.weight.latest = weightReadings[weightReadings.length - 1].weight;
      stats.weight.average = weightReadings.reduce((sum, v) => sum + v.weight.value, 0) / weightReadings.length;
      stats.weight.trends = weightReadings.map(v => ({
        date: v.measurementDate,
        value: v.weight.value
      }));
    }
  }

  res.json({
    success: true,
    data: {
      stats,
      period: `${days} days`
    }
  });
});
