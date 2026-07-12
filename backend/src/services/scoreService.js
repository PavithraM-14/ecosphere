/**
 * ESG Score Service
 * Calculate ESG scores with customizable weights
 * Default Weights: Environmental 40%, Social 30%, Governance 30%
 */

import EnvironmentalGoal from '../models/EnvironmentalGoal.js';
import CarbonTransaction from '../models/CarbonTransaction.js';
import Department from '../models/Department.js';
import Challenge from '../models/Challenge.js';
import ESGPolicy from '../models/ESGPolicy.js';

// Default weight configuration
const DEFAULT_WEIGHTS = {
  environmental: 0.4, // 40%
  social: 0.3, // 30%
  governance: 0.3, // 30%
};

/**
 * Validate custom weights
 * @param {Object} weights - Custom weights object
 * @throws {Error} If weights are invalid
 */
const validateWeights = (weights) => {
  if (!weights || typeof weights !== 'object') {
    throw new Error('Weights must be a valid object');
  }

  const { environmental, social, governance } = weights;

  // Check for null/undefined
  if (environmental === null || environmental === undefined) {
    throw new Error('Environmental weight is required');
  }
  if (social === null || social === undefined) {
    throw new Error('Social weight is required');
  }
  if (governance === null || governance === undefined) {
    throw new Error('Governance weight is required');
  }

  // Check for valid numbers
  if (typeof environmental !== 'number' || isNaN(environmental)) {
    throw new Error('Environmental weight must be a valid number');
  }
  if (typeof social !== 'number' || isNaN(social)) {
    throw new Error('Social weight must be a valid number');
  }
  if (typeof governance !== 'number' || isNaN(governance)) {
    throw new Error('Governance weight must be a valid number');
  }

  // Check for negative values
  if (environmental < 0 || social < 0 || governance < 0) {
    throw new Error('Weights cannot be negative');
  }

  // Check total equals 1 (100%)
  const total = environmental + social + governance;
  const tolerance = 0.0001; // Allow small floating-point errors
  if (Math.abs(total - 1) > tolerance) {
    throw new Error(`Total weight must equal 100% (1.0). Current total: ${(total * 100).toFixed(2)}%`);
  }

  return true;
};

/**
 * Calculate Environmental Score
 * Based on carbon emissions and environmental goals
 * @param {String} departmentId - Department ID (optional)
 * @returns {Promise<number>} Environmental score (0-100)
 */
export const calculateEnvironmentalScore = async (departmentId = null) => {
  const startTime = Date.now();
  const functionName = 'calculateEnvironmentalScore';

  try {
    // Get environmental goals
    const goalQuery = { status: 'Active' };
    const goals = await EnvironmentalGoal.find(goalQuery);

    // Get carbon transactions
    const transactionQuery = departmentId ? { department: departmentId, status: 'Verified' } : { status: 'Verified' };
    const transactions = await CarbonTransaction.find(transactionQuery);

    let score = 100; // Start with perfect score

    // Deduct points for missed goals (empty array check)
    if (goals.length === 0) {
      score = 80; // No active goals = 80 base score
    } else {
      const averageProgress = goals.reduce((sum, goal) => {
        const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / goals.length;

      score = Math.round(averageProgress);
    }

    // Deduct points for high emissions (empty array check)
    if (transactions.length > 0) {
      const totalEmissions = transactions.reduce((sum, t) => sum + (t.calculatedEmission || 0), 0);
      const emissionPenalty = Math.min(totalEmissions / 1000, 20); // Max 20 points deduction
      score = Math.max(0, score - emissionPenalty);
    }

    const finalScore = Math.round(score);

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[SCORE SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Score: ${finalScore}`);

    return finalScore;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[SCORE SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate Social Score
 * Based on employee engagement and challenges
 * @param {String} departmentId - Department ID (optional)
 * @returns {Promise<number>} Social score (0-100)
 */
export const calculateSocialScore = async (departmentId = null) => {
  const startTime = Date.now();
  const functionName = 'calculateSocialScore';

  try {
    // Get challenges
    const challengeQuery = { status: { $in: ['Active', 'Completed'] } };
    const challenges = await Challenge.find(challengeQuery);

    // Get department info
    const departmentQuery = departmentId ? { _id: departmentId } : { status: 'Active' };
    const departments = await Department.find(departmentQuery);

    let score = 100; // Start with perfect score

    // Calculate based on challenge participation (empty array check)
    if (challenges.length === 0) {
      score = 70; // No challenges = 70 base score
    } else {
      const completedChallenges = challenges.filter((c) => c.status === 'Completed').length;
      const completionRate = (completedChallenges / challenges.length) * 100;
      score = Math.round(completionRate);
    }

    // Bonus for active departments (empty array check)
    if (departments.length > 0) {
      const averageEmployees = departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0) / departments.length;
      const engagementBonus = Math.min(averageEmployees / 10, 10); // Max 10 points bonus
      score = Math.min(100, score + engagementBonus);
    }

    const finalScore = Math.round(score);

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[SCORE SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Score: ${finalScore}`);

    return finalScore;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[SCORE SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate Governance Score
 * Based on policies and compliance
 * @param {String} departmentId - Department ID (optional)
 * @returns {Promise<number>} Governance score (0-100)
 */
export const calculateGovernanceScore = async (departmentId = null) => {
  const startTime = Date.now();
  const functionName = 'calculateGovernanceScore';

  try {
    // Get active policies
    const policyQuery = { status: 'Active' };
    const policies = await ESGPolicy.find(policyQuery);

    // Get pending carbon transactions (compliance issues)
    const transactionQuery = departmentId ? { department: departmentId, status: 'Pending' } : { status: 'Pending' };
    const pendingTransactions = await CarbonTransaction.find(transactionQuery);

    let score = 100; // Start with perfect score

    // Calculate based on active policies (empty array check)
    if (policies.length === 0) {
      score = 60; // No policies = 60 base score
    } else {
      // More policies = better governance
      const policyBonus = Math.min(policies.length * 5, 30); // Max 30 points bonus
      score = 70 + policyBonus;
    }

    // Deduct points for pending compliance (empty array check)
    if (pendingTransactions.length > 0) {
      const compliancePenalty = Math.min(pendingTransactions.length * 2, 30); // Max 30 points deduction
      score = Math.max(0, score - compliancePenalty);
    }

    const finalScore = Math.round(score);

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[SCORE SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Score: ${finalScore}`);

    return finalScore;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[SCORE SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate Department Score
 * Combined ESG score for a specific department
 * @param {String} departmentId - Department ID
 * @param {Object} weights - Custom weights (optional)
 * @returns {Promise<Object>} Department scores
 */
export const calculateDepartmentScore = async (departmentId, weights = null) => {
  const startTime = Date.now();
  const functionName = 'calculateDepartmentScore';

  try {
    // Validate department ID
    if (!departmentId) {
      throw new Error('Department ID is required');
    }

    // Use custom weights or default
    const scoreWeights = weights || DEFAULT_WEIGHTS;

    // Validate weights if custom provided
    if (weights) {
      validateWeights(weights);
    }

    // Calculate individual scores
    const environmentalScore = await calculateEnvironmentalScore(departmentId);
    const socialScore = await calculateSocialScore(departmentId);
    const governanceScore = await calculateGovernanceScore(departmentId);

    // Calculate overall score
    const overallScore = Math.round(
      environmentalScore * scoreWeights.environmental +
        socialScore * scoreWeights.social +
        governanceScore * scoreWeights.governance
    );

    const result = {
      departmentId,
      environmentalScore,
      socialScore,
      governanceScore,
      overallScore,
      weights: {
        environmental: scoreWeights.environmental * 100,
        social: scoreWeights.social * 100,
        governance: scoreWeights.governance * 100,
      },
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[SCORE SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Overall Score: ${overallScore}`);

    return result;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[SCORE SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate Overall ESG Score
 * Organization-wide ESG score
 * @param {Object} weights - Custom weights (optional)
 * @returns {Promise<Object>} Overall scores
 */
export const calculateOverallESGScore = async (weights = null) => {
  const startTime = Date.now();
  const functionName = 'calculateOverallESGScore';

  try {
    // Use custom weights or default
    const scoreWeights = weights || DEFAULT_WEIGHTS;

    // Validate weights if custom provided
    if (weights) {
      validateWeights(weights);
    }

    // Calculate individual scores (organization-wide)
    const environmentalScore = await calculateEnvironmentalScore();
    const socialScore = await calculateSocialScore();
    const governanceScore = await calculateGovernanceScore();

    // Calculate overall score
    const overallScore = Math.round(
      environmentalScore * scoreWeights.environmental +
        socialScore * scoreWeights.social +
        governanceScore * scoreWeights.governance
    );

    const result = {
      environmentalScore,
      socialScore,
      governanceScore,
      overallScore,
      weights: {
        environmental: scoreWeights.environmental * 100,
        social: scoreWeights.social * 100,
        governance: scoreWeights.governance * 100,
      },
      calculatedAt: new Date(),
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[SCORE SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Overall Score: ${overallScore}`);

    return result;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[SCORE SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};
