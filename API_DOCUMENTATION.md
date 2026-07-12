# 📚 EcoSphere API Documentation

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Interactive Documentation:** http://localhost:5000/api-docs

---

## 🎯 Overview

The EcoSphere API provides a comprehensive RESTful interface for managing ESG (Environmental, Social, Governance) operations. All endpoints return JSON responses and most require JWT authentication.

---

## 🚀 Quick Start

### 1. Start the Server
```bash
npm run dev
```

### 2. Access Interactive Documentation
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

### 3. Authenticate
1. Click on **POST /api/auth/login** or **POST /api/auth/register**
2. Try it out with your credentials
3. Copy the JWT token from the response
4. Click the **Authorize** button at the top
5. Paste your token (format: `Bearer <your_token>`)
6. Now you can test all protected endpoints!

---

## 📖 API Documentation

### Interactive Swagger UI
The Swagger UI provides:
- ✅ **Interactive Testing** - Try all endpoints directly from the browser
- ✅ **Request/Response Examples** - See exactly what to send and expect
- ✅ **Schema Definitions** - Understand all data models
- ✅ **Authentication Integration** - Test with your JWT token
- ✅ **Parameter Documentation** - Know what each parameter does

Access it at: **http://localhost:5000/api-docs**

### Static Documentation Files
- **`swagger.yaml`** - OpenAPI 3.0 specification in YAML format
- **`swagger.json`** - OpenAPI 3.0 specification in JSON format

---

## 🔐 Authentication

Most endpoints require JWT authentication.

### Get a Token

**Option 1: Register a new user**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Employee",
  "department": "Engineering"
}
```

**Option 2: Login with existing user**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### Use the Token

Include the token in the Authorization header for protected endpoints:
```
Authorization: Bearer <your_jwt_token>
```

**Example with cURL:**
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📡 API Endpoints Summary

### System
- `GET /health` - Health check

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user 🔒

### CRUD Operations
- `GET /api/crud/{entity}` - Get all records 🔒
- `POST /api/crud/{entity}` - Create record 🔒
- `GET /api/crud/{entity}/{id}` - Get single record 🔒
- `PUT /api/crud/{entity}/{id}` - Update record 🔒
- `DELETE /api/crud/{entity}/{id}` - Delete record 🔒

**Available Entities:**
- departments
- challenges
- categories
- emissionfactors
- carbontransactions
- environmentalgoals
- esgpolicies
- badges
- rewards

### Workflow
- `PATCH /api/workflow/{entity}/{id}/status` - Change status 🔒
- `GET /api/workflow/{entity}/{id}/history` - Get workflow history 🔒

### Dashboard
- `GET /api/dashboard` - Complete dashboard summary 🔒
- `GET /api/dashboard/ranking` - Department ranking 🔒
- `GET /api/dashboard/leaderboard` - User leaderboard 🔒
- `GET /api/dashboard/activities` - Recent activities 🔒
- `GET /api/dashboard/compliance` - Pending compliance 🔒

### Reports
- `GET /api/reports/environment` - Environmental report 🔒
- `GET /api/reports/social` - Social report 🔒
- `GET /api/reports/governance` - Governance report 🔒
- `GET /api/reports/summary` - ESG summary report 🔒

🔒 = Requires JWT authentication

---

## 💻 Usage Examples

### Example 1: Get Dashboard Summary

```javascript
// Using fetch
const token = 'YOUR_JWT_TOKEN';

const response = await fetch('http://localhost:5000/api/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.data.overallESGScore); // 71
```

### Example 2: Create a Department

```javascript
// Using axios
import axios from 'axios';

const token = 'YOUR_JWT_TOKEN';

const response = await axios.post(
  'http://localhost:5000/api/crud/departments',
  {
    name: 'Marketing',
    code: 'MKT',
    head: 'Jane Smith',
    employeeCount: 15,
    status: 'Active'
  },
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(response.data);
```

### Example 3: Generate ESG Report

```bash
# Using cURL
curl -X GET "http://localhost:5000/api/reports/summary?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Response Format

All API responses follow a consistent format:

**Success Response (200/201):**
```json
{
  "success": true,
  "message": "Optional message",
  "data": {
    // Response data
  }
}
```

**Error Response (4xx/5xx):**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔍 Query Parameters

### Pagination (CRUD Endpoints)
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)

### Sorting (CRUD Endpoints)
- `sort` - Field to sort by
- `order` - Sort order (`asc` or `desc`)

### Search (CRUD Endpoints)
- `search` - Search keyword (searches all string fields)

### Date Filtering (Reports)
- `startDate` - Start date (YYYY-MM-DD format)
- `endDate` - End date (YYYY-MM-DD format)

**Example:**
```
GET /api/crud/departments?page=2&limit=20&sort=name&order=asc&search=IT
GET /api/reports/environment?startDate=2026-01-01&endDate=2026-12-31
```

---

## 🛠️ Testing with Swagger UI

### Step-by-Step Guide:

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI:**
   Navigate to http://localhost:5000/api-docs

3. **Authenticate:**
   - Expand **POST /api/auth/login**
   - Click **Try it out**
   - Enter your credentials
   - Click **Execute**
   - Copy the token from the response

4. **Authorize:**
   - Click the **Authorize** button (🔒) at the top
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click **Authorize**
   - Click **Close**

5. **Test Endpoints:**
   - All protected endpoints are now accessible
   - Expand any endpoint
   - Click **Try it out**
   - Modify parameters if needed
   - Click **Execute**
   - See the response below

---

## 📱 Frontend Integration

### React Example

```javascript
// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API methods
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me')
};

export const dashboardAPI = {
  getSummary: () => api.get('/api/dashboard'),
  getRanking: () => api.get('/api/dashboard/ranking'),
  getLeaderboard: (limit = 10) => api.get(`/api/dashboard/leaderboard?limit=${limit}`)
};

export const reportAPI = {
  getEnvironmental: (startDate, endDate) => 
    api.get('/api/reports/environment', { params: { startDate, endDate } }),
  getSummary: () => api.get('/api/reports/summary')
};

export default api;
```

### Usage in Component

```javascript
import { useEffect, useState } from 'react';
import { dashboardAPI } from './api';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getSummary();
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Overall ESG Score: {data.overallESGScore}</h1>
      <p>Environmental: {data.environmentalScore}</p>
      <p>Social: {data.socialScore}</p>
      <p>Governance: {data.governanceScore}</p>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Common Issues

**401 Unauthorized**
- Make sure you included the Authorization header
- Check if your token is expired (login again)
- Verify the token format: `Bearer <token>`

**400 Bad Request**
- Check request body matches the schema
- Verify all required fields are provided
- Check data types (strings, numbers, dates)

**404 Not Found**
- Verify the endpoint URL is correct
- Check if the resource ID exists
- Make sure the entity name is correct

**500 Internal Server Error**
- Check server logs for details
- Verify MongoDB connection is active
- Check if all required services are running

---

## 📚 Additional Resources

- **Main README:** `README.md`
- **OpenAPI Spec (YAML):** `swagger.yaml`
- **OpenAPI Spec (JSON):** `swagger.json`
- **Business Services Docs:** `BUSINESS_SERVICES_DOCUMENTATION.md`
- **Dashboard API Docs:** `DASHBOARD_API_VERIFICATION_REPORT.md`
- **Report API Docs:** `REPORT_API_VERIFICATION_REPORT.md`

---

## 🎯 For Hackathon Demo

### Impress the Judges:

1. **Show Interactive Docs:**
   - Open http://localhost:5000/api-docs during your presentation
   - Demonstrate how easy it is to test the API

2. **Live API Testing:**
   - Register a user live
   - Generate a report in real-time
   - Show the dashboard data

3. **Highlight Features:**
   - "Our API is fully documented with OpenAPI 3.0"
   - "Any frontend developer can integrate immediately"
   - "Interactive testing available at /api-docs"

4. **Professional Touch:**
   - "We follow REST best practices"
   - "100% test coverage on all endpoints"
   - "JWT-based security throughout"

---

**Last Updated:** 2026-07-12  
**API Version:** 1.0.0  
**Status:** ✅ Production Ready

---

🎉 **Happy Coding!**
