const axios = require('axios');

// Test student login credentials
const testStudents = [
  {
    email: 'amina.juma@cbe.ac.tz',
    password: 'CBE@2024',
    expectedName: 'Amina Juma',
    studentNumber: 'CBE/DAR/2021/0001'
  },
  {
    email: 'brian.mwangi@cbe.ac.tz',
    password: 'CBE@2024',
    expectedName: 'Brian Mwangi',
    studentNumber: 'CBE/DAR/2021/0002'
  },
  {
    email: 'zainab.mhina@cbe.ac.tz',
    password: 'CBE@2024',
    expectedName: 'Zainab Mhina',
    studentNumber: 'CBE/DOD/2021/0001'
  },
  {
    email: 'oscar.chacha@cbe.ac.tz',
    password: 'CBE@2024',
    expectedName: 'Oscar Chacha',
    studentNumber: 'CBE/MWZ/2021/0001'
  }
];

async function testStudentLogin() {
  console.log('🧪 Testing Student Login API');
  console.log('=====================================\n');

  const API_BASE = 'http://localhost:5000/api';

  try {
    // Test health check first
    console.log('1. Testing API Health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test each student login
    for (let i = 0; i < testStudents.length; i++) {
      const student = testStudents[i];
      console.log(`${i + 2}. Testing login for: ${student.email}`);
      
      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: student.email,
          password: student.password
        });

        const { token, user } = loginResponse.data;
        
        console.log('✅ Login Successful!');
        console.log('   - Email:', user.email);
        console.log('   - Role:', user.role);
        console.log('   - First Login:', user.isFirstLogin);
        console.log('   - Student Name:', user.profile?.firstName + ' ' + user.profile?.lastName);
        console.log('   - Student Number:', user.profile?.studentNumber);
        console.log('   - Token Length:', token.length);
        console.log('   - Expected Name:', student.expectedName);
        console.log('   - Expected Student Number:', student.studentNumber);
        
        // Verify data matches
        const nameMatches = user.profile?.firstName + ' ' + user.profile?.lastName === student.expectedName;
        const studentNumberMatches = user.profile?.studentNumber === student.studentNumber;
        
        console.log('   - Name Match:', nameMatches ? '✅' : '❌');
        console.log('   - Student Number Match:', studentNumberMatches ? '✅' : '❌');
        
        if (user.isFirstLogin) {
          console.log('   - ⚠️  First login - will be prompted to change password');
        }

      } catch (error) {
        console.log('❌ Login Failed!');
        console.log('   - Error:', error.response?.data?.error || error.message);
      }
      
      console.log('');
    }

    // Test invalid credentials
    console.log(`${testStudents.length + 2}. Testing invalid credentials...`);
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: 'invalid@student.com',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed!');
    } catch (error) {
      console.log('✅ Correctly rejected invalid credentials');
      console.log('   - Error:', error.response?.data?.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

// Run the test
testStudentLogin();
