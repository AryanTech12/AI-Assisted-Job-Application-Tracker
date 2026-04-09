import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    role: {
      type: String,
      required: [true, 'Please add a role/title'],
    },
    status: {
      type: String,
      enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    jdLink: {
      type: String,
    },
    notes: {
      type: String,
    },
    salaryRange: {
      type: String,
    },
    skills: {
      type: [String],
    },
    resumeSuggestions: {
      type: [String],
    },
    location: {
      type: String,
    },
    seniority: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
