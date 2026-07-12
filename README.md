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

## 🚧 Future Development

The following features are planned but not yet implemented:

- ✅ **STEP 1:** Project Setup (Completed)
- ✅ **STEP 2:** MongoDB Connection (Completed)
- ✅ **STEP 3:** Authentication Module (Completed)
- ✅ **STEP 4:** Generic CRUD Engine (Completed)
- ✅ **STEP 5:** Workflow Engine (Completed)
- ⏳ Additional ESG-specific features

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
