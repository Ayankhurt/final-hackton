# 👨‍👩‍👧‍👦 HealthMate Family Member API Guide

## 🎯 **NEW FEATURE: Family Member Management**

The HealthMate backend now supports **complete family health management**! Users can:
- ✅ Add family members (spouse, children, parents, etc.)
- ✅ Upload medical reports for family members
- ✅ Track vitals for family members
- ✅ View family health timeline
- ✅ Get individual family member health summaries

---

## 📋 **Family Member API Endpoints**

### **1. Family Member Management**

#### Add Family Member
```bash
POST /api/family
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "relationship": "spouse",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "phone": "+1234567890",
  "email": "john@example.com",
  "bloodGroup": "A+",
  "allergies": [
    {
      "allergen": "Peanuts",
      "severity": "severe",
      "notes": "Causes severe reaction"
    }
  ],
  "medicalConditions": [
    {
      "condition": "Diabetes Type 2",
      "diagnosedDate": "2020-01-15",
      "status": "active",
      "notes": "Controlled with medication"
    }
  ],
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "startDate": "2020-01-20",
      "prescribedBy": "Dr. Smith"
    }
  ],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "sister",
    "phone": "+1234567891",
    "email": "jane@example.com"
  },
  "notes": "Regular checkups needed"
}
```

#### Get All Family Members
```bash
GET /api/family
Authorization: Bearer <jwt-token>
```

#### Get Single Family Member
```bash
GET /api/family/:id
Authorization: Bearer <jwt-token>
```

#### Update Family Member
```bash
PUT /api/family/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567892",
  "allergies": [
    {
      "allergen": "Peanuts",
      "severity": "severe",
      "notes": "Updated notes"
    }
  ]
}
```

#### Delete Family Member
```bash
DELETE /api/family/:id
Authorization: Bearer <jwt-token>
```

#### Get Family Overview
```bash
GET /api/family/overview
Authorization: Bearer <jwt-token>
```

#### Get Family Member Health Summary
```bash
GET /api/family/:id/health-summary
Authorization: Bearer <jwt-token>
```

### **2. Updated File Upload for Family Members**

#### Upload Report for Family Member
```bash
POST /api/files/upload
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Form Data:
- file: [medical-report.pdf]
- reportType: "blood-test"
- familyMemberId: "family_member_id_here"
```

### **3. Updated Vitals for Family Members**

#### Add Vitals for Family Member
```bash
POST /api/vitals
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "familyMemberId": "family_member_id_here",
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

#### Get Vitals for Specific Family Member
```bash
GET /api/vitals?familyMemberId=family_member_id_here
Authorization: Bearer <jwt-token>
```

### **4. Updated Timeline for Family Members**

#### Get Timeline for Specific Family Member
```bash
GET /api/timeline?familyMemberId=family_member_id_here
Authorization: Bearer <jwt-token>
```

#### Get All Family Timeline (Mixed)
```bash
GET /api/timeline
Authorization: Bearer <jwt-token>
```

---

## 🧪 **Complete Testing Flow**

### **Step 1: Login and Get Token**
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "Password123"
}
```

### **Step 2: Add Family Member**
```bash
POST /api/family
Authorization: Bearer <token>
{
  "name": "Sarah Doe",
  "relationship": "child",
  "dateOfBirth": "2010-03-20",
  "gender": "female",
  "bloodGroup": "O+"
}
```

### **Step 3: Upload Report for Family Member**
```bash
POST /api/files/upload
Authorization: Bearer <token>
Form Data:
- file: [child-report.pdf]
- familyMemberId: <family_member_id>
```

### **Step 4: Add Vitals for Family Member**
```bash
POST /api/vitals
Authorization: Bearer <token>
{
  "familyMemberId": <family_member_id>,
  "weight": {"value": 35, "unit": "kg"},
  "notes": "Regular checkup"
}
```

### **Step 5: View Family Member Health Summary**
```bash
GET /api/family/<family_member_id>/health-summary
Authorization: Bearer <token>
```

---

## 📊 **Response Examples**

### **Family Member Response**
```json
{
  "success": true,
  "data": {
    "familyMember": {
      "id": "68f3f6cd166a72d5e6abfdc9",
      "name": "Sarah Doe",
      "relationship": "child",
      "age": 14,
      "gender": "female",
      "bloodGroup": "O+",
      "allergies": [],
      "medicalConditions": [],
      "medications": [],
      "createdAt": "2025-10-18T20:30:00.000Z"
    }
  }
}
```

### **Family Overview Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "68f3f6cd166a72d5e6abfdc9",
      "name": "Test User",
      "email": "test@example.com",
      "profile": {...}
    },
    "familyOverview": [
      {
        "id": "68f3f6cd166a72d5e6abfdc9",
        "name": "Sarah Doe",
        "relationship": "child",
        "age": 14,
        "bloodGroup": "O+",
        "reportsCount": 2,
        "vitalsCount": 5,
        "lastReportDate": "2025-10-18T15:30:00.000Z",
        "lastVitalsDate": "2025-10-18T10:00:00.000Z",
        "activeConditions": 0,
        "activeMedications": 0
      }
    ],
    "totalMembers": 2
  }
}
```

### **File Upload with Family Member**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": "68f3f6cd166a72d5e6abfdc9",
      "fileName": "child-report.pdf",
      "cloudinaryUrl": "https://res.cloudinary.com/...",
      "reportType": "blood-test",
      "belongsTo": "family",
      "familyMember": {
        "id": "68f3f6cd166a72d5e6abfdc9",
        "name": "Sarah Doe",
        "relationship": "child"
      }
    },
    "aiInsight": {
      "summaryEnglish": "The report shows...",
      "summaryRomanUrdu": "Report mein dikhaya gaya hai...",
      "abnormalValues": [...],
      "doctorQuestions": [...],
      "foodRecommendations": {...}
    }
  }
}
```

---

## 🔧 **Key Features**

### **✅ Complete Family Management**
- Add unlimited family members
- Track relationships (spouse, child, parent, etc.)
- Store medical history, allergies, medications
- Emergency contact information

### **✅ Individual Health Tracking**
- Upload reports for each family member
- Track vitals for each family member
- AI analysis for each family member's reports
- Individual health summaries

### **✅ Family Overview Dashboard**
- See all family members at a glance
- Track health activity for each member
- Monitor active conditions and medications
- Quick access to recent reports and vitals

### **✅ Flexible Data Access**
- Filter reports by family member
- Filter vitals by family member
- View timeline for specific family member
- Mixed timeline showing all family data

---

## 🎯 **Use Cases**

1. **Parent managing children's health**
2. **Adult managing elderly parents' health**
3. **Spouse managing partner's health**
4. **Caregiver managing multiple family members**
5. **Family doctor tracking multiple patients**

---

**HealthMate - Sehat ka Smart Dost** 🏥✨
*Now supporting complete family health management!*
