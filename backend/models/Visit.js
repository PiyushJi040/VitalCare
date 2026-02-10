import { Schema, model } from "mongoose";

const visitSchema = new Schema(
	{
		patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
		symptoms: { type: String, trim: true },
		vitals: {
			temperature: Number,
			bloodPressure: String,
			heartRate: Number,
			weight: Number,
			height: Number,
		},
		queuePosition: Number,
		status: {
			type: String,
			enum: ["waiting", "consulting", "done"],
			default: "waiting",
		},
		visitDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default model("Visit", visitSchema);
