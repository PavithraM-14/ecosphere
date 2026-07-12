/**
 * Notification Service
 * Generate and manage system notifications
 * Types: Badge Unlocked, Challenge Completed, Policy Reminder, Compliance Issue, Reward Redeemed
 */

import mongoose from 'mongoose';

// Notification types enum
export const NOTIFICATION_TYPES = {
  BADGE_UNLOCKED: 'Badge Unlocked',
  CHALLENGE_COMPLETED: 'Challenge Completed',
  POLICY_REMINDER: 'Policy Reminder',
  COMPLIANCE_ISSUE: 'Compliance Issue',
  REWARD_REDEEMED: 'Reward Redeemed',
};

// In-memory notification store (can be replaced with a database model later)
const notificationStore = [];

/**
 * Validate notification data
 * @param {Object} data - Notification data
 * @throws {Error} If data is invalid
 */
const validateNotificationData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Notification data must be a valid object');
  }

  if (!data.title || typeof data.title !== 'string') {
    throw new Error('Notification title is required and must be a string');
  }

  if (!data.message || typeof data.message !== 'string') {
    throw new Error('Notification message is required and must be a string');
  }

  if (!data.type || !Object.values(NOTIFICATION_TYPES).includes(data.type)) {
    throw new Error(`Notification type must be one of: ${Object.values(NOTIFICATION_TYPES).join(', ')}`);
  }

  if (!data.recipient) {
    throw new Error('Notification recipient is required');
  }

  return true;
};

/**
 * Create a new notification
 * @param {Object} data - Notification data
 * @returns {Object} Created notification
 */
export const createNotification = (data) => {
  const startTime = Date.now();
  const functionName = 'createNotification';

  try {
    // Validate notification data
    validateNotificationData(data);

    // Create notification object
    const notification = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: data.title.trim(),
      message: data.message.trim(),
      type: data.type,
      recipient: data.recipient,
      isRead: false,
      createdAt: new Date(),
    };

    // Store notification
    notificationStore.push(notification);

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(
      `[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Type: ${notification.type} - Recipient: ${notification.recipient}`
    );

    return notification;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @returns {Object} Updated notification
 */
export const markAsRead = (notificationId) => {
  const startTime = Date.now();
  const functionName = 'markAsRead';

  try {
    // Validate notification ID
    if (!notificationId || typeof notificationId !== 'string') {
      throw new Error('Notification ID is required and must be a string');
    }

    // Find notification
    const notification = notificationStore.find((n) => n._id === notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    // Mark as read
    notification.isRead = true;
    notification.readAt = new Date();

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - ID: ${notificationId}`);

    return notification;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Get unread notifications for a recipient
 * @param {String} recipientId - Recipient ID
 * @returns {Array} Unread notifications
 */
export const getUnreadNotifications = (recipientId) => {
  const startTime = Date.now();
  const functionName = 'getUnreadNotifications';

  try {
    // Validate recipient ID
    if (!recipientId) {
      throw new Error('Recipient ID is required');
    }

    // Filter unread notifications for recipient
    const unreadNotifications = notificationStore.filter((n) => n.recipient === recipientId && !n.isRead);

    // Handle empty array
    if (unreadNotifications.length === 0) {
      // Log success with empty result
      const executionTime = Date.now() - startTime;
      console.log(
        `[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Recipient: ${recipientId} - Count: 0`
      );
      return [];
    }

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(
      `[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Recipient: ${recipientId} - Count: ${unreadNotifications.length}`
    );

    return unreadNotifications;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Delete notification
 * @param {String} notificationId - Notification ID
 * @returns {Object} Deletion result
 */
export const deleteNotification = (notificationId) => {
  const startTime = Date.now();
  const functionName = 'deleteNotification';

  try {
    // Validate notification ID
    if (!notificationId || typeof notificationId !== 'string') {
      throw new Error('Notification ID is required and must be a string');
    }

    // Find notification index
    const index = notificationStore.findIndex((n) => n._id === notificationId);

    if (index === -1) {
      throw new Error('Notification not found');
    }

    // Remove notification
    const deletedNotification = notificationStore.splice(index, 1)[0];

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - ID: ${notificationId}`);

    return {
      success: true,
      deletedNotification,
      message: 'Notification deleted successfully',
    };
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Get all notifications for a recipient
 * @param {String} recipientId - Recipient ID
 * @returns {Array} All notifications
 */
export const getAllNotifications = (recipientId) => {
  const startTime = Date.now();
  const functionName = 'getAllNotifications';

  try {
    // Validate recipient ID
    if (!recipientId) {
      throw new Error('Recipient ID is required');
    }

    // Filter notifications for recipient
    const notifications = notificationStore.filter((n) => n.recipient === recipientId);

    // Handle empty array
    if (notifications.length === 0) {
      // Log success with empty result
      const executionTime = Date.now() - startTime;
      console.log(
        `[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Recipient: ${recipientId} - Count: 0`
      );
      return [];
    }

    // Sort by creation date (newest first)
    notifications.sort((a, b) => b.createdAt - a.createdAt);

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(
      `[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Recipient: ${recipientId} - Count: ${notifications.length}`
    );

    return notifications;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Clear all notifications (for testing purposes)
 * @returns {Object} Clear result
 */
export const clearAllNotifications = () => {
  const startTime = Date.now();
  const functionName = 'clearAllNotifications';

  try {
    const count = notificationStore.length;
    notificationStore.length = 0;

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[NOTIFICATION SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Cleared: ${count} notifications`);

    return {
      success: true,
      clearedCount: count,
      message: 'All notifications cleared successfully',
    };
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[NOTIFICATION SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};
