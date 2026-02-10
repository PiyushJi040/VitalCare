import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff, Database, Trash2 } from "lucide-react";
import offlineStorage from "../src/utils/offlineStorage";

const TestDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageStats, setStorageStats] = useState(null);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    updateStorageStats();
    runAllTests();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateStorageStats = () => {
    setStorageStats(offlineStorage.getStorageStats());
  };

  const runAllTests = () => {
    const tests = {
      offlineStorage: testOfflineStorage(),
      serviceWorker: testServiceWorker(),
      geolocation: testGeolocation(),
      notifications: testNotifications(),
      localStorage: testLocalStorage(),
      indexedDB: testIndexedDB()
    };
    setTestResults(tests);
  };

  const testOfflineStorage = () => {
    try {
      const testData = { test: true, timestamp: Date.now() };
      offlineStorage.setItem('test_item', testData);
      const retrieved = offlineStorage.getItem('test_item');
      offlineStorage.removeItem('test_item');
      return retrieved && retrieved.test === true;
    } catch (error) {
      return false;
    }
  };

  const testServiceWorker = () => {
    return 'serviceWorker' in navigator;
  };

  const testGeolocation = () => {
    return 'geolocation' in navigator;
  };

  const testNotifications = () => {
    return 'Notification' in window;
  };

  const testLocalStorage = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (error) {
      return false;
    }
  };

  const testIndexedDB = () => {
    return 'indexedDB' in window;
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all offline data?')) {
      offlineStorage.clearCache();
      updateStorageStats();
      alert('All offline data cleared!');
    }
  };

  const pages = [
    { name: "Landing Page", path: "/landing", description: "Main entry point" },
    { name: "Patient Dashboard", path: "/patient-dashboard", description: "Patient portal with doctor search" },
    { name: "Doctor Home", path: "/doctor-home", description: "Doctor dashboard with messaging" },
    { name: "Pharmacy Dashboard", path: "/pharmacy-dashboard", description: "Medicine inventory management" },
    { name: "Emergency Dashboard", path: "/emergency", description: "Emergency services with offline support" },
    { name: "Health Monitor", path: "/health-monitor", description: "Vital signs tracking" },
    { name: "AI Symptom Checker", path: "/symptom-checker", description: "AI-powered symptom analysis" },
    { name: "Analytics Dashboard", path: "/analytics", description: "Healthcare analytics and insights" }
  ];

  const TestResult = ({ name, result, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
      <div>
        <div className="flex items-center">
          {result ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
          )}
          <span className="font-medium">{name}</span>
        </div>
        <p className="text-sm text-gray-400 ml-7">{description}</p>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {result ? 'PASS' : 'FAIL'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">System Test Dashboard</h1>
          <p className="text-gray-400">Comprehensive testing of all features and capabilities</p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
              <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <button
              onClick={runAllTests}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Run Tests
            </button>
            <button
              onClick={clearAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Data
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Tests */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Feature Tests</h2>
            <div className="space-y-3">
              <TestResult 
                name="Offline Storage" 
                result={testResults.offlineStorage} 
                description="Local data caching and retrieval"
              />
              <TestResult 
                name="Service Worker" 
                result={testResults.serviceWorker} 
                description="Background sync and offline functionality"
              />
              <TestResult 
                name="Geolocation API" 
                result={testResults.geolocation} 
                description="Location services for emergency features"
              />
              <TestResult 
                name="Notifications API" 
                result={testResults.notifications} 
                description="Push notifications support"
              />
              <TestResult 
                name="Local Storage" 
                result={testResults.localStorage} 
                description="Browser local storage availability"
              />
              <TestResult 
                name="IndexedDB" 
                result={testResults.indexedDB} 
                description="Advanced client-side database"
              />
            </div>
          </div>

          {/* Storage Statistics */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Storage Statistics
            </h2>
            {storageStats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Storage Used:</span>
                  <span className="font-bold">{storageStats.totalSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Items:</span>
                  <span className="font-bold">{storageStats.itemCount}</span>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Storage by Category:</h3>
                  <div className="space-y-2">
                    {storageStats.categories.map((category) => (
                      <div key={category.name} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{category.name}:</span>
                        <div className="flex items-center gap-2">
                          <span>{category.size}</span>
                          <span className="text-gray-400">({category.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">Loading storage statistics...</div>
            )}
          </div>
        </div>

        {/* Page Navigation Tests */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Page Navigation Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <div key={page.path} className="border border-gray-600 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-semibold text-lg mb-2">{page.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{page.description}</p>
                <button
                  onClick={() => navigate(page.path)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Test Page
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Browser Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>User Agent:</span>
                  <span className="text-right text-xs">{navigator.userAgent.substring(0, 50)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span>{navigator.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span>{navigator.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Online:</span>
                  <span>{navigator.onLine ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Screen Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Screen Resolution:</span>
                  <span>{screen.width} x {screen.height}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Size:</span>
                  <span>{screen.availWidth} x {screen.availHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Depth:</span>
                  <span>{screen.colorDepth} bits</span>
                </div>
                <div className="flex justify-between">
                  <span>Pixel Ratio:</span>
                  <span>{window.devicePixelRatio}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;