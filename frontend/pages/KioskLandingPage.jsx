// src/components/KioskLandingPage.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Heart,
	Bell,
	MapPin,
	Users,
	Stethoscope,
	UserCog,
	Package,
	User,
	ShieldCheck,
	AlertTriangle,
	Activity,
	Brain,
	BarChart3,
	TestTube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- DATA FOR DYNAMIC RENDERING ---
// This makes the component easier to manage and update.
const getStatsData = (t) => [
	{ icon: MapPin, value: "173", label: t("villagesServed") },
	{ icon: Users, value: "1000+", label: t("patientsHelped") },
	{ icon: Heart, value: "24/7", label: t("doctorAvailability") },
];

const getRolesData = (t) => [
	{
		icon: UserCog,
		title: t("healthAssistant"),
		description: t("healthAssistantDesc"),
		role: "health-assistant",
	},
	{
		icon: Stethoscope,
		title: t("doctor"),
		description: t("doctorDesc"),
		role: "doctor",
	},
	{
		icon: Package,
		title: t("pharmacyManager"),
		description: t("pharmacyManagerDesc"),
		role: "pharmacy",
	},
	{
		icon: ShieldCheck,
		title: t("admin"),
		description: t("adminDesc"),
		role: "admin",
	},
	{
		icon: User,
		title: t("patient"),
		description: t("patientDesc"),
		role: "patient",
	},
];
// --- END DATA ---

const KioskLandingPage = ({ onSelectRole }) => {
	const { t } = useTranslation();
	const [activeLang, setActiveLang] = useState("EN");
	const statsData = getStatsData(t);
	const rolesData = getRolesData(t);
	const navigate = useNavigate();
	// Placeholder function to demonstrate functionality
	const handleRoleSelect = (role) => {
		if (role === "health-assistant") {
			navigate("/ha-auth");
		} else if (role === "doctor") {
			navigate("/doctor-auth");
		} else if (role === "pharmacy") {
			navigate("/pharmacy-auth");
		} else if (role === "admin") {
			navigate("/admin-login");
		} else if (role === "patient") {
			navigate("/patient-login");
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center relative justify-center p-8">
			<div className="w-full max-w-6xl mx-auto">
				{/* Header Section */}
				<header className=" text-center mb-12">
					{/* Top Right Controls */}

					<div className="flex items-center mt-14 justify-center gap-3">
						<Heart className="h-12 w-12 text-blue-600" />
						<h1 className="fairplay font-bold text-5xl text-slate-800">
							{t("nabhaTelemedicineKiosk")}
						</h1>
					</div>
					<p className="mt-2 text-lg text-slate-600">
						{t("connectingRuralHealthcare")}
					</p>
					<p className="text-md text-slate-500">{t("servingVillages")}</p>
				</header>

				{/* Stats Cards Section */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
					{statsData.map((stat, index) => (
						<div
							key={index}
							className="bg-gray-800 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center"
						>
							<stat.icon className="h-8 w-8 text-blue-600 mb-3" />
							<p className="text-2xl font-bold text-slate-800">{stat.value}</p>
							<p className="text-slate-500">{stat.label}</p>
						</div>
					))}
				</section>

				{/* Role Selection Section */}
				<main className="text-center">
					<h2 className="fairplay font-bold text-4xl text-slate-800 mb-8">
						{t("selectYourRole")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
						{rolesData.map((role, index) => (
							<button
								key={index}
								onClick={() => handleRoleSelect(role.role)}
								className="group bg-gray-800 rounded-2xl shadow-sm border border-slate-200 p-8 text-center transition-all duration-300 hover:shadow-xl hover:border-blue-400 hover:-translate-y-2"
							>
								<div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full transition-all duration-300 group-hover:bg-blue-600">
									<role.icon className="h-10 w-10 text-blue-600 transition-all duration-300 group-hover:text-white" />
								</div>
								<h3 className="text-2xl font-semibold text-slate-800 mb-2">
									{role.title}
								</h3>
								<p className="text-slate-500">{role.description}</p>
							</button>
						))}
					</div>

					{/* Quick Access Features */}
					<section className="mt-16">
						<h3 className="text-2xl font-bold text-slate-800 mb-8">Quick Access Features</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<button
								onClick={() => navigate('/emergency')}
								className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl p-6 transition-all duration-300 hover:scale-105"
							>
								<AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
								<p className="font-semibold text-red-800">Emergency</p>
							</button>
							<button
								onClick={() => navigate('/health-monitor')}
								className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl p-6 transition-all duration-300 hover:scale-105"
							>
								<Activity className="h-8 w-8 text-green-600 mx-auto mb-3" />
								<p className="font-semibold text-green-800">Health Monitor</p>
							</button>
							<button
								onClick={() => navigate('/symptom-checker')}
								className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl p-6 transition-all duration-300 hover:scale-105"
							>
								<Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
								<p className="font-semibold text-purple-800">AI Symptom Checker</p>
							</button>
							<button
								onClick={() => navigate('/test')}
								className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl p-6 transition-all duration-300 hover:scale-105"
							>
								<TestTube className="h-8 w-8 text-blue-600 mx-auto mb-3" />
								<p className="font-semibold text-blue-800">System Test</p>
							</button>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
};

export default KioskLandingPage;
