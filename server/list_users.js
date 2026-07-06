const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobfest';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to Database');
    const users = await User.find({}, 'name email role status isVerified');
    console.log('\n--- Registered Users ---');
    users.forEach(u => {
      console.log(`- Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Verified: ${u.isVerified} | Status: ${u.status}`);
    });
    console.log('------------------------\n');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });
