import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const AdminLogin = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// On success, navigate to admin dashboard
			navigate("/admin-dashboard");
		} catch {
			setErrors({ general: "Login failed. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
			<GlobalLanguageSelector />
			<div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-900 rounded-full">
						<ShieldCheck className="h-8 w-8 text-blue-400" />
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">
						{t("adminLogin")}
					</h1>
					<p className="text-gray-400">{t("adminLoginDesc")}</p>
				</div>

				<div className="bg-gray-700 border border-blue-500 rounded-lg p-4 mb-6">
					<p className="text-blue-400 font-semibold mb-2 text-center">Demo Credentials</p>
					<p className="text-gray-300 text-sm"><span className="font-medium">Email:</span> admin@demo.com</p>
					<p className="text-gray-300 text-sm"><span className="font-medium">Password:</span> admin123</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							{t("email")}
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white ${
								errors.email
									? "border-red-500 focus:ring-red-500"
									: "border-gray-600"
							}`}
							placeholder={t("enterEmail")}
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">{errors.email}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							{t("password")}
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={`w-full px-4 py-3 pr-12 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white ${
									errors.password
										? "border-red-500 focus:ring-red-500"
										: "border-gray-600"
								}`}
								placeholder={t("enterPassword")}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">{errors.password}</p>
						)}
					</div>

					{errors.general && (
						<div className="bg-red-900 border border-red-500 rounded-lg p-3">
							<p className="text-sm text-red-200">{errors.general}</p>
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? t("loggingIn") : t("login")}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-400">
						{t("dontHaveAccount")}{" "}
						<Link
							to="/admin-signup"
							className="text-blue-400 hover:text-blue-300 font-medium"
						>
							{t("signUp")}
						</Link>
					</p>
				</div>

				<div className="mt-4 text-center">
					<Link
						to="/landing"
						className="text-gray-500 hover:text-gray-400 text-sm"
					>
						{t("backToHome")}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
