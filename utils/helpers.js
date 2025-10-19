// Utility functions for HealthMate backend

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate a random filename with timestamp
 * @param {string} originalName - Original filename
 * @returns {string} - Generated filename
 */
export const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a random string for JWT secrets
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Calculate BMI from weight and height
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} - BMI value
 */
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} - BMI category
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if blood pressure is normal
 * @param {number} systolic - Systolic pressure
 * @param {number} diastolic - Diastolic pressure
 * @returns {object} - Status and category
 */
export const checkBloodPressure = (systolic, diastolic) => {
  if (systolic < 120 && diastolic < 80) {
    return { status: 'normal', category: 'Normal' };
  } else if (systolic < 130 && diastolic < 80) {
    return { status: 'elevated', category: 'Elevated' };
  } else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
    return { status: 'stage1', category: 'Stage 1 Hypertension' };
  } else if (systolic >= 140 || diastolic >= 90) {
    return { status: 'stage2', category: 'Stage 2 Hypertension' };
  } else if (systolic >= 180 || diastolic >= 120) {
    return { status: 'crisis', category: 'Hypertensive Crisis' };
  }
  return { status: 'unknown', category: 'Unknown' };
};

/**
 * Check if blood sugar is normal
 * @param {number} value - Blood sugar value
 * @param {string} type - Type of measurement (fasting, post-meal, random)
 * @returns {object} - Status and category
 */
export const checkBloodSugar = (value, type = 'random') => {
  switch (type) {
    case 'fasting':
      if (value < 100) return { status: 'normal', category: 'Normal' };
      if (value < 126) return { status: 'prediabetes', category: 'Prediabetes' };
      return { status: 'diabetes', category: 'Diabetes' };
    
    case 'post-meal':
      if (value < 140) return { status: 'normal', category: 'Normal' };
      if (value < 200) return { status: 'prediabetes', category: 'Prediabetes' };
      return { status: 'diabetes', category: 'Diabetes' };
    
    case 'random':
      if (value < 140) return { status: 'normal', category: 'Normal' };
      if (value < 200) return { status: 'prediabetes', category: 'Prediabetes' };
      return { status: 'diabetes', category: 'Diabetes' };
    
    default:
      return { status: 'unknown', category: 'Unknown' };
  }
};

/**
 * Sanitize filename for safe storage
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Check if file type is supported
 * @param {string} mimeType - MIME type
 * @returns {boolean} - True if supported
 */
export const isSupportedFileType = (mimeType) => {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
    'application/pdf'
  ];
  return supportedTypes.includes(mimeType);
};
