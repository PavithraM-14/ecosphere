/**
 * Business Services Verification Script
 * Tests all 5 services with comprehensive test cases
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import services
import * as carbonCalculator from './src/services/carbonCalculatorService.js';
import * as scoreService from './src/services/scoreService.js';
import * as notificationService from './src/services/notificationService.js';
import * as dashboardService from './src/services/dashboardService.js';
import * as reportService from './src/services/reportService.js';

// Import models
import Department from './src/models/Department.js';
import CarbonTransaction from './src/models/CarbonTransaction.js';
import EmissionFactor from './src/models/EmissionFactor.js';
import EnvironmentalGoal from './src/models/EnvironmentalGoal.js';
import Challenge from './src/models/Challenge.js';
import ESGPolicy from './src/models/ESGPolicy.js';
import User from './src/models/User.js';

dotenv.config();

// Test results tracker
const results = {
  carbonCalculator: { passed: 0, failed: 0, tests: [] },
  scoreService: { passed: 0, failed: 0, tests: [] },
  notificationService: { passed: 0, failed: 0, tests: [] },
  dashboardService: { passed: 0, failed: 0, tests: [] },
  reportService: { passed: 0, failed: 0, tests: [] },
};

// Helper function to log test result
const logTest = (service, testName, passed, details = '') => {
  const status = passed ? 'PASS' : 'FAIL';
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} [${service}] ${testName} - ${status} ${details}`);
  results[service].tests.push({ name: testName, passed, details });
  if (passed) {
    results[service].passed++;
  } else {
    results[service].failed++;
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected for Verification\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Test 1: Carbon Calculator Service
const testCarbonCalculator = async () => {
  console.log('\n📊 TEST 1: CARBON CALCULATOR SERVICE');
  console.log('='.repeat(50));

  try {
    // Test 1.1: Basic calculation
    const result1 = carbonCalculator.calculateEmission(100, 2.31);
    logTest('carbonCalculator', 'Basic Emission Calculation (100 × 2.31)', result1 === 231, `Expected: 231, Got: ${result1}`);

    // Test 1.2: Decimal rounding
    const result2 = carbonCalculator.calculateEmission(50.5, 1.234);
    const expected2 = 62.32;
    logTest('carbonCalculator', 'Decimal Rounding', result2 === expected2, `Expected: ${expected2}, Got: ${result2}`);

    // Test 1.3: Negative quantity (should throw error)
    try {
      carbonCalculator.calculateEmission(-10, 2.0);
      logTest('carbonCalculator', 'Reject Negative Quantity', false, 'Should have thrown error');
    } catch (error) {
      logTest('carbonCalculator', 'Reject Negative Quantity', true, error.message);
    }

    // Test 1.4: Negative factor (should throw error)
    try {
      carbonCalculator.calculateEmission(10, -2.0);
      logTest('carbonCalculator', 'Reject Negative Factor', false, 'Should have thrown error');
    } catch (error) {
      logTest('carbonCalculator', 'Reject Negative Factor', true, error.message);
    }

    // Test 1.5: Null validation
    try {
      carbonCalculator.calculateEmission(null, 2.0);
      logTest('carbonCalculator', 'Handle Null Quantity', false, 'Should have thrown error');
    } catch (error) {
      logTest('carbonCalculator', 'Handle Null Quantity', true, error.message);
    }

    // Test 1.6: Undefined validation
    try {
      carbonCalculator.calculateEmission(10, undefined);
      logTest('carbonCalculator', 'Handle Undefined Factor', false, 'Should have thrown error');
    } catch (error) {
      logTest('carbonCalculator', 'Handle Undefined Factor', true, error.message);
    }

    // Test 1.7: Empty array handling
    const result7 = carbonCalculator.calculateTotalEmissions([]);
    logTest('carbonCalculator', 'Handle Empty Array', result7.total === 0 && result7.count === 0, `Total: ${result7.total}, Count: ${result7.count}`);
  } catch (error) {
    console.error('❌ Carbon Calculator Test Error:', error.message);
  }
};

// Test 2: Score Service
const testScoreService = async () => {
  console.log('\n📊 TEST 2: ESG SCORE SERVICE');
  console.log('='.repeat(50));

  try {
    // Setup test data
    const testDept = await Department.create({
      name: 'Test Finance',
      code: 'TST-FIN',
      head: 'Test Manager',
      employeeCount: 25,
      status: 'Active',
    });

    await EnvironmentalGoal.create({
      title: 'Reduce Carbon by 50%',
      targetValue: 1000,
      currentValue: 800,
      deadline: new Date('2026-12-31'),
      status: 'Active',
    });

    await Challenge.create({
      title: 'Zero Waste Week',
      description: 'Test challenge',
      status: 'Completed',
    });

    await ESGPolicy.create({
      title: 'Carbon Neutrality Policy',
      description: 'Test policy',
      effectiveDate: new Date(),
      status: 'Active',
    });

    // Test 2.1: Environmental score calculation
    const envScore = await scoreService.calculateEnvironmentalScore();
    logTest('scoreService', 'Environmental Score Calculation', envScore >= 0 && envScore <= 100, `Score: ${envScore}`);

    // Test 2.2: Social score calculation
    const socialScore = await scoreService.calculateSocialScore();
    logTest('scoreService', 'Social Score Calculation', socialScore >= 0 && socialScore <= 100, `Score: ${socialScore}`);

    // Test 2.3: Governance score calculation
    const govScore = await scoreService.calculateGovernanceScore();
    logTest('scoreService', 'Governance Score Calculation', govScore >= 0 && govScore <= 100, `Score: ${govScore}`);

    // Test 2.4: Overall ESG score with default weights
    const overallScore = await scoreService.calculateOverallESGScore();
    const calculatedScore = Math.round(envScore * 0.4 + socialScore * 0.3 + govScore * 0.3);
    logTest(
      'scoreService',
      'Overall ESG Score (Default Weights)',
      overallScore.overallScore === calculatedScore,
      `Expected: ${calculatedScore}, Got: ${overallScore.overallScore}`
    );

    // Test 2.5: Custom weights validation (total = 100%)
    const customWeights = { environmental: 0.5, social: 0.3, governance: 0.2 };
    const customScore = await scoreService.calculateOverallESGScore(customWeights);
    logTest('scoreService', 'Custom Weights (50-30-20)', customScore.overallScore >= 0, `Score: ${customScore.overallScore}`);

    // Test 2.6: Invalid weights (total ≠ 100%)
    try {
      await scoreService.calculateOverallESGScore({ environmental: 0.5, social: 0.3, governance: 0.1 });
      logTest('scoreService', 'Reject Invalid Weights', false, 'Should have thrown error');
    } catch (error) {
      logTest('scoreService', 'Reject Invalid Weights', true, error.message);
    }

    // Test 2.7: Negative weights
    try {
      await scoreService.calculateOverallESGScore({ environmental: -0.4, social: 0.7, governance: 0.7 });
      logTest('scoreService', 'Reject Negative Weights', false, 'Should have thrown error');
    } catch (error) {
      logTest('scoreService', 'Reject Negative Weights', true, error.message);
    }

    // Cleanup
    await Department.deleteOne({ _id: testDept._id });
  } catch (error) {
    console.error('❌ Score Service Test Error:', error.message);
  }
};

// Test 3: Notification Service
const testNotificationService = async () => {
  console.log('\n📊 TEST 3: NOTIFICATION SERVICE');
  console.log('='.repeat(50));

  try {
    // Clear all notifications before testing
    notificationService.clearAllNotifications();

    // Test 3.1: Create Badge Unlocked notification
    const notif1 = notificationService.createNotification({
      title: 'Badge Unlocked',
      message: 'You earned the Carbon Warrior badge!',
      type: notificationService.NOTIFICATION_TYPES.BADGE_UNLOCKED,
      recipient: 'user123',
    });
    logTest('notificationService', 'Create Badge Unlocked Notification', notif1.type === 'Badge Unlocked', `ID: ${notif1._id}`);

    // Test 3.2: Create Challenge Completed notification
    const notif2 = notificationService.createNotification({
      title: 'Challenge Completed',
      message: 'Zero Waste Week completed!',
      type: notificationService.NOTIFICATION_TYPES.CHALLENGE_COMPLETED,
      recipient: 'user123',
    });
    logTest('notificationService', 'Create Challenge Completed Notification', notif2.isRead === false, `isRead: ${notif2.isRead}`);

    // Test 3.3: Get unread notifications
    const unread = notificationService.getUnreadNotifications('user123');
    logTest('notificationService', 'Get Unread Notifications', unread.length === 2, `Count: ${unread.length}`);

    // Test 3.4: Mark notification as read
    const marked = notificationService.markAsRead(notif1._id);
    logTest('notificationService', 'Mark As Read', marked.isRead === true, `isRead: ${marked.isRead}`);

    // Test 3.5: Get unread after marking one as read
    const unreadAfter = notificationService.getUnreadNotifications('user123');
    logTest('notificationService', 'Unread Count After Marking', unreadAfter.length === 1, `Count: ${unreadAfter.length}`);

    // Test 3.6: Delete notification
    const deleted = notificationService.deleteNotification(notif2._id);
    logTest('notificationService', 'Delete Notification', deleted.success === true, deleted.message);

    // Test 3.7: Invalid notification type
    try {
      notificationService.createNotification({
        title: 'Test',
        message: 'Test',
        type: 'Invalid Type',
        recipient: 'user123',
      });
      logTest('notificationService', 'Reject Invalid Type', false, 'Should have thrown error');
    } catch (error) {
      logTest('notificationService', 'Reject Invalid Type', true, error.message);
    }

    // Test 3.8: Empty array handling
    const emptyUnread = notificationService.getUnreadNotifications('nonexistent-user');
    logTest('notificationService', 'Handle Empty Unread', emptyUnread.length === 0, `Count: ${emptyUnread.length}`);
  } catch (error) {
    console.error('❌ Notification Service Test Error:', error.message);
  }
};

// Test 4: Dashboard Service
const testDashboardService = async () => {
  console.log('\n📊 TEST 4: DASHBOARD SERVICE');
  console.log('='.repeat(50));

  try {
    // Test 4.1: Get dashboard summary
    const summary = await dashboardService.getDashboardSummary();
    logTest('dashboardService', 'Get Dashboard Summary', typeof summary === 'object' && summary.overallESGScore !== undefined, 'JSON structure valid');

    // Test 4.2: Verify JSON structure (no HTML)
    const summaryStr = JSON.stringify(summary);
    const hasHTML = /<[a-z][\s\S]*>/i.test(summaryStr);
    logTest('dashboardService', 'No HTML in Summary', !hasHTML, hasHTML ? 'Contains HTML tags' : 'Pure JSON');

    // Test 4.3: Get department ranking
    const ranking = await dashboardService.getDepartmentRanking();
    logTest('dashboardService', 'Get Department Ranking', Array.isArray(ranking), `Count: ${ranking.length}`);

    // Test 4.4: Get recent activities
    const activities = await dashboardService.getRecentActivities(5);
    logTest('dashboardService', 'Get Recent Activities', Array.isArray(activities), `Count: ${activities.length}`);

    // Test 4.5: Get leaderboard
    const leaderboard = await dashboardService.getLeaderboard(5);
    logTest('dashboardService', 'Get Leaderboard', Array.isArray(leaderboard), `Count: ${leaderboard.length}`);

    // Test 4.6: Get pending compliance
    const pending = await dashboardService.getPendingCompliance();
    logTest('dashboardService', 'Get Pending Compliance', Array.isArray(pending), `Count: ${pending.length}`);

    // Test 4.7: Invalid limit handling
    try {
      await dashboardService.getLeaderboard(-5);
      logTest('dashboardService', 'Reject Negative Limit', false, 'Should have thrown error');
    } catch (error) {
      logTest('dashboardService', 'Reject Negative Limit', true, error.message);
    }
  } catch (error) {
    console.error('❌ Dashboard Service Test Error:', error.message);
  }
};

// Test 5: Report Service
const testReportService = async () => {
  console.log('\n📊 TEST 5: REPORT SERVICE');
  console.log('='.repeat(50));

  try {
    // Test 5.1: Generate environmental report
    const envReport = await reportService.generateEnvironmentalReport();
    logTest('reportService', 'Generate Environmental Report', envReport.title === 'Environmental Report', 'JSON structure valid');

    // Test 5.2: Verify JSON structure (no PDF/Excel)
    const envStr = JSON.stringify(envReport);
    const hasBinary = envStr.includes('binary') || envStr.includes('pdf') || envStr.includes('xlsx');
    logTest('reportService', 'No PDF/Excel in Environmental Report', !hasBinary, 'Pure JSON');

    // Test 5.3: Generate social report
    const socialReport = await reportService.generateSocialReport();
    logTest('reportService', 'Generate Social Report', socialReport.title === 'Social Report' && socialReport.statistics !== undefined, 'JSON structure valid');

    // Test 5.4: Generate governance report
    const govReport = await reportService.generateGovernanceReport();
    logTest('reportService', 'Generate Governance Report', govReport.title === 'Governance Report' && govReport.recommendations !== undefined, 'JSON structure valid');

    // Test 5.5: Generate summary report
    const summaryReport = await reportService.generateSummaryReport();
    logTest(
      'reportService',
      'Generate Summary Report',
      summaryReport.title === 'ESG Summary Report' && summaryReport.esgScores !== undefined,
      `Overall Score: ${summaryReport.esgScores.overall}`
    );

    // Test 5.6: Verify all sections in summary
    const hasAllSections =
      summaryReport.sections.environmental !== undefined &&
      summaryReport.sections.social !== undefined &&
      summaryReport.sections.governance !== undefined;
    logTest('reportService', 'Summary Report Contains All Sections', hasAllSections, 'E, S, G sections present');

    // Test 5.7: Verify recommendations array
    logTest('reportService', 'Recommendations Array', Array.isArray(summaryReport.recommendations), `Count: ${summaryReport.recommendations.length}`);
  } catch (error) {
    console.error('❌ Report Service Test Error:', error.message);
  }
};

// Generate final report
const generateFinalReport = () => {
  console.log('\n' + '='.repeat(70));
  console.log('📋 BUSINESS SERVICES VERIFICATION REPORT');
  console.log('='.repeat(70));

  const services = ['carbonCalculator', 'scoreService', 'notificationService', 'dashboardService', 'reportService'];
  const serviceNames = {
    carbonCalculator: 'Carbon Calculator Service',
    scoreService: 'ESG Score Service',
    notificationService: 'Notification Service',
    dashboardService: 'Dashboard Service',
    reportService: 'Report Service',
  };

  let totalPassed = 0;
  let totalFailed = 0;
  let allPassed = true;

  services.forEach((service) => {
    const result = results[service];
    const total = result.passed + result.failed;
    const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
    const status = result.failed === 0 ? 'PASS ✅' : 'FAIL ❌';

    console.log(`\n${serviceNames[service]}`);
    console.log(`  Tests Run: ${total}`);
    console.log(`  Passed: ${result.passed}`);
    console.log(`  Failed: ${result.failed}`);
    console.log(`  Success Rate: ${percentage}%`);
    console.log(`  Status: ${status}`);

    totalPassed += result.passed;
    totalFailed += result.failed;
    if (result.failed > 0) allPassed = false;
  });

  const totalTests = totalPassed + totalFailed;
  const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  console.log('\n' + '='.repeat(70));
  console.log('OVERALL SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests Run: ${totalTests}`);
  console.log(`Total Passed: ${totalPassed}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log(`Overall Success Rate: ${overallPercentage}%`);
  console.log(`Overall Status: ${allPassed ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log('='.repeat(70));

  if (totalFailed > 0) {
    console.log('\n⚠️  FAILED TESTS:');
    services.forEach((service) => {
      const failedTests = results[service].tests.filter((t) => !t.passed);
      if (failedTests.length > 0) {
        console.log(`\n${serviceNames[service]}:`);
        failedTests.forEach((test) => {
          console.log(`  ❌ ${test.name} - ${test.details}`);
        });
      }
    });
  }

  console.log('\n✨ Verification Complete!\n');
};

// Main verification function
const runVerification = async () => {
  console.log('🚀 Starting Business Services Verification...\n');

  await connectDB();

  await testCarbonCalculator();
  await testScoreService();
  await testNotificationService();
  await testDashboardService();
  await testReportService();

  generateFinalReport();

  // Close database connection
  await mongoose.connection.close();
  console.log('📊 MongoDB Connection Closed');

  // Exit with appropriate code
  const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
  process.exit(totalFailed > 0 ? 1 : 0);
};

// Run verification
runVerification();
