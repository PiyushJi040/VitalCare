import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Volume2 } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';
import { useTranslation } from 'react-i18next';

const VoiceEnabledChatBot = ({ className = "" }) => {
  const { i18n } = useTranslation();
  
  const getWelcomeMessage = () => {
    if (i18n.language === 'hi') {
      return "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आप मुझसे टाइप या बोलकर बात कर सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूँ?";
    } else if (i18n.language === 'pa') {
      return "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਨਾਲ ਟਾਈਪ ਕਰਕੇ ਜਾਂ ਬੋਲ ਕੇ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?";
    }
    return "Hello! I'm your AI health assistant. You can type or speak to me. How can I help you today?";
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = (transcript) => {
    setInputMessage(transcript);
    // Auto-send voice input
    setTimeout(() => {
      handleSendMessage(transcript);
    }, 500);
  };

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for Hindi keywords
    const isHindi = message.includes('बुखार') || message.includes('सिरदर्द') || message.includes('खांसी') || message.includes('पेट') || message.includes('डॉक्टर') || message.includes('नमस्ते') || i18n.language === 'hi';
    
    // Check for Punjabi keywords
    const isPunjabi = message.includes('ਬੁਖਾਰ') || message.includes('ਸਿਰ ਦਰਦ') || message.includes('ਖੰਘ') || message.includes('ਪੇਟ') || message.includes('ਡਾਕਟਰ') || message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ') || i18n.language === 'pa';
    
    if (message.includes('fever') || message.includes('temperature') || message.includes('बुखार') || message.includes('ਬੁਖਾਰ')) {
      if (isHindi) {
        return "बुखार के लिए मेरी सिफारिश: 1) आराम करें और पानी पिएं 2) जरूरत हो तो पैरासिटामोल लें 3) तापमान की निगरानी करें 4) यदि बुखार 3 दिन से ज्यादा रहे तो डॉक्टर से मिलें।";
      } else if (isPunjabi) {
        return "ਬੁਖਾਰ ਲਈ ਮੇਰੀ ਸਲਾਹ: 1) ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਓ 2) ਲੋੜ ਹੋਵੇ ਤਾਂ ਪੈਰਾਸਿਟਾਮੋਲ ਲਓ 3) ਤਾਪਮਾਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ 4) ਜੇ ਬੁਖਾਰ 3 ਦਿਨ ਤੋਂ ਵੱਧ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।";
      }
      return "For fever, I recommend: 1) Rest and stay hydrated 2) Take paracetamol if needed 3) Monitor temperature 4) Consult a doctor if fever persists over 3 days or exceeds 103°F. Would you like more specific advice?";
    }
    
    if (message.includes('headache') || message.includes('head pain') || message.includes('सिरदर्द') || message.includes('ਸਿਰ ਦਰਦ')) {
      if (isHindi) {
        return "सिरदर्द के लिए: 1) शांत और अंधेरे कमरे में आराम करें 2) ठंडी या गर्म सिकाई करें 3) पानी पिएं 4) गर्दन की हल्की स्ट्रेचिंग करें।";
      } else if (isPunjabi) {
        return "ਸਿਰ ਦਰਦ ਲਈ: 1) ਸ਼ਾਂਤ ਅਤੇ ਅੰਨ੍ਹੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ 2) ਠੰਡੀ ਜਾਂ ਗਰਮ ਸਿਕਾਈ ਕਰੋ 3) ਪਾਣੀ ਪੀਓ 4) ਗਰਦਨ ਦੀ ਹਲਕੀ ਸਟਰੈਚਿੰਗ ਕਰੋ।";
      }
      return "For headaches: 1) Rest in a quiet, dark room 2) Apply cold or warm compress 3) Stay hydrated 4) Gentle neck stretches 5) Consider over-the-counter pain relief. Seek medical help if severe or persistent.";
    }
    
    if (message.includes('cough') || message.includes('coughing') || message.includes('खांसी') || message.includes('ਖੰਘ')) {
      if (isHindi) {
        return "खांसी के लिए: 1) गर्म पानी और शहद पिएं 2) भाप लें 3) गले को आराम दें 4) धूम्रपान से बचें 5) यदि 2 सप्ताह से ज्यादा रहे तो डॉक्टर से मिलें।";
      } else if (isPunjabi) {
        return "ਖੰਘ ਲਈ: 1) ਗਰਮ ਪਾਣੀ ਅਤੇ ਸ਼ਹਿਦ ਪੀਓ 2) ਭਾਫ ਲਓ 3) ਗਲੇ ਨੂੰ ਆਰਾਮ ਦਿਓ 4) ਸਿਗਰਟਨੋਸ਼ੀ ਤੋਂ ਬਚੋ 5) ਜੇ 2 ਹਫਤਿਆਂ ਤੋਂ ਵੱਧ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।";
      }
      return "For cough: 1) Drink warm water with honey 2) Use steam inhalation 3) Rest your throat 4) Avoid smoking 5) Consult a doctor if cough persists over 2 weeks or has blood.";
    }
    
    if (message.includes('rash') || message.includes('skin') || message.includes('दाने') || message.includes('ਦਾਣੇ') || message.includes('त्वचा') || message.includes('ਚਮੜੀ')) {
      if (isHindi) {
        return "त्वचा की समस्या के लिए: 1) प्रभावित क्षेत्र को साफ और सूखा रखें 2) खुजली न करें 3) ठंडी सिकाई करें 4) सुगंधित साबुन से बचें 5) यदि फैलता रहे तो त्वचा विशेषज्ञ से मिलें।";
      } else if (isPunjabi) {
        return "ਚਮੜੀ ਦੀ ਸਮੱਸਿਆ ਲਈ: 1) ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ ਨੂੰ ਸਾਫ ਅਤੇ ਸੁੱਕਾ ਰੱਖੋ 2) ਖੁਜਲੀ ਨਾ ਕਰੋ 3) ਠੰਡੀ ਸਿਕਾਈ ਕਰੋ 4) ਸੁਗੰਧਿਤ ਸਾਬਣ ਤੋਂ ਬਚੋ 5) ਜੇ ਫੈਲਦਾ ਰਹੇ ਤਾਂ ਚਮੜੀ ਮਾਹਿਰ ਨੂੰ ਮਿਲੋ।";
      }
      return "For skin rash: 1) Keep affected area clean and dry 2) Avoid scratching 3) Apply cold compress 4) Avoid perfumed soaps 5) See a dermatologist if rash spreads or worsens.";
    }
    
    if (message.includes('vomit') || message.includes('vomiting') || message.includes('nausea') || message.includes('उल्टी') || message.includes('ਉਲਟੀ') || message.includes('मतली') || message.includes('ਜੀ ਮਿਚਲਾਉਣਾ')) {
      if (isHindi) {
        return "उल्टी के लिए: 1) तरल पदार्थ लें (छोटे घूंट में) 2) BRAT आहार लें (केला, चावल, सेब, टोस्ट) 3) अदरक की चाय पिएं 4) आराम करें 5) यदि निर्जलीकरण के लक्षण हों तो तुरंत डॉक्टर से मिलें।";
      } else if (isPunjabi) {
        return "ਉਲਟੀ ਲਈ: 1) ਤਰਲ ਪਦਾਰਥ ਲਓ (ਛੋਟੇ ਘੁੱਟ ਵਿੱਚ) 2) BRAT ਖੁਰਾਕ ਲਓ (ਕੇਲਾ, ਚਾਵਲ, ਸੇਬ, ਟੋਸਟ) 3) ਅਦਰਕ ਦੀ ਚਾਹ ਪੀਓ 4) ਆਰਾਮ ਕਰੋ 5) ਜੇ ਪਾਣੀ ਦੀ ਕਮੀ ਦੇ ਲੱਛਣ ਹੋਣ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।";
      }
      return "For vomiting: 1) Take small sips of fluids 2) Try BRAT diet (banana, rice, apple, toast) 3) Drink ginger tea 4) Rest 5) Seek immediate medical help if signs of dehydration occur.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('नमस्ते') || message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ')) {
      if (isHindi) {
        return "नमस्ते! मैं आपके स्वास्थ्य सवालों में मदद करने के लिए यहाँ हूँ। आप मुझसे लक्षणों, सामान्य स्वास्थ्य सलाह, या डॉक्टर के साथ अपॉइंटमेंट बुक करने के बारे में पूछ सकते हैं।";
      } else if (isPunjabi) {
        return "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੇ ਸਿਹਤ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਤੋਂ ਲੱਛਣਾਂ, ਆਮ ਸਿਹਤ ਸਲਾਹ, ਜਾਂ ਡਾਕਟਰ ਨਾਲ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।";
      }
      return "Hello! I'm here to help with your health questions. You can ask me about symptoms, general health advice, or how to book appointments with our doctors. What would you like to know?";
    }
    
    if (isHindi) {
      return "मैं समझ गया कि आप स्वास्थ्य संबंधी चिंताओं के बारे में पूछ रहे हैं। जबकि मैं सामान्य मार्गदर्शन प्रदान कर सकता हूँ, लेकिन उचित निदान और इलाज के लिए योग्य स्वास्थ्य पेशेवर से सलाह लेना महत्वपूर्ण है।";
    } else if (isPunjabi) {
      return "ਮੈਂ ਸਮਝ ਗਿਆ ਕਿ ਤੁਸੀਂ ਸਿਹਤ ਸੰਬੰਧੀ ਚਿੰਤਾਵਾਂ ਬਾਰੇ ਪੁੱਛ ਰਹੇ ਹੋ। ਜਦਕਿ ਮੈਂ ਆਮ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰ ਸਕਦਾ ਹਾਂ, ਲੇਕਿਨ ਸਹੀ ਨਿਦਾਨ ਅਤੇ ਇਲਾਜ ਲਈ ਯੋਗ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰਨਾ ਮਹੱਤਵਪੂਰਨ ਹੈ।";
    }
    
    return "I understand you're asking about health concerns. While I can provide general guidance, it's important to consult with a qualified healthcare professional for proper diagnosis and treatment. Would you like me to help you connect with one of our doctors?";
  };

  const handleSendMessage = (messageText = inputMessage) => {
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
      const botResponse = getAIResponse(messageText);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setLastBotMessage(botResponse);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-96 bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h3 className="font-semibold">AI Health Assistant (Voice Enabled)</h3>
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
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
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

      {/* Input Area with Voice Controls */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 border rounded-lg p-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                i18n.language === 'hi' ? 'अपना स्वास्थ्य प्रश्न टाइप करें या आवाज़ का उपयोग करें...' :
                i18n.language === 'pa' ? 'ਆਪਣਾ ਸਿਹਤ ਸਵਾਲ ਟਾਈਪ ਕਰੋ ਜਾਂ ਆਵਾਜ਼ ਦੀ ਵਰਤੋਂ ਕਰੋ...' :
                'Type your health question or use voice...'
              }
              className="flex-1 outline-none text-sm"
            />
            
            {/* Voice Assistant Controls */}
            <VoiceAssistant
              onVoiceInput={handleVoiceInput}
              textToSpeak={lastBotMessage}
              language={i18n.language}
              className="border-l pl-2"
            />
          </div>
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <Mic className="h-3 w-3" />
          <span>
            {i18n.language === 'hi' ? 'माइक्रोफ़ोन पर क्लिक करके बोलें, या स्पीकर से जवाब सुनें' :
             i18n.language === 'pa' ? 'ਮਾਈਕ੍ਰੋਫੋਨ ਤੇ ਕਲਿੱਕ ਕਰੋ ਜਾਂ ਸਪੀਕਰ ਸੁਣੋ' :
             'Click the microphone to speak, or the speaker to hear responses'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceEnabledChatBot;