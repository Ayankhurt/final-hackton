# 🔐 HealthMate API Authentication Guide

## The Issue: 401 Unauthorized Error

The `/api/files/upload` endpoint requires authentication. You need to:
1. **First**: Register or login to get a JWT token
2. **Then**: Use that token in the Authorization header

## 📋 Step-by-Step Testing in Postman

### Step 1: Register a New User

**Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "name": "Test User",
  "email": "test@example.com", 
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 2: Copy the JWT Token

From the registration response, copy the `token` value.

### Step 3: Test File Upload with Authentication

**Request:**
```
Method: POST
URL: http://localhost:5000/api/files/upload
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
Body (form-data):
  Key: file
  Value: [Select your PDF file]
  Key: reportType (optional)
  Value: blood-test
```

## 🧪 Alternative: Login Instead of Register

If you already have a user, use login:

**Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

## 🔧 Quick Test Script

Let me create a simple test to verify authentication works:
