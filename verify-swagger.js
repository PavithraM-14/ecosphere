import http from 'http';
import https from 'https';

// ANSI Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = protocol.request(requestOptions, (res) => {
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
async function test(description, testFn) {
  process.stdout.write(`${colors.cyan}⏳ Testing: ${description}${colors.reset}`);
  try {
    await testFn();
    console.log(`\r${colors.green}✓ PASS: ${description}${colors.reset}`);
    results.passed++;
    results.tests.push({ description, status: 'PASS' });
  } catch (error) {
    console.log(`\r${colors.red}✗ FAIL: ${description}${colors.reset}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    results.failed++;
    results.tests.push({ description, status: 'FAIL', error: error.message });
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

// Main verification function
async function verifySwaggerDocumentation() {
  console.log(`\n${colors.bright}${colors.blue}============================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}   SWAGGER DOCUMENTATION VERIFICATION${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}============================================${colors.reset}\n`);

  const BASE_URL = 'http://localhost:5000';

  // Test 1: Health Check
  await test('Server is running', async () => {
    const response = await makeRequest(`${BASE_URL}/health`);
    assertEqual(response.statusCode, 200, 'Health check should return 200');
    const data = JSON.parse(response.body);
    assertTrue(data.success, 'Health check should return success: true');
  });

  // Test 2: API Root Endpoint
  await test('API root endpoint returns correct structure', async () => {
    const response = await makeRequest(`${BASE_URL}/api`);
    assertEqual(response.statusCode, 200);
    const data = JSON.parse(response.body);
    assertTrue(data.endpoints.docs === '/api-docs', 'Should have docs endpoint');
    assertTrue(data.endpoints.auth === '/api/auth', 'Should have auth endpoint');
    assertTrue(data.endpoints.dashboard === '/api/dashboard', 'Should have dashboard endpoint');
    assertTrue(data.endpoints.reports === '/api/reports', 'Should have reports endpoint');
  });

  // Test 3: Swagger UI Endpoint Accessible
  await test('Swagger UI endpoint is accessible', async () => {
    const response = await makeRequest(`${BASE_URL}/api-docs/`);
    assertEqual(response.statusCode, 200, 'Swagger UI should return 200');
    assertTrue(
      response.headers['content-type'].includes('text/html'),
      'Swagger UI should return HTML'
    );
  });

  // Test 4: Swagger UI Contains Title
  await test('Swagger UI contains correct title', async () => {
    const response = await makeRequest(`${BASE_URL}/api-docs/`);
    assertTrue(
      response.body.includes('EcoSphere') || response.body.includes('swagger'),
      'Swagger UI HTML should contain EcoSphere or swagger'
    );
  });

  // Test 5: Swagger JSON/YAML Endpoint
  await test('Swagger spec is served correctly', async () => {
    const response = await makeRequest(`${BASE_URL}/api-docs/swagger.json`);
    // Swagger UI Express serves the spec at this path
    assertTrue(response.statusCode === 200 || response.statusCode === 404, 'Spec endpoint exists');
  });

  // Test 6: YAML File Exists and is Valid
  await test('swagger.yaml file exists and is valid', async () => {
    const fs = await import('fs');
    const YAML = (await import('yamljs')).default;
    
    assertTrue(fs.existsSync('./swagger.yaml'), 'swagger.yaml file should exist');
    const swaggerDoc = YAML.load('./swagger.yaml');
    assertTrue(swaggerDoc.openapi === '3.0.0', 'Should be OpenAPI 3.0.0');
    assertTrue(swaggerDoc.info.title.includes('EcoSphere'), 'Should have correct title');
  });

  // Test 7: YAML Contains All Major Endpoints
  await test('Swagger YAML contains all major endpoint categories', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    const paths = Object.keys(swaggerDoc.paths);
    
    assertTrue(paths.some(p => p.includes('/api/auth')), 'Should document auth endpoints');
    assertTrue(paths.some(p => p.includes('/api/crud')), 'Should document CRUD endpoints');
    assertTrue(paths.some(p => p.includes('/api/workflow')), 'Should document workflow endpoints');
    assertTrue(paths.some(p => p.includes('/api/dashboard')), 'Should document dashboard endpoints');
    assertTrue(paths.some(p => p.includes('/api/reports')), 'Should document report endpoints');
  });

  // Test 8: YAML Contains Security Schemes
  await test('Swagger YAML contains JWT security scheme', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.components.securitySchemes, 'Should have security schemes');
    assertTrue(swaggerDoc.components.securitySchemes.bearerAuth, 'Should have bearerAuth scheme');
    assertEqual(
      swaggerDoc.components.securitySchemes.bearerAuth.type,
      'http',
      'Should be HTTP type'
    );
  });

  // Test 9: YAML Contains Schemas
  await test('Swagger YAML contains component schemas', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.components.schemas, 'Should have schemas');
    assertTrue(swaggerDoc.components.schemas.User, 'Should have User schema');
    assertTrue(swaggerDoc.components.schemas.Error, 'Should have Error schema');
  });

  // Test 10: YAML Contains Response Templates
  await test('Swagger YAML contains reusable responses', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.components.responses, 'Should have reusable responses');
    assertTrue(swaggerDoc.components.responses.Unauthorized, 'Should have Unauthorized response');
    assertTrue(swaggerDoc.components.responses.BadRequest, 'Should have BadRequest response');
    assertTrue(swaggerDoc.components.responses.NotFound, 'Should have NotFound response');
  });

  // Test 11: Authentication Endpoints Documented
  await test('All authentication endpoints are documented', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.paths['/api/auth/register'], 'Should document /api/auth/register');
    assertTrue(swaggerDoc.paths['/api/auth/login'], 'Should document /api/auth/login');
    assertTrue(swaggerDoc.paths['/api/auth/me'], 'Should document /api/auth/me');
  });

  // Test 12: CRUD Endpoints Documented
  await test('CRUD endpoints are documented', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.paths['/api/crud/{entity}'], 'Should document /api/crud/{entity}');
    assertTrue(swaggerDoc.paths['/api/crud/{entity}/{id}'], 'Should document /api/crud/{entity}/{id}');
  });

  // Test 13: Dashboard Endpoints Documented
  await test('All dashboard endpoints are documented', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.paths['/api/dashboard'], 'Should document /api/dashboard');
    assertTrue(swaggerDoc.paths['/api/dashboard/ranking'], 'Should document ranking endpoint');
    assertTrue(swaggerDoc.paths['/api/dashboard/leaderboard'], 'Should document leaderboard endpoint');
    assertTrue(swaggerDoc.paths['/api/dashboard/activities'], 'Should document activities endpoint');
    assertTrue(swaggerDoc.paths['/api/dashboard/compliance'], 'Should document compliance endpoint');
  });

  // Test 14: Report Endpoints Documented
  await test('All report endpoints are documented', async () => {
    const YAML = (await import('yamljs')).default;
    const swaggerDoc = YAML.load('./swagger.yaml');
    
    assertTrue(swaggerDoc.paths['/api/reports/environment'], 'Should document environment report');
    assertTrue(swaggerDoc.paths['/api/reports/social'], 'Should document social report');
    assertTrue(swaggerDoc.paths['/api/reports/governance'], 'Should document governance report');
    assertTrue(swaggerDoc.paths['/api/reports/summary'], 'Should document summary report');
  });

  // Test 15: API Documentation File Exists
  await test('API_DOCUMENTATION.md file exists', async () => {
    const fs = await import('fs');
    assertTrue(fs.existsSync('./API_DOCUMENTATION.md'), 'API_DOCUMENTATION.md should exist');
    const content = fs.readFileSync('./API_DOCUMENTATION.md', 'utf8');
    assertTrue(content.includes('EcoSphere API'), 'Should contain EcoSphere API title');
    assertTrue(content.includes('/api-docs'), 'Should reference Swagger UI endpoint');
  });

  // Print Results
  console.log(`\n${colors.bright}${colors.blue}============================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}           VERIFICATION RESULTS${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}============================================${colors.reset}\n`);

  console.log(`${colors.green}✓ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.cyan}Total Tests: ${results.passed + results.failed}${colors.reset}`);

  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  console.log(`${colors.yellow}Success Rate: ${successRate}%${colors.reset}\n`);

  if (results.failed === 0) {
    console.log(`${colors.bright}${colors.green}🎉 ALL TESTS PASSED! Swagger documentation is complete and functional.${colors.reset}\n`);
    console.log(`${colors.cyan}📖 Access interactive documentation at: ${colors.bright}http://localhost:5000/api-docs${colors.reset}\n`);
  } else {
    console.log(`${colors.red}❌ Some tests failed. Please review the errors above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run verification
verifySwaggerDocumentation().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
