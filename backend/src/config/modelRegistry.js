/**
 * Model Registry
 * Central registry for all models used in the CRUD engine
 * Add new models here as they are created
 */

import Department from '../models/Department.js';
import Challenge from '../models/Challenge.js';
import Category from '../models/Category.js';
import EmissionFactor from '../models/EmissionFactor.js';
import CarbonTransaction from '../models/CarbonTransaction.js';
import EnvironmentalGoal from '../models/EnvironmentalGoal.js';
import ESGPolicy from '../models/ESGPolicy.js';
import Badge from '../models/Badge.js';
import Reward from '../models/Reward.js';

const modelRegistry = {
  departments: Department,
  challenges: Challenge,
  categories: Category,
  emissionfactors: EmissionFactor,
  carbontransactions: CarbonTransaction,
  environmentalgoals: EnvironmentalGoal,
  esgpolicies: ESGPolicy,
  badges: Badge,
  rewards: Reward,
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
