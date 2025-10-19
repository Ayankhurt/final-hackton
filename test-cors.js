#!/usr/bin/env node

/**
 * CORS Test Script
 * Tests CORS configuration for the HealthMate backend
 */

import https from 'https';

const testCORS = async () => {
  const backendUrl = 'https://final-hackton-one.vercel.app';
  const frontendOrigin = 'https://final-hackton-frontend.vercel.app';
  
  console.log('🧪 Testing CORS Configuration...');
  console.log(`Backend URL: ${backendUrl}`);
  console.log(`Frontend Origin: ${frontendOrigin}`);
  console.log('');

  // Test OPTIONS request (preflight)
  const options = {
    hostname: 'final-hackton-one.vercel.app',
    port: 443,
    path: '/api/auth/login',
    method: 'OPTIONS',
    headers: {
      'Origin': frontendOrigin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`✅ OPTIONS Request Status: ${res.statusCode}`);
      console.log('📋 CORS Headers:');
      
      const corsHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers',
        'access-control-allow-credentials'
      ];
      
      corsHeaders.forEach(header => {
        const value = res.headers[header];
        console.log(`  ${header}: ${value || 'NOT SET'}`);
      });
      
      console.log('');
      
      if (res.headers['access-control-allow-origin']) {
        console.log('🎉 CORS is properly configured!');
        resolve(true);
      } else {
        console.log('❌ CORS is NOT properly configured!');
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      reject(err);
    });

    req.end();
  });
};

// Run the test
testCORS()
  .then(success => {
    if (success) {
      console.log('✅ CORS test completed successfully');
    } else {
      console.log('❌ CORS test failed');
    }
  })
  .catch(err => {
    console.error('❌ Test error:', err);
  });
