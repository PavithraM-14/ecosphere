/**
 * Notification Controller
 * Handles notification-related API requests
 * Consumes notificationService - NO business logic in controller
 */

import * as notificationService from '../services/notificationService.js';

/**
 * @desc    Get all notifications for authenticated user
 * @route   GET /api/notifications
 * @access  Private (JWT required)
 */
export const getNotifications = async (req, res, next) => {
  const startTime = Date.now();

  try {
    // Get user email from authenticated request (service uses email as recipient)
    const recipientId = req.user.email;

    // Call service - NO business logic here
    const notifications = notificationService.getAllNotifications(recipientId);

    // Log endpoint execution
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION API] GET /api/notifications - ${executionTime}ms - Status: 200 - User: ${recipientId}`);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    // Log error
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION API] GET /api/notifications - ${executionTime}ms - Status: 500 - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get unread notifications for authenticated user
 * @route   GET /api/notifications/unread
 * @access  Private (JWT required)
 */
export const getUnreadNotifications = async (req, res, next) => {
  const startTime = Date.now();

  try {
    // Get user email from authenticated request (service uses email as recipient)
    const recipientId = req.user.email;

    // Call service - NO business logic here
    const notifications = notificationService.getUnreadNotifications(recipientId);

    // Log endpoint execution
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION API] GET /api/notifications/unread - ${executionTime}ms - Status: 200 - User: ${recipientId}`);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    // Log error
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION API] GET /api/notifications/unread - ${executionTime}ms - Status: 500 - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private (JWT required)
 */
export const markNotificationAsRead = async (req, res, next) => {
  const startTime = Date.now();

  try {
    const { id } = req.params;

    // Validate notification ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required',
      });
    }

    // Call service - NO business logic here
    const notification = notificationService.markAsRead(id);

    // Log endpoint execution
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION API] PATCH /api/notifications/${id}/read - ${executionTime}ms - Status: 200`);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    // Handle not found error
    if (error.message === 'Notification not found') {
      const executionTime = Date.now() - startTime;
      console.error(`[NOTIFICATION API] PATCH /api/notifications/${req.params.id}/read - ${executionTime}ms - Status: 404`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // Log error
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION API] PATCH /api/notifications/${req.params.id}/read - ${executionTime}ms - Status: 500 - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read for authenticated user
 * @route   PATCH /api/notifications/read-all
 * @access  Private (JWT required)
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  const startTime = Date.now();

  try {
    // Get user email from authenticated request (service uses email as recipient)
    const recipientId = req.user.email;

    // Get all unread notifications for user
    const unreadNotifications = notificationService.getUnreadNotifications(recipientId);

    // Mark each as read
    let markedCount = 0;
    for (const notification of unreadNotifications) {
      notificationService.markAsRead(notification._id);
      markedCount++;
    }

    // Log endpoint execution
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION API] PATCH /api/notifications/read-all - ${executionTime}ms - Status: 200 - User: ${recipientId} - Marked: ${markedCount}`);

    res.status(200).json({
      success: true,
      message: `${markedCount} notification(s) marked as read`,
      data: {
        markedCount,
      },
    });
  } catch (error) {
    // Log error
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION API] PATCH /api/notifications/read-all - ${executionTime}ms - Status: 500 - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private (JWT required)
 */
export const deleteNotification = async (req, res, next) => {
  const startTime = Date.now();

  try {
    const { id } = req.params;

    // Validate notification ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required',
      });
    }

    // Call service - NO business logic here
    const result = notificationService.deleteNotification(id);

    // Log endpoint execution
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION API] DELETE /api/notifications/${id} - ${executionTime}ms - Status: 200`);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    // Handle not found error
    if (error.message === 'Notification not found') {
      const executionTime = Date.now() - startTime;
      console.error(`[NOTIFICATION API] DELETE /api/notifications/${req.params.id} - ${executionTime}ms - Status: 404`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // Log error
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION API] DELETE /api/notifications/${req.params.id} - ${executionTime}ms - Status: 500 - Error: ${error.message}`);
    next(error);
  }
};
