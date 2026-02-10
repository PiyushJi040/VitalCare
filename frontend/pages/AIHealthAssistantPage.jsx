import React from 'react';
import { ArrowLeft, Bot, Mic, Volume2, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EnhancedVoiceHealthAssistant from '../src/components/EnhancedVoiceHealthAssistant';
import LanguageSelector from '../components/LanguageSelector';


const AIHealthAssistantPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/ha-home')}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Bot className="h-8 w-8 text-blue-600" />
                {t('aiHealthAssistant')}
              </h1>
              <p className="text-gray-400">
                {t('voiceEnabled')} • Multi-language Support • Powered by Gemini AI
              </p>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Features Overview */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-white mb-2">Voice Input</h3>
              <p className="text-sm text-gray-400">
                Speak your health questions in English, Hindi, or Punjabi
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-white mb-2">Text-to-Speech</h3>
              <p className="text-sm text-gray-400">
                Listen to responses in your preferred language
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Languages className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-white mb-2">Multi-language</h3>
              <p className="text-sm text-gray-400">
                Switch between English, Hindi (हिंदी), and Punjabi (ਪੰਜਾਬੀ)
              </p>
            </div>
          </div>
        </div>



        {/* AI Assistant */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">
              Chat with AI Health Assistant
            </h2>
            <p className="text-gray-400">
              Ask about symptoms, get health advice, or request to connect with a doctor. 
              Use the microphone button to speak or type your questions.
            </p>
          </div>
          
          <EnhancedVoiceHealthAssistant className="w-full" />
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Voice Input:</h4>
              <ul className="space-y-1">
                <li>• Click the microphone button</li>
                <li>• Speak clearly in your preferred language</li>
                <li>• Wait for the message to be processed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Language Switching:</h4>
              <ul className="space-y-1">
                <li>• Use the language selector in the header</li>
                <li>• Or click the quick switch buttons (EN/HI/PA)</li>
                <li>• Voice recognition adapts automatically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only. 
            For medical emergencies or serious health concerns, please consult with a qualified healthcare professional 
            or contact emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistantPage;