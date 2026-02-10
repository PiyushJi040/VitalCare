import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['consultation', 'follow-up', 'emergency'],
        default: 'consultation'
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    symptoms: String,
    notes: String,
    prescription: String,
    followUpDate: Date
}, { timestamps: true });

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;
