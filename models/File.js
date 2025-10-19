import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  cloudinaryUrl: {
    type: String,
    required: [true, 'Cloudinary URL is required'],
    validate: {
      validator: function(v) {
        return /^https:\/\/res\.cloudinary\.com\/.+/.test(v);
      },
      message: 'Invalid Cloudinary URL format'
    }
  },
  cloudinaryPublicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  reportType: {
    type: String,
    required: [true, 'Report type is required'],
    enum: ['blood-test', 'urine-test', 'x-ray', 'ct-scan', 'mri', 'ecg', 'ultrasound', 'other'],
    default: 'other'
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  
  // Family member reference (optional - if null, it's for the main user)
  familyMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null
  },
  
  // Indicates if this file belongs to the main user or a family member
  belongsTo: {
    type: String,
    enum: ['user', 'family'],
    default: 'user'
  },
  aiInsight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AiInsight',
    default: null
  },
  isProcessed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
fileSchema.index({ user: 1, uploadDate: -1 });
fileSchema.index({ reportType: 1 });

const File = mongoose.model('File', fileSchema);

export default File;
