/**
 * Report Service
 * Generate report data in JSON format
 * NO PDF/Excel generation - JSON only
 */

import Department from '../models/Department.js';
import CarbonTransaction from '../models/CarbonTransaction.js';
import EnvironmentalGoal from '../models/EnvironmentalGoal.js';
import Challenge from '../models/Challenge.js';
import ESGPolicy from '../models/ESGPolicy.js';
import { calculateOverallESGScore } from './scoreService.js';

/**
 * Generate Environmental Report
 * @param {Object} options - Report options (startDate, endDate)
 * @returns {Promise<Object>} Environmental report data
 */
export const generateEnvironmentalReport = async (options = {}) => {
  const startTime = Date.now();
  const functionName = 'generateEnvironmentalReport';

  try {
    const { startDate, endDate } = options;

    // Build query
    const query = { status: 'Verified' };
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    // Get carbon transactions
    const transactions = await CarbonTransaction.find(query)
      .populate('department', 'name code')
      .populate('emissionFactor', 'source unit factor');

    // Get environmental goals
    const goals = await EnvironmentalGoal.find({ status: 'Active' });

    // Calculate statistics
    const totalEmissions = transactions.reduce((sum, t) => sum + (t.calculatedEmission || 0), 0);
    const roundedTotalEmissions = Math.round(totalEmissions * 100) / 100;

    // Emissions by department
    const departmentMap = {};
    transactions.forEach((t) => {
      const deptName = t.department ? t.department.name : 'Unknown';
      if (!departmentMap[deptName]) {
        departmentMap[deptName] = 0;
      }
      departmentMap[deptName] += t.calculatedEmission || 0;
    });

    const emissionsByDepartment = Object.keys(departmentMap).map((name) => ({
      department: name,
      emissions: Math.round(departmentMap[name] * 100) / 100,
    }));

    // Emissions by source
    const sourceMap = {};
    transactions.forEach((t) => {
      const source = t.source || 'Unknown';
      if (!sourceMap[source]) {
        sourceMap[source] = 0;
      }
      sourceMap[source] += t.calculatedEmission || 0;
    });

    const emissionsBySource = Object.keys(sourceMap).map((source) => ({
      source,
      emissions: Math.round(sourceMap[source] * 100) / 100,
    }));

    // Goals progress
    const goalsProgress = goals.map((goal) => ({
      title: goal.title,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      progress: goal.progress || 0,
      deadline: goal.deadline,
      status: goal.status,
    }));

    // Recommendations
    const recommendations = [];
    if (totalEmissions > 1000) {
      recommendations.push('Consider implementing carbon reduction strategies');
    }
    if (goals.length === 0) {
      recommendations.push('Set environmental goals to track progress');
    }
    const overdueGoals = goals.filter((g) => new Date(g.deadline) < new Date() && g.status === 'Active');
    if (overdueGoals.length > 0) {
      recommendations.push(`${overdueGoals.length} environmental goal(s) are overdue - review and update`);
    }

    const report = {
      title: 'Environmental Report',
      generatedAt: new Date(),
      period: {
        startDate: startDate || 'All Time',
        endDate: endDate || 'Present',
      },
      summary: `Total carbon emissions: ${roundedTotalEmissions} kg CO2 from ${transactions.length} verified transactions`,
      statistics: {
        totalEmissions: roundedTotalEmissions,
        transactionCount: transactions.length,
        activeGoals: goals.length,
        overdueGoals: overdueGoals.length,
        averageEmissionPerTransaction: transactions.length > 0 ? Math.round((totalEmissions / transactions.length) * 100) / 100 : 0,
      },
      chartsData: {
        emissionsByDepartment,
        emissionsBySource,
        goalsProgress,
      },
      recommendations,
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[REPORT SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Total Emissions: ${roundedTotalEmissions}`);

    return report;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate Social Report
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Social report data
 */
export const generateSocialReport = async (options = {}) => {
  const startTime = Date.now();
  const functionName = 'generateSocialReport';

  try {
    // Get challenges
    const challenges = await Challenge.find().populate('createdBy', 'name email');

    // Get departments
    const departments = await Department.find({ status: 'Active' });

    // Calculate statistics
    const totalChallenges = challenges.length;
    const activeChallenges = challenges.filter((c) => c.status === 'Active').length;
    const completedChallenges = challenges.filter((c) => c.status === 'Completed').length;
    const totalEmployees = departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0);
    const avgEmployeesPerDept = departments.length > 0 ? Math.round((totalEmployees / departments.length) * 100) / 100 : 0;

    // Challenges by status
    const challengesByStatus = [
      { status: 'Draft', count: challenges.filter((c) => c.status === 'Draft').length },
      { status: 'Active', count: activeChallenges },
      { status: 'Under Review', count: challenges.filter((c) => c.status === 'Under Review').length },
      { status: 'Completed', count: completedChallenges },
      { status: 'Archived', count: challenges.filter((c) => c.status === 'Archived').length },
    ];

    // Departments overview
    const departmentsOverview = departments.map((d) => ({
      name: d.name,
      code: d.code,
      employeeCount: d.employeeCount || 0,
      head: d.head,
    }));

    // Recommendations
    const recommendations = [];
    if (activeChallenges === 0) {
      recommendations.push('Launch new challenges to boost employee engagement');
    }
    if (totalEmployees === 0) {
      recommendations.push('Update employee counts in departments for accurate reporting');
    }
    if (completedChallenges < totalChallenges * 0.5) {
      recommendations.push('Focus on completing ongoing challenges to improve social impact');
    }

    const report = {
      title: 'Social Report',
      generatedAt: new Date(),
      summary: `${totalChallenges} challenges with ${totalEmployees} employees across ${departments.length} departments`,
      statistics: {
        totalChallenges,
        activeChallenges,
        completedChallenges,
        totalDepartments: departments.length,
        totalEmployees,
        avgEmployeesPerDept,
        challengeCompletionRate: totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0,
      },
      chartsData: {
        challengesByStatus,
        departmentsOverview,
      },
      recommendations,
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(
      `[REPORT SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Total Challenges: ${totalChallenges}`
    );

    return report;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate Governance Report
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Governance report data
 */
export const generateGovernanceReport = async (options = {}) => {
  const startTime = Date.now();
  const functionName = 'generateGovernanceReport';

  try {
    // Get policies
    const policies = await ESGPolicy.find();

    // Get pending transactions (compliance issues)
    const pendingTransactions = await CarbonTransaction.find({ status: 'Pending' }).populate('department', 'name code');

    // Calculate statistics
    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p) => p.status === 'Active').length;
    const pendingCompliance = pendingTransactions.length;

    // Policies by status
    const policiesByStatus = [
      { status: 'Active', count: activePolicies },
      { status: 'Inactive', count: policies.filter((p) => p.status === 'Inactive').length },
      { status: 'Draft', count: policies.filter((p) => p.status === 'Draft').length },
    ];

    // Compliance issues by department
    const complianceMap = {};
    pendingTransactions.forEach((t) => {
      const deptName = t.department ? t.department.name : 'Unknown';
      if (!complianceMap[deptName]) {
        complianceMap[deptName] = 0;
      }
      complianceMap[deptName]++;
    });

    const complianceByDepartment = Object.keys(complianceMap).map((name) => ({
      department: name,
      pendingCount: complianceMap[name],
    }));

    // Active policies overview
    const activePoliciesOverview = policies
      .filter((p) => p.status === 'Active')
      .map((p) => ({
        title: p.title,
        effectiveDate: p.effectiveDate,
        description: p.description ? p.description.substring(0, 100) + '...' : 'No description',
      }));

    // Recommendations
    const recommendations = [];
    if (activePolicies === 0) {
      recommendations.push('Create and activate ESG policies to ensure governance compliance');
    }
    if (pendingCompliance > 10) {
      recommendations.push('High number of pending compliance issues - prioritize verification process');
    }
    if (totalPolicies < 5) {
      recommendations.push('Consider expanding policy coverage for comprehensive governance');
    }

    const report = {
      title: 'Governance Report',
      generatedAt: new Date(),
      summary: `${activePolicies} active policies with ${pendingCompliance} pending compliance items`,
      statistics: {
        totalPolicies,
        activePolicies,
        pendingCompliance,
        complianceRate: totalPolicies > 0 ? Math.round(((totalPolicies - pendingCompliance) / totalPolicies) * 100) : 100,
      },
      chartsData: {
        policiesByStatus,
        complianceByDepartment,
        activePoliciesOverview,
      },
      recommendations,
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[REPORT SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Active Policies: ${activePolicies}`);

    return report;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate Summary Report
 * Combined ESG report
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Summary report data
 */
export const generateSummaryReport = async (options = {}) => {
  const startTime = Date.now();
  const functionName = 'generateSummaryReport';

  try {
    // Get all sub-reports
    const environmentalReport = await generateEnvironmentalReport(options);
    const socialReport = await generateSocialReport(options);
    const governanceReport = await generateGovernanceReport(options);

    // Get ESG scores
    const esgScores = await calculateOverallESGScore();

    // Combined recommendations
    const allRecommendations = [
      ...environmentalReport.recommendations,
      ...socialReport.recommendations,
      ...governanceReport.recommendations,
    ];

    const report = {
      title: 'ESG Summary Report',
      generatedAt: new Date(),
      summary: `Overall ESG Score: ${esgScores.overallScore}/100 - Comprehensive analysis of Environmental, Social, and Governance performance`,
      esgScores: {
        overall: esgScores.overallScore,
        environmental: esgScores.environmentalScore,
        social: esgScores.socialScore,
        governance: esgScores.governanceScore,
        weights: esgScores.weights,
      },
      sections: {
        environmental: {
          score: esgScores.environmentalScore,
          summary: environmentalReport.summary,
          statistics: environmentalReport.statistics,
        },
        social: {
          score: esgScores.socialScore,
          summary: socialReport.summary,
          statistics: socialReport.statistics,
        },
        governance: {
          score: esgScores.governanceScore,
          summary: governanceReport.summary,
          statistics: governanceReport.statistics,
        },
      },
      recommendations: allRecommendations,
      detailedReports: {
        environmental: environmentalReport,
        social: socialReport,
        governance: governanceReport,
      },
    };

    // Log success
    const executionTime = Date.now() - startTime;
    console.log(`[REPORT SERVICE] ${functionName} - Success - Execution Time: ${executionTime}ms - Overall Score: ${esgScores.overallScore}`);

    return report;
  } catch (error) {
    // Log failure
    const executionTime = Date.now() - startTime;
    console.error(`[REPORT SERVICE] ${functionName} - Failure - Execution Time: ${executionTime}ms - Error: ${error.message}`);
    throw error;
  }
};
