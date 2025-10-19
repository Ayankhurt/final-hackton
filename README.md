# HealthMate - Sehat ka Smart Dost Backend

An AI-powered health companion backend that helps users upload, understand, and track their medical reports using Google Gemini AI.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication system
- **Medical Report Upload**: Upload PDF/image medical reports to Cloudinary
- **AI Analysis**: Automatic analysis of medical reports using Google Gemini AI
- **Bilingual Support**: AI summaries in English and Roman Urdu
- **Vitals Tracking**: Track blood pressure, blood sugar, weight, and notes
- **Health Timeline**: Combined timeline view of reports and vitals
- **Dashboard**: Health summary and statistics
- **Security**: Rate limiting, CORS, Helmet security headers

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **File Storage**: Cloudinary
- **AI**: Google Gemini 1.5 Flash/Pro
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
healthmate-backend/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── cloudinary.js    # Cloudinary configuration
│   └── gemini.js        # Gemini AI configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── fileController.js    # File upload & AI analysis
│   ├── vitalsController.js  # Vitals management
│   └── timelineController.js # Timeline & dashboard
├── middleware/
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   ├── validation.js     # Input validation
│   └── upload.js        # File upload handling
├── models/
│   ├── User.js          # User model
│   ├── File.js          # File model
│   ├── AiInsight.js     # AI analysis model
│   └── Vitals.js        # Vitals model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── files.js         # File management routes
│   ├── vitals.js        # Vitals routes
│   └── timeline.js      # Timeline routes
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── server.mjs          # Main server file
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Google AI Studio account (for Gemini API)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd healthmate-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the `.env.example` file to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Update the `.env` file with your actual values:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Get API Keys

#### MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGO_URI`

#### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Update the Cloudinary variables in `.env`

#### Google Gemini AI
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Update `GEMINI_API_KEY` in `.env`

### 5. Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### File Management
- `POST /api/files/upload` - Upload medical report
- `GET /api/files/reports` - Get user's reports
- `GET /api/files/reports/:id` - Get single report
- `DELETE /api/files/reports/:id` - Delete report
- `POST /api/files/reports/:id/analyze` - Retry AI analysis

### Vitals Management
- `POST /api/vitals` - Add vitals entry
- `GET /api/vitals` - Get user's vitals
- `GET /api/vitals/stats` - Get vitals statistics
- `GET /api/vitals/:id` - Get single vitals entry
- `PUT /api/vitals/:id` - Update vitals entry
- `DELETE /api/vitals/:id` - Delete vitals entry

### Timeline & Dashboard
- `GET /api/timeline` - Get health timeline
- `GET /api/timeline/dashboard` - Get dashboard data

### Health Check
- `GET /health` - Server health check
- `GET /` - API information

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📤 File Upload

Upload medical reports (PDF, images) using multipart/form-data:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('reportType', 'blood-test');

fetch('/api/files/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## 🤖 AI Analysis

The system automatically analyzes uploaded medical reports using Google Gemini AI and provides:

- **Bilingual Summaries**: English and Roman Urdu
- **Abnormal Values Detection**: Identifies concerning values
- **Doctor Questions**: Suggested questions to ask your doctor
- **Food Recommendations**: Dietary advice based on findings
- **Disclaimer**: Always emphasizes consulting a doctor

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers for protection
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
GEMINI_API_KEY=your-gemini-api-key
```

### Deployment Checklist

1. ✅ Set up MongoDB Atlas production cluster
2. ✅ Configure Cloudinary for production
3. ✅ Set up Google Gemini API with production limits
4. ✅ Use strong JWT secret
5. ✅ Configure CORS for your frontend domain
6. ✅ Set up monitoring and logging
7. ✅ Configure SSL/HTTPS
8. ✅ Set up backup strategies

## 🧪 Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `http://localhost:5000/`

## 🔮 Future Enhancements

- [ ] OCR support for scanned documents
- [ ] Integration with wearable devices
- [ ] Doctor appointment scheduling
- [ ] Medication reminders
- [ ] Health goal tracking
- [ ] Family member health sharing
- [ ] Advanced analytics and insights

---

**HealthMate - Sehat ka Smart Dost** - Your AI-powered health companion! 🏥✨
