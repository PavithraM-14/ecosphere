/**
 * Notification Routes
 * All routes are JWT protected
 */

import express from 'express';
import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT protection to all routes
router.use(protect);

// GET /api/notifications - Get all notifications
router.get('/', getNotifications);

// GET /api/notifications/unread - Get unread notifications
router.get('/unread', getUnreadNotifications);

// PATCH /api/notifications/read-all - Mark all notifications as read
router.patch('/read-all', markAllNotificationsAsRead);

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', markNotificationAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', deleteNotification);

export default router;
