import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AIChatBot = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, text: t('chatbotWelcome'), sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{ id: 1, text: t('chatbotWelcome'), sender: "bot" }]);
  }, [i18n.language, t]);

  // Text-to-speech function
  const speakMessage = (text, language) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current language
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'pa') {
        utterance.lang = 'pa-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    
    // Add typing indicator
    const typingMessage = { id: Date.now() + 1, text: "Typing...", sender: "bot", isTyping: true };
    setMessages(prev => [...prev, typingMessage]);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: currentInput,
        language: i18n.language
      });
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        const botResponse = {
          id: Date.now() + 2,
          text: response.data.response,
          sender: "bot"
        };
        
        // Speak the response in the current language
        speakMessage(response.data.response, i18n.language);
        
        return [...filtered, botResponse];
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      // Remove typing indicator and add fallback response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        const fallbackResponse = getFallbackResponse(currentInput, i18n.language);
        
        // Speak the fallback response in the current language
        speakMessage(fallbackResponse, i18n.language);
        
        return [...filtered, {
          id: Date.now() + 2,
          text: fallbackResponse,
          sender: "bot"
        }];
      });
    }
  };

  const getFallbackResponse = (message, language = 'en') => {
    const lowerMessage = message.toLowerCase();
    
    // Check for Hindi/Punjabi keywords
    const hindiKeywords = ['बुखार', 'सिरदर्द', 'खांसी', 'पेट', 'नमस्ते', 'हैलो'];
    const punjabKeywords = ['ਬੁਖਾਰ', 'ਸਿਰ ਦਰਦ', 'ਖੰਘ', 'ਪੇਟ', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਹੈਲੋ'];
    
    const isHindi = hindiKeywords.some(keyword => message.includes(keyword)) || language === 'hi';
    const isPunjabi = punjabKeywords.some(keyword => message.includes(keyword)) || language === 'pa';
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || message.includes('बुखार') || message.includes('ਬੁਖਾਰ')) {
      if (isHindi) return 'बुखार के लिए, आराम करें और हाइड्रेटेड रहें। यदि तापमान 101°F (38.3°C) से अधिक है या बना रहता है, तो स्वास्थ्य सेवा प्रदाता से सलाह लें।';
      if (isPunjabi) return 'ਬੁਖਾਰ ਲਈ, ਆਰਾਮ ਕਰੋ ਅਤੇ ਹਾਈਡ੍ਰੇਟਿਡ ਰਹੋ। ਜੇ ਤਾਪਮਾਨ 101°F (38.3°C) ਤੋਂ ਜ਼ਿਆਦਾ ਹੈ ਜਾਂ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ, ਤਾਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
      return 'For fever, rest and stay hydrated. If temperature exceeds 101°F (38.3°C) or persists, consult a healthcare provider.';
    }
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain') || message.includes('सिरदर्द') || message.includes('ਸਿਰ ਦਰਦ')) {
      if (isHindi) return 'सिरदर्द के लिए, शांत, अंधेरे कमरे में आराम करने की कोशिश करें और हाइड्रेटेड रहें। यदि गंभीर या लगातार है, तो कृपया स्वास्थ्य सेवा प्रदाता से सलाह लें।';
      if (isPunjabi) return 'ਸਿਰ ਦਰਦ ਲਈ, ਸ਼ਾਂਤ, ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਅਤੇ ਹਾਈਡ੍ਰੇਟਿਡ ਰਹੋ। ਜੇ ਗੰਭੀਰ ਜਾਂ ਲਗਾਤਾਰ ਹੈ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
      return 'For headaches, try rest in a quiet, dark room and stay hydrated. If severe or persistent, please consult a healthcare provider.';
    }
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || message.includes('खांसी') || message.includes('ਖੰਘ')) {
      if (isHindi) return 'खांसी और सर्दी के लक्षणों के लिए, आराम करें, तरल पदार्थ पिएं, और गर्म नमक के पानी से गरारे करने पर विचार करें। यदि लक्षण बिगड़ते हैं, तो स्वास्थ्य सेवा प्रदाता से सलाह लें।';
      if (isPunjabi) return 'ਖੰਘ ਅਤੇ ਠੰਡ ਦੇ ਲੱਛਣਾਂ ਲਈ, ਆਰਾਮ ਕਰੋ, ਤਰਲ ਪਦਾਰਥ ਪੀਓ, ਅਤੇ ਗਰਮ ਨਮਕ ਦੇ ਪਾਣੀ ਨਾਲ ਗਰਾਰੇ ਕਰਨ ਬਾਰੇ ਸੋਚੋ। ਜੇ ਲੱਛਣ ਵਿਗੜਦੇ ਹਨ, ਤਾਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
      return 'For cough and cold symptoms, rest, drink fluids, and consider warm saltwater gargles. If symptoms worsen, consult a healthcare provider.';
    }
    if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea') || message.includes('पेट') || message.includes('ਪੇਟ')) {
      if (isHindi) return 'पेट की समस्याओं के लिए, चावल या टोस्ट जैसे सादे खाद्य पदार्थों की कोशिश करें, हाइड्रेटेड रहें, और आराम करें। यदि लक्षण गंभीर हैं, तो स्वास्थ्य सेवा प्रदाता से सलाह लें।';
      if (isPunjabi) return 'ਪੇਟ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਲਈ, ਚਾਵਲ ਜਾਂ ਟੋਸਟ ਵਰਗੇ ਸਾਦੇ ਭੋਜਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ, ਹਾਈਡ੍ਰੇਟਿਡ ਰਹੋ, ਅਤੇ ਆਰਾਮ ਕਰੋ। ਜੇ ਲੱਛਣ ਗੰਭੀਰ ਹਨ, ਤਾਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
      return 'For stomach issues, try bland foods like rice or toast, stay hydrated, and rest. If symptoms are severe, consult a healthcare provider.';
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || message.includes('नमस्ते') || message.includes('हैलो') || message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ') || message.includes('ਹੈਲੋ')) {
      if (isHindi) return 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं बुनियादी चिकित्सा प्रश्नों में मदद कर सकता हूं। आज आप कैसा महसूस कर रहे हैं?';
      if (isPunjabi) return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਬੁਨਿਆਦੀ ਮੈਡੀਕਲ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?';
      return 'Hello! I\'m your AI health assistant. I can help with basic medical questions. How are you feeling today?';
    }
    
    if (isHindi) return 'आपके प्रश्न के लिए धन्यवाद। मैं व्यक्तिगत चिकित्सा सलाह के लिए स्वास्थ्य पेशेवर से परामर्श करने की सलाह देता हूं। आप हमारे प्लेटफॉर्म के माध्यम से अपॉइंटमेंट बुक कर सकते हैं।';
    if (isPunjabi) return 'ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਮੈਂ ਨਿੱਜੀ ਮੈਡੀਕਲ ਸਲਾਹ ਲਈ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹਾਂ। ਤੁਸੀਂ ਸਾਡੇ ਪਲੇਟਫਾਰਮ ਰਾਹੀਂ ਅਪੌਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ।';
    return 'Thank you for your question. I recommend consulting with a healthcare professional for personalized medical advice. You can book an appointment through our platform.';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-lg z-40 w-80 h-96 flex flex-col">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h4 className="font-bold">{t('aiHealthAssistant')}</h4>
        <button onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg text-sm ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {message.isTyping ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{message.text}</span>
                  {message.sender === 'bot' && (
                    <button
                      onClick={() => speakMessage(message.text, i18n.language)}
                      className="text-gray-600 hover:text-gray-800 flex-shrink-0"
                      title="Listen to response"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('typeMessage')}
          className="flex-1 p-2 border border-gray-300 rounded text-sm"
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AIChatBot;