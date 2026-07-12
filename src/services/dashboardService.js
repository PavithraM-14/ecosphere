/**
 * Dashboard Service
 * Aggregate dashboard data for APIs
 * Returns JSON only - NO HTML generation
 */

import Department from '../models/Department.js';
import Challenge from '../models/Challenge.js';
import CarbonTransaction from '../models/CarbonTransaction.js';
import User from '../models/User.js';
import { calculateOverallESGScore } from './scoreService.js';

/**
 * Get dashboard summary
 * @returns {Promise<Object>} Dashboard summary data
 */
export const getDashboardSummary = async () => {
  const startTime = Date.now();
  const functionName = 'getDashboardSummary';

  try {
    // Calculate ESG scores
    const esgScores = await calculateOverallESGScore();

    // Get department count
    const departmentCount = await Department.countDocuments({ status: 'Active' });

    // Get employee count
    const departments = await Department.find({ status: 'Active' });
    const employeeCount = departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0);

    // Get active challenges
    const activeChallenges = await Challenge.countDocuments({ status: 'Active' });

    // Get pending compliance
    const pendingCompliance = await CarbonTransaction.countDocuments({ status: 'Pending' });

    // Get total carbon emissions
    const verifiedTransactions = await CarbonTransaction.find({ status: 'Verified' });
    const carbonEmission = verifiedTransactions.reduce((sum, t) => sum + (t.calculatedEmission || 0), 0);
    const roundedEmission = Math.round(carbonEmission * 100) / 100;

    // Get leaderboard (top 5 users)
    const leaderboard = await User.find()
      .sort({ xp: -1 })
      .limit(5)
      .select('name email xp points department');

    // Get department ranking
    const departmentRanking = await getDepartmentRanking();

    // Get recent activities
    const recentActivities = await getRecentActivities();

    const summary = {
      overallESGScore: esgScores.overallScore,
      environmentalScore: esgScores.environmentalScore,
      socialScore: esgScores.socialScore,
      governanceScore: esgScores.governanceScore,
      departmentCount,
      employeeCount,
      activeChallenges,
      pendingCompliance,
      carbonEmission: roundedEmission,
      leaderboard,
      departmentRanking,
      recentActivities,
      generatedAt: new Date(),
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Overall Score: ${summary.overallESGScore}`);

    return summary;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Get department ranking
 * @returns {Promise<Array>} Department ranking by emissions
 */
export const getDepartmentRanking = async () => {
  const startTime = Date.now();
  const functionName = 'getDepartmentRanking';

  try {
    // Get all active departments
    const departments = await Department.find({ status: 'Active' });

    // Handle empty array
    if (departments.length === 0) {
      const executionTime = Date.now() - startTime;
      console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: 0`);
      return [];
    }

    // Calculate emissions for each department
    const ranking = await Promise.all(
      departments.map(async (dept) => {
        const transactions = await CarbonTransaction.find({
          department: dept._id,
          status: 'Verified',
        });

        const totalEmissions = transactions.reduce((sum, t) => sum + (t.calculatedEmission || 0), 0);
        const roundedEmissions = Math.round(totalEmissions * 100) / 100;

        return {
          departmentId: dept._id,
          departmentName: dept.name,
          departmentCode: dept.code,
          employeeCount: dept.employeeCount || 0,
          totalEmissions: roundedEmissions,
          transactionCount: transactions.length,
        };
      })
    );

    // Sort by emissions (lowest first = best)
    ranking.sort((a, b) => a.totalEmissions - b.totalEmissions);

    // Add rank
    ranking.forEach((item, index) => {
      item.rank = index + 1;
    });

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: ${ranking.length}`);

    return ranking;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Get recent activities
 * @param {Number} limit - Number of activities to return
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivities = async (limit = 10) => {
  const startTime = Date.now();
  const functionName = 'getRecentActivities';

  try {
    // Validate limit
    if (typeof limit !== 'number' || limit < 1) {
      throw new Error('Limit must be a positive number');
    }

    // Get recent carbon transactions
    const transactions = await CarbonTransaction.find()
      .populate('department', 'name code')
      .sort({ transactionDate: -1 })
      .limit(limit);

    // Handle empty array
    if (transactions.length === 0) {
      const executionTime = Date.now() - startTime;
      console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: 0`);
      return [];
    }

    // Format activities
    const activities = transactions.map((t) => ({
      id: t._id,
      type: 'Carbon Transaction',
      description: `${t.source} - ${t.calculatedEmission} kg CO2`,
      department: t.department ? t.department.name : 'Unknown',
      status: t.status,
      date: t.transactionDate,
    }));

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: ${activities.length}`);

    return activities;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Get leaderboard
 * @param {Number} limit - Number of users to return
 * @returns {Promise<Array>} Top users by XP
 */
export const getLeaderboard = async (limit = 10) => {
  const startTime = Date.now();
  const functionName = 'getLeaderboard';

  try {
    // Validate limit
    if (typeof limit !== 'number' || limit < 1) {
      throw new Error('Limit must be a positive number');
    }

    // Get top users
    const users = await User.find().sort({ xp: -1 }).limit(limit).select('name email xp points department role');

    // Handle empty array
    if (users.length === 0) {
      const executionTime = Date.now() - startTime;
      console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: 0`);
      return [];
    }

    // Add rank
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      email: user.email,
      department: user.department || 'Not Assigned',
      xp: user.xp,
      points: user.points,
      role: user.role,
    }));

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: ${leaderboard.length}`);

    return leaderboard;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Get pending compliance issues
 * @returns {Promise<Array>} Pending compliance issues
 */
export const getPendingCompliance = async () => {
  const startTime = Date.now();
  const functionName = 'getPendingCompliance';

  try {
    // Get pending transactions
    const pendingTransactions = await CarbonTransaction.find({ status: 'Pending' })
      .populate('department', 'name code')
      .populate('emissionFactor', 'source unit')
      .sort({ transactionDate: -1 });

    // Handle empty array
    if (pendingTransactions.length === 0) {
      const executionTime = Date.now() - startTime;
      console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: 0`);
      return [];
    }

    // Format compliance issues
    const issues = pendingTransactions.map((t) => ({
      id: t._id,
      department: t.department ? t.department.name : 'Unknown',
      source: t.source,
      quantity: t.quantity,
      emissionFactor: t.emissionFactor ? t.emissionFactor.source : 'Unknown',
      calculatedEmission: t.calculatedEmission,
      transactionDate: t.transactionDate,
      daysWaiting: Math.floor((Date.now() - new Date(t.transactionDate)) / (1000 * 60 * 60 * 24)),
    }));

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Count: ${issues.length}`);

    return issues;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};
