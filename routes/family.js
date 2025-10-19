import express from 'express';
import {
  addFamilyMember,
  getFamilyMembers,
  getSingleFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getFamilyMemberHealthSummary,
  getFamilyOverview
} from '../controllers/familyController.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   POST /api/family
// @desc    Add a new family member
// @access  Private
router.post('/', authenticateToken, asyncHandler(addFamilyMember));

// @route   GET /api/family/overview
// @desc    Get family overview
// @access  Private
router.get('/overview', authenticateToken, asyncHandler(getFamilyOverview));

// @route   GET /api/family
// @desc    Get all family members
// @access  Private
router.get('/', authenticateToken, asyncHandler(getFamilyMembers));

// @route   GET /api/family/:id
// @desc    Get single family member
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(getSingleFamilyMember));

// @route   GET /api/family/:id/health-summary
// @desc    Get family member's health summary
// @access  Private
router.get('/:id/health-summary', authenticateToken, asyncHandler(getFamilyMemberHealthSummary));

// @route   PUT /api/family/:id
// @desc    Update family member
// @access  Private
router.put('/:id', authenticateToken, asyncHandler(updateFamilyMember));

// @route   DELETE /api/family/:id
// @desc    Delete family member
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(deleteFamilyMember));

export default router;
