require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('../data/sampleData');
const User = require('../models/User');

async function runSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/colorplatee', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Run the seed function
    await seedDatabase();

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@colorplatee.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@colorplatee.com',
        password: 'admin123',
        level: 'Pro',
        totalScore: 0
      });
      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log('Admin credentials:');
      console.log('Email: admin@colorplatee.com');
      console.log('Password: admin123');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed if this file is executed directly
if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
