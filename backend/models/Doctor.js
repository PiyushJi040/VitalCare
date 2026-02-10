import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  specialty: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  location: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;