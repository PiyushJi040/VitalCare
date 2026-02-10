import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import User, { Doctor } from './models/User.js';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';

const seedIndianData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await User.deleteMany({ role: 'health_assistant' });
    await Appointment.deleteMany({});

    // Create Indian Doctors
    const doctors = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@hospital.in',
        password: await bcrypt.hash('demoPass', 10),
        role: 'doctor',
        specialisation: 'Cardiology',
        experience: 15,
        qualification: 'MBBS, MD Cardiology',
        hospital: 'AIIMS New Delhi',
        consultationFee: 800,
        availability: {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '13:00', available: true },
          sunday: { start: '10:00', end: '12:00', available: false }
        },
        phone: '+91-9876543210',
        languages: ['Hindi', 'English', 'Punjabi'],
        rating: 4.8
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.in',
        password: await bcrypt.hash('demoPass', 10),
        role: 'doctor',
        specialisation: 'Dermatology',
        experience: 12,
        qualification: 'MBBS, MD Dermatology',
        hospital: 'Fortis Hospital Mumbai',
        consultationFee: 600,
        availability: {
          monday: { start: '10:00', end: '18:00', available: true },
          tuesday: { start: '10:00', end: '18:00', available: true },
          wednesday: { start: '10:00', end: '18:00', available: true },
          thursday: { start: '10:00', end: '18:00', available: true },
          friday: { start: '10:00', end: '18:00', available: true },
          saturday: { start: '10:00', end: '14:00', available: true },
          sunday: { start: '11:00', end: '13:00', available: false }
        },
        phone: '+91-9876543211',
        languages: ['Hindi', 'English', 'Marathi'],
        rating: 4.6
      },
      {
        name: 'Dr. Arjun Patel',
        email: 'arjun.patel@hospital.in',
        password: await bcrypt.hash('demoPass', 10),
        role: 'doctor',
        specialisation: 'Orthopedics',
        experience: 18,
        qualification: 'MBBS, MS Orthopedics',
        hospital: 'Apollo Hospital Bangalore',
        consultationFee: 900,
        availability: {
          monday: { start: '08:00', end: '16:00', available: true },
          tuesday: { start: '08:00', end: '16:00', available: true },
          wednesday: { start: '08:00', end: '16:00', available: true },
          thursday: { start: '08:00', end: '16:00', available: true },
          friday: { start: '08:00', end: '16:00', available: true },
          saturday: { start: '08:00', end: '12:00', available: true },
          sunday: { start: '09:00', end: '11:00', available: false }
        },
        phone: '+91-9876543212',
        languages: ['Hindi', 'English', 'Gujarati'],
        rating: 4.9
      }
    ];

    const createdDoctors = await Doctor.insertMany(doctors);
    console.log('Created doctors:', createdDoctors.length);

    // Create Sample Patients
    const patients = [
      {
        fullName: 'Amit Singh',
        phoneNumber: '+91-9123456789',
        age: 35,
        gender: 'Male',
        village: 'Delhi, India'
      },
      {
        fullName: 'Kavya Reddy',
        phoneNumber: '+91-9123456791',
        age: 28,
        gender: 'Female',
        village: 'Hyderabad, India'
      },
      {
        fullName: 'Rohit Gupta',
        phoneNumber: '+91-9123456793',
        age: 42,
        gender: 'Male',
        village: 'Mumbai, India'
      }
    ];

    const createdPatients = await Patient.insertMany(patients);
    console.log('Created patients:', createdPatients.length);

    // Create Health Assistants
    const healthAssistants = [
      {
        name: 'Nurse Meera Joshi',
        email: 'meera.joshi@hospital.in',
        password: await bcrypt.hash('demoPass', 10),
        role: 'health_assistant',
        phone: '+91-9876543213',
        department: 'General Medicine',
        shift: 'Morning'
      },
      {
        name: 'Nurse Ravi Kumar',
        email: 'ravi.kumar@hospital.in',
        password: await bcrypt.hash('demoPass', 10),
        role: 'health_assistant',
        phone: '+91-9876543214',
        department: 'Emergency',
        shift: 'Night'
      }
    ];

    const createdHAs = await User.insertMany(healthAssistants);
    console.log('Created health assistants:', createdHAs.length);

    // Create Sample Appointments
    const appointments = [
      {
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[0]._id,
        date: new Date('2024-12-20'),
        time: '10:00',
        type: 'consultation',
        status: 'scheduled',
        symptoms: 'Chest pain, shortness of breath',
        notes: 'Follow-up for cardiac evaluation'
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: createdDoctors[1]._id,
        date: new Date('2024-12-21'),
        time: '14:00',
        type: 'consultation',
        status: 'scheduled',
        symptoms: 'Skin rash, itching',
        notes: 'Dermatological consultation'
      },
      {
        patientId: createdPatients[2]._id,
        doctorId: createdDoctors[2]._id,
        date: new Date('2024-12-22'),
        time: '11:00',
        type: 'consultation',
        status: 'completed',
        symptoms: 'Knee pain, difficulty walking',
        notes: 'Orthopedic evaluation completed'
      }
    ];

    const createdAppointments = await Appointment.insertMany(appointments);
    console.log('Created appointments:', createdAppointments.length);

    console.log('\n✅ Indian data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Doctors: ${createdDoctors.length}`);
    console.log(`   - Patients: ${createdPatients.length}`);
    console.log(`   - Health Assistants: ${createdHAs.length}`);
    console.log(`   - Appointments: ${createdAppointments.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedIndianData();