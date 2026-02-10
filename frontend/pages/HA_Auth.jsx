import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import login from "../assets/login.jpg";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const HA_Auth = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { login: authLogin } = useAuth();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const result = await authLogin(formData.email, formData.password, "healthAssistant");
		
		if (result.success) {
			navigate("/ha-home");
		} else {
			setError(result.message);
		}
		setLoading(false);
	};

	return (
		<div className="flex min-h-screen bg-gray-900">
			<GlobalLanguageSelector />
			<div className="w-3/5 flex flex-col justify-center items-center p-12">
				<div className="w-full max-w-md">
					<h2 className="text-5xl fairplay font-bold mb-2 text-center text-white">
						{t("Health Assistant login")}
					</h2>
					<p className="text-gray-400 mb-8 text-center">
						{t("enterCredentials")}
					</p>
					
					<div className="bg-gray-800 border border-yellow-500 rounded-lg p-4 mb-6">
						<p className="text-yellow-400 font-semibold mb-2 text-center">Demo Credentials</p>
						<p className="text-gray-300 text-sm"><span className="font-medium">Email:</span> assistant@demo.com</p>
						<p className="text-gray-300 text-sm"><span className="font-medium">Password:</span> assistant123</p>
					</div>
					
					{error && (
						<div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-gray-300 text-sm font-bold mb-2"
							>
								{t("email")}
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="shadow appearance-none border border-gray-600 bg-gray-700 text-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
								placeholder={t("enterEmail")}
								required
							/>
						</div>
						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-gray-300 text-sm font-bold mb-2"
							>
								{t("password")}
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="shadow appearance-none border border-gray-600 bg-gray-700 text-white rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								placeholder={t("enterPassword")}
								required
							/>
							<a href="#" className="text-sm text-blue-400 hover:text-blue-300">
								{t("forgotPassword")}
							</a>
						</div>
						<div className="flex items-center justify-between">
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
								type="submit"
								disabled={loading}
							>
								{loading ? t("signingIn") || "Signing In..." : t("signIn")}
							</button>
						</div>
						<p className="text-center text-gray-400 text-xs mt-4">
							{t("noAccount")}{" "}
							<a href="/ha-signup" className="text-blue-400 hover:text-blue-300">
								{t("signUp")}
							</a>
						</p>
					</form>
				</div>
			</div>
			<div className="w-2/5 bg-cover">
				<img
					src={login}
					alt="Login background"
					className="object-cover w-full h-full"
				/>
			</div>
		</div>
	);
};

export default HA_Auth;
