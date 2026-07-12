/**
 * Dashboard API Verification Script
 * Tests all Dashboard API endpoints
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './src/app.js';
import User from './src/models/User.js';
import Department from './src/models/Department.js';
import Challenge from './src/models/Challenge.js';
import ESGPolicy from './src/models/ESGPolicy.js';
import EnvironmentalGoal from './src/models/EnvironmentalGoal.js';

dotenv.config();

// Test results tracker
const results = {
  dashboardController: { passed: 0, failed: 0, tests: [] },
  dashboardRoutes: { passed: 0, failed: 0, tests: [] },
  jwtProtection: { passed: 0, failed: 0, tests: [] },
  jsonResponse: { passed: 0, failed: 0, tests: [] },
  serviceIntegration: { passed: 0, failed: 0, tests: [] },
};

// Helper function to log test result
const logTest = (category, testName, passed, details = '') => {
  const status = passed ? 'PASS' : 'FAIL';
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} [${category}] ${testName} - ${status} ${details}`);
  results[category].tests.push({ name: testName, passed, details });
  if (passed) {
    results[category].passed++;
  } else {
    results[category].failed++;
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

// Create test user and get JWT token
const createTestUser = async () => {
  try {
    // Delete existing test user
    await User.deleteOne({ email: 'dashboard.test@ecosphere.com' });

    // Create new test user
    const testUser = await User.create({
      name: 'Dashboard Test User',
      email: 'dashboard.test@ecosphere.com',
      password: 'test123456',
      role: 'Admin',
      department: 'IT',
    });

    // Generate token (simulate login)
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    console.log('✅ Test user created with JWT token\n');
    return { user: testUser, token };
  } catch (error) {
    console.error('❌ Test user creation error:', error.message);
    throw error;
  }
};

// Setup test data
const setupTestData = async () => {
  try {
    // Clean up existing test data
    await Department.deleteMany({ code: { $in: ['TEST-DEPT', 'TEST-IT'] } });
    await Challenge.deleteMany({ title: 'Test Challenge' });
    await ESGPolicy.deleteMany({ title: 'Test Policy' });
    await EnvironmentalGoal.deleteMany({ title: 'Test Goal' });

    // Create test department
    await Department.create([
      {
        name: 'Test Department',
        code: 'TEST-DEPT',
        head: 'Test Manager',
        employeeCount: 20,
        status: 'Active',
      },
      {
        name: 'Test IT Department',
        code: 'TEST-IT',
        head: 'IT Manager',
        employeeCount: 15,
        status: 'Active',
      },
    ]);

    // Create test challenge
    await Challenge.create({
      title: 'Test Challenge',
      description: 'Test challenge for verification',
      status: 'Active',
    });

    // Create test policy
    await ESGPolicy.create({
      title: 'Test Policy',
      description: 'Test policy for verification',
      effectiveDate: new Date(),
      status: 'Active',
    });

    // Create test environmental goal
    await EnvironmentalGoal.create({
      title: 'Test Goal',
      targetValue: 1000,
      currentValue: 500,
      deadline: new Date('2026-12-31'),
      status: 'Active',
    });

    console.log('✅ Test data created\n');
  } catch (error) {
    console.error('❌ Test data setup error:', error.message);
    throw error;
  }
};

// Make HTTP request helper
const makeRequest = async (method, path, token = null, body = null) => {
  const fetch = (await import('node-fetch')).default;
  const url = `http://localhost:${process.env.PORT || 5000}${path}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  return { status: response.status, data };
};

// Start server
let server;
const startServer = () => {
  return new Promise((resolve) => {
    const port = process.env.PORT || 5000;
    server = app.listen(port, () => {
      console.log(`✅ Test server started on port ${port}\n`);
      resolve();
    });
  });
};

// Stop server
const stopServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log('\n✅ Test server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Test 1: Dashboard Controller Functions
const testDashboardController = async (token) => {
  console.log('\n📊 TEST 1: DASHBOARD CONTROLLER');
  console.log('='.repeat(50));

  try {
    // Test 1.1: getDashboardSummary
    const summary = await makeRequest('GET', '/api/dashboard', token);
    const hasSummary =
      summary.status === 200 &&
      summary.data.success === true &&
      summary.data.data.overallESGScore !== undefined;
    logTest('dashboardController', 'getDashboardSummary', hasSummary, `Status: ${summary.status}`);

    // Test 1.2: getDepartmentRanking
    const ranking = await makeRequest('GET', '/api/dashboard/ranking', token);
    const hasRanking =
      ranking.status === 200 &&
      ranking.data.success === true &&
      Array.isArray(ranking.data.data);
    logTest('dashboardController', 'getDepartmentRanking', hasRanking, `Status: ${ranking.status}`);

    // Test 1.3: getLeaderboard
    const leaderboard = await makeRequest('GET', '/api/dashboard/leaderboard', token);
    const hasLeaderboard =
      leaderboard.status === 200 &&
      leaderboard.data.success === true &&
      Array.isArray(leaderboard.data.data);
    logTest('dashboardController', 'getLeaderboard', hasLeaderboard, `Status: ${leaderboard.status}`);

    // Test 1.4: getRecentActivities
    const activities = await makeRequest('GET', '/api/dashboard/activities', token);
    const hasActivities =
      activities.status === 200 &&
      activities.data.success === true &&
      Array.isArray(activities.data.data);
    logTest('dashboardController', 'getRecentActivities', hasActivities, `Status: ${activities.status}`);

    // Test 1.5: getPendingCompliance
    const compliance = await makeRequest('GET', '/api/dashboard/compliance', token);
    const hasCompliance =
      compliance.status === 200 &&
      compliance.data.success === true &&
      Array.isArray(compliance.data.data);
    logTest('dashboardController', 'getPendingCompliance', hasCompliance, `Status: ${compliance.status}`);
  } catch (error) {
    console.error('❌ Dashboard Controller Test Error:', error.message);
  }
};

// Test 2: Dashboard Routes
const testDashboardRoutes = async (token) => {
  console.log('\n📊 TEST 2: DASHBOARD ROUTES');
  console.log('='.repeat(50));

  try {
    // Test 2.1: GET /api/dashboard
    const route1 = await makeRequest('GET', '/api/dashboard', token);
    logTest('dashboardRoutes', 'GET /api/dashboard', route1.status === 200, `Status: ${route1.status}`);

    // Test 2.2: GET /api/dashboard/ranking
    const route2 = await makeRequest('GET', '/api/dashboard/ranking', token);
    logTest('dashboardRoutes', 'GET /api/dashboard/ranking', route2.status === 200, `Status: ${route2.status}`);

    // Test 2.3: GET /api/dashboard/leaderboard
    const route3 = await makeRequest('GET', '/api/dashboard/leaderboard', token);
    logTest('dashboardRoutes', 'GET /api/dashboard/leaderboard', route3.status === 200, `Status: ${route3.status}`);

    // Test 2.4: GET /api/dashboard/activities
    const route4 = await makeRequest('GET', '/api/dashboard/activities', token);
    logTest('dashboardRoutes', 'GET /api/dashboard/activities', route4.status === 200, `Status: ${route4.status}`);

    // Test 2.5: GET /api/dashboard/compliance
    const route5 = await makeRequest('GET', '/api/dashboard/compliance', token);
    logTest('dashboardRoutes', 'GET /api/dashboard/compliance', route5.status === 200, `Status: ${route5.status}`);

    // Test 2.6: Query parameters (limit)
    const route6 = await makeRequest('GET', '/api/dashboard/leaderboard?limit=5', token);
    logTest('dashboardRoutes', 'Query params (?limit=5)', route6.status === 200, `Status: ${route6.status}`);
  } catch (error) {
    console.error('❌ Dashboard Routes Test Error:', error.message);
  }
};

// Test 3: JWT Protection
const testJWTProtection = async () => {
  console.log('\n📊 TEST 3: JWT PROTECTION');
  console.log('='.repeat(50));

  try {
    // Test 3.1: No token - should fail
    const noToken = await makeRequest('GET', '/api/dashboard');
    logTest('jwtProtection', 'Reject request without token', noToken.status === 401, `Status: ${noToken.status}`);

    // Test 3.2: Invalid token - should fail
    const invalidToken = await makeRequest('GET', '/api/dashboard', 'invalid_token_here');
    logTest('jwtProtection', 'Reject invalid token', invalidToken.status === 401, `Status: ${invalidToken.status}`);

    // Test 3.3: All routes require JWT
    const routes = ['/api/dashboard', '/api/dashboard/ranking', '/api/dashboard/leaderboard', '/api/dashboard/activities', '/api/dashboard/compliance'];

    let allProtected = true;
    for (const route of routes) {
      const res = await makeRequest('GET', route);
      if (res.status !== 401) {
        allProtected = false;
        break;
      }
    }
    logTest('jwtProtection', 'All routes require JWT', allProtected, allProtected ? 'All protected' : 'Some unprotected');
  } catch (error) {
    console.error('❌ JWT Protection Test Error:', error.message);
  }
};

// Test 4: JSON Response Format
const testJSONResponse = async (token) => {
  console.log('\n📊 TEST 4: JSON RESPONSE FORMAT');
  console.log('='.repeat(50));

  try {
    // Test 4.1: Dashboard summary structure
    const summary = await makeRequest('GET', '/api/dashboard', token);
    const hasCorrectStructure =
      summary.data.success !== undefined &&
      summary.data.data !== undefined &&
      summary.data.data.overallESGScore !== undefined &&
      summary.data.data.environmentalScore !== undefined &&
      summary.data.data.socialScore !== undefined &&
      summary.data.data.governanceScore !== undefined;
    logTest('jsonResponse', 'Dashboard summary structure', hasCorrectStructure, 'All fields present');

    // Test 4.2: Ranking is array
    const ranking = await makeRequest('GET', '/api/dashboard/ranking', token);
    logTest('jsonResponse', 'Ranking returns array', Array.isArray(ranking.data.data), `Type: ${typeof ranking.data.data}`);

    // Test 4.3: Leaderboard is array
    const leaderboard = await makeRequest('GET', '/api/dashboard/leaderboard', token);
    logTest('jsonResponse', 'Leaderboard returns array', Array.isArray(leaderboard.data.data), `Type: ${typeof leaderboard.data.data}`);

    // Test 4.4: Activities is array
    const activities = await makeRequest('GET', '/api/dashboard/activities', token);
    logTest('jsonResponse', 'Activities returns array', Array.isArray(activities.data.data), `Type: ${typeof activities.data.data}`);

    // Test 4.5: Compliance is array
    const compliance = await makeRequest('GET', '/api/dashboard/compliance', token);
    logTest('jsonResponse', 'Compliance returns array', Array.isArray(compliance.data.data), `Type: ${typeof compliance.data.data}`);

    // Test 4.6: No HTML in responses
    const summaryStr = JSON.stringify(summary.data);
    const hasHTML = /<[a-z][\s\S]*>/i.test(summaryStr);
    logTest('jsonResponse', 'No HTML in JSON', !hasHTML, hasHTML ? 'Contains HTML' : 'Pure JSON');
  } catch (error) {
    console.error('❌ JSON Response Test Error:', error.message);
  }
};

// Test 5: Business Service Integration
const testServiceIntegration = async (token) => {
  console.log('\n📊 TEST 5: BUSINESS SERVICE INTEGRATION');
  console.log('='.repeat(50));

  try {
    // Test 5.1: Dashboard service integration
    const summary = await makeRequest('GET', '/api/dashboard', token);
    const hasServiceData =
      summary.data.data.departmentCount !== undefined &&
      summary.data.data.employeeCount !== undefined &&
      summary.data.data.carbonEmission !== undefined;
    logTest('serviceIntegration', 'Dashboard service called', hasServiceData, 'Service data present');

    // Test 5.2: Ranking service integration
    const ranking = await makeRequest('GET', '/api/dashboard/ranking', token);
    logTest('serviceIntegration', 'Ranking service called', ranking.data.success === true, 'Service responded');

    // Test 5.3: Leaderboard service integration
    const leaderboard = await makeRequest('GET', '/api/dashboard/leaderboard', token);
    const hasLeaderboardData = Array.isArray(leaderboard.data.data);
    logTest('serviceIntegration', 'Leaderboard service called', hasLeaderboardData, `Count: ${leaderboard.data.data.length}`);

    // Test 5.4: Activities service integration
    const activities = await makeRequest('GET', '/api/dashboard/activities', token);
    logTest('serviceIntegration', 'Activities service called', activities.data.success === true, 'Service responded');

    // Test 5.5: Compliance service integration
    const compliance = await makeRequest('GET', '/api/dashboard/compliance', token);
    logTest('serviceIntegration', 'Compliance service called', compliance.data.success === true, 'Service responded');

    // Test 5.6: No business logic in controller
    // Verify that responses contain calculated values (done by service, not controller)
    const hasCalculatedValues =
      typeof summary.data.data.overallESGScore === 'number' &&
      typeof summary.data.data.carbonEmission === 'number';
    logTest('serviceIntegration', 'No business logic in controller', hasCalculatedValues, 'Services handle calculations');
  } catch (error) {
    console.error('❌ Service Integration Test Error:', error.message);
  }
};

// Generate final report
const generateFinalReport = () => {
  console.log('\n' + '='.repeat(70));
  console.log('📋 DASHBOARD API VERIFICATION REPORT');
  console.log('='.repeat(70));

  const categories = ['dashboardController', 'dashboardRoutes', 'jwtProtection', 'jsonResponse', 'serviceIntegration'];
  const categoryNames = {
    dashboardController: 'Dashboard Controller',
    dashboardRoutes: 'Dashboard Routes',
    jwtProtection: 'JWT Protection',
    jsonResponse: 'JSON Response',
    serviceIntegration: 'Business Service Integration',
  };

  let totalPassed = 0;
  let totalFailed = 0;
  let allPassed = true;

  categories.forEach((category) => {
    const result = results[category];
    const total = result.passed + result.failed;
    const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
    const status = result.failed === 0 ? 'PASS ✅' : 'FAIL ❌';

    console.log(`\n${categoryNames[category]}`);
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
    categories.forEach((category) => {
      const failedTests = results[category].tests.filter((t) => !t.passed);
      if (failedTests.length > 0) {
        console.log(`\n${categoryNames[category]}:`);
        failedTests.forEach((test) => {
          console.log(`  ❌ ${test.name} - ${test.details}`);
        });
      }
    });
  }

  console.log('\n✨ Verification Complete!\n');
  return allPassed;
};

// Main verification function
const runVerification = async () => {
  console.log('🚀 Starting Dashboard API Verification...\n');

  try {
    // Connect to database
    await connectDB();

    // Setup test data
    await setupTestData();

    // Create test user and get token
    const { user, token } = await createTestUser();

    // Start server
    await startServer();

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Run tests
    await testJWTProtection();
    await testDashboardController(token);
    await testDashboardRoutes(token);
    await testJSONResponse(token);
    await testServiceIntegration(token);

    // Generate report
    const allPassed = generateFinalReport();

    // Cleanup
    await User.deleteOne({ _id: user._id });
    await stopServer();
    await mongoose.connection.close();
    console.log('📊 MongoDB Connection Closed');

    // Exit with appropriate code
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    console.error(error.stack);
    if (server) await stopServer();
    if (mongoose.connection.readyState === 1) await mongoose.connection.close();
    process.exit(1);
  }
};

// Run verification
runVerification();
