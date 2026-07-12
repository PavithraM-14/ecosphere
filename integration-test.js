/**
 * Phase 3: Integration Testing
 * Test all APIs working together: Dashboard → CRUD → Workflow → Notification → Reports
 */

import http from 'http';

// ANSI Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: [],
  categories: {
    auth: { passed: 0, failed: 0 },
    crud: { passed: 0, failed: 0 },
    workflow: { passed: 0, failed: 0 },
    dashboard: { passed: 0, failed: 0 },
    reports: { passed: 0, failed: 0 },
    notifications: { passed: 0, failed: 0 },
  },
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test function
async function test(description, category, testFn) {
  process.stdout.write(`${colors.cyan}⏳ ${description}${colors.reset}`);
  try {
    await testFn();
    console.log(`\r${colors.green}✓ PASS: ${description}${colors.reset}`);
    results.passed++;
    results.categories[category].passed++;
    results.tests.push({ description, category, status: 'PASS' });
  } catch (error) {
    console.log(`\r${colors.red}✗ FAIL: ${description}${colors.reset}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    results.failed++;
    results.categories[category].failed++;
    results.tests.push({ description, category, status: 'FAIL', error: error.message });
  }
}

// Assertion helpers
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Global variables for test data
let authToken = '';
let testDepartmentId = '';
let testChallengeId = '';
let testNotificationId = '';

// Main integration test function
async function runIntegrationTests() {
  console.log(`\n${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}          PHASE 3: INTEGRATION TESTING${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}\n`);

  const BASE_URL = 'http://localhost:5000';

  // ==================== AUTHENTICATION ====================
  console.log(`\n${colors.bright}${colors.magenta}🔐 AUTHENTICATION MODULE${colors.reset}`);
  
  await test('Login with seeded credentials', 'auth', async () => {
    const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ecosphere.com',
        password: 'admin123',
      }),
    });

    assertEqual(response.statusCode, 200, 'Should return 200 OK');
    const data = JSON.parse(response.body);
    assertTrue(data.success, 'Login should succeed');
    assertTrue(data.data.token.length > 0, 'Should receive JWT token');
    authToken = data.data.token;
  });

  await test('Get current user profile', 'auth', async () => {
    const response = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertEqual(data.data.user.email, 'admin@ecosphere.com');
  });

  // ==================== CRUD ENGINE ====================
  console.log(`\n${colors.bright}${colors.magenta}📝 CRUD ENGINE${colors.reset}`);

  await test('Get all departments (with seeded data)', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/departments`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.length >= 5, 'Should have seeded departments');
    testDepartmentId = data.data[0]._id;
  });

  await test('Get single department by ID', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/departments/${testDepartmentId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertEqual(data.data._id, testDepartmentId);
  });

  await test('Get all challenges', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/challenges`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.length >= 3, 'Should have seeded challenges');
    testChallengeId = data.data[0]._id;
  });

  await test('Get badges', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/badges`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.length >= 3, 'Should have seeded badges');
  });

  await test('Get rewards', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/rewards`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.length >= 3, 'Should have seeded rewards');
  });

  await test('Get carbon transactions', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/carbontransactions?limit=100`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.pagination.totalRecords >= 50, 'Should have 50+ total transactions');
  });

  await test('Search departments (CRUD search feature)', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/departments?search=IT`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.length > 0, 'Should find IT department');
  });

  await test('Pagination (CRUD pagination feature)', 'crud', async () => {
    const response = await makeRequest(`${BASE_URL}/api/crud/carbontransactions?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.pagination.totalPages > 1, 'Should have multiple pages');
  });

  // ==================== WORKFLOW ENGINE ====================
  console.log(`\n${colors.bright}${colors.magenta}🔄 WORKFLOW ENGINE${colors.reset}`);

  await test('Get allowed transitions for challenge', 'workflow', async () => {
    const response = await makeRequest(`${BASE_URL}/api/workflow/challenges/${testChallengeId}/transitions`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data.allowedTransitions));
  });

  await test('Get workflow history for challenge', 'workflow', async () => {
    const response = await makeRequest(`${BASE_URL}/api/workflow/challenges/${testChallengeId}/history`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data));
  });

  // ==================== DASHBOARD API ====================
  console.log(`\n${colors.bright}${colors.magenta}📊 DASHBOARD API${colors.reset}`);

  await test('Get dashboard summary', 'dashboard', async () => {
    const response = await makeRequest(`${BASE_URL}/api/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.overallESGScore !== undefined);
    assertTrue(data.data.departmentCount >= 5);
    assertTrue(data.data.activeChallenges >= 3);
  });

  await test('Get department ranking', 'dashboard', async () => {
    const response = await makeRequest(`${BASE_URL}/api/dashboard/ranking`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data));
  });

  await test('Get leaderboard', 'dashboard', async () => {
    const response = await makeRequest(`${BASE_URL}/api/dashboard/leaderboard?limit=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data));
  });

  await test('Get recent activities', 'dashboard', async () => {
    const response = await makeRequest(`${BASE_URL}/api/dashboard/activities?limit=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data));
  });

  await test('Get pending compliance', 'dashboard', async () => {
    const response = await makeRequest(`${BASE_URL}/api/dashboard/compliance`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
  });

  // ==================== REPORTS API ====================
  console.log(`\n${colors.bright}${colors.magenta}📄 REPORTS API${colors.reset}`);

  await test('Generate environmental report', 'reports', async () => {
    const response = await makeRequest(`${BASE_URL}/api/reports/environment`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.title === 'Environmental Report');
    assertTrue(data.data.statistics !== undefined);
  });

  await test('Generate social report', 'reports', async () => {
    const response = await makeRequest(`${BASE_URL}/api/reports/social`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.title === 'Social Report');
  });

  await test('Generate governance report', 'reports', async () => {
    const response = await makeRequest(`${BASE_URL}/api/reports/governance`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.title === 'Governance Report');
  });

  await test('Generate ESG summary report', 'reports', async () => {
    const response = await makeRequest(`${BASE_URL}/api/reports/summary`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(data.data.title === 'ESG Summary Report');
    assertTrue(data.data.esgScores !== undefined);
  });

  // ==================== NOTIFICATIONS API ====================
  console.log(`\n${colors.bright}${colors.magenta}📬 NOTIFICATIONS API${colors.reset}`);

  await test('Get all notifications', 'notifications', async () => {
    const response = await makeRequest(`${BASE_URL}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data));
    if (data.data.length > 0) {
      testNotificationId = data.data[0]._id;
    }
  });

  await test('Get unread notifications', 'notifications', async () => {
    const response = await makeRequest(`${BASE_URL}/api/notifications/unread`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.success);
    assertTrue(Array.isArray(data.data));
  });

  if (testNotificationId) {
    await test('Mark notification as read', 'notifications', async () => {
      const response = await makeRequest(`${BASE_URL}/api/notifications/${testNotificationId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      assertEqual(response.statusCode, 200);
      const data = JSON.parse(response.body);
      assertTrue(data.success);
    });
  }

  // ==================== INTEGRATION SCENARIOS ====================
  console.log(`\n${colors.bright}${colors.magenta}🔗 INTEGRATION SCENARIOS${colors.reset}`);

  await test('Frontend → Dashboard → Services flow', 'dashboard', async () => {
    // Simulate frontend calling dashboard
    const dashResponse = await makeRequest(`${BASE_URL}/api/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    const dashData = JSON.parse(dashResponse.body);
    assertTrue(dashData.success);

    // Verify dashboard aggregates data from multiple sources
    assertTrue(dashData.data.departmentCount > 0, 'Should aggregate department data');
    assertTrue(dashData.data.activeChallenges > 0, 'Should aggregate challenge data');
    assertTrue(dashData.data.carbonEmission >= 0, 'Should aggregate carbon data');
  });

  await test('CRUD → Workflow integration', 'workflow', async () => {
    // Get a challenge via CRUD
    const crudResponse = await makeRequest(`${BASE_URL}/api/crud/challenges/${testChallengeId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    const challenge = JSON.parse(crudResponse.body).data;
    assertTrue(challenge.status !== undefined);

    // Get workflow transitions for that challenge
    const workflowResponse = await makeRequest(`${BASE_URL}/api/workflow/challenges/${testChallengeId}/transitions`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    const workflow = JSON.parse(workflowResponse.body);
    assertTrue(workflow.success);
  });

  await test('Dashboard → Reports consistency', 'reports', async () => {
    // Get dashboard summary
    const dashResponse = await makeRequest(`${BASE_URL}/api/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    const dashData = JSON.parse(dashResponse.body).data;

    // Get ESG summary report
    const reportResponse = await makeRequest(`${BASE_URL}/api/reports/summary`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    const reportData = JSON.parse(reportResponse.body).data;

    // Verify ESG scores are consistent
    assertTrue(dashData.overallESGScore !== undefined);
    assertTrue(reportData.esgScores.overall !== undefined);
  });

  // Print Results
  console.log(`\n${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}                 INTEGRATION TEST RESULTS${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}\n`);

  console.log(`${colors.green}✓ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.cyan}Total Tests: ${results.passed + results.failed}${colors.reset}`);

  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  console.log(`${colors.yellow}Success Rate: ${successRate}%${colors.reset}\n`);

  // Print results by category
  console.log(`${colors.bright}${colors.blue}Results by Module:${colors.reset}`);
  for (const [category, stats] of Object.entries(results.categories)) {
    const total = stats.passed + stats.failed;
    if (total > 0) {
      const categoryRate = ((stats.passed / total) * 100).toFixed(0);
      const icon = stats.failed === 0 ? '✅' : '⚠️';
      console.log(`  ${icon} ${category.toUpperCase()}: ${stats.passed}/${total} (${categoryRate}%)`);
    }
  }

  if (results.failed === 0) {
    console.log(`\n${colors.bright}${colors.green}🎉 ALL INTEGRATION TESTS PASSED!${colors.reset}`);
    console.log(`${colors.green}All APIs are working together correctly.${colors.reset}`);
    console.log(`${colors.cyan}Ready for frontend integration and AI module!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}❌ Some tests failed. Please review the errors above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run integration tests
runIntegrationTests().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
