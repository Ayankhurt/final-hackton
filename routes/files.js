import express from 'express';
import {
  uploadReport,
  getUserReports,
  getSingleReport,
  deleteReport,
  retryAnalysis
} from '../controllers/fileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadSingle, handleMulterError } from '../middleware/upload.js';
import { validateFileUpload } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   POST /api/files/upload
// @desc    Upload medical report and generate AI analysis
// @access  Private
router.post('/upload', 
  authenticateToken, 
  uploadSingle, 
  handleMulterError,
  validateFileUpload,
  asyncHandler(uploadReport)
);

// @route   GET /api/files/reports
// @desc    Get all user's reports
// @access  Private
router.get('/reports', authenticateToken, asyncHandler(getUserReports));

// @route   GET /api/files/reports/:id
// @desc    Get single report with AI analysis
// @access  Private
router.get('/reports/:id', authenticateToken, asyncHandler(getSingleReport));

// @route   DELETE /api/files/reports/:id
// @desc    Delete a report
// @access  Private
router.delete('/reports/:id', authenticateToken, asyncHandler(deleteReport));

// @route   POST /api/files/reports/:id/analyze
// @desc    Retry AI analysis for a report
// @access  Private
router.post('/reports/:id/analyze', authenticateToken, asyncHandler(retryAnalysis));

export default router;
