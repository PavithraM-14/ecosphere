# EcoSphere - ESG Management Platform Backend

A robust and scalable backend foundation for an ERP application focused on ESG (Environmental, Social, and Governance) management.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing
- **Environment:** dotenv for configuration
- **CORS:** Enabled for cross-origin requests
- **Dev Tool:** Nodemon for hot reloading

## 📁 Project Structure

```
ecosphere-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & authorization
│   │   ├── errorHandler.js       # Global error handler
│   │   └── notFound.js           # 404 handler
│   ├── models/
│   │   └── User.js               # User schema & model
│   ├── routes/
│   │   └── authRoutes.js         # Authentication routes
│   ├── utils/                     # Utility functions (future)
│   ├── services/                  # Business logic services (future)
│   ├── engines/                   # CRUD & Workflow engines (future)
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies & scripts
└── README.md                      # Documentation
```

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecosphere-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your MongoDB URI and JWT secret
```

### 4. Set up MongoDB Atlas
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Replace `<username>` and `<password>` in the MONGODB_URI
5. Whitelist your IP address

### 5. Run the application
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecosphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### Authentication Routes

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Employee",
    "department": "Engineering"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Employee",
        "department": "Engineering",
        "xp": 0,
        "points": 0
      }
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Employee",
        "department": "Engineering",
        "xp": 0,
        "points": 0
      }
    }
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Employee",
        "department": "Engineering",
        "xp": 0,
        "points": 0,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

## 👤 User Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ['Admin', 'Employee'] (default: 'Employee'),
  department: String (optional),
  xp: Number (default: 0),
  points: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔒 Authentication Flow

1. **Registration:**
   - User submits name, email, password
   - Email uniqueness is validated
   - Password is hashed using bcrypt
   - User is created with default role "Employee"
   - JWT token is generated and returned

2. **Login:**
   - User submits email and password
   - Email is validated
   - Password is compared with hashed password
   - JWT token is generated and returned

3. **Protected Routes:**
   - Client includes JWT token in Authorization header
   - Middleware verifies token validity
   - User information is attached to request object
   - Route handler processes the request

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Token expiration (7 days default)
- ✅ Password field excluded from queries by default
- ✅ Email validation with regex
- ✅ Role-based access control ready
- ✅ CORS protection
- ✅ Input validation
- ✅ Centralized error handling

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📚 API Documentation

### Interactive Swagger UI

Access comprehensive, interactive API documentation at:
```
http://localhost:5000/api-docs
```

**Features:**
- ✅ **Interactive Testing** - Try all endpoints directly from your browser
- ✅ **Request/Response Examples** - See exactly what to send and expect
- ✅ **JWT Authentication** - Test with your token easily
- ✅ **Schema Definitions** - Understand all data models
- ✅ **Professional Presentation** - Perfect for hackathon demos

### Quick Start with API Docs

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI:**
   Navigate to http://localhost:5000/api-docs

3. **Authenticate:**
   - Login via `/api/auth/login`
   - Copy the JWT token
   - Click **Authorize** button
   - Enter: `Bearer YOUR_TOKEN`

4. **Test Endpoints:**
   - All endpoints are now accessible
   - Click **Try it out** on any endpoint
   - See live responses

### Documentation Files

- **`swagger.yaml`** - OpenAPI 3.0 specification (YAML)
- **`swagger.json`** - OpenAPI 3.0 specification (JSON)
- **`API_DOCUMENTATION.md`** - Complete API guide with examples

### For Your Frontend Team

The OpenAPI specification provides everything needed for frontend integration:
- All endpoint URLs and methods
- Request/response schemas
- Authentication requirements
- Query parameters and filters
- Error responses

📚 **Full API Guide:** See `API_DOCUMENTATION.md`

---

## 🚧 Development Progress

- ✅ **STEP 1:** Project Setup (Completed)
- ✅ **STEP 2:** MongoDB Connection (Completed)
- ✅ **STEP 3:** Authentication Module (Completed)
- ✅ **STEP 4:** Generic CRUD Engine (Completed)
- ✅ **STEP 5:** Workflow Engine (Completed)
- ✅ **STEP 6:** Core ESG Models (Completed)
- ✅ **STEP 7:** Business Services Layer (Completed)
- ✅ **STEP 8:** Dashboard API Layer (Completed)
- ✅ **STEP 9:** Report API Layer (Completed)
- ⏳ AI Integration (Planned)

## 🔧 Generic CRUD Engine

The EcoSphere backend includes a powerful Generic CRUD Engine that eliminates repetitive code:

### Features
- ✅ **One Controller for All Entities** - No need to write DepartmentController, RewardController, etc.
- ✅ **Automatic Pagination** - Query: `?page=1&limit=10`
- ✅ **Sorting Support** - Query: `?sort=name&order=asc`
- ✅ **Auto Search** - Query: `?search=keyword` (searches all string fields)
- ✅ **Validation** - ObjectId validation, empty update rejection
- ✅ **Logging** - All CREATE, UPDATE, DELETE operations logged

### API Endpoints
```
POST   /api/crud/:entity        # Create record
GET    /api/crud/:entity        # Get all (with pagination, sorting, search)
GET    /api/crud/:entity/:id    # Get single record
PUT    /api/crud/:entity/:id    # Update record
DELETE /api/crud/:entity/:id    # Delete record
```

### Example Usage
```bash
# Create a department
POST /api/crud/departments
{
  "name": "Information Technology",
  "head": "John Doe",
  "status": "Active"
}

# Get all departments with pagination
GET /api/crud/departments?page=1&limit=10&sort=name&order=asc

# Search departments
GET /api/crud/departments?search=IT
```

### Adding New Entities
1. Create model in `src/models/YourModel.js`
2. Register in `src/config/modelRegistry.js`
3. Use immediately! No controller or routes needed.

📚 **Full Documentation:** See `CRUD_ENGINE_DOCUMENTATION.md`

## 🔄 Generic Workflow Engine

The EcoSphere backend includes a powerful Workflow Engine for managing status transitions:

### Features
- ✅ **Generic & Reusable** - Works with any entity (Challenge, CSR Activity, Compliance, Audit)
- ✅ **Configuration-Driven** - Define workflows in config, not code
- ✅ **Transition Validation** - Prevents illegal status changes
- ✅ **History Tracking** - Every status change recorded
- ✅ **JWT Authentication** - Secure access control
- ✅ **Automatic Logging** - All transitions logged

### API Endpoints
```
PATCH  /api/workflow/:entity/:id/status       # Change status
GET    /api/workflow/:entity/:id/history      # Get history
GET    /api/workflow/:entity/:id/transitions  # Get allowed transitions
```

### Example Usage
```bash
# Change challenge status
PATCH /api/workflow/challenges/:id/status
Authorization: Bearer <token>
{
  "status": "Active"
}

# Get workflow history
GET /api/workflow/challenges/:id/history
Authorization: Bearer <token>
```

### Challenge Workflow
```
Draft → Active → Under Review → Completed → Archived
(Archived can be reached from any state)
```

### Adding New Workflows
1. Define workflow in `src/config/workflows.js`
2. Create model with status field
3. Register in Model Registry
4. Use immediately!

📚 **Full Documentation:** See `WORKFLOW_ENGINE_DOCUMENTATION.md`

## 🌍 Core ESG Business Models

The EcoSphere platform includes 8 core business models for ESG management:

### Models
1. **Department** - Organizational structure with code, head, employee count
2. **Category** - Classify CSR Activities and Challenges
3. **EmissionFactor** - Carbon calculation factors (source, unit, factor)
4. **CarbonTransaction** - Track department carbon emissions
5. **EnvironmentalGoal** - Sustainability targets with progress tracking
6. **ESGPolicy** - Corporate ESG policies with effective dates
7. **Badge** - Gamification achievements
8. **Reward** - Points-based reward system

### Features
- ✅ **Full CRUD Operations** - All models work with CRUD Engine
- ✅ **Validation** - Required fields, enums, non-negative values
- ✅ **Relationships** - ObjectId references between models
- ✅ **Indexes** - Optimized for common queries
- ✅ **Virtual Fields** - Calculated fields (e.g., goal progress)
- ✅ **Timestamps** - Auto-tracked creation and updates

### API Usage
```bash
# Department operations
POST   /api/crud/departments
GET    /api/crud/departments
PUT    /api/crud/departments/:id
DELETE /api/crud/departments/:id

# All other models follow the same pattern:
# categories, emissionfactors, carbontransactions,
# environmentalgoals, esgpolicies, badges, rewards
```

### Example: Track Carbon Emissions
```bash
# Create emission factor
POST /api/crud/emissionfactors
{
  "source": "Electricity",
  "unit": "kWh",
  "factor": 0.92
}

# Record transaction
POST /api/crud/carbontransactions
{
  "department": "DEPT_ID",
  "source": "Electricity",
  "quantity": 1000,
  "emissionFactor": "FACTOR_ID",
  "calculatedEmission": 920
}
```

📚 **Full Documentation:** See `ESG_MODELS_DOCUMENTATION.md`

## 🎯 Business Services Layer

The EcoSphere backend includes 5 production-ready business services:

### Services
1. **Carbon Calculator Service** - Automatic carbon emission calculations
2. **ESG Score Service** - Environmental, Social, Governance scoring with custom weights
3. **Notification Service** - System notification management (5 types)
4. **Dashboard Service** - Data aggregation for dashboard APIs
5. **Report Service** - JSON report generation (Environmental, Social, Governance, Summary)

### Features
- ✅ **Production Ready** - 100% test coverage (36/36 tests passed)
- ✅ **Validated** - Input validation on all functions
- ✅ **Logged** - Execution time and status logging
- ✅ **Error Handled** - Comprehensive error handling
- ✅ **JSON Only** - Dashboard and Reports return pure JSON (no HTML/PDF)

### Quick Examples

#### Carbon Calculator
```javascript
import * as carbonCalculator from './src/services/carbonCalculatorService.js';

// Calculate emission: Quantity × Factor
const emission = carbonCalculator.calculateEmission(100, 2.31);
console.log(emission); // 231
```

#### ESG Scores
```javascript
import * as scoreService from './src/services/scoreService.js';

// Get overall ESG score (E:40%, S:30%, G:30%)
const scores = await scoreService.calculateOverallESGScore();
console.log(scores.overallScore); // 85
```

#### Notifications
```javascript
import * as notificationService from './src/services/notificationService.js';

// Create notification
const notif = notificationService.createNotification({
  title: 'Badge Unlocked',
  message: 'You earned the Carbon Warrior badge!',
  type: 'Badge Unlocked',
  recipient: 'user123'
});
```

#### Dashboard Summary
```javascript
import * as dashboardService from './src/services/dashboardService.js';

// Get complete dashboard data
const summary = await dashboardService.getDashboardSummary();
// Returns: ESG scores, department count, employee count, 
//          active challenges, pending compliance, carbon emissions,
//          leaderboard, department ranking, recent activities
```

#### Reports
```javascript
import * as reportService from './src/services/reportService.js';

// Generate ESG summary report
const report = await reportService.generateSummaryReport();
// Returns: title, generatedAt, summary, esgScores, 
//          sections (E/S/G), recommendations, detailedReports
```

### Verification
Run comprehensive tests:
```bash
node verify-services.js
```

Expected: ✅ 36/36 tests passed (100% success rate)

📚 **Full Documentation:** See `BUSINESS_SERVICES_DOCUMENTATION.md`  
📊 **Verification Report:** See `BUSINESS_SERVICES_VERIFICATION_REPORT.md`  
🚀 **Quick Start:** See `SERVICES_README.md`

## 🎯 Dashboard API Layer

The EcoSphere backend includes a complete Dashboard API that consumes Business Services:

### Features
- ✅ **5 API Endpoints** - Complete dashboard functionality
- ✅ **JWT Protected** - All routes require authentication
- ✅ **Service Integration** - No business logic in controllers
- ✅ **Standardized Responses** - Consistent JSON format
- ✅ **Query Parameters** - Limit support for pagination
- ✅ **Production Ready** - 100% test coverage (26/26 tests passed)

### API Endpoints

#### Get Dashboard Summary
```bash
GET /api/dashboard
Authorization: Bearer <token>

Response: {
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
    "leaderboard": [...],
    "departmentRanking": [...],
    "recentActivities": [...]
  }
}
```

#### Get Department Ranking
```bash
GET /api/dashboard/ranking
Authorization: Bearer <token>

Response: Departments ranked by carbon emissions (lowest = best)
```

#### Get Leaderboard
```bash
GET /api/dashboard/leaderboard?limit=10
Authorization: Bearer <token>

Response: Top users by XP
```

#### Get Recent Activities
```bash
GET /api/dashboard/activities?limit=10
Authorization: Bearer <token>

Response: Recent carbon transactions
```

#### Get Pending Compliance
```bash
GET /api/dashboard/compliance
Authorization: Bearer <token>

Response: Pending compliance issues
```

### Controller Pattern

Controllers are thin and only orchestrate service calls:

```javascript
export const getDashboardSummary = async (req, res, next) => {
  try {
    // Call service - NO business logic in controller
    const summary = await dashboardService.getDashboardSummary();
    
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
```

### Verification
Run comprehensive tests:
```bash
node verify-dashboard-api.js
```

Expected: ✅ 26/26 tests passed (100% success rate)

📚 **Full Documentation:** See `DASHBOARD_API_VERIFICATION_REPORT.md`

## 📄 Report API Layer

The EcoSphere backend includes a complete Report API that consumes the reportService:

### Features
- ✅ **4 API Endpoints** - Complete ESG reporting functionality
- ✅ **JWT Protected** - All routes require authentication
- ✅ **Service Integration** - No business logic in controllers
- ✅ **Standardized Responses** - Consistent JSON format
- ✅ **Date Filtering** - Optional date range for reports
- ✅ **Production Ready** - 100% test coverage (24/24 tests passed)

### API Endpoints

#### Generate Environmental Report
```bash
GET /api/reports/environment?startDate=2026-01-01&endDate=2026-12-31
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "title": "Environmental Report",
    "generatedAt": "...",
    "summary": "...",
    "statistics": {
      "totalEmissions": 92,
      "transactionCount": 1,
      "activeGoals": 2
    },
    "chartsData": {
      "emissionsByDepartment": [...],
      "emissionsBySource": [...],
      "goalsProgress": [...]
    },
    "recommendations": [...]
  }
}
```

#### Generate Social Report
```bash
GET /api/reports/social
Authorization: Bearer <token>

Response: Employee engagement and challenges analysis
```

#### Generate Governance Report
```bash
GET /api/reports/governance
Authorization: Bearer <token>

Response: Policies and compliance analysis
```

#### Generate ESG Summary Report
```bash
GET /api/reports/summary
Authorization: Bearer <token>

Response: Combined ESG report with overall scores
```

### Controller Pattern

Controllers are thin and only orchestrate service calls:

```javascript
export const generateEnvironmentalReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const options = {};
    if (startDate) options.startDate = startDate;
    if (endDate) options.endDate = endDate;
    
    // Call service - NO business logic in controller
    const report = await reportService.generateEnvironmentalReport(options);
    
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
```

### Verification
Run comprehensive tests:
```bash
node verify-report-api.js
```

Expected: ✅ 24/24 tests passed (100% success rate)

📚 **Full Documentation:** See `REPORT_API_VERIFICATION_REPORT.md`

## 🤝 Best Practices Implemented

- Clean Architecture with separation of concerns
- ES Modules (import/export)
- Async/await for asynchronous operations
- Centralized error handling
- Environment-based configuration
- RESTful API design
- Proper HTTP status codes
- Security best practices
- Input validation
- Graceful error handling
- Database connection error handling
- Password security with bcrypt
- Token-based authentication

## 📝 Notes

- Default user role is "Employee"
- Passwords must be at least 6 characters
- Email addresses are stored in lowercase
- Tokens expire after 7 days (configurable)
- MongoDB connection is established before server starts
- Graceful shutdown handling for SIGTERM and uncaught exceptions

## 🐛 Error Handling

All errors are handled centrally and return consistent JSON responses:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (development only)"
}
```

## 📧 Contact

For questions or issues, please contact the development team.

---

**Built with ❤️ by the EcoSphere Team**
