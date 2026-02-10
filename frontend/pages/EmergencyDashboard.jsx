import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Phone, MapPin, Clock, Heart, Thermometer, Activity, Zap } from "lucide-react";
import offlineStorage from "../src/utils/offlineStorage";

const EmergencyDashboard = () => {
  const { t } = useTranslation();
  const [emergencyType, setEmergencyType] = useState("");
  const [vitals, setVitals] = useState({ heartRate: "", bloodPressure: "", temperature: "" });
  const [location, setLocation] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const emergencyTypes = [
    { id: "cardiac", name: "Cardiac Emergency", icon: Heart, color: "red" },
    { id: "stroke", name: "Stroke", icon: Zap, color: "purple" },
    { id: "breathing", name: "Breathing Difficulty", icon: Activity, color: "blue" },
    { id: "accident", name: "Accident/Trauma", icon: AlertTriangle, color: "orange" },
    { id: "fever", name: "High Fever", icon: Thermometer, color: "yellow" },
    { id: "other", name: "Other Emergency", icon: AlertTriangle, color: "gray" }
  ];

  const handleEmergencyCall = () => {
    const emergencyData = {
      type: emergencyType,
      vitals,
      location,
      timestamp: new Date().toISOString(),
      status: "pending"
    };

    // Store offline if needed
    if (isOffline) {
      offlineStorage.setItem(`emergency_${Date.now()}`, emergencyData);
      alert("Emergency request saved offline. Will be sent when connection is restored.");
    } else {
      // In real app, this would call emergency services API
      console.log("Emergency call initiated:", emergencyData);
      alert("Emergency services have been notified!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
            <h1 className="text-3xl font-bold">EMERGENCY</h1>
            <p className="text-red-100">Immediate Medical Assistance</p>
          </div>
          
          {isOffline && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>Offline Mode:</strong> Emergency data will be saved and sent when connection is restored.
            </div>
          )}
        </header>

        {/* Quick Emergency Call */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <div className="text-center">
            <button 
              onClick={() => window.open('tel:108')}
              className="bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              <Phone className="h-8 w-8 inline mr-3" />
              CALL 108
            </button>
            <p className="text-gray-300 mt-2">For immediate life-threatening emergencies</p>
          </div>
        </div>

        {/* Emergency Type Selection */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Select Emergency Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {emergencyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setEmergencyType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  emergencyType === type.id 
                    ? `border-${type.color}-500 bg-${type.color}-50` 
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                }`}
              >
                <type.icon className={`h-8 w-8 mx-auto mb-2 text-${type.color}-600`} />
                <p className="text-sm font-medium text-gray-300">{type.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Current Vital Signs (if known)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Heart Rate (BPM)</label>
              <input
                type="number"
                value={vitals.heartRate}
                onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg"
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Blood Pressure</label>
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg"
                placeholder="e.g., 120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Temperature (°F)</label>
              <input
                type="number"
                value={vitals.temperature}
                onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg"
                placeholder="e.g., 98.6"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Location</h2>
          <div className="flex items-center text-gray-300">
            <MapPin className="h-5 w-5 mr-2" />
            {location ? (
              <span>Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            ) : (
              <span>Getting location...</span>
            )}
          </div>
        </div>

        {/* Submit Emergency Request */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <button
            onClick={handleEmergencyCall}
            disabled={!emergencyType}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg"
          >
            <AlertTriangle className="h-6 w-6 inline mr-2" />
            REQUEST EMERGENCY ASSISTANCE
          </button>
          <p className="text-center text-gray-300 mt-2">
            This will notify emergency services and nearby medical facilities
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;