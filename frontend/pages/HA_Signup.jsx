import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Users } from "lucide-react";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const HA_Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/ha-auth");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <GlobalLanguageSelector />
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-900 rounded-full">
            <Users className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Health Assistant Signup</h1>
          <p className="text-gray-400">Create health assistant account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/ha-auth" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HA_Signup;
