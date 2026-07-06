const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'hirovateadmin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        phone: '0000000000',
        password: 'hirovate@123',
        role: 'admin',
        status: 'approved',
        isVerified: true
      });
      console.log('✅ Default Admin seeded successfully.');
    } else {
      console.log('⚡ Admin already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

module.exports = seedAdmin;
