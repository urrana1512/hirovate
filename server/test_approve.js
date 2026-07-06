const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/hirovate');
  
  try {
    // Login as Admin
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'hirovateadmin@gmail.com',
      password: 'hirovate@123'
    });
    const token = loginRes.data.token;
    
    // Get company
    const company = await User.findOne({ email: 'rohan@gmail.com' });
    if (!company) return console.log('Company not found');
    
    // Approve company
    const res = await axios.put(`http://localhost:5000/api/admin/user-status/${company._id}`, 
      { status: 'approved' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Approve Response:', res.data);
    
    // Login as Company
    const companyLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'rohan@gmail.com',
      password: 'password123' // assuming this was the password
    });
    console.log('Company Login:', companyLogin.data.success);
    
  } catch (e) {
    console.error('Test failed:', e.response?.data || e.message);
  }
  
  await mongoose.disconnect();
}
test();
