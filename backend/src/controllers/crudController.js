/**
 * Generic CRUD Controller
 * Handles all CRUD operations for any entity
 * Uses the CRUD Engine and Model Registry
 */

import * as crudEngine from '../engines/crudEngine.js';
import { getModel } from '../config/modelRegistry.js';

/**
 * @route   POST /api/crud/:entity
 * @desc    Create a new record
 * @access  Public (can be protected later)
 */
export const createRecord = async (req, res) => {
  try {
    const { entity } = req.params;
    const Model = getModel(entity);

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    const document = await crudEngine.create(Model, req.body);

    res.status(201).json({
      success: true,
      message: `${Model.modelName} created successfully`,
      data: document,
    });
  } catch (error) {
    console.error('Create error:', error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/crud/:entity
 * @desc    Get all records with pagination, sorting, and search
 * @access  Public (can be protected later)
 */
export const getAllRecords = async (req, res) => {
  try {
    const { entity } = req.params;
    const Model = getModel(entity);

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    const result = await crudEngine.findAll(Model, req.query);

    res.status(200).json({
      success: true,
      message: `${Model.modelName} retrieved successfully`,
      ...result,
    });
  } catch (error) {
    console.error('Get all error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/crud/:entity/:id
 * @desc    Get a single record by ID
 * @access  Public (can be protected later)
 */
export const getRecordById = async (req, res) => {
  try {
    const { entity, id } = req.params;
    const Model = getModel(entity);

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    const document = await crudEngine.findById(Model, id);

    res.status(200).json({
      success: true,
      message: `${Model.modelName} retrieved successfully`,
      data: document,
    });
  } catch (error) {
    console.error('Get by ID error:', error.message);

    const statusCode = error.message.includes('Invalid ID') ? 400 : 404;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   PUT /api/crud/:entity/:id
 * @desc    Update a record by ID
 * @access  Public (can be protected later)
 */
export const updateRecord = async (req, res) => {
  try {
    const { entity, id } = req.params;
    const Model = getModel(entity);

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    const document = await crudEngine.update(Model, id, req.body);

    res.status(200).json({
      success: true,
      message: `${Model.modelName} updated successfully`,
      data: document,
    });
  } catch (error) {
    console.error('Update error:', error.message);

    const statusCode = error.message.includes('Invalid ID') || error.message.includes('empty') ? 400 : 404;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/crud/:entity/:id
 * @desc    Delete a record by ID
 * @access  Public (can be protected later)
 */
export const deleteRecord = async (req, res) => {
  try {
    const { entity, id } = req.params;
    const Model = getModel(entity);

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found',
      });
    }

    const document = await crudEngine.deleteOne(Model, id);

    res.status(200).json({
      success: true,
      message: `${Model.modelName} deleted successfully`,
      data: document,
    });
  } catch (error) {
    console.error('Delete error:', error.message);

    const statusCode = error.message.includes('Invalid ID') ? 400 : 404;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
