import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
	ArrowLeft,
	Video,
	Clock,
	Users,
	Star,
	Circle,
	UserCheck,
	Stethoscope,
} from "lucide-react";

const HA_DoctorSelection = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { patient } = location.state || {};

	const [selectedSpecialty, setSelectedSpecialty] = useState("");
	const [availableDoctors, setAvailableDoctors] = useState([]);
	const [loading, setLoading] = useState(false);

	// Sample specialties - replace with API call
	const specialties = [
		{ id: "general", name: "General Medicine", count: 5 },
		{ id: "cardiology", name: "Cardiology", count: 2 },
		{ id: "dermatology", name: "Dermatology", count: 3 },
		{ id: "pediatrics", name: "Pediatrics", count: 4 },
		{ id: "orthopedics", name: "Orthopedics", count: 2 },
		{ id: "gynecology", name: "Gynecology", count: 3 },
	];

	// Sample doctors data - replace with API call
	const sampleDoctors = {
		general: [
			{
				id: "doc1",
				name: "Dr. Rajesh Kumar",
				specialty: "General Medicine",
				experience: "8 years",
				rating: 4.8,
				currentPatients: 2,
				maxPatients: 5,
				status: "online",
				avatar: "RK",
			},
			{
				id: "doc2",
				name: "Dr. Priya Sharma",
				specialty: "General Medicine",
				experience: "12 years",
				rating: 4.9,
				currentPatients: 1,
				maxPatients: 4,
				status: "online",
				avatar: "PS",
			},
		],
		cardiology: [
			{
				id: "doc3",
				name: "Dr. Amit Singh",
				specialty: "Cardiology",
				experience: "15 years",
				rating: 4.9,
				currentPatients: 3,
				maxPatients: 6,
				status: "online",
				avatar: "AS",
			},
		],
	};

	useEffect(() => {
		if (selectedSpecialty) {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setAvailableDoctors(sampleDoctors[selectedSpecialty] || []);
				setLoading(false);
			}, 500);
		}
	}, [selectedSpecialty]);

	const handleSelectDoctor = async (doctor) => {
		try {
			// Add patient to doctor's queue
			console.log("Adding patient to doctor queue:", { patient, doctor });
			
			// Navigate to video call or queue management
			navigate("/ha-patient-queue", {
				state: { 
					patientAdded: true, 
					doctor: doctor,
					patient: patient 
				}
			});
		} catch (error) {
			console.error("Error adding patient to queue:", error);
		}
	};

	const buttonBaseStyles =
		"inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 transform hover:scale-[1.02] active:scale-[0.98]";
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
							onClick={() => navigate("/ha-patient-queue")}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Queue
						</button>
						<div>
							<h1 className="fairplay font-bold text-4xl text-slate-800">
								Select Doctor
							</h1>
							{patient && (
								<p className="text-slate-600 mt-1">
									For patient: <span className="font-semibold">{patient.fullName}</span>
								</p>
							)}
						</div>
					</div>
				</header>

				<main className="grid grid-cols-1 gap-8">
					{/* Specialty Selection */}
					<div className="bg-gray-800 rounded-xl shadow-sm border border-slate-200 p-6">
						<h2 className="text-xl font-bold text-slate-800 mb-4">
							Choose Specialty
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{specialties.map((specialty) => (
								<button
									key={specialty.id}
									onClick={() => setSelectedSpecialty(specialty.id)}
									className={`p-4 rounded-lg border-2 transition-all ${
										selectedSpecialty === specialty.id
											? "border-blue-500 bg-blue-50"
											: "border-slate-200 hover:border-blue-300"
									}`}
								>
									<div className="flex items-center gap-3">
										<div className="bg-blue-100 p-2 rounded-full">
											<Stethoscope className="h-5 w-5 text-blue-600" />
										</div>
										<div className="text-left">
											<p className="font-semibold text-slate-800">
												{specialty.name}
											</p>
											<p className="text-sm text-slate-500">
												{specialty.count} doctors online
											</p>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Available Doctors */}
					{selectedSpecialty && (
						<div className="bg-gray-800 rounded-xl shadow-sm border border-slate-200 p-6">
							<h2 className="text-xl font-bold text-slate-800 mb-4">
								Available Doctors - {specialties.find(s => s.id === selectedSpecialty)?.name}
							</h2>

							{loading ? (
								<p className="text-center text-slate-500 py-8">Loading doctors...</p>
							) : availableDoctors.length === 0 ? (
								<p className="text-center text-slate-500 py-8">
									No doctors available in this specialty
								</p>
							) : (
								<div className="space-y-4">
									{availableDoctors.map((doctor) => (
										<div
											key={doctor.id}
											className="flex items-center justify-between bg-gray-800 border border-slate-200 hover:border-blue-400 p-4 rounded-lg transition-colors"
										>
											<div className="flex items-center gap-4">
												{/* Doctor Avatar */}
												<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
													<span className="text-blue-600 font-bold">
														{doctor.avatar}
													</span>
												</div>

												{/* Doctor Info */}
												<div>
													<div className="flex items-center gap-2">
														<h3 className="font-semibold text-lg text-slate-800">
															{doctor.name}
														</h3>
														<div className="flex items-center gap-1">
															<Circle className="w-2 h-2 fill-green-500 text-green-500" />
															<span className="text-xs text-green-600 font-medium">
																Online
															</span>
														</div>
													</div>
													<p className="text-sm text-slate-600">
														{doctor.specialty} • {doctor.experience} experience
													</p>
													<div className="flex items-center gap-4 mt-1">
														<div className="flex items-center gap-1">
															<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
															<span className="text-sm font-medium">
																{doctor.rating}
															</span>
														</div>
														<div className="flex items-center gap-1">
															<Users className="w-4 h-4 text-slate-400" />
															<span className="text-sm text-slate-500">
																{doctor.currentPatients}/{doctor.maxPatients} patients
															</span>
														</div>
													</div>
												</div>
											</div>

											{/* Action Buttons */}
											<div className="flex items-center gap-3">
												<div className="text-right">
													<p className="text-sm text-slate-500">
														Queue: {doctor.currentPatients} waiting
													</p>
													<p className="text-xs text-slate-400">
														~{doctor.currentPatients * 15} min wait
													</p>
												</div>
												<button
													className={buttonDefaultStyles}
													onClick={() => handleSelectDoctor(doctor)}
													disabled={doctor.currentPatients >= doctor.maxPatients}
												>
													<Video className="h-4 w-4 mr-2" />
													{doctor.currentPatients >= doctor.maxPatients 
														? "Queue Full" 
														: "Add to Queue"
													}
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default HA_DoctorSelection;
