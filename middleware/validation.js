import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Vitals validation
export const validateVitals = [
  body('bloodPressure.systolic')
    .optional()
    .isInt({ min: 50, max: 250 })
    .withMessage('Systolic pressure must be between 50 and 250'),
  
  body('bloodPressure.diastolic')
    .optional()
    .isInt({ min: 30, max: 150 })
    .withMessage('Diastolic pressure must be between 30 and 150'),
  
  body('bloodSugar.value')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Blood sugar must be between 50 and 500'),
  
  body('weight.value')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('measurementDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  handleValidationErrors
];

// File upload validation
export const validateFileUpload = [
  body('reportType')
    .optional()
    .isIn(['blood-test', 'urine-test', 'x-ray', 'ct-scan', 'mri', 'ecg', 'ultrasound', 'other'])
    .withMessage('Invalid report type'),
  
  handleValidationErrors
];
