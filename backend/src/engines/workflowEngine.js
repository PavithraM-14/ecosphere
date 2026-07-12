/**
 * Generic Workflow Engine
 * Manages status transitions for any entity
 * Reusable across Challenge, CSR Activity, Compliance, Audit, etc.
 */

import WorkflowHistory from '../models/WorkflowHistory.js';

/**
 * Validate if a status transition is allowed
 * @param {string} workflowName - Name of the workflow (e.g., 'challenge')
 * @param {string} currentStatus - Current status of the entity
 * @param {string} newStatus - Desired new status
 * @param {Object} workflowConfig - Workflow configuration object
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateTransition = (workflowName, currentStatus, newStatus, workflowConfig) => {
  try {
    // Check if workflow exists
    if (!workflowConfig) {
      return { valid: false, error: `Workflow '${workflowName}' not found` };
    }

    const { states, transitions } = workflowConfig;

    // Check if current status exists
    if (!states.includes(currentStatus)) {
      return { valid: false, error: `Current status '${currentStatus}' is not valid for ${workflowName}` };
    }

    // Check if new status exists
    if (!states.includes(newStatus)) {
      return { valid: false, error: `New status '${newStatus}' is not valid for ${workflowName}` };
    }

    // If status is not changing, it's valid (no-op)
    if (currentStatus === newStatus) {
      return { valid: true };
    }

    // Check if transition is allowed
    const allowedTransitions = transitions[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      return { 
        valid: false, 
        error: `Transition from '${currentStatus}' to '${newStatus}' is not allowed` 
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Change status of an entity
 * @param {Model} Model - Mongoose model
 * @param {string} entityId - Entity ID
 * @param {string} newStatus - New status
 * @param {Object} workflowConfig - Workflow configuration
 * @param {string} userId - User making the change
 * @param {string} entityType - Type of entity (e.g., 'challenge')
 * @returns {Promise<Object>} Updated entity
 */
export const changeStatus = async (Model, entityId, newStatus, workflowConfig, userId, entityType) => {
  try {
    // Find the entity
    const entity = await Model.findById(entityId);
    
    if (!entity) {
      throw new Error(`${Model.modelName} not found`);
    }

    const currentStatus = entity.status;

    // Validate transition
    const validation = validateTransition(entityType, currentStatus, newStatus, workflowConfig);
    
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // If status is not changing, return current entity
    if (currentStatus === newStatus) {
      return entity;
    }

    // Update status
    entity.status = newStatus;
    await entity.save();

    // Record history
    await recordHistory(entityType, entityId, currentStatus, newStatus, userId);

    // Log the change
    console.log(`[WORKFLOW ENGINE] ${entityType.toUpperCase()} - ID: ${entityId}, Status: ${currentStatus} → ${newStatus}, User: ${userId}, Timestamp: ${new Date().toISOString()}`);

    return entity;
  } catch (error) {
    throw error;
  }
};

/**
 * Get allowed transitions from current status
 * @param {string} workflowName - Name of the workflow
 * @param {string} currentStatus - Current status
 * @param {Object} workflowConfig - Workflow configuration
 * @returns {Array<string>} Array of allowed next statuses
 */
export const getAllowedTransitions = (workflowName, currentStatus, workflowConfig) => {
  try {
    if (!workflowConfig) {
      return [];
    }

    const { transitions } = workflowConfig;
    return transitions[currentStatus] || [];
  } catch (error) {
    return [];
  }
};

/**
 * Record status change in history
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @param {string} previousStatus - Previous status
 * @param {string} newStatus - New status
 * @param {string} changedBy - User ID who made the change
 * @returns {Promise<Object>} History record
 */
export const recordHistory = async (entityType, entityId, previousStatus, newStatus, changedBy) => {
  try {
    const historyRecord = await WorkflowHistory.create({
      entityType,
      entityId,
      previousStatus,
      newStatus,
      changedBy,
    });

    return historyRecord;
  } catch (error) {
    console.error('Error recording workflow history:', error);
    throw error;
  }
};

/**
 * Get workflow history for an entity
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @returns {Promise<Array>} Array of history records
 */
export const getHistory = async (entityType, entityId) => {
  try {
    const history = await WorkflowHistory.find({
      entityType,
      entityId,
    })
      .sort({ createdAt: -1 })
      .populate('changedBy', 'name email');

    return history;
  } catch (error) {
    throw error;
  }
};
