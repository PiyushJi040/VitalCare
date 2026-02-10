import Patient from "../models/Patient.js";
import Visit from "../models/Visit.js	";
//Register a new patient to the database

// Register a new patient

export const registerPatientVisit = async (req, res) => {
	try {
		const { name, age, gender, phone, village, photo, symptoms, vitals } =
			req.body;

		// 1. Find existing patient by phone number
		let patient = await Patient.findOne({ phoneNumber: phone });

		if (!patient) {
			patient = new Patient({
				fullName: name,
				age,
				gender,
				phoneNumber: phone,
				village,
				photo,
			});
			await patient.save();
		}

		// 2. Get today's last queue position
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));

		const lastVisit = await Visit.findOne({
			visitDate: { $gte: startOfDay, $lte: endOfDay },
		}).sort({ queuePosition: -1 });

		const queuePosition = lastVisit ? lastVisit.queuePosition + 1 : 1;

		// 3. Create a new visit
		const visit = new Visit({
			patient: patient._id,
			symptoms,
			vitals,
			queuePosition,
		});

		await visit.save();

		res.status(201).json({
			message: "Patient visit registered successfully",
			patient,
			visit,
		});
	} catch (error) {
		console.error("Error registering patient visit:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getWaitingPatients = async (req, res) => {
	try {
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));

		const patients = await Visit.find({
			status: "waiting",
			visitDate: { $gte: startOfDay, $lte: endOfDay },
		})
			.populate("patient")
			.sort({ queuePosition: 1 });

		res.json(patients);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
