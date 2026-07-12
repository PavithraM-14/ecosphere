/**
 * Generic CRUD Routes
 * Dynamic routes that work with any entity registered in modelRegistry
 */

import express from 'express';
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from '../controllers/crudController.js';

const router = express.Router();

// Create a new record
router.post('/:entity', createRecord);

// Get all records (with pagination, sorting, search)
router.get('/:entity', getAllRecords);

// Get a single record by ID
router.get('/:entity/:id', getRecordById);

// Update a record by ID
router.put('/:entity/:id', updateRecord);

// Delete a record by ID
router.delete('/:entity/:id', deleteRecord);

export default router;
