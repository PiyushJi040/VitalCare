import express from "express";
import {
    getDoctorDashboard,
    getDoctorAppointments,
    sendMessageToPatient,
    getDiseaseCases,
    attendToCase,
    updateAppointmentStatus
} from "../controllers/doctor.controller.js";

const doctorRouter = express.Router();

// Get doctor dashboard data
doctorRouter.get("/dashboard/:doctorId", getDoctorDashboard);

// Get doctor's appointments
doctorRouter.get("/appointments/:doctorId", getDoctorAppointments);

// Send message to patient
doctorRouter.post("/message", sendMessageToPatient);

// Get disease cases (eye, skin, bone)
doctorRouter.get("/cases/:type", getDiseaseCases);

// Attend to a disease case
doctorRouter.post("/attend-case", attendToCase);

// Update appointment status
doctorRouter.put("/appointment/:appointmentId", updateAppointmentStatus);

export default doctorRouter;
