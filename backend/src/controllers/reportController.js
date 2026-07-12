/**
 * Report Controller
 * Consumes Report Service - NO business logic here
 * All report generation is done in reportService
 */

import * as reportService from '../services/reportService.js';

/**
 * @desc    Generate Environmental Report
 * @route   GET /api/reports/environment
 * @access  Private (JWT required)
 */
export const generateEnvironmentalReport = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/reports/environment';

  try {
    // Extract query parameters for date filtering
    const { startDate, endDate } = req.query;
    const options = {};
    if (startDate) options.startDate = startDate;
    if (endDate) options.endDate = endDate;

    // Call service - NO business logic in controller
    const report = await reportService.generateEnvironmentalReport(options);

    const executionTime = Date.now() - startTime;
    console.log(`[REPORT API] ${endpoint} - Success - Execution Time: ${executionTime}ms`);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Generate Social Report
 * @route   GET /api/reports/social
 * @access  Private (JWT required)
 */
export const generateSocialReport = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/reports/social';

  try {
    // Extract query parameters (if any future options needed)
    const options = {};

    // Call service - NO business logic in controller
    const report = await reportService.generateSocialReport(options);

    const executionTime = Date.now() - startTime;
    console.log(`[REPORT API] ${endpoint} - Success - Execution Time: ${executionTime}ms`);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Generate Governance Report
 * @route   GET /api/reports/governance
 * @access  Private (JWT required)
 */
export const generateGovernanceReport = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/reports/governance';

  try {
    // Extract query parameters (if any future options needed)
    const options = {};

    // Call service - NO business logic in controller
    const report = await reportService.generateGovernanceReport(options);

    const executionTime = Date.now() - startTime;
    console.log(`[REPORT API] ${endpoint} - Success - Execution Time: ${executionTime}ms`);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Generate ESG Summary Report
 * @route   GET /api/reports/summary
 * @access  Private (JWT required)
 */
export const generateSummaryReport = async (req, res, next) => {
  const startTime = Date.now();
  const endpoint = 'GET /api/reports/summary';

  try {
    // Extract query parameters for date filtering
    const { startDate, endDate } = req.query;
    const options = {};
    if (startDate) options.startDate = startDate;
    if (endDate) options.endDate = endDate;

    // Call service - NO business logic in controller
    const report = await reportService.generateSummaryReport(options);

    const executionTime = Date.now() - startTime;
    console.log(`[REPORT API] ${endpoint} - Success - Execution Time: ${executionTime}ms - Overall Score: ${report.esgScores?.overall || 'N/A'}`);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT API] ${endpoint} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    next(error);
  }
};
