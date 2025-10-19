#!/usr/bin/env node

/**
 * Test Retry Analysis Endpoint
 * Specifically tests the retry analysis functionality with Gemini 2.0 Flash Exp
 */

// Use built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'Password123'
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

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

// Test functions
async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (result.ok && result.data.data && result.data.data.token) {
    authToken = result.data.data.token;
    console.log('✅ Auth token obtained:', authToken.substring(0, 20) + '...');
    return true;
  }
  console.log('❌ Login failed');
  return false;
}

async function testGetReports() {
  console.log('\n📄 Testing Get User Reports...');
  const result = await apiRequest('/api/files/reports');
  
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, JSON.stringify(result.data, null, 2));
  
  if (result.ok && result.data.data && result.data.data.reports && result.data.data.reports.length > 0) {
    console.log(`✅ Found ${result.data.data.reports.length} reports`);
    return result.data.data.reports[0]._id; // Return first report ID
  }
  console.log('❌ No reports found');
  return null;
}

async function testRetryAnalysis(reportId) {
  console.log(`\n🤖 Testing Retry Analysis for Report: ${reportId}...`);
  const result = await apiRequest(`/api/files/reports/${reportId}/analyze`, {
    method: 'POST'
  });
  
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, JSON.stringify(result.data, null, 2));
  
  if (result.ok) {
    console.log('✅ Retry analysis successful!');
    console.log('🤖 AI Model used:', result.data.data?.aiInsight?.geminiModel || 'Unknown');
    return true;
  } else {
    console.log('❌ Retry analysis failed');
    return false;
  }
}

// Main test runner
async function runRetryAnalysisTest() {
  console.log('🚀 Testing Retry Analysis with Gemini 2.0 Flash Exp');
  console.log('=' .repeat(60));

  try {
    // Step 1: Login
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      console.log('\n❌ Cannot proceed without authentication');
      return;
    }

    // Step 2: Get reports
    const reportId = await testGetReports();
    if (!reportId) {
      console.log('\n❌ Cannot proceed without reports');
      return;
    }

    // Step 3: Test retry analysis
    const retrySuccess = await testRetryAnalysis(reportId);
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RETRY ANALYSIS TEST SUMMARY');
    console.log('=' .repeat(60));
    
    if (retrySuccess) {
      console.log('🎉 RETRY ANALYSIS TEST PASSED!');
      console.log('✅ Gemini 2.0 Flash Exp is working correctly');
      console.log('✅ AI analysis endpoint is functional');
    } else {
      console.log('❌ RETRY ANALYSIS TEST FAILED');
      console.log('⚠️  Check the error details above');
    }

  } catch (error) {
    console.log('\n❌ Test failed with error:', error.message);
  }

  console.log('\n🔗 Backend URL: http://localhost:5000');
  console.log('📚 API Documentation: http://localhost:5000/');
  console.log('🏥 Health Check: http://localhost:5000/health');
}

// Run the test
runRetryAnalysisTest().catch(console.error);
