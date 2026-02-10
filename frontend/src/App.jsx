import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/authContext";
import HA_Home from "../pages/HA_Home";
import HA_RegisterNewPatient from "../pages/HA_RegisterNewPatient";
import HA_PatientQueue from "../pages/HA_PatientQueue";
import HA_DoctorSelection from "../pages/HA_DoctorSelection";
import Doctor_Home from "../pages/Doctor_Home";
import SimpleKioskLanding from "../pages/SimpleKioskLanding";
import HA_Auth from "../pages/HA_Auth";
import Doctor_Auth from "../pages/Doctor_Auth";
import AdminLogin from "../pages/AdminLogin";
import AdminSignup from "../pages/AdminSignup";
import AdminDashboard from "../pages/AdminDashboard";
import PatientLogin from "../pages/PatientLogin";
import PatientSignup from "../pages/PatientSignup";
import PatientDashboard from "../pages/PatientDashboard";
import PharmacyLogin from "../pages/PharmacyLogin";
import PharmacySignup from "../pages/PharmacySignup";
import PharmacyDashboard from "../pages/PharmacyDashboard";
import DoctorSignup from "../pages/DoctorSignup";
import HA_Signup from "../pages/HA_Signup";
import EmergencyDashboard from "../pages/EmergencyDashboard";
import HealthMonitor from "../pages/HealthMonitor";
import SymptomChecker from "../pages/SymptomChecker";
import AIAnalysisPage from "../pages/AIAnalysisPage";

const ProtectedLanding = () => {
	const { user } = useAuth();
	return user ? <Navigate to={user.role === 'doctor' ? '/doctor-home' : '/ha-home'} replace /> : <SimpleKioskLanding />;
};

const AppContent = () => {
	return (
		<div>
			<Routes>
				<Route path="/ha-home" element={<HA_Home />} />
				<Route path="/ha-auth" element={<HA_Auth />} />
				<Route path="/ha-signup" element={<HA_Signup />} />
				<Route path="/ha-register" element={<HA_RegisterNewPatient />} />
				<Route path="/ha-patient-queue" element={<HA_PatientQueue />} />
				<Route path="/ha-doctor-selection" element={<HA_DoctorSelection />} />
				<Route path="/doctor-home" element={<Doctor_Home />} />
				<Route path="/landing" element={<ProtectedLanding />} />
				<Route path="/ha-auth" element={<HA_Auth />} />
				<Route path="/doctor-auth" element={<Doctor_Auth />} />
				<Route path="/doctor-signup" element={<DoctorSignup />} />
				<Route path="/admin-login" element={<AdminLogin />} />
				<Route path="/admin-signup" element={<AdminSignup />} />
				<Route path="/admin-dashboard" element={<AdminDashboard />} />
				<Route path="/patient-login" element={<PatientLogin />} />
				<Route path="/patient-signup" element={<PatientSignup />} />
				<Route path="/patient-dashboard" element={<PatientDashboard />} />
				<Route path="/pharmacy-login" element={<PharmacyLogin />} />
				<Route path="/pharmacy-signup" element={<PharmacySignup />} />
				<Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
				<Route path="/emergency" element={<EmergencyDashboard />} />
				<Route path="/health-monitor" element={<HealthMonitor />} />
				<Route path="/symptom-checker" element={<SymptomChecker />} />
				<Route path="/ai-analysis" element={<AIAnalysisPage />} />
				<Route path="/" element={<Navigate to="/landing" replace />} />
			</Routes>
		</div>
	);
};

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;