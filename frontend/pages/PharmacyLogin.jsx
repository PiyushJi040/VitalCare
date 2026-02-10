import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/authContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import LanguageSelector from "../components/LanguageSelector";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const PharmacyLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password, "pharmacyManager");
      if (result.success) {
        toast.success(t("loginSuccess"));
        navigate("/pharmacy-dashboard");
      } else {
        toast.error(result.message || t("loginFailed"));
      }
    } catch (error) {
      toast.error(t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <GlobalLanguageSelector />
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t("pharmacyLogin")}</h2>
        
        <div className="bg-gray-700 border border-purple-500 rounded-lg p-4 mb-6">
          <p className="text-purple-400 font-semibold mb-2 text-center">Demo Credentials</p>
          <p className="text-gray-300 text-sm"><span className="font-medium">Email:</span> pharmacy@demo.com</p>
          <p className="text-gray-300 text-sm"><span className="font-medium">Password:</span> pharmacy123</p>
        </div>
        
        <label className="block mb-2 font-semibold text-gray-300">{t("email")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-4"
          placeholder={t("enterEmail")}
        />
        <label className="block mb-2 font-semibold text-gray-300">{t("password")}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-6"
          placeholder={t("enterPassword")}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? t("loading") : t("login")}
        </button>
      </form>
    </div>
  );
};

export default PharmacyLogin;
