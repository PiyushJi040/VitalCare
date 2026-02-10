// src/components/Doctor_Home.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ArrowLeft,
	RefreshCw,
	Bell,
	Search,
	History,
	Users,
	Video,
	CheckCircle,
	FileText,
	Clock,
	Heart,
	Thermometer,
	Activity,
	LogOut,
	Eye,
	Bone,
	MessageSquare,
	Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

import VideoCall from "../src/components/VideoCall";
import PrescriptionBlockchain from "../src/components/PrescriptionBlockchain";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

// --- SAMPLE DATA ---
const sampleStats = {
	patientsWaiting: 1,
	activeConsultations: 1,
	completedToday: 12,
	prescriptionsSent: 8,
};

const sampleActiveConsultations = [
	{
		id: "p002",
		name: "Sunita Devi",
		details:
			"Ghanaur • Stomach pain and nausea since morning, loss of appetite",
	},
];

const sampleWaitingPatients = [
	{
		id: "p001",
		queuePosition: 1,
		name: "Rajesh Kumar",
		age: 45,
		gender: "male",
		location: "Bhadson",
		summary: "Fever and headache for 3 days, feeling weak and tired",
		vitals: {
			bp: "140/90",
			temp: "101.2°F",
			hr: "85 bpm",
		},
		waitingTime: "30 min",
	},
];

const Doctor_Home = () => {
	const { t } = useTranslation();
	const [stats] = useState(sampleStats);
	const [activeConsultations] = useState(sampleActiveConsultations);
	const [waitingPatients] = useState(sampleWaitingPatients);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [showMessaging, setShowMessaging] = useState(false);
	const [searchHistory, setSearchHistory] = useState("");
	const [showPatientHistory, setShowPatientHistory] = useState(false);
	const [patientHistoryData, setPatientHistoryData] = useState([]);
	const [filteredHistory, setFilteredHistory] = useState([]);
	const [showVideoCall, setShowVideoCall] = useState(false);
	const [roomId, setRoomId] = useState("");
	const [selectedCaseType, setSelectedCaseType] = useState(null);
	const [casePatients, setCasePatients] = useState([]);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		try {
			logout();
			toast.success("Logged out successfully");
			navigate("/landing");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Error during logout");
		}
	};

	const handleJoinConsultation = (patientId) => {
		try {
			const newRoomId = `consultation-${Date.now()}-${patientId}`;
			setRoomId(newRoomId);
			setShowVideoCall(true);
			toast.success("Joining consultation...");
		} catch (error) {
			console.error("Error joining consultation:", error);
			toast.error("Failed to join consultation");
		}
	};

	const handleStartConsultation = (patientId) => {
		try {
			const newRoomId = `consultation-${Date.now()}-${patientId}`;
			setRoomId(newRoomId);
			setShowVideoCall(true);
			toast.success("Starting consultation...");
		} catch (error) {
			console.error("Error starting consultation:", error);
			toast.error("Failed to start consultation");
		}
	};

	const closeVideoCall = () => {
		try {
			setShowVideoCall(false);
			setRoomId("");
			toast.success("Video call ended");
		} catch (error) {
			console.error("Error closing video call:", error);
			toast.error("Error ending video call");
		}
	};

	const handlePatientHistory = () => {
		const historyData = [
			{
				id: 1,
				name: "Rajesh Kumar",
				lastVisit: "2024-01-15",
				condition: "Fever, Headache",
				treatment: "Paracetamol prescribed",
			},
			{
				id: 2,
				name: "Sunita Devi",
				lastVisit: "2024-01-10",
				condition: "Stomach pain",
				treatment: "Antacid prescribed",
			},
			{
				id: 3,
				name: "Amit Singh",
				lastVisit: "2024-01-08",
				condition: "Cough, Cold",
				treatment: "Cough syrup prescribed",
			},
		];
		setPatientHistoryData(historyData);
		setFilteredHistory(historyData);
		setShowPatientHistory(true);
	};

	const handleSearchHistory = (searchTerm) => {
		setSearchHistory(searchTerm);
		if (searchTerm.trim() === "") {
			setFilteredHistory(patientHistoryData);
		} else {
			const filtered = patientHistoryData.filter(
				(patient) =>
					patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredHistory(filtered);
		}
	};

	const handleRefresh = () => {
		try {
			toast.success("Dashboard refreshed");
		} catch (error) {
			console.error("Error refreshing dashboard:", error);
			toast.error("Failed to refresh dashboard");
		}
	};

	const handleCaseClick = (caseType) => {
		try {
			const sampleCaseData = {
				Eye: [
					{
						id: "e1",
						name: "Priya Sharma",
						age: 32,
						condition: "Conjunctivitis",
						severity: "Mild",
						waitTime: "15 min",
						symptoms: "Red eyes, itching, discharge",
					},
					{
						id: "e2",
						name: "Ravi Kumar",
						age: 58,
						condition: "Cataract",
						severity: "Moderate",
						waitTime: "25 min",
						symptoms: "Blurred vision, light sensitivity",
					},
					{
						id: "e3",
						name: "Meera Devi",
						age: 45,
						condition: "Glaucoma",
						severity: "High",
						waitTime: "10 min",
						symptoms: "Eye pain, vision loss",
					},
				],
				Skin: [
					{
						id: "s1",
						name: "Amit Singh",
						age: 28,
						condition: "Eczema",
						severity: "Moderate",
						waitTime: "20 min",
						symptoms: "Dry, itchy skin patches",
					},
					{
						id: "s2",
						name: "Sunita Rani",
						age: 35,
						condition: "Psoriasis",
						severity: "High",
						waitTime: "12 min",
						symptoms: "Red, scaly patches on skin",
					},
					{
						id: "s3",
						name: "Deepak Sharma",
						age: 42,
						condition: "Acne",
						severity: "Mild",
						waitTime: "30 min",
						symptoms: "Facial breakouts, inflammation",
					},
					{
						id: "s4",
						name: "Kavita Devi",
						age: 29,
						condition: "Dermatitis",
						severity: "Moderate",
						waitTime: "18 min",
						symptoms: "Skin rash, redness",
					},
					{
						id: "s5",
						name: "Rohit Kumar",
						age: 24,
						condition: "Fungal Infection",
						severity: "Mild",
						waitTime: "22 min",
						symptoms: "Itchy, circular patches",
					},
				],
				Bone: [
					{
						id: "b1",
						name: "Harpreet Singh",
						age: 55,
						condition: "Arthritis",
						severity: "High",
						waitTime: "8 min",
						symptoms: "Joint pain, stiffness",
					},
					{
						id: "b2",
						name: "Manjeet Kaur",
						age: 48,
						condition: "Fracture",
						severity: "High",
						waitTime: "5 min",
						symptoms: "Severe pain, swelling",
					},
				],
			};
			setSelectedCaseType(caseType);
			setCasePatients(sampleCaseData[caseType] || []);
			toast.success(`Showing ${caseType} cases`);
		} catch (error) {
			console.error("Error opening case management:", error);
			toast.error("Failed to open case management");
		}
	};

	const handleSendMessage = () => {
		try {
			if (newMessage.trim() && selectedPatient) {
				const message = {
					id: Date.now(),
					patientId: selectedPatient.id,
					text: newMessage,
					timestamp: new Date().toLocaleTimeString(),
					sender: "doctor",
				};
				setMessages([...messages, message]);
				setNewMessage("");
				toast.success("Message sent");
			} else {
				toast.warning("Please enter a message");
			}
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message");
		}
	};

	const openMessaging = (patient) => {
		try {
			setSelectedPatient(patient);
			setShowMessaging(true);
			toast.success(`Opening chat with ${patient.name}`);
		} catch (error) {
			console.error("Error opening messaging:", error);
			toast.error("Failed to open messaging");
		}
	};

	const closeCaseDetails = () => {
		setSelectedCaseType(null);
		setCasePatients([]);
	};

	const buttonBaseStyles =
		"inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 transform hover:scale-[1.02] active:scale-[0.98]";
	const buttonDefaultStyles = `${buttonBaseStyles} bg-blue-600 text-white shadow-sm hover:bg-blue-700`;
	const buttonOutlineStyles = `${buttonBaseStyles} border border-gray-600 bg-transparent hover:bg-slate-100 text-slate-700`;
	const cardStyles =
		"bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-6";

	const statCardsData = [
		{ title: t("patientsWaiting"), value: stats.patientsWaiting, icon: Users },
		{
			title: t("activeConsultations"),
			value: stats.activeConsultations,
			icon: Video,
		},
		{
			title: t("completedToday"),
			value: stats.completedToday,
			icon: CheckCircle,
		},
		{
			title: t("prescriptionsSent"),
			value: stats.prescriptionsSent,
			icon: FileText,
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 p-4 md:p-8">
			<GlobalLanguageSelector />
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<header className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<button
							className={`${buttonOutlineStyles} text-sm`}
							onClick={() => navigate("/landing")}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							{t("backToHome")}
						</button>
						<div>
							<p className="font-serif text-blue-700 text-lg">
								{t("hello")} {user?.name || "Doctor"},
							</p>
							<h1 className="fairplay font-bold text-4xl text-white">
								{t("doctorDashboard")}
							</h1>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-400">
							{t("lastUpdated")}: 1m {t("ago")}
						</span>
						<button
							className="flex items-center gap-2 text-gray-300 hover:text-white text-sm"
							onClick={handleRefresh}
						>
							<RefreshCw className="h-4 w-4" /> {t("refresh")}
						</button>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
							<input
								type="text"
								value={searchHistory}
								onChange={(e) => handleSearchHistory(e.target.value)}
								placeholder={t("searchPatientHistory")}
								className="pl-10 pr-10 py-2 text-sm border border-gray-600 rounded-lg w-64 focus:ring-blue-500 focus:border-blue-500"
							/>
							{searchHistory && (
								<button
									onClick={() => handleSearchHistory("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gray-300"
								>
									×
								</button>
							)}
						</div>
						<button
							className={buttonOutlineStyles}
							onClick={handlePatientHistory}
						>
							<History className="h-4 w-4 mr-2" /> {t("patientHistory")}
						</button>

						<button
							className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
							onClick={handleLogout}
						>
							<LogOut className="h-4 w-4" /> {t("logout")}
						</button>
					</div>
				</header>

				<main className="grid grid-cols-1 gap-8">
					{/* Stat Cards Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{statCardsData.map((card, index) => (
							<div
								key={index}
								className="bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-5 flex items-center gap-5"
							>
								<div className="bg-blue-100 p-4 rounded-full">
									<card.icon className="h-7 w-7 text-blue-600" />
								</div>
								<div>
									<p className="text-3xl font-bold text-white">
										{card.value}
									</p>
									<p className="text-sm text-gray-400">{card.title}</p>
								</div>
							</div>
						))}
					</div>

					{/* Active Consultations Section */}
					<div className={cardStyles}>
						<h2 className="text-xl font-bold text-white mb-4">
							{t("activeConsultations")}
						</h2>
						<div className="space-y-3">
							{activeConsultations.map((patient) => (
								<div
									key={patient.id}
									className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
								>
									<div className="flex items-center gap-4">
										<div className="bg-blue-100 p-3 rounded-full">
											<Video className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<p className="font-semibold text-white">
												{patient.name}
											</p>
											<p className="text-sm text-gray-300">
												{patient.details}
											</p>
										</div>
									</div>
									<button
										className={buttonDefaultStyles}
										onClick={() => handleJoinConsultation(patient.id)}
									>
										<Video className="h-5 w-5 mr-2" /> {t("joinConsultation")}
									</button>
								</div>
							))}
							{activeConsultations.length === 0 && (
								<p className="text-center text-gray-400 py-4">
									{t("noActiveConsultations")}
								</p>
							)}
						</div>
					</div>

					{/* Disease Case Sections */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div
							className={`${cardStyles} hover:shadow-md transition-shadow cursor-pointer`}
							onClick={() => handleCaseClick("Eye")}
						>
							<div className="flex items-center gap-4 mb-4">
								<div className="bg-blue-100 p-3 rounded-full">
									<Eye className="h-6 w-6 text-blue-600" />
								</div>
								<h3 className="text-lg font-semibold text-white">
									{t("eyeCases")}
								</h3>
							</div>
							<p className="text-sm text-gray-300 mb-3">
								{t("manageEyeConsultations")}
							</p>
							<div className="text-2xl font-bold text-blue-600">3</div>
							<p className="text-xs text-gray-400">{t("activeCases")}</p>
						</div>

						<div
							className={`${cardStyles} hover:shadow-md transition-shadow cursor-pointer`}
							onClick={() => handleCaseClick("Skin")}
						>
							<div className="flex items-center gap-4 mb-4">
								<div className="bg-green-100 p-3 rounded-full">
									<Heart className="h-6 w-6 text-green-600" />
								</div>
								<h3 className="text-lg font-semibold text-white">
									{t("skinCases")}
								</h3>
							</div>
							<p className="text-sm text-gray-300 mb-3">
								{t("handleDermatological")}
							</p>
							<div className="text-2xl font-bold text-green-600">5</div>
							<p className="text-xs text-gray-400">{t("activeCases")}</p>
						</div>

						<div
							className={`${cardStyles} hover:shadow-md transition-shadow cursor-pointer`}
							onClick={() => handleCaseClick("Bone")}
						>
							<div className="flex items-center gap-4 mb-4">
								<div className="bg-orange-100 p-3 rounded-full">
									<Bone className="h-6 w-6 text-orange-600" />
								</div>
								<h3 className="text-lg font-semibold text-white">
									{t("boneCases")}
								</h3>
							</div>
							<p className="text-sm text-gray-300 mb-3">
								{t("manageOrthopedic")}
							</p>
							<div className="text-2xl font-bold text-orange-600">2</div>
							<p className="text-xs text-gray-400">{t("activeCases")}</p>
						</div>
					</div>

					{/* Case Details Section */}
					{selectedCaseType && (
						<div className={cardStyles}>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold text-white">
									{selectedCaseType} Cases - {casePatients.length} Patients
								</h2>
								<button
									onClick={closeCaseDetails}
									className="text-gray-400 hover:text-slate-700 text-xl font-bold"
								>
									×
								</button>
							</div>
							<div className="space-y-4">
								{casePatients.map((patient) => (
									<div
										key={patient.id}
										className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500"
									>
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-4 mb-2">
													<h3 className="font-semibold text-lg text-white">
														{patient.name} ({patient.age}y)
													</h3>
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${
															patient.severity === "High"
																? "bg-red-100 text-red-800"
																: patient.severity === "Moderate"
																? "bg-yellow-100 text-yellow-800"
																: "bg-green-100 text-green-800"
														}`}
													>
														{patient.severity} Priority
													</span>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
													<div>
														<p className="text-sm text-gray-300">
															<span className="font-medium">Condition:</span>{" "}
															{patient.condition}
														</p>
														<p className="text-sm text-gray-300">
															<span className="font-medium">Wait Time:</span>{" "}
															{patient.waitTime}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-300">
															<span className="font-medium">Symptoms:</span>{" "}
															{patient.symptoms}
														</p>
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<button
													className={buttonDefaultStyles}
													onClick={() => handleStartConsultation(patient.id)}
												>
													<Video className="h-4 w-4 mr-2" /> Attend Call
												</button>
												<button
													className={buttonOutlineStyles}
													onClick={() => openMessaging(patient)}
												>
													<MessageSquare className="h-4 w-4 mr-2" /> Message
												</button>
											</div>
										</div>
									</div>
								))}
								{casePatients.length === 0 && (
									<p className="text-center text-gray-400 py-4">
										No patients found for {selectedCaseType} cases.
									</p>
								)}
							</div>
						</div>
					)}

					{/* Blockchain Prescription Section */}
					<PrescriptionBlockchain
						patientId="demo-patient-123"
						doctorId={user?.id || "demo-doctor"}
					/>

					{/* Waiting Patients Section */}
					<div className={cardStyles}>
						<h2 className="text-xl font-bold text-white mb-4">
							{t("waitingQueue")}
						</h2>
						<div className="space-y-3">
							{waitingPatients.map((patient) => (
								<div
									key={patient.id}
									className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
								>
									<div className="flex items-center gap-4">
										<div className="bg-blue-100 p-3 rounded-full">
											<Users className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<p className="font-semibold text-white">
												{patient.name} ({patient.age}y, {patient.gender})
											</p>
											<p className="text-sm text-gray-300">
												{patient.location} • {patient.summary}
											</p>
											<div className="flex gap-4 text-xs text-gray-400 mt-1">
												<span>BP: {patient.vitals.bp}</span>
												<span>Temp: {patient.vitals.temp}</span>
												<span>HR: {patient.vitals.hr}</span>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<span className="text-xs text-gray-400">
											{t("waiting")}: {patient.waitingTime}
										</span>
										<div className="flex gap-2">
											<button
												className={buttonDefaultStyles}
												onClick={() => handleStartConsultation(patient.id)}
											>
												<Video className="h-4 w-4 mr-2" /> {t("start")}
											</button>
											<button
												className={buttonOutlineStyles}
												onClick={() => openMessaging(patient)}
											>
												<MessageSquare className="h-4 w-4 mr-2" />{" "}
												{t("message")}
											</button>
										</div>
									</div>
								</div>
							))}
							{waitingPatients.length === 0 && (
								<p className="text-center text-gray-400 py-4">
									{t("waitingQueueEmpty")}
								</p>
							)}
						</div>
					</div>

					{/* Messaging Modal */}
					{showMessaging && selectedPatient && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-gray-800 rounded-lg p-6 w-96 max-h-96">
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-semibold">
										{t("message")} {selectedPatient.name}
									</h3>
									<button
										onClick={() => {
											setShowMessaging(false);
											setSelectedPatient(null);
											setNewMessage("");
										}}
										className="text-gray-400 hover:text-slate-700 text-2xl font-bold"
									>
										×
									</button>
								</div>
								<div className="h-48 overflow-y-auto mb-4 border rounded p-2 bg-gray-900">
									{(() => {
										const patientMessages = messages.filter(
											(msg) => msg.patientId === selectedPatient.id
										);
										if (patientMessages.length === 0) {
											return (
												<div className="text-center text-gray-400 py-8">
													No messages yet. Start the conversation!
												</div>
											);
										}
										return patientMessages.map((msg) => (
											<div
												key={msg.id}
												className="mb-2 p-3 bg-blue-100 rounded-lg"
											>
												<p className="text-sm font-medium">{msg.text}</p>
												<span className="text-xs text-gray-300">
													{msg.timestamp}
												</span>
											</div>
										));
									})()}
								</div>
								<div className="flex gap-2">
									<input
										type="text"
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										placeholder={t("typeMessage")}
										className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										onKeyPress={(e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												handleSendMessage();
											}
										}}
									/>
									<button
										onClick={handleSendMessage}
										className={buttonDefaultStyles}
									>
										<Send className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Patient History Modal */}
					{showPatientHistory && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
								<div className="flex justify-between items-center mb-4">
									<div>
										<h3 className="text-lg font-semibold">
											{t("patientHistory")}
										</h3>
										{searchHistory && (
											<p className="text-sm text-gray-400">
												Search results for: "{searchHistory}"
											</p>
										)}
									</div>
									<button
										onClick={() => {
											setShowPatientHistory(false);
											setSearchHistory("");
											setFilteredHistory([]);
										}}
										className="text-gray-400 hover:text-slate-700 text-2xl font-bold"
									>
										×
									</button>
								</div>
								<div className="overflow-y-auto max-h-96">
									{(() => {
										const dataToShow = searchHistory
											? filteredHistory
											: patientHistoryData;
										if (dataToShow.length === 0) {
											return (
												<div className="text-center py-8 text-gray-400">
													{searchHistory
														? "No patients found matching your search."
														: "No patient history available."}
												</div>
											);
										}
										return dataToShow.map((patient) => (
											<div
												key={patient.id}
												className="border border-gray-600 rounded-lg p-4 mb-3"
											>
												<div className="flex justify-between items-start">
													<div>
														<h4 className="font-semibold">{patient.name}</h4>
														<p className="text-sm text-gray-400">
															Last Visit: {patient.lastVisit}
														</p>
														<p className="text-sm text-gray-400">
															Condition: {patient.condition}
														</p>
														<p className="text-sm text-gray-400">
															Treatment: {patient.treatment}
														</p>
													</div>
												</div>
											</div>
										));
									})()}
								</div>
							</div>
						</div>
					)}

					{/* Video Call Modal */}
					{showVideoCall && (
						<VideoCall
							roomId={roomId}
							userId="doctor"
							onClose={closeVideoCall}
						/>
					)}
				</main>
			</div>
		</div>
	);
};

export default Doctor_Home;
