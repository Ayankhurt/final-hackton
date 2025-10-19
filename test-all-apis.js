#!/usr/bin/env node

/**
 * Comprehensive API Testing Script for HealthMate Backend
 * Tests all endpoints to ensure they're working correctly
 */

// Use built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123'
};

const testFamilyMember = {
  name: 'Test Family Member',
  relationship: 'child',
  dateOfBirth: '2010-01-01T00:00:00.000Z',
  gender: 'male',
  bloodGroup: 'A+',
  phone: '03351316921',
  email: 'family@example.com'
};

const testVitals = {
  bloodPressure: '120/80',
  bloodSugar: '100',
  weight: '70',
  notes: 'Test vitals entry',
  measurementDate: new Date().toISOString()
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };

  // Debug log
  if (authToken) {
    console.log(`🔑 Using token: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ No auth token available');
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  const result = await apiRequest('/health');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testUserRegistration() {
  console.log('\n👤 Testing User Registration...');
  const result = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  
  if (result.ok && result.data.token) {
    authToken = result.data.token;
    console.log('✅ Auth token obtained');
  }
  return result.ok;
}

async function testUserLogin() {
  console.log('\n🔐 Testing User Login...');
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  
  // Token is in result.data.data.token
  if (result.ok && result.data.data && result.data.data.token) {
    authToken = result.data.data.token;
    console.log('✅ Auth token obtained:', authToken.substring(0, 20) + '...');
  }
  return result.ok;
}

async function testAddFamilyMember() {
  console.log('\n👨‍👩‍👧‍👦 Testing Add Family Member...');
  console.log('Using auth token:', authToken ? authToken.substring(0, 20) + '...' : 'NO TOKEN');
  const result = await apiRequest('/api/family', {
    method: 'POST',
    body: JSON.stringify(testFamilyMember)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testGetFamilyMembers() {
  console.log('\n📋 Testing Get Family Members...');
  const result = await apiRequest('/api/family');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testGetFamilyOverview() {
  console.log('\n📊 Testing Get Family Overview...');
  const result = await apiRequest('/api/family/overview');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testAddVitals() {
  console.log('\n💓 Testing Add Vitals...');
  const result = await apiRequest('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(testVitals)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testGetVitals() {
  console.log('\n📈 Testing Get Vitals...');
  const result = await apiRequest('/api/vitals');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testGetTimeline() {
  console.log('\n⏰ Testing Get Timeline...');
  const result = await apiRequest('/api/timeline');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

async function testGetUserReports() {
  console.log('\n📄 Testing Get User Reports...');
  const result = await apiRequest('/api/files/reports');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  return result.ok;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Tests for HealthMate Backend');
  console.log('=' .repeat(60));

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Add Family Member', fn: testAddFamilyMember },
    { name: 'Get Family Members', fn: testGetFamilyMembers },
    { name: 'Get Family Overview', fn: testGetFamilyOverview },
    { name: 'Add Vitals', fn: testAddVitals },
    { name: 'Get Vitals', fn: testGetVitals },
    { name: 'Get Timeline', fn: testGetTimeline },
    { name: 'Get User Reports', fn: testGetUserReports }
  ];

  const results = [];
  
  for (const test of tests) {
    try {
      const success = await test.fn();
      results.push({ name: test.name, success });
      console.log(`${success ? '✅' : '❌'} ${test.name}: ${success ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      results.push({ name: test.name, success: false });
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! HealthMate Backend is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }

  console.log('\n🔗 Backend URL: http://localhost:5000');
  console.log('📚 API Documentation: http://localhost:5000/');
  console.log('🏥 Health Check: http://localhost:5000/health');
}

// Run the tests
runAllTests().catch(console.error);
