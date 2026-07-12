/**
 * Workflow Controller
 * Handles workflow status transitions and history retrieval
 */

import * as workflowEngine from '../engines/workflowEngine.js';
import { getWorkflow, hasWorkflow } from '../config/workflows.js';
import { getModel } from '../config/modelRegistry.js';

/**
 * @route   PATCH /api/workflow/:entity/:id/status
 * @desc    Change entity status with workflow validation
 * @access  Private (JWT required)
 */
export const changeEntityStatus = async (req, res) => {
  try {
    const { entity, id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate request body
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required in request body',
      });
    }

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    // Get model from registry
    const Model = getModel(entity);
    
    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    // Check if entity type has a workflow
    if (!hasWorkflow(entity)) {
      return res.status(400).json({
        success: false,
        message: `No workflow defined for entity type '${entity}'`,
      });
    }

    // Get workflow configuration
    const workflowConfig = getWorkflow(entity);

    // Change status using workflow engine
    const updatedEntity = await workflowEngine.changeStatus(
      Model,
      id,
      status,
      workflowConfig,
      userId,
      entity
    );

    // Get allowed next transitions
    const allowedTransitions = workflowEngine.getAllowedTransitions(
      entity,
      updatedEntity.status,
      workflowConfig
    );

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updatedEntity,
      allowedTransitions,
    });
  } catch (error) {
    console.error('Change status error:', error.message);

    // Determine appropriate status code
    let statusCode = 400;
    if (error.message.includes('not found')) {
      statusCode = 404;
    } else if (error.message.includes('not allowed')) {
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/workflow/:entity/:id/history
 * @desc    Get workflow history for an entity
 * @access  Private (JWT required)
 */
export const getWorkflowHistory = async (req, res) => {
  try {
    const { entity, id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    // Get model from registry (to verify entity exists)
    const Model = getModel(entity);
    
    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    // Verify entity exists
    const entityExists = await Model.findById(id);
    if (!entityExists) {
      return res.status(404).json({
        success: false,
        message: `${Model.modelName} not found`,
      });
    }

    // Get history from workflow engine
    const history = await workflowEngine.getHistory(entity, id);

    res.status(200).json({
      success: true,
      message: 'Workflow history retrieved successfully',
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Get workflow history error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/workflow/:entity/:id/transitions
 * @desc    Get allowed transitions for current status
 * @access  Private (JWT required)
 */
export const getAllowedTransitions = async (req, res) => {
  try {
    const { entity, id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    // Get model from registry
    const Model = getModel(entity);
    
    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    // Check if entity type has a workflow
    if (!hasWorkflow(entity)) {
      return res.status(400).json({
        success: false,
        message: `No workflow defined for entity type '${entity}'`,
      });
    }

    // Get entity to check current status
    const entityDoc = await Model.findById(id);
    if (!entityDoc) {
      return res.status(404).json({
        success: false,
        message: `${Model.modelName} not found`,
      });
    }

    // Get workflow configuration
    const workflowConfig = getWorkflow(entity);

    // Get allowed transitions
    const allowedTransitions = workflowEngine.getAllowedTransitions(
      entity,
      entityDoc.status,
      workflowConfig
    );

    res.status(200).json({
      success: true,
      data: {
        currentStatus: entityDoc.status,
        allowedTransitions,
      },
    });
  } catch (error) {
    console.error('Get allowed transitions error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
