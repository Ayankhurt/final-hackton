import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  // Basic information
  name: {
    type: String,
    required: [true, 'Family member name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  // Relationship to the main user
  relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    enum: [
      'self', 'spouse', 'child', 'parent', 'sibling', 
      'grandparent', 'grandchild', 'uncle', 'aunt', 
      'cousin', 'nephew', 'niece', 'other'
    ],
    default: 'other'
  },
  
  // Personal details
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  
  // Contact information
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty phone numbers
        return /^[\+]?[0-9]{10,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty email
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  
  // Medical information
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
    default: 'unknown'
  },
  
  allergies: [{
    allergen: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    notes: String
  }],
  
  medicalConditions: [{
    condition: {
      type: String,
      required: true
    },
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'resolved'],
      default: 'active'
    },
    notes: String
  }],
  
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String,
    notes: String
  }],
  
  // Emergency contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Reference to the main user who manages this family member
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Manager user reference is required']
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Additional notes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
familyMemberSchema.index({ managedBy: 1, isActive: 1 });
familyMemberSchema.index({ relationship: 1 });
familyMemberSchema.index({ name: 1 });

// Virtual for age calculation
familyMemberSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Virtual for full profile summary
familyMemberSchema.virtual('profileSummary').get(function() {
  return {
    name: this.name,
    relationship: this.relationship,
    age: this.age,
    gender: this.gender,
    bloodGroup: this.bloodGroup,
    activeConditions: this.medicalConditions.filter(c => c.status === 'active').length,
    activeMedications: this.medications.filter(m => !m.endDate || m.endDate > new Date()).length
  };
});

const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);

export default FamilyMember;
