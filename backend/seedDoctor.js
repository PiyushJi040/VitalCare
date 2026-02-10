import mongoose from 'mongoose';
import { Doctor } from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');
    
    const doctorData = {
      name: 'Dr. John Smith',
      email: 'doctor@test.com',
      password: 'password123',
      location: 'New York',
      specialisation: 'Cardiology',
      qualification: 'MBBS, MD',
      experience: 10,
      rating: 4.5,
      isOnline: true
    };

    const existingDoctor = await Doctor.findOne({ email: doctorData.email });
    if (existingDoctor) {
      console.log('Doctor already exists');
      return;
    }

    const doctor = new Doctor(doctorData);
    await doctor.save();
    
    console.log('Doctor seeded successfully:');
    console.log('Email: doctor@test.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error seeding doctor:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDoctor();