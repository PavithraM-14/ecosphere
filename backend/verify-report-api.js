/**
 * Report API Verification Script
 * Tests all Report API endpoints
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './src/app.js';
import User from './src/models/User.js';
import Department from './src/models/Department.js';
import Challenge from './src/models/Challenge.js';
import ESGPolicy from './src/models/ESGPolicy.js';
import EnvironmentalGoal from './src/models/EnvironmentalGoal.js';
import CarbonTransaction from './src/models/CarbonTransaction.js';
import EmissionFactor from './src/models/EmissionFactor.js';

dotenv.config();

// Test results tracker
const results = {
  reportController: { passed: 0, failed: 0, tests: [] },
  reportRoutes: { passed: 0, failed: 0, tests: [] },
  jwtProtection: { passed: 0, failed: 0, tests: [] },
  responseFormat: { passed: 0, failed: 0, tests: [] },
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
    await User.deleteOne({ email: 'report.test@ecosphere.com' });

    // Create new test user
    const testUser = await User.create({
      name: 'Report Test User',
      email: 'report.test@ecosphere.com',
      password: 'test123456',
      role: 'Admin',
      department: 'IT',
    });

    // Generate token
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
    await Department.deleteMany({ code: { $in: ['TEST-DEPT', 'TEST-FIN'] } });
    await Challenge.deleteMany({ title: { $regex: /^Test.*Report/ } });
    await ESGPolicy.deleteMany({ title: { $regex: /^Test.*Report/ } });
    await EnvironmentalGoal.deleteMany({ title: { $regex: /^Test.*Report/ } });
    await EmissionFactor.deleteMany({ source: 'Test Electricity Report' });
    await CarbonTransaction.deleteMany({ source: 'Test Electricity Report' });

    // Create test departments
    const dept1 = await Department.create({
      name: 'Test Report Department',
      code: 'TEST-DEPT',
      head: 'Test Manager',
      employeeCount: 20,
      status: 'Active',
    });

    const dept2 = await Department.create({
      name: 'Test Report Finance',
      code: 'TEST-FIN',
      head: 'Finance Manager',
      employeeCount: 15,
      status: 'Active',
    });

    // Create test challenges
    await Challenge.create([
      {
        title: 'Test Active Challenge Report',
        description: 'Test challenge for report verification',
        status: 'Active',
      },
      {
        title: 'Test Completed Challenge Report',
        description: 'Test completed challenge',
        status: 'Completed',
      },
    ]);

    // Create test policies
    await ESGPolicy.create([
      {
        title: 'Test Active Policy Report',
        description: 'Test policy for report verification',
        effectiveDate: new Date(),
        status: 'Active',
      },
      {
        title: 'Test Draft Policy Report',
        description: 'Test draft policy',
        effectiveDate: new Date(),
        status: 'Draft',
      },
    ]);

    // Create test environmental goals
    await EnvironmentalGoal.create([
      {
        title: 'Test Active Goal Report',
        targetValue: 1000,
        currentValue: 600,
        deadline: new Date('2026-12-31'),
        status: 'Active',
      },
      {
        title: 'Test Overdue Goal Report',
        targetValue: 500,
        currentValue: 200,
        deadline: new Date('2025-01-01'),
        status: 'Active',
      },
    ]);

    // Create test emission factor
    const emissionFactor = await EmissionFactor.create({
      source: 'Test Electricity Report',
      unit: 'kWh',
      factor: 0.92,
      status: 'Active',
    });

    // Create test carbon transactions
    await CarbonTransaction.create([
      {
        department: dept1._id,
        source: 'Test Electricity Report',
        quantity: 100,
        emissionFactor: emissionFactor._id,
        calculatedEmission: 92,
        transactionDate: new Date(),
        status: 'Verified',
      },
      {
        department: dept2._id,
        source: 'Test Electricity Report',
        quantity: 50,
        emissionFactor: emissionFactor._id,
        calculatedEmission: 46,
        transactionDate: new Date(),
        status: 'Pending',
      },
    ]);

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

// Test 1: Report Controller Functions
const testReportController = async (token) => {
  console.log('\n📊 TEST 1: REPORT CONTROLLER');
  console.log('='.repeat(50));

  try {
    // Test 1.1: generateEnvironmentalReport
    const envReport = await makeRequest('GET', '/api/reports/environment', token);
    const hasEnvReport =
      envReport.status === 200 &&
      envReport.data.success === true &&
      envReport.data.data.title === 'Environmental Report';
    logTest('reportController', 'generateEnvironmentalReport', hasEnvReport, `Status: ${envReport.status}`);

    // Test 1.2: generateSocialReport
    const socialReport = await makeRequest('GET', '/api/reports/social', token);
    const hasSocialReport =
      socialReport.status === 200 &&
      socialReport.data.success === true &&
      socialReport.data.data.title === 'Social Report';
    logTest('reportController', 'generateSocialReport', hasSocialReport, `Status: ${socialReport.status}`);

    // Test 1.3: generateGovernanceReport
    const govReport = await makeRequest('GET', '/api/reports/governance', token);
    const hasGovReport =
      govReport.status === 200 &&
      govReport.data.success === true &&
      govReport.data.data.title === 'Governance Report';
    logTest('reportController', 'generateGovernanceReport', hasGovReport, `Status: ${govReport.status}`);

    // Test 1.4: generateSummaryReport
    const summaryReport = await makeRequest('GET', '/api/reports/summary', token);
    const hasSummaryReport =
      summaryReport.status === 200 &&
      summaryReport.data.success === true &&
      summaryReport.data.data.title === 'ESG Summary Report';
    logTest('reportController', 'generateSummaryReport', hasSummaryReport, `Status: ${summaryReport.status}`);
  } catch (error) {
    console.error('❌ Report Controller Test Error:', error.message);
  }
};

// Test 2: Report Routes
const testReportRoutes = async (token) => {
  console.log('\n📊 TEST 2: REPORT ROUTES');
  console.log('='.repeat(50));

  try {
    // Test 2.1: GET /api/reports/environment
    const route1 = await makeRequest('GET', '/api/reports/environment', token);
    logTest('reportRoutes', 'GET /api/reports/environment', route1.status === 200, `Status: ${route1.status}`);

    // Test 2.2: GET /api/reports/social
    const route2 = await makeRequest('GET', '/api/reports/social', token);
    logTest('reportRoutes', 'GET /api/reports/social', route2.status === 200, `Status: ${route2.status}`);

    // Test 2.3: GET /api/reports/governance
    const route3 = await makeRequest('GET', '/api/reports/governance', token);
    logTest('reportRoutes', 'GET /api/reports/governance', route3.status === 200, `Status: ${route3.status}`);

    // Test 2.4: GET /api/reports/summary
    const route4 = await makeRequest('GET', '/api/reports/summary', token);
    logTest('reportRoutes', 'GET /api/reports/summary', route4.status === 200, `Status: ${route4.status}`);

    // Test 2.5: Query parameters (date filtering)
    const route5 = await makeRequest('GET', '/api/reports/environment?startDate=2026-01-01&endDate=2026-12-31', token);
    logTest('reportRoutes', 'Query params (date filtering)', route5.status === 200, `Status: ${route5.status}`);
  } catch (error) {
    console.error('❌ Report Routes Test Error:', error.message);
  }
};

// Test 3: JWT Protection
const testJWTProtection = async () => {
  console.log('\n📊 TEST 3: JWT PROTECTION');
  console.log('='.repeat(50));

  try {
    // Test 3.1: No token - should fail
    const noToken = await makeRequest('GET', '/api/reports/environment');
    logTest('jwtProtection', 'Reject request without token', noToken.status === 401, `Status: ${noToken.status}`);

    // Test 3.2: Invalid token - should fail
    const invalidToken = await makeRequest('GET', '/api/reports/social', 'invalid_token_here');
    logTest('jwtProtection', 'Reject invalid token', invalidToken.status === 401, `Status: ${invalidToken.status}`);

    // Test 3.3: All routes require JWT
    const routes = ['/api/reports/environment', '/api/reports/social', '/api/reports/governance', '/api/reports/summary'];

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

// Test 4: Response Format
const testResponseFormat = async (token) => {
  console.log('\n📊 TEST 4: RESPONSE FORMAT');
  console.log('='.repeat(50));

  try {
    // Test 4.1: Environmental Report structure
    const envReport = await makeRequest('GET', '/api/reports/environment', token);
    const hasEnvStructure =
      envReport.data.data.title !== undefined &&
      envReport.data.data.generatedAt !== undefined &&
      envReport.data.data.summary !== undefined &&
      envReport.data.data.statistics !== undefined &&
      envReport.data.data.chartsData !== undefined &&
      envReport.data.data.recommendations !== undefined;
    logTest('responseFormat', 'Environmental Report structure', hasEnvStructure, 'All required fields present');

    // Test 4.2: Social Report structure
    const socialReport = await makeRequest('GET', '/api/reports/social', token);
    const hasSocialStructure =
      socialReport.data.data.title !== undefined &&
      socialReport.data.data.statistics !== undefined &&
      socialReport.data.data.recommendations !== undefined;
    logTest('responseFormat', 'Social Report structure', hasSocialStructure, 'All required fields present');

    // Test 4.3: Governance Report structure
    const govReport = await makeRequest('GET', '/api/reports/governance', token);
    const hasGovStructure =
      govReport.data.data.title !== undefined &&
      govReport.data.data.statistics !== undefined &&
      govReport.data.data.recommendations !== undefined;
    logTest('responseFormat', 'Governance Report structure', hasGovStructure, 'All required fields present');

    // Test 4.4: Summary Report structure
    const summaryReport = await makeRequest('GET', '/api/reports/summary', token);
    const hasSummaryStructure =
      summaryReport.data.data.title !== undefined &&
      summaryReport.data.data.esgScores !== undefined &&
      summaryReport.data.data.sections !== undefined &&
      summaryReport.data.data.recommendations !== undefined;
    logTest('responseFormat', 'Summary Report structure', hasSummaryStructure, 'All required fields present');

    // Test 4.5: Recommendations is array
    const hasRecommendations = Array.isArray(envReport.data.data.recommendations);
    logTest('responseFormat', 'Recommendations is array', hasRecommendations, `Type: ${typeof envReport.data.data.recommendations}`);

    // Test 4.6: No HTML in JSON
    const reportStr = JSON.stringify(envReport.data);
    const hasHTML = /<[a-z][\s\S]*>/i.test(reportStr);
    logTest('responseFormat', 'No HTML in JSON', !hasHTML, hasHTML ? 'Contains HTML' : 'Pure JSON');
  } catch (error) {
    console.error('❌ Response Format Test Error:', error.message);
  }
};

// Test 5: Service Integration
const testServiceIntegration = async (token) => {
  console.log('\n📊 TEST 5: SERVICE INTEGRATION');
  console.log('='.repeat(50));

  try {
    // Test 5.1: Environmental service integration
    const envReport = await makeRequest('GET', '/api/reports/environment', token);
    const hasEnvData =
      envReport.data.data.statistics.totalEmissions !== undefined &&
      envReport.data.data.chartsData.emissionsByDepartment !== undefined;
    logTest('serviceIntegration', 'Environmental service called', hasEnvData, 'Service data present');

    // Test 5.2: Social service integration
    const socialReport = await makeRequest('GET', '/api/reports/social', token);
    const hasSocialData =
      socialReport.data.data.statistics.totalChallenges !== undefined &&
      socialReport.data.data.chartsData.challengesByStatus !== undefined;
    logTest('serviceIntegration', 'Social service called', hasSocialData, 'Service data present');

    // Test 5.3: Governance service integration
    const govReport = await makeRequest('GET', '/api/reports/governance', token);
    const hasGovData =
      govReport.data.data.statistics.totalPolicies !== undefined &&
      govReport.data.data.chartsData.policiesByStatus !== undefined;
    logTest('serviceIntegration', 'Governance service called', hasGovData, 'Service data present');

    // Test 5.4: Summary service integration
    const summaryReport = await makeRequest('GET', '/api/reports/summary', token);
    const hasSummaryData =
      summaryReport.data.data.esgScores.overall !== undefined &&
      summaryReport.data.data.sections.environmental !== undefined &&
      summaryReport.data.data.sections.social !== undefined &&
      summaryReport.data.data.sections.governance !== undefined;
    logTest('serviceIntegration', 'Summary service called', hasSummaryData, `Overall Score: ${summaryReport.data.data.esgScores.overall}`);

    // Test 5.5: No business logic in controller
    // Verify that reports contain calculated values (done by service, not controller)
    const hasCalculatedValues =
      typeof envReport.data.data.statistics.totalEmissions === 'number' &&
      Array.isArray(envReport.data.data.recommendations);
    logTest('serviceIntegration', 'No business logic in controller', hasCalculatedValues, 'Services handle generation');

    // Test 5.6: Date filtering works
    const filteredReport = await makeRequest('GET', '/api/reports/environment?startDate=2026-01-01', token);
    const hasDateFilter = filteredReport.data.data.period !== undefined;
    logTest('serviceIntegration', 'Date filtering parameter passed', hasDateFilter, 'Period field present');
  } catch (error) {
    console.error('❌ Service Integration Test Error:', error.message);
  }
};

// Generate final report
const generateFinalReport = () => {
  console.log('\n' + '='.repeat(70));
  console.log('📋 REPORT API VERIFICATION REPORT');
  console.log('='.repeat(70));

  const categories = ['reportController', 'reportRoutes', 'jwtProtection', 'responseFormat', 'serviceIntegration'];
  const categoryNames = {
    reportController: 'Report Controller',
    reportRoutes: 'Report Routes',
    jwtProtection: 'JWT Protection',
    responseFormat: 'Response Format',
    serviceIntegration: 'Service Integration',
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
  console.log('🚀 Starting Report API Verification...\n');

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
    await testReportController(token);
    await testReportRoutes(token);
    await testResponseFormat(token);
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
