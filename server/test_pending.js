const axios = require('axios');
async function test() {
  try {
    // 1. Login as admin
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'jobfestadmin@gmail.com',
      password: 'jobfest@123'
    });
    const token = loginRes.data.token;
    
    // 2. Fetch pending users
    const pendingRes = await axios.get('http://localhost:5000/api/admin/pending-users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Pending users:', pendingRes.data.data.map(u => ({ email: u.email, role: u.role, status: u.status, verified: u.isVerified })));
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
}
test();
