/**
 * Dashboard Routes
 * All routes are JWT protected
 */

import express from 'express';
import {
  getDashboardSummary,
  getDepartmentRanking,
  getLeaderboard,
  getRecentActivities,
  getPendingCompliance,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/dashboard
 * @desc    Get complete dashboard summary
 * @access  Private
 */
router.get('/', getDashboardSummary);

/**
 * @route   GET /api/dashboard/ranking
 * @desc    Get department ranking by carbon emissions
 * @access  Private
 */
router.get('/ranking', getDepartmentRanking);

/**
 * @route   GET /api/dashboard/leaderboard
 * @desc    Get leaderboard (top users by XP)
 * @access  Private
 * @query   limit - Number of users to return (default: 10)
 */
router.get('/leaderboard', getLeaderboard);

/**
 * @route   GET /api/dashboard/activities
 * @desc    Get recent activities
 * @access  Private
 * @query   limit - Number of activities to return (default: 10)
 */
router.get('/activities', getRecentActivities);

/**
 * @route   GET /api/dashboard/compliance
 * @desc    Get pending compliance issues
 * @access  Private
 */
router.get('/compliance', getPendingCompliance);

export default router;
