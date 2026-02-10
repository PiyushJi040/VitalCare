import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Volume2, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import VoiceAssistant from './VoiceAssistant';
import api from '../../services/api';

const EnhancedVoiceHealthAssistant = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const getWelcomeMessage = () => {
    switch (selectedLanguage) {
      case 'hi':
        return "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आप मुझसे टाइप या बोलकर बात कर सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूँ?";
      case 'pa':
        return "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਨਾਲ ਟਾਈਪ ਕਰਕੇ ਜਾਂ ਬੋਲ ਕੇ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?";
      default:
        return "Hello! I'm your AI health assistant. You can type or speak to me. How can I help you today?";
    }
  };

  useEffect(() => {
    setMessages([{
      id: 1,
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [selectedLanguage]);

  // Listen for global language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = i18n.language;
      if (newLang !== selectedLanguage) {
        setSelectedLanguage(newLang);
      }
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [selectedLanguage, i18n]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const handleVoiceInput = (transcript) => {
    setInputMessage(transcript);
    setTimeout(() => handleSendMessage(transcript), 500);
  };

  const getLocalResponse = (message, language) => {
    const msg = message.toLowerCase();
    const symptoms = [];
    
    // Detect multiple symptoms
    const hasFever = msg.includes('fever') || msg.includes('bukhar') || msg.includes('बुखार') || msg.includes('ਬੁਖਾਰ');
    const hasHeadache = msg.includes('headache') || msg.includes('head') || msg.includes('sir') || msg.includes('सिर') || msg.includes('ਸਿਰ');
    const hasCough = msg.includes('cough') || msg.includes('khansi') || msg.includes('खांसी') || msg.includes('ਖੰਘ');
    const hasRash = msg.includes('rash') || msg.includes('skin') || msg.includes('itch') || msg.includes('dane') || msg.includes('दाने') || msg.includes('खुजली') || msg.includes('ਦਾਣੇ') || msg.includes('ਖੁਜਲੀ');
    const hasVomiting = msg.includes('vomit') || msg.includes('nausea') || msg.includes('ulti') || msg.includes('उल्टी') || msg.includes('ਉਲਟੀ');
    
    if (language === 'hi') {
      let response = 'आपके लक्षणों के आधार पर:\n\n';
      
      if (hasFever) response += '• बुखार: आराम करें, पानी पिएं, 101°F से अधिक हो तो डॉक्टर से मिलें\n';
      if (hasHeadache) response += '• सिरदर्द: अंधेरे कमरे में आराम, पानी पिएं, तनाव कम करें\n';
      if (hasCough) response += '• खांसी: गर्म पानी, शहद, भाप लें, धूम्रपान से बचें\n';
      if (hasRash) response += '• दाने/खुजली: ठंडे पानी से नहाएं, सूती कपड़े, खुजली न करें\n';
      if (hasVomiting) response += '• उल्टी: थोड़ा-थोड़ा पानी, अदरक चाय, हल्का खाना\n';
      
      if (hasFever || hasHeadache || hasCough || hasRash || hasVomiting) {
        response += '\nयदि लक्षण बिगड़ते रहें या गंभीर हों तो तुरंत डॉक्टर से सलाह लें।';
        return response;
      }
      return 'मैं आपका AI स्वास्थ्य सहायक हूं। कृपया अपने लक्षणों के बारे में बताएं।';
    }
    
    if (language === 'pa') {
      let response = 'ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ ਤੇ:\n\n';
      
      if (hasFever) response += '• ਬੁਖਾਰ: ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ, 101°F ਤੋਂ ਵੱਧ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ\n';
      if (hasHeadache) response += '• ਸਿਰ ਦਰਦ: ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ, ਪਾਣੀ ਪੀਓ, ਤਣਾਅ ਘਟਾਓ\n';
      if (hasCough) response += '• ਖੰਘ: ਗਰਮ ਪਾਣੀ, ਸ਼ਹਿਦ, ਭਾਫ਼ ਲਓ, ਸਿਗਰਟ ਤੋਂ ਬਚੋ\n';
      if (hasRash) response += '• ਦਾਣੇ/ਖੁਜਲੀ: ਠੰਡੇ ਪਾਣੀ ਨਾਲ ਨਹਾਓ, ਸੂਤੀ ਕੱਪੜੇ, ਖੁਜਲੀ ਨਾ ਕਰੋ\n';
      if (hasVomiting) response += '• ਉਲਟੀ: ਥੋੜਾ-ਥੋੜਾ ਪਾਣੀ, ਅਦਰਕ ਚਾਹ, ਹਲਕਾ ਖਾਣਾ\n';
      
      if (hasFever || hasHeadache || hasCough || hasRash || hasVomiting) {
        response += '\nਜੇ ਲੱਛਣ ਵਿਗੜਦੇ ਰਹਿਣ ਜਾਂ ਗੰਭੀਰ ਹੋਣ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
        return response;
      }
      return 'ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ।';
    }
    
    // English responses
    let response = 'Based on your symptoms:\n\n';
    
    if (hasFever) response += '• Fever: Rest, drink fluids, consult doctor if temperature exceeds 101°F\n';
    if (hasHeadache) response += '• Headache: Rest in dark room, stay hydrated, reduce stress\n';
    if (hasCough) response += '• Cough: Warm water, honey, steam inhalation, avoid smoking\n';
    if (hasRash) response += '• Rash/Itching: Cool baths, cotton clothing, avoid scratching\n';
    if (hasVomiting) response += '• Vomiting: Small sips of water, ginger tea, bland foods\n';
    
    if (hasFever || hasHeadache || hasCough || hasRash || hasVomiting) {
      response += '\nSeek immediate medical attention if symptoms worsen or become severe.';
      return response;
    }
    
    return 'I am your AI health assistant. Please describe your symptoms and I will provide general guidance.';
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getLocalResponse(messageText, selectedLanguage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false)
    }, 1000);
  };

  return (
    <div className={`flex flex-col h-[500px] bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header with Language Selector */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold">{t('aiHealthAssistant')} (Voice Enabled)</h3>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-blue-700 text-white text-sm rounded px-2 py-1 border-none outline-none"
              title="Change language and hear voice guide"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Language Quick Buttons */}
      <div className="bg-blue-50 px-4 py-2 border-b flex gap-2">
        <span className="text-sm text-gray-600">Quick switch:</span>
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedLanguage === lang.code
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            title={`Switch to ${lang.name} and play voice guide`}
          >
            {lang.flag} {lang.code.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'bot' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                {message.sender === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                <div>
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          
                          setTimeout(() => {
                            const utterance = new SpeechSynthesisUtterance(message.text);
                            
                            // Voice selection for different languages
                            const voices = window.speechSynthesis.getVoices();
                            let voice = null;
                            
                            if (selectedLanguage === 'hi') {
                              voice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('hi'));
                            } else if (selectedLanguage === 'pa') {
                              voice = voices.find(v => v.lang.includes('pa-IN') || v.lang.includes('pa-Guru')) ||
                                     voices.find(v => v.lang.includes('hi-IN')) ||
                                     voices.find(v => v.lang.includes('en-IN')) ||
                                     voices.find(v => v.lang.includes('en-US'));
                            } else {
                              voice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en'));
                            }
                            
                            if (voice) {
                              utterance.voice = voice;
                              utterance.lang = voice.lang;
                            }
                            
                            utterance.volume = 1;
                            utterance.rate = 0.8;
                            utterance.pitch = 1;
                            
                            window.speechSynthesis.speak(utterance);
                          }, 100);
                        }}
                        className="ml-2 p-1 rounded hover:bg-gray-200 opacity-70 hover:opacity-100 cursor-pointer"
                        title="Read aloud"
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 border rounded-lg p-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder={
                selectedLanguage === 'hi' ? "अपना स्वास्थ्य प्रश्न टाइप करें या आवाज़ का उपयोग करें..." :
                selectedLanguage === 'pa' ? "ਆਪਣਾ ਸਿਹਤ ਸਵਾਲ ਟਾਈਪ ਕਰੋ ਜਾਂ ਆਵਾਜ਼ ਦੀ ਵਰਤੋਂ ਕਰੋ..." :
                "Type your health question or use voice..."
              }
              className="flex-1 outline-none text-sm"
            />
            
            <VoiceAssistant
              onVoiceInput={handleVoiceInput}
              textToSpeak={messages.length > 0 && messages[messages.length - 1].sender === 'bot' ? messages[messages.length - 1].text : ''}
              language={selectedLanguage}
            />
          </div>
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-3 w-3" />
            <span>
              {selectedLanguage === 'hi' ? "माइक्रोफ़ोन पर क्लिक करके बोलें" :
               selectedLanguage === 'pa' ? "ਬੋਲਣ ਲਈ ਮਾਈਕ੍ਰੋਫੋਨ 'ਤੇ ਕਲਿੱਕ ਕਰੋ" :
               "Click microphone to speak"}
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EnhancedVoiceHealthAssistant;