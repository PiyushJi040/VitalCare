import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, X, Brain, AlertTriangle, CheckCircle, Clock, Wifi, WifiOff } from "lucide-react";
import offlineStorage from "../src/utils/offlineStorage";

const SymptomChecker = () => {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedAnalyses, setSavedAnalyses] = useState([]);

  const commonSymptoms = [
    "Fever", "Headache", "Cough", "Sore throat", "Runny nose", "Body aches",
    "Fatigue", "Nausea", "Vomiting", "Diarrhea", "Stomach pain", "Chest pain",
    "Shortness of breath", "Dizziness", "Rash", "Joint pain", "Back pain",
    "Difficulty sleeping", "Loss of appetite", "Weight loss", "Swelling",
    "Blurred vision", "Ear pain", "Constipation", "Frequent urination"
  ];

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom)
  );

  useEffect(() => {
    // Load saved analyses
    const saved = offlineStorage.getItem('symptom_analyses') || [];
    setSavedAnalyses(saved);

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addSymptom = (symptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setSearchTerm("");
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real app, this would call an AI service)
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(selectedSymptoms);
      setAnalysis(mockAnalysis);
      
      // Save analysis offline
      const analysisRecord = {
        id: Date.now(),
        symptoms: selectedSymptoms,
        analysis: mockAnalysis,
        timestamp: new Date().toISOString(),
        synced: isOnline
      };
      
      const updatedAnalyses = [analysisRecord, ...savedAnalyses];
      setSavedAnalyses(updatedAnalyses);
      offlineStorage.setItem('symptom_analyses', updatedAnalyses);
      
      if (!isOnline) {
        offlineStorage.setItem(`analysis_${analysisRecord.id}`, analysisRecord);
      }
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockAnalysis = (symptoms) => {
    // Simple rule-based analysis for demo
    const feverSymptoms = ["fever", "headache", "body aches", "fatigue"];
    const coldSymptoms = ["runny nose", "sore throat", "cough"];
    const digestiveSymptoms = ["nausea", "vomiting", "diarrhea", "stomach pain"];
    
    const lowerSymptoms = symptoms.map(s => s.toLowerCase());
    
    let possibleConditions = [];
    let urgency = "low";
    let recommendations = [];
    
    if (feverSymptoms.some(s => lowerSymptoms.includes(s))) {
      possibleConditions.push({ name: "Viral Infection", probability: 75 });
      recommendations.push("Rest and stay hydrated");
      recommendations.push("Monitor temperature");
      if (lowerSymptoms.includes("fever")) urgency = "medium";
    }
    
    if (coldSymptoms.some(s => lowerSymptoms.includes(s))) {
      possibleConditions.push({ name: "Common Cold", probability: 65 });
      recommendations.push("Use throat lozenges");
      recommendations.push("Drink warm liquids");
    }
    
    if (digestiveSymptoms.some(s => lowerSymptoms.includes(s))) {
      possibleConditions.push({ name: "Gastroenteritis", probability: 60 });
      recommendations.push("Stay hydrated with clear fluids");
      recommendations.push("Eat bland foods");
      urgency = "medium";
    }
    
    if (lowerSymptoms.includes("chest pain") || lowerSymptoms.includes("shortness of breath")) {
      urgency = "high";
      recommendations.push("Seek immediate medical attention");
    }
    
    if (possibleConditions.length === 0) {
      possibleConditions.push({ name: "General Malaise", probability: 40 });
      recommendations.push("Monitor symptoms");
      recommendations.push("Rest and maintain good nutrition");
    }
    
    return {
      possibleConditions,
      urgency,
      recommendations,
      disclaimer: "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation."
    };
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high": return "red";
      case "medium": return "yellow";
      default: return "green";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center">
                <Brain className="h-10 w-10 mr-3 text-purple-600" />
                AI Symptom Checker
              </h1>
              <p className="text-gray-300 mt-2">Get preliminary health insights based on your symptoms</p>
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
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Selection */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Select Your Symptoms</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Selected Symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Symptoms */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => addSymptom(symptom)}
                  className="w-full text-left p-2 hover:bg-gray-700 rounded-lg flex items-center justify-between text-gray-300"
                >
                  <span>{symptom}</span>
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>

            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className="w-full mt-6 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-medium flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>

          {/* Analysis Results */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Analysis Results</h2>
            
            {analysis ? (
              <div className="space-y-6">
                {/* Urgency Level */}
                <div className={`p-4 rounded-lg border-l-4 border-${getUrgencyColor(analysis.urgency)}-500 bg-${getUrgencyColor(analysis.urgency)}-50`}>
                  <div className="flex items-center">
                    {analysis.urgency === "high" ? (
                      <AlertTriangle className={`h-5 w-5 mr-2 text-${getUrgencyColor(analysis.urgency)}-600`} />
                    ) : (
                      <CheckCircle className={`h-5 w-5 mr-2 text-${getUrgencyColor(analysis.urgency)}-600`} />
                    )}
                    <span className={`font-medium text-${getUrgencyColor(analysis.urgency)}-800 capitalize`}>
                      {analysis.urgency} Priority
                    </span>
                  </div>
                </div>

                {/* Possible Conditions */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Possible Conditions:</h3>
                  <div className="space-y-2">
                    {analysis.possibleConditions.map((condition, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                        <span className="text-gray-300">{condition.name}</span>
                        <span className="text-sm text-gray-400">{condition.probability}% match</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Recommendations:</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    {analysis.disclaimer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select symptoms and click "Analyze" to get AI-powered insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Previous Analyses */}
        {savedAnalyses.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Previous Analyses</h2>
            <div className="space-y-4">
              {savedAnalyses.slice(0, 5).map((record) => (
                <div key={record.id} className="border border-gray-600 bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-300">
                      {new Date(record.timestamp).toLocaleDateString()} at{" "}
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </div>
                    {!record.synced && (
                      <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Offline
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Symptoms:</strong> {record.symptoms.join(", ")}
                  </div>
                  <div className="text-sm mt-1">
                    <strong>Top Condition:</strong> {record.analysis.possibleConditions[0]?.name} 
                    ({record.analysis.possibleConditions[0]?.probability}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;