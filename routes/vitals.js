import express from 'express';
import {
  addVitals,
  getUserVitals,
  getSingleVitals,
  updateVitals,
  deleteVitals,
  getVitalsStats
} from '../controllers/vitalsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateVitals } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   POST /api/vitals
// @desc    Add new vitals entry
// @access  Private
router.post('/', authenticateToken, validateVitals, asyncHandler(addVitals));

// @route   GET /api/vitals
// @desc    Get all user's vitals
// @access  Private
router.get('/', authenticateToken, asyncHandler(getUserVitals));

// @route   GET /api/vitals/stats
// @desc    Get vitals statistics
// @access  Private
router.get('/stats', authenticateToken, asyncHandler(getVitalsStats));

// @route   GET /api/vitals/:id
// @desc    Get single vitals entry
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(getSingleVitals));

// @route   PUT /api/vitals/:id
// @desc    Update vitals entry
// @access  Private
router.put('/:id', authenticateToken, validateVitals, asyncHandler(updateVitals));

// @route   DELETE /api/vitals/:id
// @desc    Delete vitals entry
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(deleteVitals));

export default router;
