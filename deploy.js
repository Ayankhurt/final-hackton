#!/usr/bin/env node

/**
 * Simple deployment script for CORS fix
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Deploying CORS fix to Vercel...');

try {
  // Check if we're logged in to Vercel
  console.log('📋 Checking Vercel authentication...');
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log('✅ Authenticated with Vercel');
  
  // Deploy to production
  console.log('🚀 Deploying to production...');
  execSync('vercel --prod --yes', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Your backend should now accept requests from:');
  console.log('   https://final-hackton-frontend.vercel.app');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n📋 Manual deployment steps:');
  console.log('1. Run: vercel login');
  console.log('2. Run: vercel --prod --yes');
  console.log('3. Or commit and push to trigger automatic deployment');
}
