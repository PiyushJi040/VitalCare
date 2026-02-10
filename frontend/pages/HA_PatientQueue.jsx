// src/components/HA_PatientQueue.jsx

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ArrowLeft,
	UserPlus,
	Video,
	Clock,
	Phone,
	MapPin,
	Play,
	UserCheck,
	X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const HA_PatientQueue = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [waitingPatients, setWaitingPatients] = useState([]);
	const [activePatients, setActivePatients] = useState([]);
	const [loading, setLoading] = useState(true);

	// 🔹 Fetch waiting patients from backend
	useEffect(() => {
		const fetchWaitingPatients = async () => {
			try {
				const { data } = await api.get("/patients/waiting"); // 👈 using axios wrapper
				setWaitingPatients(data);
			} catch (err) {
				console.error(
					"Error fetching patients:",
					err.response?.data || err.message
				);
			} finally {
				setLoading(false);
			}
		};

		fetchWaitingPatients();

		// Optional auto-refresh every 30s
		const interval = setInterval(fetchWaitingPatients, 30000);
		return () => clearInterval(interval);
	}, []);

	// 🔹 Select doctor for patient
	const handleSelectDoctor = (patient) => {
		navigate("/ha-doctor-selection", {
			state: { patient }
		});
	};

	// 🔹 Remove patient from queue
	const handleRemoveFromQueue = async (visitId) => {
		try {
			await api.delete(`/visits/${visitId}`);
			setWaitingPatients((prev) => prev.filter((p) => p._id !== visitId));
		} catch (err) {
			console.error("Error removing patient:", err.response?.data || err.message);
		}
	};

	const buttonBaseStyles =
		"inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-5 py-2.5 transform hover:scale-[1.02] active:scale-[0.98]";
	const buttonDefaultStyles = `${buttonBaseStyles} bg-blue-600 text-white shadow-sm hover:bg-blue-700`;
	const buttonOutlineStyles = `${buttonBaseStyles} border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700`;

	return (
		<div className="min-h-screen p-4 md:p-8">
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<header className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<button
							className={`${buttonOutlineStyles} text-sm`}
							onClick={() => navigate("/ha-home")}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							{t("backToDashboard")}
						</button>
						<h1 className="fairplay font-bold text-4xl text-slate-800">
							{t("patientQueue")}
						</h1>
					</div>
					<button
						className={buttonDefaultStyles}
						onClick={() => navigate("/ha-register")}
					>
						<UserPlus className="h-5 w-5 mr-2" />
						{t("addNewPatient")}
					</button>
				</header>

				<main className="grid grid-cols-1 gap-8">
					{/* Active Consultations */}
					<div className="bg-gray-800 rounded-xl shadow-sm border border-slate-200 p-6">
						<h2 className="text-xl font-bold text-slate-800 mb-4">
							{t("activeConsultations")}
						</h2>
						<div className="space-y-3">
							{activePatients.map((visit) => (
								<div
									key={visit._id}
									className="flex items-center justify-between bg-slate-50 p-4 rounded-lg"
								>
									<div className="flex items-center gap-4">
										<div className="bg-blue-100 p-3 rounded-full">
											<Video className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<p className="font-semibold text-slate-800">
												{visit.patient.fullName}
											</p>
											<p className="text-sm text-slate-600">
												{visit.patient.village || "Unknown"} •{" "}
												{visit.symptoms || "No symptoms provided"}
											</p>
										</div>
									</div>
									<div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
										{t("inConsultation")}
									</div>
								</div>
							))}
							{activePatients.length === 0 && (
								<p className="text-center text-slate-500 py-4">
									{t("noActiveConsultations")}
								</p>
							)}
						</div>
					</div>

					{/* Waiting Queue */}
					<div className="bg-gray-800 rounded-xl shadow-sm border border-slate-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-slate-800">
								{t("waitingQueue")} ({waitingPatients.length})
							</h2>
							<div className="flex items-center gap-2 text-sm text-slate-600">
								<Clock className="h-4 w-4" />
								<span>
									{t("averageWaitTime")}: 15 {t("minutes")}
								</span>
							</div>
						</div>

						{loading ? (
							<p className="text-center text-slate-500 py-8">Loading...</p>
						) : waitingPatients.length === 0 ? (
							<p className="text-center text-slate-500 py-8">
								{t("waitingQueueEmpty")}
							</p>
						) : (
							<div className="space-y-3">
								{waitingPatients.map((visit) => (
									<div
										key={visit._id}
										className="flex items-center justify-between bg-gray-800 border border-slate-200 hover:border-blue-400 p-4 rounded-lg transition-colors"
									>
										<div className="flex items-center gap-4">
											<div className="flex items-center justify-center w-10 h-10 border-2 border-blue-500 text-blue-600 font-bold text-xl rounded-full">
												{visit.queuePosition}
											</div>
											<div className="font-semibold text-lg text-slate-800">
												{visit.patient.fullName}
											</div>
											<div className="flex items-center gap-5 text-slate-500 text-sm">
												<span>
													{visit.patient.age} yrs • {visit.patient.gender}
												</span>
												<span className="flex items-center gap-1.5">
													<Phone className="h-4 w-4" />{" "}
													{visit.patient.phoneNumber || "Not Available"}
												</span>
												<span className="flex items-center gap-1.5">
													<MapPin className="h-4 w-4" />{" "}
													{visit.patient.village || "Not Available"}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-3">
											{visit.assignedDoctor ? (
												<div className="text-right mr-4">
													<p className="text-sm font-medium text-slate-700">
														Assigned to: {visit.assignedDoctor.name}
													</p>
													<p className="text-xs text-slate-500">
														{visit.assignedDoctor.specialty}
													</p>
												</div>
											) : null}
											<button
												className={`${buttonOutlineStyles} text-red-600 border-red-300 hover:bg-red-50`}
												onClick={() => handleRemoveFromQueue(visit._id)}
											>
												<X className="h-4 w-4 mr-2" />
												Remove
											</button>
											<button
												className={buttonDefaultStyles}
												onClick={() => handleSelectDoctor(visit.patient)}
											>
												<UserCheck className="h-4 w-4 mr-2" />
												{visit.assignedDoctor ? "Change Doctor" : "Select Doctor"}
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default HA_PatientQueue;
