# 📊 Dashboard API - Quick Reference

**Status:** ✅ Production Ready  
**Test Coverage:** 26/26 (100%)  
**All Routes:** JWT Protected

---

## 🎯 API Endpoints

### 1. Get Dashboard Summary
```http
GET /api/dashboard
Authorization: Bearer <token>
```

**Returns:** Complete dashboard with ESG scores, counts, rankings, activities

**Response Time:** ~590ms

---

### 2. Get Department Ranking
```http
GET /api/dashboard/ranking
Authorization: Bearer <token>
```

**Returns:** Departments ranked by carbon emissions (lowest = best)

**Response Time:** ~80ms

---

### 3. Get Leaderboard
```http
GET /api/dashboard/leaderboard?limit=10
Authorization: Bearer <token>
```

**Query Params:**
- `limit` (optional, default: 10) - Number of users to return

**Returns:** Top users by XP

**Response Time:** ~40ms

---

### 4. Get Recent Activities
```http
GET /api/dashboard/activities?limit=10
Authorization: Bearer <token>
```

**Query Params:**
- `limit` (optional, default: 10) - Number of activities to return

**Returns:** Recent carbon transactions

**Response Time:** ~37ms

---

### 5. Get Pending Compliance
```http
GET /api/dashboard/compliance
Authorization: Bearer <token>
```

**Returns:** Pending compliance issues

**Response Time:** ~40ms

---

## 📝 Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": {
    // Service response data
  }
}
```

### Error Response (401)
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

---

## 🔐 Authentication

**Required Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Get Token:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 💻 Example Usage

### Using cURL

```bash
# Get dashboard summary
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get leaderboard (top 5)
curl -X GET "http://localhost:5000/api/dashboard/leaderboard?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript (fetch)

```javascript
const token = 'YOUR_JWT_TOKEN';

// Get dashboard summary
const response = await fetch('http://localhost:5000/api/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

### Using Axios

```javascript
import axios from 'axios';

const token = 'YOUR_JWT_TOKEN';

// Get dashboard summary
const response = await axios.get('http://localhost:5000/api/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(response.data);
```

---

## 🎯 Example Responses

### Dashboard Summary
```json
{
  "success": true,
  "data": {
    "overallESGScore": 71,
    "environmentalScore": 65,
    "socialScore": 69,
    "governanceScore": 80,
    "departmentCount": 2,
    "employeeCount": 35,
    "activeChallenges": 6,
    "pendingCompliance": 0,
    "carbonEmission": 0,
    "leaderboard": [
      {
        "rank": 1,
        "userId": "...",
        "name": "John Doe",
        "xp": 500
      }
    ],
    "departmentRanking": [...],
    "recentActivities": [...]
  }
}
```

### Leaderboard
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "department": "IT",
      "xp": 500,
      "points": 250,
      "role": "Employee"
    }
  ]
}
```

---

## 🧪 Testing

### Run Verification Tests
```bash
node verify-dashboard-api.js
```

**Expected Output:**
```
✅ Dashboard Controller: 5/5 PASS
✅ Dashboard Routes: 6/6 PASS
✅ JWT Protection: 3/3 PASS
✅ JSON Response: 6/6 PASS
✅ Service Integration: 6/6 PASS

OVERALL: 26/26 PASS (100%)
```

---

## 🔍 Troubleshooting

### 401 Unauthorized

**Problem:** Request returns 401

**Solutions:**
1. Check if Authorization header is present
2. Verify token is valid (not expired)
3. Check token format: `Bearer <token>`
4. Login again to get new token

### 500 Internal Server Error

**Problem:** Request returns 500

**Solutions:**
1. Check MongoDB connection
2. Check server logs for error details
3. Verify Business Services are working
4. Check if test data exists

---

## 📚 Documentation

- **Full API Docs:** `DASHBOARD_API_VERIFICATION_REPORT.md`
- **Business Services:** `BUSINESS_SERVICES_DOCUMENTATION.md`
- **Main README:** `README.md`

---

**Last Updated:** 2026-07-12  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
