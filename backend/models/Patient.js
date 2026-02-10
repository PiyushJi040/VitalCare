import { Schema, model } from "mongoose";

const patientSchema = new Schema(
	{
		fullName: { type: String, required: true, trim: true },
		age: { type: Number, min: 0, max: 150 },
		gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
		phoneNumber: { type: String, required: true, trim: true },
		village: { type: String, trim: true },
		photo: { type: String }, // base64 or URL
	},
	{ timestamps: true }
);

export default model("Patient", patientSchema);
