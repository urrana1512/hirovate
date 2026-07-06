const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/hirovate');
  
  const allCompanies = await User.find({ role: 'company' });
  console.log('All companies:', allCompanies);
  
  await mongoose.disconnect();
}
test();
