import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Chat from "../models/Chat.js";
import MedicalImage from "../models/MedicalImage.js";

// Get doctor dashboard data
export const getDoctorDashboard = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Mock data for now - replace with actual database queries
        const dashboardData = {
            stats: {
                patientsWaiting: 5,
                activeConsultations: 2,
                completedToday: 15,
                prescriptionsSent: 12
            },
            appointments: [
                {
                    id: "apt001",
                    patientName: "Rajesh Kumar",
                    time: "10:00 AM",
                    type: "Consultation",
                    status: "upcoming"
                }
            ],
            messages: [
                {
                    id: "msg001",
                    patientName: "Sunita Devi",
                    message: "Doctor, I have severe headache",
                    time: "9:30 AM",
                    unread: true
                }
            ]
        };

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Mock data
        const appointments = [
            {
                id: "apt001",
                patientName: "Rajesh Kumar",
                time: "10:00 AM",
                date: "2024-01-15",
                type: "Consultation",
                status: "confirmed"
            }
        ];

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

// Send message to patient
export const sendMessageToPatient = async (req, res) => {
    try {
        const { doctorId, patientId, message } = req.body;

        // Mock response
        const newMessage = {
            id: Date.now().toString(),
            from: doctorId,
            to: patientId,
            message: message,
            timestamp: new Date(),
            type: "doctor_to_patient"
        };

        res.json({ success: true, message: newMessage });
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

// Get disease cases
export const getDiseaseCases = async (req, res) => {
    try {
        const { type } = req.params; // eye, skin, bone

        // Mock data for disease cases
        const cases = [
            {
                id: "case001",
                patientName: "Priya Sharma",
                imageUrl: "/images/eye_case_1.jpg",
                description: "Redness in right eye",
                severity: "moderate",
                submittedAt: "2024-01-14T10:00:00Z"
            }
        ];

        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: "Error fetching disease cases", error: error.message });
    }
};

// Attend to a case
export const attendToCase = async (req, res) => {
    try {
        const { caseId, doctorId, notes } = req.body;

        // Mock response
        res.json({
            success: true,
            message: "Case attended successfully",
            caseId: caseId,
            status: "in_progress"
        });
    } catch (error) {
        res.status(500).json({ message: "Error attending to case", error: error.message });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        // Mock response
        res.json({
            success: true,
            appointmentId: appointmentId,
            status: status
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment", error: error.message });
    }
};
