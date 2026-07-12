# 🌍 EcoSphere - ESG Management Platform

A comprehensive ESG (Environmental, Social, and Governance) management platform for businesses to track, manage, and improve their sustainability initiatives.

## 📁 Project Structure

```
ecosphere/
├── backend/          # Node.js/Express API Server
├── frontend/         # React Frontend Application
└── README.md        # This file
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
node seed-data.js      # Optional: Load test data
npm run dev           # Start backend server
```

Backend will run on http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev           # Start frontend dev server
```

Frontend will run on http://localhost:5173 (or another port if 5173 is in use)

## 📚 Documentation

### Backend Documentation
- **API Docs:** http://localhost:5000/api-docs (Swagger UI)
- **Full Guide:** `backend/API_DOCUMENTATION.md`
- **Integration Tests:** `backend/PHASE3_INTEGRATION_REPORT.md`

### API Endpoints
- **Authentication:** `/api/auth/*`
- **CRUD Operations:** `/api/crud/*`
- **Workflows:** `/api/workflow/*`
- **Dashboard:** `/api/dashboard/*`
- **Reports:** `/api/reports/*`
- **Notifications:** `/api/notifications/*`
- **AI Insights:** `/api/ai/*`

## 🔐 Test Credentials

After running `node seed-data.js` in backend:
```
Email: admin@ecosphere.com
Password: admin123
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
node integration-test.js      # All integration tests (26 tests)
node verify-dashboard-api.js   # Dashboard API tests
node verify-report-api.js      # Report API tests
node verify-notification-api.js # Notification API tests
```

All tests achieve 100% pass rate.

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Swagger/OpenAPI 3.0
- Generic CRUD & Workflow Engines

### Frontend
- React 18
- Vite
- React Router
- Axios

## ✨ Features

### Backend Features
- ✅ JWT-based authentication
- ✅ Generic CRUD engine (works with any entity)
- ✅ Workflow engine with status transitions
- ✅ ESG scoring system
- ✅ Carbon footprint calculator
- ✅ Dashboard analytics
- ✅ Automated report generation
- ✅ Notification system
- ✅ AI-powered insights (Gemini integration)

### Frontend Features
- ✅ Modern dashboard UI
- ✅ ESG metrics visualization
- ✅ User leaderboard
- ✅ Real-time notifications
- ✅ Report generation
- ✅ Settings management

## 📊 Key Modules

1. **Authentication** - Secure JWT-based auth
2. **CRUD Engine** - Generic operations for all entities
3. **Workflow Engine** - Configurable status workflows
4. **ESG Models** - 10+ data models (Departments, Challenges, Goals, etc.)
5. **Business Services** - Score calculation, carbon tracking, notifications
6. **Dashboard API** - Analytics and metrics aggregation
7. **Report API** - Environmental, Social, Governance reports
8. **Notification API** - User notification management
9. **AI Module** - Gemini-powered insights and recommendations

## 🗃️ Database Models

- User
- Department
- Challenge
- Category
- EmissionFactor
- CarbonTransaction
- EnvironmentalGoal
- ESGPolicy
- Badge
- Reward
- WorkflowHistory

## 🌐 API Status

**Total Endpoints:** 24+  
**Test Coverage:** 100%  
**Documentation:** Complete with Swagger UI  
**Status:** ✅ Production Ready

## 📈 Development Status

| Module | Status |
|--------|--------|
| Authentication | ✅ Complete |
| CRUD Engine | ✅ Complete |
| Workflow Engine | ✅ Complete |
| ESG Models | ✅ Complete |
| Business Services | ✅ Complete |
| Dashboard API | ✅ Complete |
| Report API | ✅ Complete |
| Notification API | ✅ Complete |
| AI Module | ✅ Complete |
| Frontend | ✅ Complete |
| Integration Testing | ✅ Complete |
| Documentation | ✅ Complete |

## 👥 Contributors

- Backend Development Team
- Frontend Development Team
- AI Integration Team

## 📝 License

MIT

## 🔗 Links

- **Repository:** https://github.com/PavithraM-14/ecosphere
- **API Documentation:** http://localhost:5000/api-docs (when server is running)

---

**Ready for hackathon demo! 🚀**
