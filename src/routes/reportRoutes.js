/**
 * Report Routes
 * All routes are JWT protected
 */

import express from 'express';
import {
  generateEnvironmentalReport,
  generateSocialReport,
  generateGovernanceReport,
  generateSummaryReport,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/reports/environment
 * @desc    Generate Environmental Report
 * @access  Private
 * @query   startDate - Optional start date for filtering (YYYY-MM-DD)
 * @query   endDate - Optional end date for filtering (YYYY-MM-DD)
 */
router.get('/environment', generateEnvironmentalReport);

/**
 * @route   GET /api/reports/social
 * @desc    Generate Social Report
 * @access  Private
 */
router.get('/social', generateSocialReport);

/**
 * @route   GET /api/reports/governance
 * @desc    Generate Governance Report
 * @access  Private
 */
router.get('/governance', generateGovernanceReport);

/**
 * @route   GET /api/reports/summary
 * @desc    Generate ESG Summary Report (combines all three)
 * @access  Private
 * @query   startDate - Optional start date for filtering (YYYY-MM-DD)
 * @query   endDate - Optional end date for filtering (YYYY-MM-DD)
 */
router.get('/summary', generateSummaryReport);

export default router;
