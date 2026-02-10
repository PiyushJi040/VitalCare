import React, { useState } from 'react';
import { ArrowLeft, Mic, Volume2, MessageCircle, Search, Bot, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedVoiceHealthAssistant from '../src/components/EnhancedVoiceHealthAssistant';
import VoiceSymptomChecker from '../src/components/VoiceSymptomChecker';

const VoiceFeaturesDemo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chatbot');


  const tabs = [
    { id: 'chatbot', label: 'Voice Chatbot', icon: MessageCircle },
    { id: 'symptom', label: 'Voice Symptom Checker', icon: Search }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Voice Features</h1>
              <p className="text-gray-400">Experience our Web Speech API powered voice features</p>
            </div>
          </div>
          

        </div>



        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-blue-600 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'chatbot' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">AI Health Assistant with Voice</h2>
                <p className="text-gray-400">
                  Chat with our AI health assistant using voice input and get spoken responses. 
                  Click the microphone to speak your questions, and the speaker to hear responses.
                </p>
              </div>
              <EnhancedVoiceHealthAssistant className="max-w-2xl mx-auto" />
            </div>
          )}

          {activeTab === 'symptom' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Voice-Enabled Symptom Checker</h2>
                <p className="text-gray-400">
                  Describe your symptoms using voice input and get preliminary health guidance with spoken feedback.
                </p>
              </div>
              <VoiceSymptomChecker className="max-w-4xl mx-auto" />
            </div>
          )}


        </div>

        {/* Features Overview */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Voice Features Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-white mb-2">Speech Recognition</h3>
              <p className="text-sm text-gray-400">
                Convert your speech to text using browser's built-in Web Speech API. Works in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-white mb-2">Text-to-Speech</h3>
              <p className="text-sm text-gray-400">
                Convert text responses to natural speech. Adjustable rate, pitch, and volume.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-white mb-2">AI Integration</h3>
              <p className="text-sm text-gray-400">
                Seamlessly integrated with AI chatbot and symptom checker for complete voice experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceFeaturesDemo;