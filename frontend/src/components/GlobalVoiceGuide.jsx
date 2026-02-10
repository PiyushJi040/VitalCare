import React, { useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GlobalVoiceGuide = () => {
  const { i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const getGuideText = (language) => {
    const guides = {
      en: `Welcome to our Telemedicine Platform. This is a comprehensive healthcare solution with AI-powered features. You can use voice commands throughout the application. Click the microphone buttons to speak your questions or symptoms. The AI health assistant can help you with medical queries in multiple languages. You can book appointments with doctors, get AI analysis of medical images, and access emergency services. The platform supports English, Hindi, and Punjabi languages. Use the language selector to switch between languages. All voice features work with your browser's built-in speech recognition. For the best experience, speak clearly and ensure your microphone is working properly.`,
      
      hi: `हमारे टेलीमेडिसिन प्लेटफॉर्म में आपका स्वागत है। यह एआई-संचालित सुविधाओं के साथ एक व्यापक स्वास्थ्य सेवा समाधान है। आप पूरे एप्लिकेशन में वॉयस कमांड का उपयोग कर सकते हैं। अपने प्रश्न या लक्षण बोलने के लिए माइक्रोफोन बटन पर क्लिक करें। एआई स्वास्थ्य सहायक कई भाषाओं में आपके चिकित्सा प्रश्नों में मदद कर सकता है। आप डॉक्टरों के साथ अपॉइंटमेंट बुक कर सकते हैं, मेडिकल इमेज का एआई विश्लेषण प्राप्त कर सकते हैं, और आपातकालीन सेवाओं तक पहुंच सकते हैं। प्लेटफॉर्म अंग्रेजी, हिंदी और पंजाबी भाषाओं का समर्थन करता है। भाषाओं के बीच स्विच करने के लिए भाषा चयनकर्ता का उपयोग करें। सभी वॉयस सुविधाएं आपके ब्राउज़र की अंतर्निहित स्पीच रिकग्निशन के साथ काम करती हैं।`,
      
      pa: `ਸਾਡੇ ਟੈਲੀਮੈਡਿਸਿਨ ਪਲੇਟਫਾਰਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਇਹ ਏਆਈ-ਸੰਚਾਲਿਤ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੇ ਨਾਲ ਇੱਕ ਵਿਆਪਕ ਸਿਹਤ ਸੇਵਾ ਹੱਲ ਹੈ। ਤੁਸੀਂ ਪੂਰੀ ਐਪਲੀਕੇਸ਼ਨ ਵਿੱਚ ਵੌਇਸ ਕਮਾਂਡਾਂ ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ। ਆਪਣੇ ਸਵਾਲ ਜਾਂ ਲੱਛਣ ਬੋਲਣ ਲਈ ਮਾਈਕ੍ਰੋਫੋਨ ਬਟਨਾਂ ਤੇ ਕਲਿੱਕ ਕਰੋ। ਏਆਈ ਸਿਹਤ ਸਹਾਇਕ ਕਈ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ। ਤੁਸੀਂ ਡਾਕਟਰਾਂ ਨਾਲ ਮੁਲਾਕਾਤਾਂ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਮੈਡੀਕਲ ਚਿੱਤਰਾਂ ਦਾ ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਕਰ ਸਕਦੇ ਹੋ। ਪਲੇਟਫਾਰਮ ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ ਅਤੇ ਪੰਜਾਬੀ ਭਾਸ਼ਾਵਾਂ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ। ਭਾਸ਼ਾਵਾਂ ਵਿਚਕਾਰ ਸਵਿੱਚ ਕਰਨ ਲਈ ਭਾਸ਼ਾ ਚੋਣਕਰਤਾ ਦੀ ਵਰਤੋਂ ਕਰੋ।`
    };
    return guides[language] || guides.en;
  };

  const playGuide = () => {
    if (isPlaying) {
      stopGuide();
      return;
    }

    const text = getGuideText(i18n.language);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Voice selection based on language
        const voices = window.speechSynthesis.getVoices();
        let voice = null;
        
        if (i18n.language === 'hi') {
          voice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('hi'));
        } else if (i18n.language === 'pa') {
          voice = voices.find(v => v.lang.includes('pa-IN') || v.lang.includes('pa')) ||
                 voices.find(v => v.lang.includes('en-IN')) ||
                 voices.find(v => v.lang.includes('en-US'));
        } else {
          voice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en'));
        }
        
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        setCurrentAudio(utterance);
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const stopGuide = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentAudio(null);
  };

  // Auto-play when language changes (disabled to prevent auto-play)
  React.useEffect(() => {
    const handlePlayGuide = () => {
      playGuide();
    };
    
    window.addEventListener('playVoiceGuide', handlePlayGuide);
    
    return () => {
      window.removeEventListener('playVoiceGuide', handlePlayGuide);
    };
  }, [i18n]);

  return (
    <button
      onClick={playGuide}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors ${
        isPlaying 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
      title={isPlaying ? 'Stop Voice Guide' : 'Play Voice Guide'}
    >
      {isPlaying ? <X className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span className="text-sm">
        {isPlaying ? (
          i18n.language === 'hi' ? 'रोकें' :
          i18n.language === 'pa' ? 'ਰੋਕੋ' : 'Stop'
        ) : (
          i18n.language === 'hi' ? 'गाइड' :
          i18n.language === 'pa' ? 'ਗਾਈਡ' : 'Guide'
        )}
      </span>
    </button>
  );
};

export default GlobalVoiceGuide;