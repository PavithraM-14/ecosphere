/**
 * Generic CRUD Engine
 * Provides reusable methods for Create, Read, Update, Delete operations
 * Works with any Mongoose model
 */

/**
 * Create a new document
 * @param {Model} Model - Mongoose model
 * @param {Object} data - Document data
 * @returns {Promise<Object>} Created document
 */
export const create = async (Model, data) => {
  try {
    const document = await Model.create(data);
    
    // Log operation
    console.log(`[CRUD ENGINE] CREATE - Entity: ${Model.modelName}, ID: ${document._id}, Timestamp: ${new Date().toISOString()}`);
    
    return document;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new Error(messages.join(', '));
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`Duplicate value for field: ${field}`);
    }
    
    throw error;
  }
};

/**
 * Find all documents with optional filtering, pagination, sorting, and search
 * @param {Model} Model - Mongoose model
 * @param {Object} query - Query parameters (page, limit, sort, order, search)
 * @returns {Promise<Object>} Documents with pagination info
 */
export const findAll = async (Model, query = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search = '',
    } = query;

    // Parse pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter = {};

    // Search across all string fields
    if (search) {
      const stringFields = [];
      
      // Get all string fields from schema
      Object.keys(Model.schema.paths).forEach((field) => {
        if (Model.schema.paths[field].instance === 'String') {
          stringFields.push(field);
        }
      });

      // Create OR conditions for all string fields
      if (stringFields.length > 0) {
        filter.$or = stringFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        }));
      }
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    // Execute query
    const [documents, totalRecords] = await Promise.all([
      Model.find(filter).sort(sortObj).skip(skip).limit(limitNumber),
      Model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limitNumber);

    return {
      data: documents,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalRecords,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Find a document by ID
 * @param {Model} Model - Mongoose model
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Found document
 */
export const findById = async (Model, id) => {
  try {
    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid ID format');
    }

    const document = await Model.findById(id);

    if (!document) {
      throw new Error(`${Model.modelName} not found`);
    }

    return document;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a document by ID
 * @param {Model} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated document
 */
export const update = async (Model, id, data) => {
  try {
    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid ID format');
    }

    // Check if update data is empty
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data cannot be empty');
    }

    const document = await Model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!document) {
      throw new Error(`${Model.modelName} not found`);
    }

    // Log operation
    console.log(`[CRUD ENGINE] UPDATE - Entity: ${Model.modelName}, ID: ${id}, Timestamp: ${new Date().toISOString()}`);

    return document;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new Error(messages.join(', '));
    }
    
    throw error;
  }
};

/**
 * Delete a document by ID
 * @param {Model} Model - Mongoose model
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Deleted document
 */
export const deleteOne = async (Model, id) => {
  try {
    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid ID format');
    }

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      throw new Error(`${Model.modelName} not found`);
    }

    // Log operation
    console.log(`[CRUD ENGINE] DELETE - Entity: ${Model.modelName}, ID: ${id}, Timestamp: ${new Date().toISOString()}`);

    return document;
  } catch (error) {
    throw error;
  }
};

/**
 * Search documents by keyword
 * @param {Model} Model - Mongoose model
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} Matching documents
 */
export const search = async (Model, keyword) => {
  try {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const stringFields = [];
    
    // Get all string fields from schema
    Object.keys(Model.schema.paths).forEach((field) => {
      if (Model.schema.paths[field].instance === 'String') {
        stringFields.push(field);
      }
    });

    // Create OR conditions for all string fields
    const filter = {
      $or: stringFields.map((field) => ({
        [field]: { $regex: keyword, $options: 'i' },
      })),
    };

    const documents = await Model.find(filter);
    return documents;
  } catch (error) {
    throw error;
  }
};
