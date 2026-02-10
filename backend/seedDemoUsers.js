import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import User, { Doctor, HealthAssistant, PharmacyManager } from './models/User.js';

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');
    console.log('Connected to MongoDB');

    // Patient
    const patientData = {
      name: 'Demo Patient',
      email: 'patient@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'patient',
      location: 'Demo City'
    };
    await User.findOneAndUpdate({ email: patientData.email }, patientData, { upsert: true });
    console.log('✅ Patient: patient@demo.com / demo123');

    // Doctor
    const doctorData = {
      name: 'Demo Doctor',
      email: 'doctor@demo.com',
      password: await bcrypt.hash('doctor123', 10),
      role: 'doctor',
      location: 'Demo Hospital',
      specialisation: 'General Medicine',
      experience: 10,
      qualification: 'MBBS, MD'
    };
    await Doctor.findOneAndUpdate({ email: doctorData.email }, doctorData, { upsert: true });
    console.log('✅ Doctor: doctor@demo.com / doctor123');

    // Admin
    const adminData = {
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      location: 'Admin Office'
    };
    await User.findOneAndUpdate({ email: adminData.email }, adminData, { upsert: true });
    console.log('✅ Admin: admin@demo.com / admin123');

    // Pharmacy
    const pharmacyData = {
      name: 'Demo Pharmacy',
      email: 'pharmacy@demo.com',
      password: await bcrypt.hash('pharmacy123', 10),
      role: 'pharmacyManager',
      location: 'Demo Pharmacy',
      storeName: 'Demo Medical Store'
    };
    await PharmacyManager.findOneAndUpdate({ email: pharmacyData.email }, pharmacyData, { upsert: true });
    console.log('✅ Pharmacy: pharmacy@demo.com / pharmacy123');

    // Health Assistant
    const assistantData = {
      name: 'Demo Health Assistant',
      email: 'assistant@demo.com',
      password: await bcrypt.hash('assistant123', 10),
      role: 'healthAssistant',
      location: 'Demo Clinic'
    };
    await HealthAssistant.findOneAndUpdate({ email: assistantData.email }, assistantData, { upsert: true });
    console.log('✅ Health Assistant: assistant@demo.com / assistant123');

    console.log('\n🎉 All demo users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
};

seedDemoUsers();
