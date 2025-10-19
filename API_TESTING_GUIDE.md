# HealthMate API Testing Guide

## 🚀 Server Status: ✅ RUNNING
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **MongoDB**: ✅ Connected to Atlas
- **Environment**: Development

## 📋 Complete API Endpoints

### 1. Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```bash
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```bash
PUT /api/auth/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

### 2. File Management Endpoints

#### Upload Medical Report
```bash
POST /api/files/upload
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Form Data:
- file: [medical-report.pdf or image]
- reportType: "blood-test" (optional)
```

#### Get All User Reports
```bash
GET /api/files/reports
Authorization: Bearer <jwt-token>

Query Parameters:
- page: 1 (optional)
- limit: 10 (optional)
- reportType: "blood-test" (optional)
```

#### Get Single Report
```bash
GET /api/files/reports/:id
Authorization: Bearer <jwt-token>
```

#### Delete Report
```bash
DELETE /api/files/reports/:id
Authorization: Bearer <jwt-token>
```

#### Retry AI Analysis
```bash
POST /api/files/reports/:id/analyze
Authorization: Bearer <jwt-token>
```

### 3. Vitals Management Endpoints

#### Add Vitals Entry
```bash
POST /api/vitals
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80,
    "unit": "mmHg"
  },
  "bloodSugar": {
    "value": 100,
    "unit": "mg/dL",
    "type": "fasting"
  },
  "weight": {
    "value": 70,
    "unit": "kg"
  },
  "notes": "Feeling good today",
  "measurementDate": "2025-10-18T10:00:00Z"
}
```

#### Get All Vitals
```bash
GET /api/vitals
Authorization: Bearer <jwt-token>

Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- startDate: "2025-10-01" (optional)
- endDate: "2025-10-31" (optional)
```

#### Get Vitals Statistics
```bash
GET /api/vitals/stats
Authorization: Bearer <jwt-token>

Query Parameters:
- days: 30 (optional)
```

#### Get Single Vitals Entry
```bash
GET /api/vitals/:id
Authorization: Bearer <jwt-token>
```

#### Update Vitals Entry
```bash
PUT /api/vitals/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "bloodPressure": {
    "systolic": 125,
    "diastolic": 85
  },
  "notes": "Updated notes"
}
```

#### Delete Vitals Entry
```bash
DELETE /api/vitals/:id
Authorization: Bearer <jwt-token>
```

### 4. Timeline & Dashboard Endpoints

#### Get Health Timeline
```bash
GET /api/timeline
Authorization: Bearer <jwt-token>

Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- startDate: "2025-10-01" (optional)
- endDate: "2025-10-31" (optional)
- type: "all|reports|vitals" (optional)
```

#### Get Dashboard Data
```bash
GET /api/timeline/dashboard
Authorization: Bearer <jwt-token>

Query Parameters:
- days: 30 (optional)
```

### 5. System Endpoints

#### Health Check
```bash
GET /health
```

#### API Information
```bash
GET /
```

## 🧪 Testing with cURL

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test File Upload (with token)
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@medical-report.pdf" \
  -F "reportType=blood-test"
```

### Test Vitals Addition
```bash
curl -X POST http://localhost:5000/api/vitals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bloodPressure":{"systolic":120,"diastolic":80},"bloodSugar":{"value":100,"type":"fasting"},"weight":{"value":70}}'
```

## 🔐 Authentication Flow

1. **Register** → Get user data + JWT token
2. **Login** → Get user data + JWT token
3. **Use Token** → Include `Authorization: Bearer <token>` in all protected requests
4. **Token Expiry** → Re-login to get new token (7-day expiry)

## 📊 Response Format

All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": {
    // Response data
  }
}
```

## 🚨 Error Handling

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## 🔧 Environment Variables Required

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
NODE_ENV=development
```

## 🎯 AI Analysis Features

When uploading medical reports, the system automatically:
1. **Uploads** file to Cloudinary
2. **Analyzes** with Google Gemini AI
3. **Generates** bilingual summaries (English + Roman Urdu)
4. **Detects** abnormal values
5. **Suggests** doctor questions
6. **Provides** food recommendations
7. **Includes** medical disclaimers

## 📱 Frontend Integration Ready

The API is designed for easy React frontend integration with:
- CORS enabled for localhost:3000/3001
- JWT token-based authentication
- RESTful API design
- Comprehensive error handling
- File upload support
- Real-time data updates

---

**HealthMate - Sehat ka Smart Dost** 🏥✨
*Your AI-powered health companion backend is ready!*
