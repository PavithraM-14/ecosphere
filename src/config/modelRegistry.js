/**
 * Model Registry
 * Central registry for all models used in the CRUD engine
 * Add new models here as they are created
 */

import Department from '../models/Department.js';
import Challenge from '../models/Challenge.js';

const modelRegistry = {
  departments: Department,
  challenges: Challenge,
};

/**
 * Get model by entity name
 * @param {string} entityName - Name of the entity (e.g., 'departments')
 * @returns {Model|null} Mongoose model or null if not found
 */
export const getModel = (entityName) => {
  return modelRegistry[entityName] || null;
};

export default modelRegistry;
