/**
 * Dashboard Controller
 * Consumes Business Services - NO business logic here
 * All calculations are done in services
 */

import * as dashboardService from '../services/dashboardService.js';

/**
 * @desc    Get complete dashboard summary
 * @route   GET /api/dashboard
 * @access  Private (JWT required)
 */
export const getDashboardSummary = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/dashboard';

  try {
    // Call service - NO business logic in controller
    const summary = await dashboardService.getDashboardSummary();

    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD API] ${endpoint} - Success - Execution Time: ${executionTime}ms`);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get department ranking by carbon emissions
 * @route   GET /api/dashboard/ranking
 * @access  Private (JWT required)
 */
export const getDepartmentRanking = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/dashboard/ranking';

  try {
    // Call service - NO business logic in controller
    const ranking = await dashboardService.getDepartmentRanking();

    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD API] ${endpoint} - Success - Execution Time: ${executionTime}ms - Count: ${ranking.length}`);

    res.status(200).json({
      success: true,
      data: ranking,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get leaderboard (top users by XP)
 * @route   GET /api/dashboard/leaderboard
 * @access  Private (JWT required)
 */
export const getLeaderboard = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/dashboard/leaderboard';

  try {
    // Get limit from query params (default: 10)
    const limit = parseInt(req.query.limit) || 10;

    // Call service - NO business logic in controller
    const leaderboard = await dashboardService.getLeaderboard(limit);

    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD API] ${endpoint} - Success - Execution Time: ${executionTime}ms - Count: ${leaderboard.length}`);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get recent activities
 * @route   GET /api/dashboard/activities
 * @access  Private (JWT required)
 */
export const getRecentActivities = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/dashboard/activities';

  try {
    // Get limit from query params (default: 10)
    const limit = parseInt(req.query.limit) || 10;

    // Call service - NO business logic in controller
    const activities = await dashboardService.getRecentActivities(limit);

    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD API] ${endpoint} - Success - Execution Time: ${executionTime}ms - Count: ${activities.length}`);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get pending compliance issues
 * @route   GET /api/dashboard/compliance
 * @access  Private (JWT required)
 */
export const getPendingCompliance = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/dashboard/compliance';

  try {
    // Call service - NO business logic in controller
    const compliance = await dashboardService.getPendingCompliance();

    const executionTime = Date.now() - startTime;
    console.log(`[DASHBOARD API] ${endpoint} - Success - Execution Time: ${executionTime}ms - Count: ${compliance.length}`);

    res.status(200).json({
      success: true,
      data: compliance,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[DASHBOARD API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};
