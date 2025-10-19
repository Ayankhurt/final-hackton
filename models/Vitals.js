import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  // Blood Pressure
  bloodPressure: {
    systolic: {
      type: Number,
      min: [50, 'Systolic pressure too low'],
      max: [250, 'Systolic pressure too high']
    },
    diastolic: {
      type: Number,
      min: [30, 'Diastolic pressure too low'],
      max: [150, 'Diastolic pressure too high']
    },
    unit: {
      type: String,
      default: 'mmHg'
    }
  },
  
  // Blood Sugar
  bloodSugar: {
    value: {
      type: Number,
      min: [50, 'Blood sugar too low'],
      max: [500, 'Blood sugar too high']
    },
    unit: {
      type: String,
      default: 'mg/dL'
    },
    type: {
      type: String,
      enum: ['fasting', 'post-meal', 'random', 'hba1c'],
      default: 'random'
    }
  },
  
  // Weight
  weight: {
    value: {
      type: Number,
      min: [20, 'Weight too low'],
      max: [300, 'Weight too high']
    },
    unit: {
      type: String,
      default: 'kg'
    }
  },
  
  // Additional notes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true
  },
  
  // Date of measurement
  measurementDate: {
    type: Date,
    required: [true, 'Measurement date is required'],
    default: Date.now
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
  
  // Indicates if this vitals entry belongs to the main user or a family member
  belongsTo: {
    type: String,
    enum: ['user', 'family'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Index for efficient queries
vitalsSchema.index({ user: 1, measurementDate: -1 });

// Virtual for formatted blood pressure
vitalsSchema.virtual('bloodPressureFormatted').get(function() {
  if (this.bloodPressure.systolic && this.bloodPressure.diastolic) {
    return `${this.bloodPressure.systolic}/${this.bloodPressure.diastolic} ${this.bloodPressure.unit}`;
  }
  return null;
});

// Virtual for BMI calculation (if height is available in user profile)
vitalsSchema.virtual('bmi').get(function() {
  // This would require height from user profile
  // For now, return null
  return null;
});

const Vitals = mongoose.model('Vitals', vitalsSchema);

export default Vitals;
