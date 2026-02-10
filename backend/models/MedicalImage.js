import { Schema, model } from "mongoose";

const medicalImageSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['eye', 'skin', 'bone'],
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: String,
    diagnosis: String,
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'attended'],
        default: 'pending'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const MedicalImage = model("MedicalImage", medicalImageSchema);

export default MedicalImage;
