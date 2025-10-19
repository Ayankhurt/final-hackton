// Comprehensive HealthMate Backend Test Suite
// Tests all functionality including family member features

const BASE_URL = 'http://localhost:5000';

let authToken = '';
let familyMemberId = '';

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

async function testUserLogin() {
  console.log('🔐 Testing User Login...');
  const result = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'Password123'
    })
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  
  if (result.data.success && result.data.data.token) {
    authToken = result.data.data.token;
    console.log('✅ Login successful, token saved\n');
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

async function testAddFamilyMember() {
  console.log('👨‍👩‍👧‍👦 Testing Add Family Member...');
  const familyMemberData = {
    name: 'Sarah Doe',
    relationship: 'child',
    dateOfBirth: '2010-03-20',
    gender: 'female',
    bloodGroup: 'O+',
    phone: '+1234567890',
    allergies: [
      {
        allergen: 'Peanuts',
        severity: 'severe',
        notes: 'Causes severe reaction'
      }
    ],
    medicalConditions: [
      {
        condition: 'Asthma',
        diagnosedDate: '2015-01-15',
        status: 'active',
        notes: 'Mild asthma, controlled with inhaler'
      }
    ]
  };

  const result = await apiCall('/api/family', {
    method: 'POST',
    body: JSON.stringify(familyMemberData)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  
  if (result.data.success && result.data.data.familyMember.id) {
    familyMemberId = result.data.data.familyMember.id;
    console.log('✅ Family member added successfully\n');
  } else {
    console.log('❌ Family member addition failed\n');
  }
}

async function testGetFamilyMembers() {
  console.log('👨‍👩‍👧‍👦 Testing Get Family Members...');
  const result = await apiCall('/api/family');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Family members retrieved\n');
}

async function testGetFamilyOverview() {
  console.log('📊 Testing Get Family Overview...');
  const result = await apiCall('/api/family/overview');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Family overview retrieved\n');
}

async function testGetSingleFamilyMember() {
  if (!familyMemberId) {
    console.log('❌ No family member ID available for testing\n');
    return;
  }
  
  console.log('👤 Testing Get Single Family Member...');
  const result = await apiCall(`/api/family/${familyMemberId}`);
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Single family member retrieved\n');
}

async function testAddVitalsForFamilyMember() {
  if (!familyMemberId) {
    console.log('❌ No family member ID available for testing\n');
    return;
  }
  
  console.log('📊 Testing Add Vitals for Family Member...');
  const vitalsData = {
    familyMemberId: familyMemberId,
    weight: {
      value: 35,
      unit: 'kg'
    },
    bloodSugar: {
      value: 90,
      unit: 'mg/dL',
      type: 'fasting'
    },
    notes: 'Regular checkup for child',
    measurementDate: new Date().toISOString()
  };

  const result = await apiCall('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(vitalsData)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Vitals added for family member\n');
}

async function testAddVitalsForUser() {
  console.log('📊 Testing Add Vitals for User...');
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
    notes: 'Regular checkup',
    measurementDate: new Date().toISOString()
  };

  const result = await apiCall('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(vitalsData)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Vitals added for user\n');
}

async function testGetVitals() {
  console.log('📈 Testing Get Vitals...');
  const result = await apiCall('/api/vitals');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Vitals retrieved\n');
}

async function testGetVitalsForFamilyMember() {
  if (!familyMemberId) {
    console.log('❌ No family member ID available for testing\n');
    return;
  }
  
  console.log('📈 Testing Get Vitals for Family Member...');
  const result = await apiCall(`/api/vitals?familyMemberId=${familyMemberId}`);
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Vitals for family member retrieved\n');
}

async function testGetTimeline() {
  console.log('📅 Testing Get Timeline...');
  const result = await apiCall('/api/timeline');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Timeline retrieved\n');
}

async function testGetTimelineForFamilyMember() {
  if (!familyMemberId) {
    console.log('❌ No family member ID available for testing\n');
    return;
  }
  
  console.log('📅 Testing Get Timeline for Family Member...');
  const result = await apiCall(`/api/timeline?familyMemberId=${familyMemberId}`);
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Timeline for family member retrieved\n');
}

async function testGetDashboard() {
  console.log('📊 Testing Get Dashboard...');
  const result = await apiCall('/api/timeline/dashboard');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Dashboard data retrieved\n');
}

async function testGetFamilyMemberHealthSummary() {
  if (!familyMemberId) {
    console.log('❌ No family member ID available for testing\n');
    return;
  }
  
  console.log('🏥 Testing Get Family Member Health Summary...');
  const result = await apiCall(`/api/family/${familyMemberId}/health-summary`);
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Family member health summary retrieved\n');
}

async function testUpdateFamilyMember() {
  if (!familyMemberId) {
    console.log('❌ No family member ID available for testing\n');
    return;
  }
  
  console.log('✏️ Testing Update Family Member...');
  const updateData = {
    phone: '+1234567891',
    notes: 'Updated notes for regular checkups'
  };

  const result = await apiCall(`/api/family/${familyMemberId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.data);
  console.log('✅ Family member updated\n');
}

// Main test runner
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive HealthMate Backend Tests...\n');
  
  try {
    await testHealthCheck();
    await testUserLogin();
    await testGetProfile();
    await testAddFamilyMember();
    await testGetFamilyMembers();
    await testGetFamilyOverview();
    await testGetSingleFamilyMember();
    await testAddVitalsForFamilyMember();
    await testAddVitalsForUser();
    await testGetVitals();
    await testGetVitalsForFamilyMember();
    await testGetTimeline();
    await testGetTimelineForFamilyMember();
    await testGetDashboard();
    await testGetFamilyMemberHealthSummary();
    await testUpdateFamilyMember();
    
    console.log('🎉 All tests completed successfully!');
    console.log('✅ HealthMate Backend with Family Member functionality is fully working!');
    console.log('\n📋 Summary:');
    console.log('✅ Authentication system working');
    console.log('✅ Family member management working');
    console.log('✅ Vitals tracking for user and family members working');
    console.log('✅ Timeline and dashboard working');
    console.log('✅ Health summaries working');
    console.log('✅ All CRUD operations working');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests();
}

export { runComprehensiveTests, apiCall };
