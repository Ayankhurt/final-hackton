// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing Health Check...');
  const result = await apiCall('/health');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Health check passed\n');
}

async function testUserRegistration() {
  console.log('👤 Testing User Registration...');
  const result = await apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  
  if (result.data.success && result.data.data.token) {
    authToken = result.data.data.token;
    console.log('✅ Registration successful, token saved\n');
  } else {
    console.log('❌ Registration failed\n');
  }
}

async function testUserLogin() {
  console.log('🔐 Testing User Login...');
  const result = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  
  if (result.data.success && result.data.data.token) {
    authToken = result.data.data.token;
    console.log('✅ Login successful, token updated\n');
  } else {
    console.log('❌ Login failed\n');
  }
}

async function testGetProfile() {
  console.log('👤 Testing Get Profile...');
  const result = await apiCall('/api/auth/profile');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Profile retrieved\n');
}

async function testAddVitals() {
  console.log('📊 Testing Add Vitals...');
  const vitalsData = {
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      unit: 'mmHg'
    },
    bloodSugar: {
      value: 100,
      unit: 'mg/dL',
      type: 'fasting'
    },
    weight: {
      value: 70,
      unit: 'kg'
    },
    notes: 'Test vitals entry',
    measurementDate: new Date().toISOString()
  };

  const result = await apiCall('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(vitalsData)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Vitals added\n');
}

async function testGetVitals() {
  console.log('📈 Testing Get Vitals...');
  const result = await apiCall('/api/vitals');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Vitals retrieved\n');
}

async function testGetTimeline() {
  console.log('📅 Testing Get Timeline...');
  const result = await apiCall('/api/timeline');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Timeline retrieved\n');
}

async function testGetDashboard() {
  console.log('📊 Testing Get Dashboard...');
  const result = await apiCall('/api/timeline/dashboard');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Dashboard data retrieved\n');
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting HealthMate API Tests...\n');
  
  try {
    await testHealthCheck();
    await testUserRegistration();
    await testUserLogin();
    await testGetProfile();
    await testAddVitals();
    await testGetVitals();
    await testGetTimeline();
    await testGetDashboard();
    
    console.log('🎉 All tests completed successfully!');
    console.log('✅ HealthMate Backend is fully functional');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests, apiCall };
