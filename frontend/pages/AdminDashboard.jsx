import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

import {
	Users,
	Settings,
	BarChart3,
	Shield,
	Database,
	Activity,
	AlertTriangle,
	CheckCircle,
	Clock,
	TrendingUp,
	Server,
	Wifi,
	LogOut,
	ArrowLeft,
	RefreshCw,
	Eye,
	UserCheck,
	FileText,
	Bell,
} from "lucide-react";
import { useEffect } from "react";
import api from "../services/api";

const AdminDashboard = () => {
	const [totalUsers, settotalUsers] = useState("");
	const [totalDoctors, settotalDoctors] = useState("");
	const [totalConsultants, settotalConsultants] = useState("");
	const [totalPatients, setTotalPatients] = useState("");
	const [doctors, setDoctors] = useState([]);
	const [patients, setPatients] = useState([]);
	const [healthAssistants, setHealthAssistants] = useState([]);
	const [showManageModal, setShowManageModal] = useState(null);
	const { t } = useTranslation();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("overview");

	const handleLogout = () => {
		logout();
		toast.success("Logged out successfully");
		navigate("/landing");
	};

	useEffect(() => {
		async function getAllParams() {
			const response = await api.get("/admin/total-users");
			settotalUsers(response.data);
			const response2 = await api.get("/admin/total-doctors");
			settotalDoctors(response2.data);
			const response3 = await api.get("/admin/total-con");
			settotalConsultants(response3.data);
			const response4 = await api.get("/admin/patients");
			setTotalPatients({totalPatients: response4.data.allPatients?.length || 0});
		}
		getAllParams();
	}, []);

	const fetchUsers = async (type) => {
		const response = await api.get(`/admin/${type}`);
		if (type === 'doctors') setDoctors(response.data.allDoctors);
		else if (type === 'patients') setPatients(response.data.allPatients);
		else if (type === 'health-assistants') setHealthAssistants(response.data.allHealthAssistants);
	};

	const deleteUser = async (type, id) => {
		await api.delete(`/admin/${type}/${id}`);
		fetchUsers(type);
		toast.success('User deleted successfully');
	};

	const openManageModal = (type) => {
		fetchUsers(type);
		setShowManageModal(type);
	};

	// Sample data
	const systemStats = {
		totalUsers: 1247,
		activeDoctors: 23,
		activePatients: 156,
		systemUptime: "99.8%",
		totalConsultations: 3421,
		todayConsultations: 47,
	};

	const recentActivities = [
		{
			id: 1,
			type: "user_login",
			message: t('doctorLoggedIn', { name: t('drSarahJohnson').replace('Dr. ', '').replace('डॉ. ', '').replace('ਡਾ. ', '') }),
			time: `2 ${t('minAgo')}`,
		},
		{
			id: 2,
			type: "consultation",
			message: t('newConsultationStarted'),
			time: `5 ${t('minAgo')}`,
		},
		{
			id: 3,
			type: "system",
			message: t('systemBackupCompleted'),
			time: `1 ${t('hourAgo')}`,
		},
		{
			id: 4,
			type: "user_register",
			message: t('newPatientRegistered'),
			time: `2 ${t('hoursAgo')}`,
		},
	];

	const systemHealth = [
		{ name: "Database", status: "healthy", uptime: "99.9%" },
		{ name: "API Server", status: "healthy", uptime: "99.8%" },
		{ name: "Video Service", status: "warning", uptime: "98.5%" },
		{ name: "File Storage", status: "healthy", uptime: "100%" },
	];

	return (
		<div className="min-h-screen bg-gray-900 p-4 md:p-8">
			<GlobalLanguageSelector />
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<header className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<button
							className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-700"
							onClick={() => navigate("/landing")}
						>
							<ArrowLeft className="h-4 w-4" />
							{t('backToHome')}
						</button>
						<div>
							<p className="text-blue-700 text-lg">
								Hello {user?.name || "Admin"},
							</p>
							<h1 className="text-4xl font-bold text-white">
								{t('adminDashboard')}
							</h1>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
							<RefreshCw className="h-4 w-4" /> {t('refresh')}
						</button>

						<button
							className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
							onClick={handleLogout}
						>
							<LogOut className="h-4 w-4" /> {t('logout')}
						</button>
					</div>
				</header>

				{/* Navigation Tabs */}
				<div className="flex space-x-1 mb-8 bg-gray-200 p-1 rounded-lg w-fit">
					{[
						{ id: "overview", label: t('overview'), icon: BarChart3 },
						{ id: "users", label: t('userManagement'), icon: Users },
						{ id: "system", label: t('systemHealth'), icon: Server },
						{ id: "settings", label: t('settings'), icon: Settings },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								activeTab === tab.id
									? "bg-gray-800 text-blue-600 shadow-sm"
									: "text-gray-400 hover:text-white"
							}`}
						>
							<tab.icon className="h-4 w-4" />
							{tab.label}
						</button>
					))}
				</div>

				{/* Overview Tab */}
				{activeTab === "overview" && (
					<div className="space-y-8">
						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-gray-800 rounded-lg shadow p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">{t('totalUsers')}</p>
										<p className="text-3xl font-bold text-white">
											{totalUsers.totalUsers || 0}
										</p>
									</div>
									<div className="bg-blue-100 p-3 rounded-full">
										<Users className="h-6 w-6 text-blue-600" />
									</div>
								</div>
							</div>

							<div className="bg-gray-800 rounded-lg shadow p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">{t('activeDoctors')}</p>
										<p className="text-3xl font-bold text-white">
											{totalDoctors.totalDoctors || 0}
										</p>
									</div>
									<div className="bg-green-100 p-3 rounded-full">
										<UserCheck className="h-6 w-6 text-green-600" />
									</div>
								</div>
							</div>

							<div className="bg-gray-800 rounded-lg shadow p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">
											{t('todaysConsultations')}
										</p>
										<p className="text-3xl font-bold text-white">
											{totalConsultants.totalVisits || 0}
										</p>
									</div>
									<div className="bg-purple-100 p-3 rounded-full">
										<Activity className="h-6 w-6 text-purple-600" />
									</div>
								</div>
							</div>

							<div className="bg-gray-800 rounded-lg shadow p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-400">{t('systemUptime')}</p>
										<p className="text-3xl font-bold text-white">
											{systemStats.systemUptime}
										</p>
									</div>
									<div className="bg-orange-100 p-3 rounded-full">
										<TrendingUp className="h-6 w-6 text-orange-600" />
									</div>
								</div>
							</div>
						</div>

						{/* Recent Activities */}
						<div className="bg-gray-800 rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">{t('recentActivities')}</h2>
							<div className="space-y-4">
								{recentActivities.map((activity) => (
									<div
										key={activity.id}
										className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg"
									>
										<div className="bg-blue-100 p-2 rounded-full">
											<Bell className="h-4 w-4 text-blue-600" />
										</div>
										<div className="flex-1">
											<p className="text-sm text-white">
												{activity.message}
											</p>
											<p className="text-xs text-gray-400">{activity.time}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* User Management Tab */}
				{activeTab === "users" && (
					<div className="bg-gray-800 rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-6">{t('userManagement')}</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="border rounded-lg p-4">
								<h3 className="font-semibold mb-2">{t('doctors')}</h3>
								<p className="text-2xl font-bold text-blue-600">
									{totalDoctors.totalDoctors || 0}
								</p>
								<p className="text-sm text-gray-400">
									{t('activeDoctorsInSystem')}
								</p>
								<button 
									className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
									onClick={() => openManageModal('doctors')}
								>
									{t('manageDoctors')}
								</button>
							</div>

							<div className="border rounded-lg p-4">
								<h3 className="font-semibold mb-2">{t('patients')}</h3>
								<p className="text-2xl font-bold text-green-600">
									{totalPatients.totalPatients || 0}
								</p>
								<p className="text-sm text-gray-400">{t('registeredPatients')}</p>
								<button 
									className="mt-3 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
									onClick={() => openManageModal('patients')}
								>
									{t('managePatients')}
								</button>
							</div>

							<div className="border rounded-lg p-4">
								<h3 className="font-semibold mb-2">{t('healthAssistants')}</h3>
								<p className="text-2xl font-bold text-purple-600">12</p>
								<p className="text-sm text-gray-400">
									{t('activeHealthAssistants')}
								</p>
								<button 
									className="mt-3 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
									onClick={() => openManageModal('health-assistants')}
								>
									{t('manageStaff')}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* System Health Tab */}
				{activeTab === "system" && (
					<div className="space-y-6">
						<div className="bg-gray-800 rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-6">
								{t('systemHealthMonitor')}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{systemHealth.map((service, index) => (
									<div key={index} className="border rounded-lg p-4">
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-semibold">{t(service.name.toLowerCase().replace(' ', ''))}</h3>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													service.status === "healthy"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{t(service.status)}
											</span>
										</div>
										<p className="text-sm text-gray-400">
											{t('uptime')}: {service.uptime}
										</p>
										<div className="mt-2 bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full ${
													service.status === "healthy"
														? "bg-green-500"
														: "bg-yellow-500"
												}`}
												style={{ width: service.uptime }}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="bg-gray-800 rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">{t('systemAlerts')}</h2>
							<div className="space-y-3">
								<div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
									<AlertTriangle className="h-5 w-5 text-yellow-600" />
									<div>
										<p className="text-sm font-medium">
											{t('videoServicePerformance')}
										</p>
										<p className="text-xs text-gray-400">
											{t('videoCallQualityDegraded')}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
									<CheckCircle className="h-5 w-5 text-green-600" />
									<div>
										<p className="text-sm font-medium">
											{t('databaseBackupCompleted')}
										</p>
										<p className="text-xs text-gray-400">
											{t('dailyBackupCompleted')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Settings Tab */}
				{activeTab === "settings" && (
					<div className="bg-gray-800 rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-6">{t('systemSettings')}</h2>
						<div className="space-y-6">
							<div className="border-b pb-4">
								<h3 className="font-semibold mb-2">{t('generalSettings')}</h3>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm">{t('maintenanceMode')}</span>
										<button 
											onClick={() => toast.info('Maintenance mode toggled')}
											className="bg-gray-200 rounded-full w-12 h-6 flex items-center hover:bg-gray-300 transition-colors"
										>
											<div className="bg-gray-800 w-5 h-5 rounded-full shadow transform transition-transform"></div>
										</button>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">{t('autoBackup')}</span>
										<button 
											onClick={() => toast.success('Auto backup is enabled')}
											className="bg-blue-500 rounded-full w-12 h-6 flex items-center justify-end hover:bg-blue-600 transition-colors"
										>
											<div className="bg-gray-800 w-5 h-5 rounded-full shadow transform transition-transform"></div>
										</button>
									</div>
								</div>
							</div>

							<div className="border-b pb-4">
								<h3 className="font-semibold mb-2">{t('securitySettings')}</h3>
								<div className="space-y-3">
									<button 
										onClick={() => toast.success('Security policies updated successfully')}
										className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
									>
										{t('updateSecurityPolicies')}
									</button>
									<button 
										onClick={() => toast.info('Opening access logs...')}
										className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
									>
										{t('viewAccessLogs')}
									</button>
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">{t('dataManagement')}</h3>
								<div className="space-y-3">
									<button 
										onClick={() => toast.success('System data exported successfully')}
										className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
									>
										{t('exportSystemData')}
									</button>
									<button 
										onClick={() => toast.success('Cache cleared successfully')}
										className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
									>
										{t('clearCache')}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* User Management Modal */}
				{showManageModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">Manage {showManageModal}</h3>
								<button onClick={() => setShowManageModal(null)} className="text-gray-400 hover:text-gray-300 text-2xl">×</button>
							</div>
							<div className="overflow-y-auto max-h-96">
								{(() => {
									const users = showManageModal === 'doctors' ? doctors : showManageModal === 'patients' ? patients : healthAssistants;
									return users.map((user) => (
										<div key={user._id} className="flex justify-between items-center p-3 border-b">
											<div>
												<p className="font-semibold">{user.name}</p>
												<p className="text-sm text-gray-400">{user.email}</p>
											</div>
											<button 
												onClick={() => deleteUser(showManageModal, user._id)}
												className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
											>
												Delete
											</button>
										</div>
									));
								})()}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
