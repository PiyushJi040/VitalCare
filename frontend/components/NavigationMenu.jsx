import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Home, Users, Stethoscope, Package, AlertTriangle, Activity, 
  Brain, BarChart3, Menu, X, Wifi, WifiOff, Settings 
} from "lucide-react";

const NavigationMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const menuItems = [
    { path: "/landing", label: "Home", icon: Home, color: "blue" },
    { path: "/patient-dashboard", label: "Patient Portal", icon: Users, color: "green" },
    { path: "/doctor-home", label: "Doctor Portal", icon: Stethoscope, color: "purple" },
    { path: "/pharmacy-dashboard", label: "Pharmacy", icon: Package, color: "orange" },
    { path: "/emergency", label: "Emergency", icon: AlertTriangle, color: "red" },
    { path: "/health-monitor", label: "Health Monitor", icon: Activity, color: "teal" },
    { path: "/symptom-checker", label: "AI Symptom Checker", icon: Brain, color: "indigo" },
    { path: "/analytics", label: "Analytics", icon: BarChart3, color: "pink" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Menu */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TeleMed</h1>
              <p className="text-xs text-gray-500">Healthcare Platform</p>
            </div>
          </div>

          {/* Online Status */}
          <div className={`flex items-center mb-6 p-2 rounded-lg ${
            isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isOnline ? (
              <Wifi className="h-4 w-4 mr-2" />
            ) : (
              <WifiOff className="h-4 w-4 mr-2" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center p-3 rounded-lg text-left transition-all duration-200
                  ${isActive(item.path) 
                    ? `bg-${item.color}-100 text-${item.color}-700 border-r-4 border-${item.color}-500` 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 mr-3 ${
                  isActive(item.path) ? `text-${item.color}-600` : 'text-gray-400'
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/emergency")}
                className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Emergency Call</span>
              </button>
              <button
                onClick={() => navigate("/symptom-checker")}
                className="w-full flex items-center p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Brain className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Check Symptoms</span>
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="absolute bottom-6 left-6 right-6">
            <button className="w-full flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default NavigationMenu;