const mongoose = require('mongoose');
const CompanyProfile = require('./models/CompanyProfile');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/jobfest');
  
  const user = await User.findOne({ email: 'rohan@gmail.com' });
  const profile = await CompanyProfile.findOne({ user: user._id });
  console.log('Company Profile exists:', !!profile);
  
  await mongoose.disconnect();
}
test();
