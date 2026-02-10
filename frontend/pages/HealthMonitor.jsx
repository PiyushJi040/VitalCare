import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Activity, Thermometer, Droplets, Eye, Scale, TrendingUp, Calendar, Wifi, WifiOff } from "lucide-react";
import offlineStorage from "../src/utils/offlineStorage";

const HealthMonitor = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [healthData, setHealthData] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    weight: "",
    bloodSugar: "",
    oxygenLevel: ""
  });
  const [healthHistory, setHealthHistory] = useState([]);
  const [syncStatus, setSyncStatus] = useState("synced");

  useEffect(() => {
    // Load offline data
    const savedData = offlineStorage.getItem('health_history') || [];
    setHealthHistory(savedData);

    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineData = async () => {
    setSyncStatus("syncing");
    // Simulate API sync
    setTimeout(() => {
      setSyncStatus("synced");
    }, 2000);
  };

  const saveHealthData = () => {
    const newEntry = {
      id: Date.now(),
      ...healthData,
      timestamp: new Date().toISOString(),
      synced: isOnline
    };

    const updatedHistory = [newEntry, ...healthHistory];
    setHealthHistory(updatedHistory);
    
    // Save offline
    offlineStorage.setItem('health_history', updatedHistory);
    
    if (!isOnline) {
      offlineStorage.setItem(`health_entry_${newEntry.id}`, newEntry);
    }

    // Reset form
    setHealthData({
      heartRate: "",
      bloodPressure: "",
      temperature: "",
      weight: "",
      bloodSugar: "",
      oxygenLevel: ""
    });
  };

  const getVitalStatus = (vital, value) => {
    const ranges = {
      heartRate: { normal: [60, 100], unit: "BPM" },
      temperature: { normal: [97, 99], unit: "°F" },
      oxygenLevel: { normal: [95, 100], unit: "%" },
      bloodSugar: { normal: [70, 140], unit: "mg/dL" }
    };

    if (!ranges[vital] || !value) return { status: "unknown", color: "gray" };
    
    const numValue = parseFloat(value);
    const [min, max] = ranges[vital].normal;
    
    if (numValue >= min && numValue <= max) {
      return { status: "normal", color: "green" };
    } else {
      return { status: "abnormal", color: "red" };
    }
  };

  const healthMetrics = [
    { key: "heartRate", label: "Heart Rate", icon: Heart, placeholder: "e.g., 72" },
    { key: "bloodPressure", label: "Blood Pressure", icon: Activity, placeholder: "e.g., 120/80" },
    { key: "temperature", label: "Temperature", icon: Thermometer, placeholder: "e.g., 98.6" },
    { key: "weight", label: "Weight (lbs)", icon: Scale, placeholder: "e.g., 150" },
    { key: "bloodSugar", label: "Blood Sugar", icon: Droplets, placeholder: "e.g., 100" },
    { key: "oxygenLevel", label: "Oxygen Level", icon: Activity, placeholder: "e.g., 98" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">Health Monitor</h1>
              <p className="text-gray-300 mt-2">Track your vital signs and health metrics</p>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-5 w-5 mr-1" />
                  <span className="text-sm">Online</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <WifiOff className="h-5 w-5 mr-1" />
                  <span className="text-sm">Offline</span>
                </div>
              )}
              {syncStatus === "syncing" && (
                <div className="text-blue-600 text-sm">Syncing...</div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Entry Form */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-white">Record New Measurements</h2>
            <div className="space-y-4">
              {healthMetrics.map((metric) => (
                <div key={metric.key}>
                  <label className="block text-sm font-medium mb-2 flex items-center text-gray-300">
                    <metric.icon className="h-4 w-4 mr-2 text-blue-600" />
                    {metric.label}
                  </label>
                  <input
                    type="text"
                    value={healthData[metric.key]}
                    onChange={(e) => setHealthData({...healthData, [metric.key]: e.target.value})}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={metric.placeholder}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={saveHealthData}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Measurements
            </button>
          </div>

          {/* Recent History */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-white">Recent Measurements</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {healthHistory.slice(0, 10).map((entry) => (
                <div key={entry.id} className="border border-gray-600 bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-300">
                      {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center">
                      {!entry.synced && (
                        <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Pending Sync
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(entry).map(([key, value]) => {
                      if (!value || key === 'id' || key === 'timestamp' || key === 'synced') return null;
                      const status = getVitalStatus(key, value);
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className={`font-medium text-${status.color}-600`}>
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {healthHistory.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No measurements recorded yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Trends */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2" />
            Health Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{healthHistory.length}</div>
              <div className="text-gray-300">Total Measurements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {healthHistory.filter(h => !h.synced).length}
              </div>
              <div className="text-gray-300">Pending Sync</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {new Set(healthHistory.map(h => new Date(h.timestamp).toDateString())).size}
              </div>
              <div className="text-gray-300">Days Tracked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitor;