/**
 * Seed Data Script
 * Populate database with realistic test data for Phase 3 Integration Testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Department from './src/models/Department.js';
import Challenge from './src/models/Challenge.js';
import Category from './src/models/Category.js';
import EmissionFactor from './src/models/EmissionFactor.js';
import CarbonTransaction from './src/models/CarbonTransaction.js';
import EnvironmentalGoal from './src/models/EnvironmentalGoal.js';
import ESGPolicy from './src/models/ESGPolicy.js';
import Badge from './src/models/Badge.js';
import Reward from './src/models/Reward.js';
import * as notificationService from './src/services/notificationService.js';

dotenv.config();

// ANSI Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log('✅ MongoDB Connected', colors.green);
  } catch (error) {
    log(`❌ MongoDB Connection Error: ${error.message}`, colors.red);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Department.deleteMany({});
    await Challenge.deleteMany({});
    await Category.deleteMany({});
    await EmissionFactor.deleteMany({});
    await CarbonTransaction.deleteMany({});
    await EnvironmentalGoal.deleteMany({});
    await ESGPolicy.deleteMany({});
    await Badge.deleteMany({});
    await Reward.deleteMany({});
    notificationService.clearAllNotifications();
    log('🗑️  Cleared existing data', colors.yellow);
  } catch (error) {
    log(`❌ Error clearing data: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Departments
const seedDepartments = async () => {
  try {
    const departments = await Department.insertMany([
      {
        name: 'Information Technology',
        code: 'IT',
        head: 'Sarah Johnson',
        employeeCount: 25,
        status: 'Active',
      },
      {
        name: 'Human Resources',
        code: 'HR',
        head: 'Michael Brown',
        employeeCount: 15,
        status: 'Active',
      },
      {
        name: 'Finance',
        code: 'FIN',
        head: 'Emily Davis',
        employeeCount: 20,
        status: 'Active',
      },
      {
        name: 'Sales',
        code: 'SAL',
        head: 'David Wilson',
        employeeCount: 30,
        status: 'Active',
      },
      {
        name: 'Marketing',
        code: 'MKT',
        head: 'Lisa Anderson',
        employeeCount: 18,
        status: 'Active',
      },
    ]);
    log(`✅ Created ${departments.length} departments`, colors.green);
    return departments;
  } catch (error) {
    log(`❌ Error seeding departments: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Users (Employees)
const seedUsers = async (departments) => {
  try {
    const users = [];
    
    // Admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecosphere.com',
      password: 'admin123',
      role: 'Admin',
      department: departments[0]._id,
      xp: 500,
      points: 250,
    });
    users.push(admin);

    // IT Department
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        name: `IT Employee ${i}`,
        email: `it${i}@ecosphere.com`,
        password: 'password123',
        role: 'Employee',
        department: departments[0]._id,
        xp: Math.floor(Math.random() * 300) + 50,
        points: Math.floor(Math.random() * 150) + 25,
      });
      users.push(user);
    }

    // HR Department
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        name: `HR Employee ${i}`,
        email: `hr${i}@ecosphere.com`,
        password: 'password123',
        role: 'Employee',
        department: departments[1]._id,
        xp: Math.floor(Math.random() * 300) + 50,
        points: Math.floor(Math.random() * 150) + 25,
      });
      users.push(user);
    }

    // Finance Department
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        name: `Finance Employee ${i}`,
        email: `finance${i}@ecosphere.com`,
        password: 'password123',
        role: 'Employee',
        department: departments[2]._id,
        xp: Math.floor(Math.random() * 300) + 50,
        points: Math.floor(Math.random() * 150) + 25,
      });
      users.push(user);
    }

    // Sales Department
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        name: `Sales Employee ${i}`,
        email: `sales${i}@ecosphere.com`,
        password: 'password123',
        role: 'Employee',
        department: departments[3]._id,
        xp: Math.floor(Math.random() * 300) + 50,
        points: Math.floor(Math.random() * 150) + 25,
      });
      users.push(user);
    }

    log(`✅ Created ${users.length} users (passwords hashed)`, colors.green);
    return users;
  } catch (error) {
    log(`❌ Error seeding users: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Categories
const seedCategories = async () => {
  try {
    const categories = await Category.insertMany([
      {
        name: 'Environmental',
        description: 'Environmental sustainability activities',
        type: 'CSR Activity',
      },
      {
        name: 'Social',
        description: 'Social responsibility activities',
        type: 'CSR Activity',
      },
      {
        name: 'Governance',
        description: 'Governance and ethics activities',
        type: 'Challenge',
      },
    ]);
    log(`✅ Created ${categories.length} categories`, colors.green);
    return categories;
  } catch (error) {
    log(`❌ Error seeding categories: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Challenges
const seedChallenges = async (categories) => {
  try {
    const challenges = await Challenge.insertMany([
      {
        title: 'Paperless Week',
        description: 'Reduce paper usage for one week',
        category: categories[0]._id,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-07'),
        xpReward: 100,
        pointsReward: 50,
        status: 'Active',
      },
      {
        title: 'Bike to Work',
        description: 'Cycle to work instead of driving',
        category: categories[0]._id,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-31'),
        xpReward: 150,
        pointsReward: 75,
        status: 'Active',
      },
      {
        title: 'Tree Plantation',
        description: 'Plant trees in your community',
        category: categories[0]._id,
        startDate: new Date('2026-06-15'),
        endDate: new Date('2026-08-15'),
        xpReward: 200,
        pointsReward: 100,
        status: 'Active',
      },
    ]);
    log(`✅ Created ${challenges.length} challenges`, colors.green);
    return challenges;
  } catch (error) {
    log(`❌ Error seeding challenges: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Emission Factors
const seedEmissionFactors = async () => {
  try {
    const factors = await EmissionFactor.insertMany([
      {
        source: 'Electricity',
        unit: 'kWh',
        factor: 0.92,
        region: 'Global',
      },
      {
        source: 'Natural Gas',
        unit: 'cubic meter',
        factor: 2.31,
        region: 'Global',
      },
      {
        source: 'Petrol',
        unit: 'liter',
        factor: 2.31,
        region: 'Global',
      },
      {
        source: 'Diesel',
        unit: 'liter',
        factor: 2.68,
        region: 'Global',
      },
    ]);
    log(`✅ Created ${factors.length} emission factors`, colors.green);
    return factors;
  } catch (error) {
    log(`❌ Error seeding emission factors: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Carbon Transactions
const seedCarbonTransactions = async (departments, factors) => {
  try {
    const transactions = [];
    
    // Create 10-15 transactions per department
    for (const dept of departments) {
      const txCount = Math.floor(Math.random() * 6) + 10; // 10-15 transactions
      
      for (let i = 0; i < txCount; i++) {
        const factor = factors[Math.floor(Math.random() * factors.length)];
        const quantity = Math.floor(Math.random() * 500) + 100;
        const calculatedEmission = quantity * factor.factor;
        
        transactions.push({
          department: dept._id,
          source: factor.source,
          quantity: quantity,
          unit: factor.unit,
          emissionFactor: factor._id,
          calculatedEmission: calculatedEmission,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        });
      }
    }
    
    const createdTransactions = await CarbonTransaction.insertMany(transactions);
    log(`✅ Created ${createdTransactions.length} carbon transactions`, colors.green);
    return createdTransactions;
  } catch (error) {
    log(`❌ Error seeding carbon transactions: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Environmental Goals
const seedEnvironmentalGoals = async (departments) => {
  try {
    const goals = await EnvironmentalGoal.insertMany([
      {
        title: 'Reduce Carbon Emissions by 20%',
        description: 'Reduce company-wide carbon emissions',
        targetValue: 1000,
        currentValue: 750,
        unit: 'kg CO2',
        deadline: new Date('2026-12-31'),
        status: 'Active',
        department: departments[0]._id,
      },
      {
        title: 'Achieve 50% Renewable Energy',
        description: 'Use renewable energy sources',
        targetValue: 50,
        currentValue: 32,
        unit: 'percentage',
        deadline: new Date('2026-12-31'),
        status: 'Active',
        department: departments[2]._id,
      },
    ]);
    log(`✅ Created ${goals.length} environmental goals`, colors.green);
    return goals;
  } catch (error) {
    log(`❌ Error seeding environmental goals: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed ESG Policies
const seedESGPolicies = async () => {
  try {
    const policies = await ESGPolicy.insertMany([
      {
        title: 'Remote Work Policy',
        description: 'Guidelines for remote work to reduce commuting emissions',
        category: 'Environmental',
        effectiveDate: new Date('2026-01-01'),
        status: 'Active',
      },
      {
        title: 'Waste Management Policy',
        description: 'Comprehensive waste reduction and recycling policy',
        category: 'Environmental',
        effectiveDate: new Date('2026-01-01'),
        status: 'Active',
      },
      {
        title: 'Diversity and Inclusion Policy',
        description: 'Promoting diversity and inclusion in the workplace',
        category: 'Social',
        effectiveDate: new Date('2026-01-01'),
        status: 'Active',
      },
    ]);
    log(`✅ Created ${policies.length} ESG policies`, colors.green);
    return policies;
  } catch (error) {
    log(`❌ Error seeding ESG policies: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Badges
const seedBadges = async () => {
  try {
    const badges = await Badge.insertMany([
      {
        name: 'Green Warrior',
        description: 'Complete 5 environmental challenges',
        unlockRule: 'Complete 5 challenges',
        icon: '🌿',
      },
      {
        name: 'Eco Champion',
        description: 'Reduce personal carbon footprint by 30%',
        unlockRule: 'Reduce emissions by 30%',
        icon: '🏆',
      },
      {
        name: 'Carbon Saver',
        description: 'Save 100kg of CO2 emissions',
        unlockRule: 'Save 100kg CO2',
        icon: '💚',
      },
    ]);
    log(`✅ Created ${badges.length} badges`, colors.green);
    return badges;
  } catch (error) {
    log(`❌ Error seeding badges: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Rewards
const seedRewards = async () => {
  try {
    const rewards = await Reward.insertMany([
      {
        name: 'Coffee Coupon',
        description: 'Free coffee at the cafeteria',
        pointsRequired: 50,
        stock: 100,
        status: 'Available',
      },
      {
        name: 'Gift Card',
        description: '$25 gift card',
        pointsRequired: 200,
        stock: 50,
        status: 'Available',
      },
      {
        name: 'Extra Leave',
        description: 'One day extra leave',
        pointsRequired: 300,
        stock: 20,
        status: 'Available',
      },
    ]);
    log(`✅ Created ${rewards.length} rewards`, colors.green);
    return rewards;
  } catch (error) {
    log(`❌ Error seeding rewards: ${error.message}`, colors.red);
    throw error;
  }
};

// Seed Notifications
const seedNotifications = async (users) => {
  try {
    const notificationTypes = [
      'Badge Unlocked',
      'Challenge Completed',
      'Policy Reminder',
      'Compliance Issue',
      'Reward Redeemed',
    ];
    
    let count = 0;
    for (const user of users.slice(0, 5)) { // Create notifications for first 5 users
      const notifCount = Math.floor(Math.random() * 4) + 2; // 2-5 notifications per user
      
      for (let i = 0; i < notifCount; i++) {
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        notificationService.createNotification({
          title: type,
          message: `You have a new ${type.toLowerCase()} notification!`,
          type: type,
          recipient: user.email,
        });
        count++;
      }
    }
    
    log(`✅ Created ${count} notifications`, colors.green);
  } catch (error) {
    log(`❌ Error seeding notifications: ${error.message}`, colors.red);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    log('\n========================================', colors.cyan);
    log('     SEEDING DATABASE FOR TESTING', colors.cyan);
    log('========================================\n', colors.cyan);

    await connectDB();
    await clearData();

    log('\n📊 Seeding data...', colors.blue);
    
    const departments = await seedDepartments();
    const users = await seedUsers(departments);
    const categories = await seedCategories();
    const challenges = await seedChallenges(categories);
    const factors = await seedEmissionFactors();
    const transactions = await seedCarbonTransactions(departments, factors);
    const goals = await seedEnvironmentalGoals(departments);
    const policies = await seedESGPolicies();
    const badges = await seedBadges();
    const rewards = await seedRewards();
    await seedNotifications(users);

    log('\n========================================', colors.cyan);
    log('         SEEDING COMPLETE! ✅', colors.green);
    log('========================================', colors.cyan);
    
    log('\n📊 Data Summary:', colors.blue);
    log(`   • Departments: ${departments.length}`, colors.cyan);
    log(`   • Users: ${users.length}`, colors.cyan);
    log(`   • Categories: ${categories.length}`, colors.cyan);
    log(`   • Challenges: ${challenges.length}`, colors.cyan);
    log(`   • Emission Factors: ${factors.length}`, colors.cyan);
    log(`   • Carbon Transactions: ${transactions.length}`, colors.cyan);
    log(`   • Environmental Goals: ${goals.length}`, colors.cyan);
    log(`   • ESG Policies: ${policies.length}`, colors.cyan);
    log(`   • Badges: ${badges.length}`, colors.cyan);
    log(`   • Rewards: ${rewards.length}`, colors.cyan);
    log(`   • Notifications: ~10-15`, colors.cyan);

    log('\n🔐 Test Credentials:', colors.yellow);
    log('   Email: admin@ecosphere.com', colors.cyan);
    log('   Password: admin123', colors.cyan);

    log('\n🚀 Ready for Integration Testing!', colors.green);
    log('   Run: node integration-test.js\n', colors.cyan);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    log(`\n❌ Seeding failed: ${error.message}`, colors.red);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
