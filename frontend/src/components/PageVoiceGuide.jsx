import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getPageName } from '../utils/pageUtils';

const PageVoiceGuide = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const pageName = getPageName(location.pathname);

  const getPageGuideText = (page, language) => {
    const guides = {
      'ha-home': {
        en: "Welcome to Health Assistant Dashboard. You can register new patients, view patient queue, select doctors for consultations, access AI analysis tools, and manage appointments. Use voice commands throughout the interface.",
        hi: "स्वास्थ्य सहायक डैशबोर्ड में आपका स्वागत है। आप नए मरीज़ों को पंजीकृत कर सकते हैं, मरीज़ों की कतार देख सकते हैं, परामर्श के लिए डॉक्टर चुन सकते हैं, AI विश्लेषण उपकरण का उपयोग कर सकते हैं।",
        pa: "ਸਿਹਤ ਸਹਾਇਕ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਤੁਸੀਂ ਨਵੇਂ ਮਰੀਜ਼ਾਂ ਨੂੰ ਰਜਿਸਟਰ ਕਰ ਸਕਦੇ ਹੋ, ਮਰੀਜ਼ਾਂ ਦੀ ਕਤਾਰ ਦੇਖ ਸਕਦੇ ਹੋ, ਸਲਾਹ ਲਈ ਡਾਕਟਰ ਚੁਣ ਸਕਦੇ ਹੋ।"
      },
      'doctor-home': {
        en: "Doctor Dashboard provides patient management, appointment scheduling, video consultations, AI diagnostic tools, and medical records access. Click voice buttons for hands-free operation.",
        hi: "डॉक्टर डैशबोर्ड में मरीज़ प्रबंधन, अपॉइंटमेंट शेड्यूलिंग, वीडियो परामर्श, AI निदान उपकरण और मेडिकल रिकॉर्ड एक्सेस है।",
        pa: "ਡਾਕਟਰ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਮਰੀਜ਼ ਪ੍ਰਬੰਧਨ, ਮੁਲਾਕਾਤ ਸ਼ੈਡਿਊਲਿੰਗ, ਵੀਡੀਓ ਸਲਾਹ, AI ਨਿਦਾਨ ਟੂਲ ਅਤੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਪਹੁੰਚ ਹੈ।"
      },
      'patient-dashboard': {
        en: "Patient Portal allows booking appointments, viewing medical history, AI health analysis, video consultations with doctors, and accessing test results. Use voice features for easy navigation.",
        hi: "मरीज़ पोर्टल में अपॉइंटमेंट बुकिंग, मेडिकल हिस्ट्री देखना, AI स्वास्थ्य विश्लेषण, डॉक्टरों के साथ वीडियो परामर्श और टेस्ट रिजल्ट एक्सेस करना शामिल है।",
        pa: "ਮਰੀਜ਼ ਪੋਰਟਲ ਵਿੱਚ ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ, ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਦੇਖਣਾ, AI ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ, ਡਾਕਟਰਾਂ ਨਾਲ ਵੀਡੀਓ ਸਲਾਹ ਸ਼ਾਮਲ ਹੈ।"
      },
      'ai-analysis': {
        en: "AI Analysis page provides medical image analysis for eye diseases, bone fractures, and skin conditions. Upload images and get instant AI-powered diagnostic insights with voice feedback.",
        hi: "AI विश्लेषण पेज आंखों की बीमारियों, हड्डी के फ्रैक्चर और त्वचा की स्थितियों के लिए मेडिकल इमेज विश्लेषण प्रदान करता है।",
        pa: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਪੰਨਾ ਅੱਖਾਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਹੱਡੀਆਂ ਦੇ ਫ੍ਰੈਕਚਰ ਅਤੇ ਚਮੜੀ ਦੀਆਂ ਸਥਿਤੀਆਂ ਲਈ ਮੈਡੀਕਲ ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।"
      },
      'voice-features': {
        en: "Voice Features Demo showcases speech recognition and text-to-speech capabilities. Test voice chatbot and symptom checker with multi-language support including Hindi and Punjabi.",
        hi: "वॉयस फीचर्स डेमो स्पीच रिकग्निशन और टेक्स्ट-टू-स्पीच क्षमताओं को दिखाता है। हिंदी और पंजाबी सहित बहुभाषी समर्थन के साथ वॉयस चैटबॉट का परीक्षण करें।",
        pa: "ਵੌਇਸ ਫੀਚਰਸ ਡੈਮੋ ਸਪੀਚ ਰਿਕਗਨਿਸ਼ਨ ਅਤੇ ਟੈਕਸਟ-ਟੂ-ਸਪੀਚ ਸਮਰੱਥਾਵਾਂ ਦਿਖਾਉਂਦਾ ਹੈ। ਹਿੰਦੀ ਅਤੇ ਪੰਜਾਬੀ ਸਮੇਤ ਬਹੁ-ਭਾਸ਼ਾ ਸਮਰਥਨ ਨਾਲ ਵੌਇਸ ਚੈਟਬੋਟ ਦਾ ਟੈਸਟ ਕਰੋ।"
      },
      'default': {
        en: "This page provides various healthcare features and tools. Use voice commands and multi-language support for better accessibility. Click microphone buttons to interact with voice features.",
        hi: "यह पेज विभिन्न स्वास्थ्य सेवा सुविधाएं और उपकरण प्रदान करता है। बेहतर पहुंच के लिए वॉयस कमांड और बहुभाषी समर्थन का उपयोग करें।",
        pa: "ਇਹ ਪੰਨਾ ਵੱਖ-ਵੱਖ ਸਿਹਤ ਸੇਵਾ ਸੁਵਿਧਾਵਾਂ ਅਤੇ ਟੂਲ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਬਿਹਤਰ ਪਹੁੰਚ ਲਈ ਵੌਇਸ ਕਮਾਂਡ ਅਤੇ ਬਹੁ-ਭਾਸ਼ਾ ਸਮਰਥਨ ਦੀ ਵਰਤੋਂ ਕਰੋ।"
      }
    };

    const pageGuide = guides[page] || guides['default'];
    return pageGuide[language] || pageGuide['en'];
  };

  const playGuide = () => {
    if (isPlaying) {
      stopGuide();
      return;
    }

    const text = getPageGuideText(pageName, i18n.language);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        let voice = null;
        
        if (i18n.language === 'hi') {
          voice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('hi'));
        } else if (i18n.language === 'pa') {
          // Use Hindi voice for Punjabi text since Punjabi TTS not available
          voice = voices.find(v => v.lang.includes('hi-IN')) ||
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
        
        // Force speech synthesis to work
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        
        console.log('Voice guide:', { language: i18n.language, voice: voice?.name });
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const stopGuide = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <button
      onClick={playGuide}
      className={`fixed top-4 left-4 z-50 p-3 rounded-full shadow-lg transition-colors ${
        isPlaying 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
      title={isPlaying ? 'Stop Page Guide' : 'Play Page Guide'}
    >
      {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
};

export default PageVoiceGuide;