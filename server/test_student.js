const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/hirovate');
  
  try {
    // Check if server is running
    const res = await axios.get('http://localhost:5000/');
    console.log('Server is running:', res.data);
    
    // Check companies endpoint
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'hirovateadmin@gmail.com', // Log in as admin, but they have 'admin' role
      password: 'hirovate@123'
    });
    console.log('Admin Login successful');
    
  } catch (e) {
    console.error('Test failed:', e.message);
  }
  
  await mongoose.disconnect();
}
test();
