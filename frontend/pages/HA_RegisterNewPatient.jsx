// src/components/HA_RegisterNewPatient.jsx

import React, { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	User,
	HeartPulse,
	Stethoscope,
	Camera,
	CheckCircle,
	Thermometer,
	Heart,
	Activity,
	Ruler,
	Weight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js"; // adjust path based on your project
// Define the steps for the registration form
const getSteps = (t) => [
	{ key: "personal", title: t("personalInfo"), icon: User },
	{ key: "vitals", title: t("vitals"), icon: HeartPulse },
	{ key: "symptoms", title: t("symptoms"), icon: Stethoscope },
	{ key: "photo", title: t("photo"), icon: Camera },
	{ key: "review", title: t("review"), icon: CheckCircle },
];
import toast from "react-hot-toast";
const HA_RegisterNewPatient = ({ setCurrentView }) => {
	const { t } = useTranslation();
	const steps = getSteps(t);
	const [registrationStep, setRegistrationStep] = useState("personal");
	const [newPatient, setNewPatient] = useState({
		name: "",
		age: "",
		gender: "",
		phone: "",
		village: "",
		symptoms: "",
		photo: undefined,
		vitals: {
			temperature: "",
			bloodPressure: "",
			heartRate: "",
			weight: "",
			height: "",
		},
	});
	const [cameraActive, setCameraActive] = useState(false);

	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const navigate = useNavigate();

	const currentStepIndex = useMemo(
		() => steps.findIndex((step) => step.key === registrationStep),
		[registrationStep]
	);

	// Handlers for navigation, camera, and submission (no changes here)
	const nextStep = () => {
		if (currentStepIndex < steps.length - 1) {
			setRegistrationStep(steps[currentStepIndex + 1].key);
		}
	};
	const prevStep = () => {
		if (currentStepIndex > 0) {
			setRegistrationStep(steps[currentStepIndex - 1].key);
		}
	};
	const startCamera = async () => {
		setCameraActive(true);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error("Error accessing camera:", err);
			setCameraActive(false);
		}
	};
	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
		setCameraActive(false);
	};
	const capturePhoto = () => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const context = canvas.getContext("2d");
			context.drawImage(video, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL("image/png");
			setNewPatient((prev) => ({ ...prev, photo: dataUrl }));
			stopCamera();
		}
	};
	const handleRetake = () => {
		setNewPatient((prev) => ({ ...prev, photo: undefined }));
	};
	const registerPatient = async () => {
		try {
			const response = await api.post("/patients/register", newPatient);
			const data = response.data;
			toast.success(
				`Patient ${data.patient.fullName} registered successfully! Queue #${data.visit.queuePosition}`
			);
			navigate("/ha-patient-queue");
		} catch (error) {
			console.error(err);

			if (err.response) {
				toast.error("Error: " + err.response.data.message);
			} else {
				toast.error("Something went wrong: " + err.message);
			}
		}
	};

	// Modernized base styles
	const inputGroupStyles = "relative";
	const inputStyles =
		"block w-full h-12 px-4 text-base text-slate-800 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-blue-500 transition-colors peer";
	const labelStyles =
		"absolute left-4 top-3 text-slate-500 transition-all duration-300 peer-focus:-top-5 peer-focus:text-blue-600 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-blue-600 peer-[:not(:placeholder-shown)]:text-sm";
	const buttonBaseStyles =
		"inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-5 py-2.5 transform hover:scale-[1.02] active:scale-[0.98]";
	const buttonDefaultStyles = `${buttonBaseStyles} bg-blue-600 text-white shadow-sm hover:bg-blue-700`;
	const buttonOutlineStyles = `${buttonBaseStyles} border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700`;

	return (
		<div className="min-h-screen  p-4 md:p-8">
			<div className="container mx-auto max-w-4xl">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<button
						className={`${buttonOutlineStyles} text-sm`}
						onClick={() => navigate("/ha-home")}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						{t("backToDashboard")}
					</button>
					<h1 className="fairplay font-bold text-4xl text-slate-800" c>
						{t("patientRegistration")}
					</h1>
				</div>

				{/* Modernized Registration Form Card */}
				<div className="bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
					{/* 1. Modernized Stepper */}
					<div className="flex items-center justify-between mb-12">
						{steps.map((step, index) => (
							<React.Fragment key={step.key}>
								<div className="flex flex-col items-center text-center">
									<div
										className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-500 ${
											currentStepIndex >= index
												? "bg-blue-600 text-white"
												: "bg-slate-200 text-slate-500"
										}`}
									>
										{currentStepIndex > index ? (
											<CheckCircle className="h-6 w-6" />
										) : (
											<step.icon className="h-5 w-5" />
										)}
									</div>
									<p
										className={`mt-2 text-xs font-semibold ${
											currentStepIndex >= index
												? "text-blue-600"
												: "text-slate-500"
										}`}
									>
										{step.title}
									</p>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`h-1 flex-1 mx-4 rounded-full transition-colors duration-500 ${
											currentStepIndex > index ? "bg-blue-600" : "bg-slate-200"
										}`}
									/>
								)}
							</React.Fragment>
						))}
					</div>

					<AnimatePresence mode="wait">
						{registrationStep === "personal" && (
							<motion.div
								key="personal"
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -30 }}
								className="space-y-8"
							>
								<h2 className="fairplay font-bold text-3xl text-slate-700 mb-6">
									Personal Information
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
									<div className={inputGroupStyles}>
										<input
											id="name"
											type="text"
											value={newPatient.name}
											onChange={(e) =>
												setNewPatient((p) => ({ ...p, name: e.target.value }))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label htmlFor="name" className={labelStyles}>
											Full Name *
										</label>
									</div>
									<div className={inputGroupStyles}>
										<input
											id="age"
											type="number"
											value={newPatient.age}
											onChange={(e) =>
												setNewPatient((p) => ({ ...p, age: e.target.value }))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label htmlFor="age" className={labelStyles}>
											Age in years *
										</label>
									</div>
									<div className="md:col-span-2">
										<label className="text-base font-medium text-slate-700">
											Gender *
										</label>
										<div className="flex gap-4 mt-3">
											{["Male", "Female", "Other"].map((gender) => (
												<button
													key={gender}
													type="button"
													className={`${buttonBaseStyles} text-sm ${
														newPatient.gender === gender
															? "bg-blue-100 text-blue-700 border-blue-300 border"
															: "bg-slate-100 text-slate-600"
													}`}
													onClick={() =>
														setNewPatient((p) => ({ ...p, gender }))
													}
												>
													{gender}
												</button>
											))}
										</div>
									</div>
									<div className={inputGroupStyles}>
										<input
											id="phone"
											type="text"
											value={newPatient.phone}
											onChange={(e) =>
												setNewPatient((p) => ({ ...p, phone: e.target.value }))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label htmlFor="phone" className={labelStyles}>
											Phone Number *
										</label>
									</div>
									<div className={inputGroupStyles}>
										<input
											id="village"
											type="text"
											value={newPatient.village}
											onChange={(e) =>
												setNewPatient((p) => ({
													...p,
													village: e.target.value,
												}))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label htmlFor="village" className={labelStyles}>
											Village/Area *
										</label>
									</div>
								</div>
							</motion.div>
						)}

						{registrationStep === "vitals" && (
							<motion.div
								key="vitals"
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -30 }}
								className="space-y-8"
							>
								<h2 className="fairplay font-bold text-3xl text-slate-700 mb-6">
									Vital Signs
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
									<div className={inputGroupStyles}>
										<input
											id="temperature"
											type="text"
											value={newPatient.vitals.temperature}
											onChange={(e) =>
												setNewPatient((p) => ({
													...p,
													vitals: { ...p.vitals, temperature: e.target.value },
												}))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label
											htmlFor="temperature"
											className={`${labelStyles} flex items-center gap-2`}
										>
											<Thermometer className="h-4 w-4" />
											Temperature
										</label>
									</div>
									<div className={inputGroupStyles}>
										<input
											id="bloodPressure"
											type="text"
											value={newPatient.vitals.bloodPressure}
											onChange={(e) =>
												setNewPatient((p) => ({
													...p,
													vitals: {
														...p.vitals,
														bloodPressure: e.target.value,
													},
												}))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label
											htmlFor="bloodPressure"
											className={`${labelStyles} flex items-center gap-2`}
										>
											<Heart className="h-4 w-4" />
											Blood Pressure
										</label>
									</div>
									<div className={inputGroupStyles}>
										<input
											id="heartRate"
											type="text"
											value={newPatient.vitals.heartRate}
											onChange={(e) =>
												setNewPatient((p) => ({
													...p,
													vitals: { ...p.vitals, heartRate: e.target.value },
												}))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label
											htmlFor="heartRate"
											className={`${labelStyles} flex items-center gap-2`}
										>
											<Activity className="h-4 w-4" />
											Heart Rate
										</label>
									</div>
									<div className={inputGroupStyles}>
										<input
											id="weight"
											type="text"
											value={newPatient.vitals.weight}
											onChange={(e) =>
												setNewPatient((p) => ({
													...p,
													vitals: { ...p.vitals, weight: e.target.value },
												}))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label
											htmlFor="weight"
											className={`${labelStyles} flex items-center gap-2`}
										>
											<Weight className="h-4 w-4" />
											Weight
										</label>
									</div>
									<div className={`${inputGroupStyles} md:col-span-2`}>
										<input
											id="height"
											type="text"
											value={newPatient.vitals.height}
											onChange={(e) =>
												setNewPatient((p) => ({
													...p,
													vitals: { ...p.vitals, height: e.target.value },
												}))
											}
											className={inputStyles}
											placeholder=" "
										/>
										<label
											htmlFor="height"
											className={`${labelStyles} flex items-center gap-2`}
										>
											<Ruler className="h-4 w-4" />
											Height
										</label>
									</div>
								</div>
							</motion.div>
						)}

						{registrationStep === "symptoms" && (
							<motion.div
								key="symptoms"
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -30 }}
							>
								<h2 className="fairplay font-bold text-3xl text-slate-700 mb-8">
									Symptoms & Concerns
								</h2>
								<div>
									<label
										htmlFor="symptoms"
										className="text-base font-medium text-slate-700"
									>
										Describe the patient's symptoms *
									</label>
									<textarea
										id="symptoms"
										value={newPatient.symptoms}
										onChange={(e) =>
											setNewPatient((p) => ({ ...p, symptoms: e.target.value }))
										}
										className="w-full mt-3 rounded-lg border-2 border-slate-200 p-4 min-h-40 focus:outline-none focus:border-blue-500 transition-colors"
										placeholder="Please describe the symptoms, when they started, severity, etc."
									/>
								</div>
							</motion.div>
						)}

						{registrationStep === "photo" && (
							<motion.div
								key="photo"
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -30 }}
								className="space-y-6"
							>
								<h2 className="fairplay font-bold text-3xl text-slate-700 mb-6">
									Patient Photo (Optional)
								</h2>
								<div className="text-center p-6 bg-slate-50 rounded-lg">
									{!cameraActive && !newPatient.photo && (
										<div className="border-2 border-dashed border-slate-300 rounded-lg p-12 flex flex-col items-center">
											<Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
											<p className="text-lg text-slate-500 mb-6">
												Take a photo for patient identification
											</p>
											<button
												type="button"
												className={buttonDefaultStyles}
												onClick={startCamera}
											>
												<Camera className="h-5 w-5 mr-2" />
												Start Camera
											</button>
										</div>
									)}
									{cameraActive && (
										<div className="space-y-4">
											<video
												ref={videoRef}
												autoPlay
												className="w-full max-w-md mx-auto rounded-lg bg-slate-900"
											/>
											<button
												type="button"
												className={buttonDefaultStyles}
												onClick={capturePhoto}
											>
												<Camera className="h-5 w-5 mr-2" />
												Capture Photo
											</button>
										</div>
									)}
									{newPatient.photo && (
										<div className="space-y-4 flex flex-col items-center">
											<img
												src={newPatient.photo}
												alt="Patient"
												className="w-64 h-64 mx-auto rounded-lg object-cover"
											/>
											<button
												type="button"
												className={buttonOutlineStyles}
												onClick={handleRetake}
											>
												Retake Photo
											</button>
										</div>
									)}
									<canvas ref={canvasRef} className="hidden" />
								</div>
							</motion.div>
						)}

						{registrationStep === "review" && (
							<motion.div
								key="review"
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -30 }}
								className="space-y-8"
							>
								<h2 className="fairplay font-bold text-3xl text-slate-700">
									Review Registration
								</h2>
								<div className="space-y-6 text-slate-700">
									<div className="pt-4 mt-4 border-t border-slate-200">
										<h3 className="font-semibold mb-4 text-xl text-slate-800">
											Personal Information
										</h3>
										<div className="grid grid-cols-2 gap-4 text-base">
											<p>
												<strong>Name:</strong> {newPatient.name}
											</p>
											<p>
												<strong>Age:</strong> {newPatient.age} years
											</p>
											<p>
												<strong>Gender:</strong> {newPatient.gender}
											</p>
											<p>
												<strong>Phone:</strong> {newPatient.phone}
											</p>
											<p>
												<strong>Village:</strong> {newPatient.village}
											</p>
										</div>
									</div>
									<div className="pt-4 mt-4 border-t border-slate-200">
										<h3 className="font-semibold mb-4 text-xl text-slate-800">
											Vital Signs
										</h3>
										<div className="grid grid-cols-2 gap-4 text-base">
											<p>
												<strong>Temperature:</strong>{" "}
												{newPatient.vitals?.temperature || "N/A"}
											</p>
											<p>
												<strong>Blood Pressure:</strong>{" "}
												{newPatient.vitals?.bloodPressure || "N/A"}
											</p>
											<p>
												<strong>Heart Rate:</strong>{" "}
												{newPatient.vitals?.heartRate || "N/A"}
											</p>
											<p>
												<strong>Weight:</strong>{" "}
												{newPatient.vitals?.weight || "N/A"}
											</p>
											<p>
												<strong>Height:</strong>{" "}
												{newPatient.vitals?.height || "N/A"}
											</p>
										</div>
									</div>
									<div className="pt-4 mt-4 border-t border-slate-200">
										<h3 className="font-semibold mb-4 text-xl text-slate-800">
											Symptoms
										</h3>
										<p className="text-base whitespace-pre-wrap">
											{newPatient.symptoms || "No symptoms described."}
										</p>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Navigation Buttons */}
					<div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
						<button
							type="button"
							className={buttonOutlineStyles}
							onClick={prevStep}
							disabled={currentStepIndex === 0}
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							Previous
						</button>
						{currentStepIndex < steps.length - 1 ? (
							<button
								type="button"
								className={buttonDefaultStyles}
								onClick={nextStep}
							>
								Next
								<ArrowRight className="h-5 w-5 ml-2" />
							</button>
						) : (
							<button
								type="button"
								className={`${buttonBaseStyles} bg-emerald-600 text-white hover:bg-emerald-700`}
								onClick={registerPatient}
							>
								<CheckCircle className="h-5 w-5 mr-2" />
								Register Patient
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HA_RegisterNewPatient;
