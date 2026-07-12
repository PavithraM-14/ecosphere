# 🌍 ESG Business Models Documentation

## Overview

The EcoSphere platform includes 8 core ESG (Environmental, Social, and Governance) business models that form the foundation of the sustainability management system. All models are integrated with the Generic CRUD Engine and ready for immediate use.

---

## 📊 Model Architecture

```
Core ESG Models
├── Department          - Organizational structure
├── Category           - Activity & challenge classification
├── EmissionFactor     - Carbon calculation factors
├── CarbonTransaction  - Emission tracking
├── EnvironmentalGoal  - Sustainability targets
├── ESGPolicy          - Corporate policies
├── Badge              - Gamification achievements
└── Reward             - Points-based incentives
```

---

## 📦 Model Specifications

### 1. Department Model

**Purpose:** Manage organizational departments and structure

**Schema:**
```javascript
{
  name: String (required, unique),
  code: String (required, unique, uppercase),
  head: String (required),
  employeeCount: Number (default: 0, min: 0),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/departments
{
  "name": "Information Technology",
  "code": "IT",
  "head": "John Doe",
  "employeeCount": 50,
  "status": "Active"
}
```

**Features:**
- ✅ Unique name and code
- ✅ Automatic code uppercase conversion
- ✅ Employee count tracking
- ✅ Status management

---

### 2. Category Model

**Purpose:** Categorize CSR Activities and Challenges

**Schema:**
```javascript
{
  name: String (required, unique),
  type: Enum ['CSR Activity', 'Challenge'] (required),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/categories
{
  "name": "Environmental Conservation",
  "type": "CSR Activity",
  "status": "Active"
}
```

**Features:**
- ✅ Separate categories for activities and challenges
- ✅ Indexed for type-based queries
- ✅ Status management

---

### 3. EmissionFactor Model

**Purpose:** Store carbon emission calculation factors

**Schema:**
```javascript
{
  source: String (required),
  unit: String (required),
  factor: Number (required, min: 0),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/emissionfactors
{
  "source": "Electricity",
  "unit": "kWh",
  "factor": 0.92,
  "status": "Active"
}
```

**Example Factors:**
- Electricity: 0.92 kg CO₂ per kWh
- Natural Gas: 2.03 kg CO₂ per cubic meter
- Diesel: 2.68 kg CO₂ per liter
- Petrol: 2.31 kg CO₂ per liter

**Features:**
- ✅ Flexible source types
- ✅ Unit specification
- ✅ Indexed for efficient lookups
- ✅ Non-negative validation

---

### 4. CarbonTransaction Model

**Purpose:** Track carbon emissions across departments

**Schema:**
```javascript
{
  department: ObjectId (ref: Department, required, indexed),
  source: String (required),
  quantity: Number (required, min: 0),
  emissionFactor: ObjectId (ref: EmissionFactor, required),
  calculatedEmission: Number (required, min: 0),
  transactionDate: Date (required, default: now),
  status: Enum ['Pending', 'Verified', 'Rejected'] (default: 'Pending'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/carbontransactions
{
  "department": "6a5332a4001f3fd786e0a18a",
  "source": "Electricity",
  "quantity": 1000,
  "emissionFactor": "6a5332a5001f3fd786e0a19d",
  "calculatedEmission": 920,
  "transactionDate": "2026-07-12",
  "status": "Pending"
}
```

**Calculation Example:**
```
Quantity: 1000 kWh
Factor: 0.92 kg CO₂/kWh
Calculated Emission: 1000 × 0.92 = 920 kg CO₂
```

**Features:**
- ✅ Department-level tracking
- ✅ Reference to emission factors
- ✅ Automatic calculation
- ✅ Verification workflow
- ✅ Indexed for reporting

---

### 5. EnvironmentalGoal Model

**Purpose:** Set and track sustainability targets

**Schema:**
```javascript
{
  title: String (required),
  targetValue: Number (required, min: 0),
  currentValue: Number (default: 0, min: 0),
  deadline: Date (required),
  status: Enum ['Active', 'Completed', 'Cancelled', 'Overdue'] (default: 'Active'),
  progress: Virtual (calculated: currentValue/targetValue * 100),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/environmentalgoals
{
  "title": "Reduce Carbon Emissions by 20%",
  "targetValue": 1000,
  "currentValue": 250,
  "deadline": "2025-12-31",
  "status": "Active"
}
```

**Response includes virtual field:**
```json
{
  "title": "Reduce Carbon Emissions by 20%",
  "targetValue": 1000,
  "currentValue": 250,
  "deadline": "2025-12-31",
  "status": "Active",
  "progress": 25
}
```

**Features:**
- ✅ Target tracking
- ✅ Progress calculation (virtual field)
- ✅ Deadline monitoring
- ✅ Status lifecycle management
- ✅ Indexed for deadline queries

---

### 6. ESGPolicy Model

**Purpose:** Manage corporate ESG policies

**Schema:**
```javascript
{
  title: String (required, unique),
  description: String (required),
  effectiveDate: Date (required),
  status: Enum ['Draft', 'Active', 'Archived'] (default: 'Draft'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/esgpolicies
{
  "title": "Environmental Protection Policy 2026",
  "description": "Guidelines for environmental sustainability...",
  "effectiveDate": "2026-01-01",
  "status": "Draft"
}
```

**Features:**
- ✅ Policy versioning
- ✅ Effective date tracking
- ✅ Draft → Active → Archived lifecycle
- ✅ Indexed for effective date queries

---

### 7. Badge Model

**Purpose:** Gamification achievements and recognition

**Schema:**
```javascript
{
  name: String (required, unique),
  description: String (required),
  unlockRule: String (required),
  icon: String (default: 'default-badge.png'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/badges
{
  "name": "Eco Warrior",
  "description": "Complete 10 environmental challenges",
  "unlockRule": "Complete 10 challenges",
  "icon": "eco-warrior.png"
}
```

**Example Badges:**
- **Carbon Reducer** - Reduce emissions by 100 kg
- **Green Champion** - Complete 5 CSR activities
- **Policy Expert** - Acknowledge 10 policies
- **Team Leader** - Lead 3 sustainability initiatives

**Features:**
- ✅ Customizable unlock rules
- ✅ Icon support
- ✅ Unique badge names
- ✅ Achievement tracking

---

### 8. Reward Model

**Purpose:** Points-based reward system

**Schema:**
```javascript
{
  name: String (required, unique),
  description: String (required),
  pointsRequired: Number (required, min: 0),
  stock: Number (default: 0, min: 0),
  status: Enum ['Available', 'Out of Stock', 'Discontinued'] (default: 'Available'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Usage:**
```bash
POST /api/crud/rewards
{
  "name": "Eco-Friendly Water Bottle",
  "description": "Reusable stainless steel water bottle",
  "pointsRequired": 500,
  "stock": 100,
  "status": "Available"
}
```

**Example Rewards:**
- **Coffee Mug** - 250 points
- **Water Bottle** - 500 points
- **Tote Bag** - 750 points
- **Tree Planting** - 1000 points

**Features:**
- ✅ Points-based redemption
- ✅ Stock management
- ✅ Status tracking
- ✅ Indexed for points queries

---

## 🔗 Model Relationships

```
CarbonTransaction
├─> Department (ObjectId reference)
└─> EmissionFactor (ObjectId reference)

(Future relationships can be added)
```

---

## 📡 CRUD API Endpoints

All models are automatically available through the Generic CRUD Engine:

### Department
```bash
POST   /api/crud/departments
GET    /api/crud/departments
GET    /api/crud/departments/:id
PUT    /api/crud/departments/:id
DELETE /api/crud/departments/:id
```

### Category
```bash
POST   /api/crud/categories
GET    /api/crud/categories
GET    /api/crud/categories/:id
PUT    /api/crud/categories/:id
DELETE /api/crud/categories/:id
```

### EmissionFactor
```bash
POST   /api/crud/emissionfactors
GET    /api/crud/emissionfactors
GET    /api/crud/emissionfactors/:id
PUT    /api/crud/emissionfactors/:id
DELETE /api/crud/emissionfactors/:id
```

### CarbonTransaction
```bash
POST   /api/crud/carbontransactions
GET    /api/crud/carbontransactions
GET    /api/crud/carbontransactions/:id
PUT    /api/crud/carbontransactions/:id
DELETE /api/crud/carbontransactions/:id
```

### EnvironmentalGoal
```bash
POST   /api/crud/environmentalgoals
GET    /api/crud/environmentalgoals
GET    /api/crud/environmentalgoals/:id
PUT    /api/crud/environmentalgoals/:id
DELETE /api/crud/environmentalgoals/:id
```

### ESGPolicy
```bash
POST   /api/crud/esgpolicies
GET    /api/crud/esgpolicies
GET    /api/crud/esgpolicies/:id
PUT    /api/crud/esgpolicies/:id
DELETE /api/crud/esgpolicies/:id
```

### Badge
```bash
POST   /api/crud/badges
GET    /api/crud/badges
GET    /api/crud/badges/:id
PUT    /api/crud/badges/:id
DELETE /api/crud/badges/:id
```

### Reward
```bash
POST   /api/crud/rewards
GET    /api/crud/rewards
GET    /api/crud/rewards/:id
PUT    /api/crud/rewards/:id
DELETE /api/crud/rewards/:id
```

**All endpoints support:**
- ✅ Pagination: `?page=1&limit=10`
- ✅ Sorting: `?sort=name&order=asc`
- ✅ Searching: `?search=keyword`

---

## 🎯 Use Cases

### 1. Carbon Footprint Tracking
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
  "department": "IT_DEPT_ID",
  "source": "Electricity",
  "quantity": 1000,
  "emissionFactor": "FACTOR_ID",
  "calculatedEmission": 920
}

# Query department emissions
GET /api/crud/carbontransactions?search=IT
```

### 2. Goal Management
```bash
# Set goal
POST /api/crud/environmentalgoals
{
  "title": "Reduce emissions by 20%",
  "targetValue": 1000,
  "deadline": "2025-12-31"
}

# Update progress
PUT /api/crud/environmentalgoals/:id
{
  "currentValue": 250
}

# Response shows 25% progress
```

### 3. Gamification
```bash
# Create badges
POST /api/crud/badges
{
  "name": "Eco Warrior",
  "unlockRule": "Complete 10 challenges"
}

# Create rewards
POST /api/crud/rewards
{
  "name": "Water Bottle",
  "pointsRequired": 500,
  "stock": 100
}
```

---

## 🔍 Query Examples

### Find active departments
```bash
GET /api/crud/departments?search=Active
```

### Find challenge categories
```bash
GET /api/crud/categories?search=Challenge
```

### Find verified transactions
```bash
GET /api/crud/carbontransactions?search=Verified
```

### Find active goals before deadline
```bash
GET /api/crud/environmentalgoals?sort=deadline&order=asc
```

### Find available rewards
```bash
GET /api/crud/rewards?search=Available&sort=pointsRequired&order=asc
```

---

## ✅ Validation Rules

### All Models
- ✅ Required fields validated
- ✅ Enum values validated
- ✅ Timestamps auto-generated
- ✅ `__v` field removed from JSON

### Numeric Fields
- ✅ Non-negative validation
- ✅ Min/max constraints where applicable

### String Fields
- ✅ Trimming whitespace
- ✅ Unique constraints where needed
- ✅ Case conversion (e.g., department code uppercase)

### Date Fields
- ✅ Valid date format required
- ✅ Default values provided

### References
- ✅ Valid ObjectId format
- ✅ Referenced documents must exist

---

## 📈 Performance Optimizations

### Indexes Created
- Department: None (small collection)
- Category: `{type: 1, status: 1}`
- EmissionFactor: `{source: 1, status: 1}`
- CarbonTransaction: `{department: 1, transactionDate: -1}`, `{status: 1, transactionDate: -1}`
- EnvironmentalGoal: `{deadline: 1, status: 1}`
- ESGPolicy: `{effectiveDate: -1, status: 1}`
- Badge: None (small collection)
- Reward: `{pointsRequired: 1, status: 1}`

### Virtual Fields
- EnvironmentalGoal: `progress` (calculated field)

---

## 🔐 Security Considerations

- ✅ All CRUD operations can be protected with JWT authentication
- ✅ Input validation at schema level
- ✅ References validated (ObjectId format)
- ✅ Enum values restricted
- ✅ Ready for role-based access control

---

## 🚀 Next Steps

Now that models are created, you can:

1. **Use CRUD operations** - All models work with existing CRUD Engine
2. **Add workflows** - Integrate with Workflow Engine if needed
3. **Create reports** - Query and aggregate data
4. **Build frontend** - Connect to these APIs
5. **Add relationships** - Link models together
6. **Implement business logic** - Add custom controllers if needed

---

## 📊 Model Summary

| Model | Purpose | Key Features |
|-------|---------|--------------|
| Department | Organizational structure | Code, employee count, status |
| Category | Classify activities | Type enum, status |
| EmissionFactor | Carbon calculations | Source, unit, factor |
| CarbonTransaction | Track emissions | References, calculation, verification |
| EnvironmentalGoal | Sustainability targets | Progress tracking, deadline |
| ESGPolicy | Corporate policies | Effective date, lifecycle |
| Badge | Achievements | Unlock rules, icons |
| Reward | Incentives | Points, stock management |

---

## ✅ Verification Status

```
══════════════════════════════════════════════════════════════════════
  MODEL VERIFICATION REPORT
══════════════════════════════════════════════════════════════════════

Department                     ✅ PASS
Category                       ✅ PASS
EmissionFactor                 ✅ PASS
CarbonTransaction              ✅ PASS
EnvironmentalGoal              ✅ PASS
ESGPolicy                      ✅ PASS
Badge                          ✅ PASS
Reward                         ✅ PASS
Model Registry                 ✅ PASS

Overall                        ✅ PASS
══════════════════════════════════════════════════════════════════════
```

---

**Built with ❤️ by the EcoSphere Team**
