// Quick Authentication Test for HealthMate API
// Run this to get a JWT token for testing

const BASE_URL = 'http://localhost:5000';

async function testAuth() {
  console.log('🔐 Testing HealthMate Authentication...\n');
  
  try {
    // Step 1: Login user
    console.log('1️⃣ Logging in user...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', loginData);
    
    if (loginData.success && loginData.data.token) {
      const token = loginData.data.token;
      console.log('\n✅ Login successful!');
      console.log('🔑 JWT Token:', token);
      
      // Step 2: Test authenticated endpoint
      console.log('\n2️⃣ Testing authenticated endpoint...');
      const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const profileData = await profileResponse.json();
      console.log('Profile Status:', profileResponse.status);
      console.log('Profile Response:', profileData);
      
      if (profileData.success) {
        console.log('\n✅ Authentication working perfectly!');
        console.log('\n📋 Use this token in Postman:');
        console.log(`Authorization: Bearer ${token}`);
        console.log('\n🎯 Now you can test file upload with this token!');
      } else {
        console.log('\n❌ Profile fetch failed');
      }
      
    } else {
      console.log('\n❌ Registration failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuth();
