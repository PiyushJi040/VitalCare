import Patient from "../models/Patient.js";
import User, { Doctor } from "../models/User.js";
import Visit from "../models/Visit.js";
export const countTotalUsers = async (req, res) => {
	const totalUsers = await User.countDocuments();
	console.log(totalUsers);
	return res.json({ totalUsers });
};

export const countDoctors = async (req, res) => {
	const totalDoctors = await Doctor.countDocuments();
	console.log(totalDoctors);
	return res.json({ totalDoctors });
};

export const totalConsulations = async (req, res) => {
	const totalVisits = await Visit.countDocuments();
	console.log(totalVisits);
	return res.json({ totalVisits });
};

export const getAllDoctors = async (req, res) => {
	const allDoctors = await Doctor.find();
	return res.json({ allDoctors });
};

export const getAllPatients = async (req, res) => {
	const allPatients = await Patient.find();
	return res.json({ allPatients });
};

export const getAllHealthAssistants = async (req, res) => {
	const allHealthAssistants = await User.find({ role: "health_assistant" });
	return res.json({ allHealthAssistants });
};

export const deleteDoctor = async (req, res) => {
	const { id } = req.params;
	await Doctor.findByIdAndDelete(id);
	return res.json({ message: "Doctor deleted successfully" });
};

export const deletePatient = async (req, res) => {
	const { id } = req.params;
	await Patient.findByIdAndDelete(id);
	return res.json({ message: "Patient deleted successfully" });
};

export const deleteHealthAssistant = async (req, res) => {
	const { id } = req.params;
	await User.findByIdAndDelete(id);
	return res.json({ message: "Health assistant deleted successfully" });
};
