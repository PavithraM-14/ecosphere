# 📄 Report API - Quick Reference

**Status:** ✅ Production Ready  
**Test Coverage:** 24/24 (100%)  
**All Routes:** JWT Protected

---

## 🎯 API Endpoints

### 1. Generate Environmental Report
```http
GET /api/reports/environment
Authorization: Bearer <token>

# With date filtering
GET /api/reports/environment?startDate=2026-01-01&endDate=2026-12-31
Authorization: Bearer <token>
```

**Returns:** Environmental report with carbon emissions analysis

**Response Time:** ~140ms

---

### 2. Generate Social Report
```http
GET /api/reports/social
Authorization: Bearer <token>
```

**Returns:** Social report with employee engagement and challenges

**Response Time:** ~90ms

---

### 3. Generate Governance Report
```http
GET /api/reports/governance
Authorization: Bearer <token>
```

**Returns:** Governance report with policies and compliance

**Response Time:** ~135ms

---

### 4. Generate ESG Summary Report
```http
GET /api/reports/summary
Authorization: Bearer <token>

# With date filtering
GET /api/reports/summary?startDate=2026-01-01&endDate=2026-12-31
Authorization: Bearer <token>
```

**Returns:** Combined ESG report with all three sections plus overall scores

**Response Time:** ~650ms

---

## 📝 Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "title": "Report Title",
    "generatedAt": "2026-07-12T...",
    "period": {
      "startDate": "...",
      "endDate": "..."
    },
    "summary": "Text summary...",
    "statistics": {
      // Key metrics
    },
    "chartsData": {
      // Data for visualizations
    },
    "recommendations": [
      // Actionable recommendations
    ]
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
# Get environmental report
curl -X GET http://localhost:5000/api/reports/environment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get summary report with date filtering
curl -X GET "http://localhost:5000/api/reports/summary?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript (fetch)

```javascript
const token = 'YOUR_JWT_TOKEN';

// Get environmental report
const response = await fetch('http://localhost:5000/api/reports/environment', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.data.statistics);
```

### Using Axios

```javascript
import axios from 'axios';

const token = 'YOUR_JWT_TOKEN';

// Get ESG summary report
const response = await axios.get('http://localhost:5000/api/reports/summary', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  params: {
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  }
});

console.log(response.data.data.esgScores);
```

---

## 🎯 Example Responses

### Environmental Report
```json
{
  "success": true,
  "data": {
    "title": "Environmental Report",
    "generatedAt": "2026-07-12T...",
    "period": {
      "startDate": "All Time",
      "endDate": "Present"
    },
    "summary": "Total carbon emissions: 92 kg CO2 from 1 verified transactions",
    "statistics": {
      "totalEmissions": 92,
      "transactionCount": 1,
      "activeGoals": 2,
      "overdueGoals": 1,
      "averageEmissionPerTransaction": 92
    },
    "chartsData": {
      "emissionsByDepartment": [
        {
          "department": "Test Report Department",
          "emissions": 92
        }
      ],
      "emissionsBySource": [
        {
          "source": "Test Electricity Report",
          "emissions": 92
        }
      ],
      "goalsProgress": [...]
    },
    "recommendations": [
      "Set environmental goals to track progress",
      "1 environmental goal(s) are overdue - review and update"
    ]
  }
}
```

### ESG Summary Report
```json
{
  "success": true,
  "data": {
    "title": "ESG Summary Report",
    "generatedAt": "2026-07-12T...",
    "summary": "Overall ESG Score: 67/100...",
    "esgScores": {
      "overall": 67,
      "environmental": 58,
      "social": 62,
      "governance": 83,
      "weights": {
        "environmental": 40,
        "social": 30,
        "governance": 30
      },
      "calculatedAt": "2026-07-12T..."
    },
    "sections": {
      "environmental": {
        "score": 58,
        "summary": "...",
        "statistics": {...}
      },
      "social": {
        "score": 62,
        "summary": "...",
        "statistics": {...}
      },
      "governance": {
        "score": 83,
        "summary": "...",
        "statistics": {...}
      }
    },
    "recommendations": [...],
    "detailedReports": {
      "environmental": {...},
      "social": {...},
      "governance": {...}
    }
  }
}
```

---

## 🧪 Testing

### Run Verification Tests
```bash
node verify-report-api.js
```

**Expected Output:**
```
✅ Report Controller: 4/4 PASS
✅ Report Routes: 5/5 PASS
✅ JWT Protection: 3/3 PASS
✅ Response Format: 6/6 PASS
✅ Service Integration: 6/6 PASS

OVERALL: 24/24 PASS (100%)
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
3. Verify Report Service is working
4. Check if test data exists

---

## 📊 Report Types

### Environmental Report
- **Focus:** Carbon emissions, environmental goals
- **Metrics:** Total emissions, transaction count, goal progress
- **Charts:** Emissions by department, by source, goals progress
- **Use Case:** Track environmental impact

### Social Report
- **Focus:** Employee engagement, challenges
- **Metrics:** Challenge completion rate, employee count
- **Charts:** Challenges by status, departments overview
- **Use Case:** Monitor social responsibility

### Governance Report
- **Focus:** Policies, compliance
- **Metrics:** Active policies, pending compliance
- **Charts:** Policies by status, compliance by department
- **Use Case:** Ensure governance compliance

### ESG Summary Report
- **Focus:** Combined ESG analysis
- **Metrics:** Overall ESG score, individual scores
- **Charts:** All charts from E, S, G reports
- **Use Case:** Executive-level overview

---

## 📚 Documentation

- **Full API Docs:** `REPORT_API_VERIFICATION_REPORT.md`
- **Report Service:** `BUSINESS_SERVICES_DOCUMENTATION.md`
- **Dashboard API:** `DASHBOARD_API_VERIFICATION_REPORT.md`
- **Main README:** `README.md`

---

**Last Updated:** 2026-07-12  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
