import React from "react";
import { useTranslation } from "react-i18next";
import {
	ArrowLeft,
	RefreshCw,
	Bell,
	Users,
	Video,
	CheckCircle,
	UserPlus,
	Users as UsersIcon,
	Circle,
	LogOut,
	Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const HA_Home = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		toast.success("Logged out successfully");
		navigate("/landing");
	};
	return (
		<div className="min-h-screen p-4 lg:p-8">
			<GlobalLanguageSelector />
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<button className="flex items-center gap-2 text-gray-300 border border-gray-600 p-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
						<ArrowLeft className="w-5 h-5" />
						{t('backToHome')}
					</button>
					<h1 className="text-3xl fairplay font-semibold text-white">
						{t('healthAssistantDashboard')}
					</h1>
				</div>

				<div className="flex items-center gap-4">
					<span className="text-sm text-gray-400">{t('lastUpdated')}: 51s {t('ago')}</span>
					<button className="flex items-center gap-2 text-gray-300 hover:text-white">
						<RefreshCw className="w-4 h-4" />
						{t('refresh')}
					</button>
					<div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
						<Circle className="w-2 h-2 fill-current" />
						{t('connected')}
					</div>
					<div className="relative">
						<Bell className="w-5 h-5 text-gray-300" />
						<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
							9+
						</span>
					</div>
					<button 
						className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
						onClick={handleLogout}
					>
						<LogOut className="w-4 h-4" /> Logout
					</button>
				</div>
			</div>

			{/* Stats Cards Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{/* Card Template */}
				{[
					{
						icon: Users,
						value: 1,
						label: t('patientsWaiting'),
					},
					{
						icon: Video,
						value: 1,
						label: t('activeConsultations'),
					},
					{
						icon: CheckCircle,
						value: 0,
						label: t('completedToday'),
					},
				].map((item, index) => (
					<div
						key={index}
						className="bg-gray-800 rounded-xl p-6 border border-gray-600 hover:border-blue-500 hover:shadow-md transition-all"
					>
						<div className="flex items-center justify-between">
							<div className="bg-blue-50 rounded-full p-3">
								<item.icon className="w-6 h-6 text-blue-600" />
							</div>
							<div className="text-right">
								<div className="text-3xl font-bold text-white">
									{item.value}
								</div>
								<div className="text-gray-300 text-sm">{item.label}</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Action Cards Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{/* Register New Patient */}
				<div
					onClick={() => navigate("/ha-register")}
					className="bg-gray-800 rounded-xl  p-8 border border-gray-600 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
				>
					<div className="flex flex-col items-center text-center">
						<div className="bg-blue-600 rounded-full p-4 mb-6">
							<UserPlus className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl fairplay font-bold text-white mb-4">
							{t('registerNewPatient')}
						</h3>
						<p className="text-gray-300 leading-relaxed">
							{t('addNewPatientDesc')}
						</p>
					</div>
				</div>

				{/* Manage Patient Queue */}
				<div
					onClick={() => navigate("/ha-patient-queue")}
					className="bg-gray-800 rounded-xl p-8 border border-gray-600 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
				>
					<div className="flex flex-col items-center text-center">
						<div className="bg-blue-600 rounded-full p-4 mb-6">
							<UsersIcon className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl fairplay font-bold text-white mb-4">
							{t('managePatientQueue')}
						</h3>
						<p className="text-gray-300 leading-relaxed">
							{t('manageQueueDesc')}
						</p>
					</div>
				</div>

				{/* AI Health Assistant */}
				<div
					onClick={() => navigate("/ai-health-assistant")}
					className="bg-gray-800 rounded-xl p-8 border border-gray-600 hover:shadow-lg hover:border-green-500 transition-all cursor-pointer"
				>
					<div className="flex flex-col items-center text-center">
						<div className="bg-green-600 rounded-full p-4 mb-6">
							<Bot className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl fairplay font-bold text-white mb-4">
							{t('aiHealthAssistant')}
						</h3>
						<p className="text-gray-300 leading-relaxed">
							Voice-enabled AI assistant for health queries and patient guidance
						</p>
					</div>
				</div>
			</div>

			{/* Recent Activity Section */}
			<div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
				<h3 className="text-xl fairplay font-bold text-white mb-6">
					{t('recentActivity')}
				</h3>

				{/* Activity Item */}
				<div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700">
					<div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
					<div className="flex-1">
						<div className="font-semibold text-white">Sunita Devi</div>
						<div className="text-gray-300 text-sm">
							Ghanar - Stomach pain and nausea
						</div>
					</div>
					<div className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm">
						{t('inConsultation')}
					</div>
				</div>
				{/* Add more activity items here as needed */}
			</div>
		</div>
	);
};

export default HA_Home;
