/**
 * Workflow Routes
 * Handle workflow status transitions and history
 */

import express from 'express';
import {
  changeEntityStatus,
  getWorkflowHistory,
  getAllowedTransitions,
} from '../controllers/workflowController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All workflow routes require authentication
router.use(protect);

// Change entity status
router.patch('/:entity/:id/status', changeEntityStatus);

// Get workflow history
router.get('/:entity/:id/history', getWorkflowHistory);

// Get allowed transitions
router.get('/:entity/:id/transitions', getAllowedTransitions);

export default router;
