# HealthMate Backend - Deployment Guide

## 🚀 Deploying from Vercel to GitHub

This guide will help you deploy your HealthMate backend from Vercel to GitHub.

### 📋 Prerequisites

1. **GitHub Account** - Create a repository for your backend
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables** - Set up your production environment variables

### 🔧 Setup Steps

#### 1. Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HealthMate backend"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/healthmate-backend.git

# Push to GitHub
git push -u origin main
```

#### 2. Environment Variables Setup

Create a `.env` file in your backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 3. Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from backend directory
cd backend
vercel

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the root directory to `backend`
5. Add environment variables in the dashboard
6. Deploy

#### 4. Configure Environment Variables in Vercel

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the environment variables from your `.env` file
4. Make sure to set them for "Production", "Preview", and "Development"

### 🔒 Security Considerations

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use strong JWT secrets** - Generate random strings
3. **Enable CORS properly** - Only allow your frontend domain
4. **Use HTTPS** - Vercel provides this automatically
5. **Rate limiting** - Already configured in the backend

### 📁 Project Structure

```
backend/
├── .gitignore          # Git ignore rules
├── vercel.json         # Vercel deployment config
├── package.json        # Dependencies and scripts
├── server.mjs         # Main server file
├── config/            # Configuration files
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Database models
├── routes/           # API routes
└── utils/            # Utility functions
```

### 🚀 Deployment Commands

```bash
# Development
npm run dev

# Production start
npm start

# Deploy to Vercel
npm run deploy

# Preview deployment
npm run preview
```

### 🔧 Vercel Configuration

The `vercel.json` file is already configured with:

- **Runtime**: Node.js
- **Entry Point**: `server.mjs`
- **Max Duration**: 30 seconds
- **Region**: `iad1` (US East)
- **Routes**: All requests go to `server.mjs`

### 📊 Monitoring & Logs

1. **Vercel Dashboard** - View deployment logs and metrics
2. **Function Logs** - Check server logs in Vercel dashboard
3. **Environment Variables** - Manage secrets in Vercel dashboard

### 🔄 Continuous Deployment

Once connected to GitHub:

1. **Automatic Deployments** - Every push to main branch triggers deployment
2. **Preview Deployments** - Pull requests get preview deployments
3. **Production Deployments** - Only main branch deploys to production

### 🐛 Troubleshooting

**Common Issues:**

1. **Environment Variables Not Working**
   - Check Vercel dashboard settings
   - Ensure variables are set for correct environment

2. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check network access in MongoDB Atlas

3. **CORS Errors**
   - Update FRONTEND_URL in environment variables
   - Check CORS configuration in server.mjs

4. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits

### 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints
4. Check database connectivity

### 🎯 Next Steps

After successful deployment:

1. **Update Frontend** - Point API calls to your Vercel URL
2. **Test Endpoints** - Verify all API routes work
3. **Monitor Performance** - Use Vercel analytics
4. **Set up Monitoring** - Consider adding error tracking

---

**Happy Deploying! 🚀**

Your HealthMate backend is now ready for production deployment!
