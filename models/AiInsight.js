import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema({
  // Bilingual summaries
  summaryEnglish: {
    type: String,
    required: [true, 'English summary is required'],
    maxlength: [2000, 'English summary cannot exceed 2000 characters']
  },
  summaryRomanUrdu: {
    type: String,
    required: [true, 'Roman Urdu summary is required'],
    maxlength: [2000, 'Roman Urdu summary cannot exceed 2000 characters']
  },
  
  // Detected abnormal values
  abnormalValues: [{
    parameter: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    normalRange: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'moderate'
    },
    description: {
      type: String,
      required: true
    }
  }],
  
  // Suggested doctor questions
  doctorQuestions: [{
    question: {
      type: String,
      required: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  
  // Food recommendations
  foodRecommendations: {
    avoid: [{
      food: {
        type: String,
        required: true
      },
      reason: {
        type: String,
        required: true
      }
    }],
    include: [{
      food: {
        type: String,
        required: true
      },
      benefit: {
        type: String,
        required: true
      }
    }]
  },
  
  // Disclaimer text
  disclaimer: {
    type: String,
    required: true,
    default: 'This analysis is for informational purposes only. Always consult your doctor for proper medical advice and treatment.'
  },
  
  // AI processing metadata
  processingDate: {
    type: Date,
    default: Date.now
  },
    geminiModel: {
      type: String,
      default: 'gemini-2.5-flash'
    },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  
  // Reference to the file
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: [true, 'File reference is required']
  },
  
  // Reference to the user
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
  
  // Indicates if this AI insight belongs to the main user or a family member
  belongsTo: {
    type: String,
    enum: ['user', 'family'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Index for efficient queries
aiInsightSchema.index({ user: 1, processingDate: -1 });
aiInsightSchema.index({ file: 1 });

const AiInsight = mongoose.model('AiInsight', aiInsightSchema);

export default AiInsight;
