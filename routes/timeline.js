import express from 'express';
import {
  getHealthTimeline,
  getDashboardData
} from '../controllers/timelineController.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/timeline
// @desc    Get user's health timeline (reports + vitals)
// @access  Private
router.get('/', authenticateToken, asyncHandler(getHealthTimeline));

// @route   GET /api/dashboard
// @desc    Get health summary/dashboard data
// @access  Private
router.get('/dashboard', authenticateToken, asyncHandler(getDashboardData));

export default router;
