import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Mic, Volume2 } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';
import { useTranslation } from 'react-i18next';

const VoiceSymptomChecker = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState('');

  const handleVoiceInput = (transcript) => {
    setSymptoms(transcript);
  };

  const analyzeSymptoms = (symptomText = symptoms) => {
    if (!symptomText.trim()) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = getSymptomAnalysis(symptomText);
      setResults(analysis);
      setLastResult(analysis.summary);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSymptomAnalysis = (symptomText) => {
    const text = symptomText.toLowerCase();
    const isHindi = text.includes('बुखार') || text.includes('सिरदर्द') || text.includes('खांसी') || text.includes('पेट') || text.includes('दाने') || text.includes('उल्टी') || i18n.language === 'hi';
    const isPunjabi = text.includes('ਬੁਖਾਰ') || text.includes('ਸਿਰ ਦਰਦ') || text.includes('ਖੰਘ') || text.includes('ਪੇਟ') || text.includes('ਦਾਣੇ') || text.includes('ਉਲਟੀ') || i18n.language === 'pa';
    const confidence = Math.floor(Math.random() * 11) + 85;
    
    // Fever-related symptoms
    if (text.includes('fever') || text.includes('temperature') || text.includes('chills') || text.includes('बुखार') || text.includes('ਬੁਖਾਰ')) {
      if (isHindi) {
        return {
          condition: 'संभावित वायरल/बैक्टीरियल संक्रमण',
          severity: 'मध्यम',
          confidence: confidence,
          recommendations: [
            'नियमित रूप से तापमान की निगरानी करें',
            'तरल पदार्थों के साथ हाइड्रेटेड रहें',
            'आराम करें और कठिन गतिविधियों से बचें',
            'यदि तापमान 100°F से अधिक हो तो पैरासिटामोल लें',
            'यदि बुखार 3 दिन से अधिक रहे तो डॉक्टर से सलाह लें'
          ],
          urgency: 'यदि बुखार 103°F से अधिक हो या बना रहे तो डॉक्टर से सलाह लें',
          summary: 'बुखार के लक्षणों के आधार पर, यह एक संभावित संक्रमण लगता है। तापमान की निगरानी करें, हाइड्रेटेड रहें, और आराम करें।'
        };
      } else if (isPunjabi) {
        return {
          condition: 'ਸੰਭਾਵਿਤ ਵਾਇਰਲ/ਬੈਕਟੀਰੀਅਲ ਸੰਕਰਮਣ',
          severity: 'ਮਧਿਮ',
          confidence: confidence,
          recommendations: [
            'ਨਿਯਮਿਤ ਰੂਪ ਨਾਲ ਤਾਪਮਾਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ',
            'ਤਰਲ ਪਦਾਰਥਾਂ ਨਾਲ ਹਾਇਡਰੇਟੇਡ ਰਹੋ',
            'ਆਰਾਮ ਕਰੋ ਅਤੇ ਕਠਿਨ ਗਤੀਵਿਧੀਆਂ ਤੋਂ ਬਚੋ',
            'ਜੇ ਤਾਪਮਾਨ 100°F ਤੋਂ ਵੱਧ ਹੋਵੇ ਤਾਂ ਪੈਰਾਸਿਟਾਮੋਲ ਲਓ',
            'ਜੇ ਬੁਖਾਰ 3 ਦਿਨ ਤੋਂ ਵੱਧ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ'
          ],
          urgency: 'ਜੇ ਬੁਖਾਰ 103°F ਤੋਂ ਵੱਧ ਹੋਵੇ ਜਾਂ ਬਣਿਆ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ',
          summary: 'ਬੁਖਾਰ ਦੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ ਤੇ, ਇਹ ਇੱਕ ਸੰਭਾਵਿਤ ਸੰਕਰਮਣ ਲਗਦਾ ਹੈ। ਤਾਪਮਾਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ, ਹਾਇਡਰੇਟੇਡ ਰਹੋ, ਅਤੇ ਆਰਾਮ ਕਰੋ।'
        };
      }
      return {
        condition: 'Possible Viral/Bacterial Infection',
        severity: 'Medium',
        confidence: confidence,
        recommendations: [
          'Monitor temperature regularly',
          'Stay hydrated with fluids',
          'Rest and avoid strenuous activities',
          'Take paracetamol if temperature exceeds 100°F',
          'Consult doctor if fever persists beyond 3 days'
        ],
        urgency: 'Consult doctor if fever exceeds 103°F or persists',
        summary: 'Based on fever symptoms, this appears to be a possible infection. Monitor temperature, stay hydrated, and rest. Seek medical attention if fever is high or persistent.'
      };
    }

    // Headache symptoms
    if (text.includes('headache') || text.includes('head pain') || text.includes('migraine') || text.includes('सिरदर्द') || text.includes('सिर') || text.includes('ਸਿਰ ਦਰਦ') || text.includes('ਸਿਰ')) {
      if (isHindi) {
        return {
          condition: 'सिरदर्द/तनाव संबंधी दर्द',
          severity: 'कम से मध्यम',
          recommendations: [
            'शांत और अंधेरे कमरे में आराम करें',
            'पर्याप्त पानी पिएं और हाइड्रेटेड रहें',
            'तनाव कम करने की तकनीकों का अभ्यास करें',
            'नियमित नींद का पैटर्न बनाए रखें',
            'यदि आवश्यक हो तो हल्की दर्द निवारक दवा लें'
          ],
          urgency: 'यदि सिरदर्द गंभीर हो, अचानक शुरू हो, या बुखार के साथ हो तो तुरंत डॉक्टर से मिलें',
          summary: 'सिरदर्द आम तौर पर तनाव, निर्जलीकरण या थकान के कारण होता है। आराम करें, हाइड्रेटेड रहें और तनाव कम करें।'
        };
      } else if (isPunjabi) {
        return {
          condition: 'ਸਿਰ ਦਰਦ/ਤਣਾਅ ਸੰਬੰਧੀ ਦਰਦ',
          severity: 'ਘੱਟ ਤੋਂ ਮਧਿਮ',
          recommendations: [
            'ਸ਼ਾਂਤ ਅਤੇ ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ',
            'ਪਰ੍ਯਾਪਤ ਪਾਣੀ ਪੀਓ ਅਤੇ ਹਾਇਡਰੇਟੇਡ ਰਹੋ',
            'ਤਣਾਅ ਘਟਾਉਣ ਦੀਆਂ ਤਕਨੀਕਾਂ ਦਾ ਅਭਿਆਸ ਕਰੋ',
            'ਨਿਯਮਿਤ ਨੀਂਦ ਦਾ ਪੈਟਰਨ ਬਣਾਈ ਰੱਖੋ',
            'ਜੇ ਲੋੜ ਹੋਵੇ ਤਾਂ ਹਲਕੀ ਦਰਦ ਨਿਵਾਰਕ ਦਵਾਈ ਲਓ'
          ],
          urgency: 'ਜੇ ਸਿਰ ਦਰਦ ਗੰਭੀਰ ਹੋਵੇ, ਅਚਾਨਕ ਸ਼ੁਰੂ ਹੋਵੇ, ਜਾਂ ਬੁਖਾਰ ਨਾਲ ਹੋਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ',
          summary: 'ਸਿਰ ਦਰਦ ਆਮ ਤੌਰ ਤੇ ਤਣਾਅ, ਪਾਣੀ ਦੀ ਕਮੀ ਜਾਂ ਥਕਾਵਟ ਕਾਰਨ ਹੁੰਦਾ ਹੈ। ਆਰਾਮ ਕਰੋ, ਹਾਇਡਰੇਟੇਡ ਰਹੋ ਅਤੇ ਤਣਾਅ ਘਟਾਓ।'
        };
      }
      return {
        condition: 'Tension/Stress Headache',
        severity: 'Low to Medium',
        recommendations: [
          'Rest in a quiet, dark room',
          'Stay hydrated and drink plenty of water',
          'Practice stress reduction techniques',
          'Maintain regular sleep patterns',
          'Take mild pain relievers if necessary'
        ],
        urgency: 'Seek immediate medical attention if headache is severe, sudden onset, or accompanied by fever',
        summary: 'Headaches are commonly caused by stress, dehydration, or fatigue. Rest, stay hydrated, and manage stress levels.'
      };
    }

    // Cough symptoms
    if (text.includes('cough') || text.includes('coughing') || text.includes('throat') || text.includes('खांसी') || text.includes('गला') || text.includes('ਖੰਘ') || text.includes('ਗਲਾ')) {
      if (isHindi) {
        return {
          condition: 'श्वसन संक्रमण/खांसी',
          severity: 'कम से मध्यम',
          recommendations: [
            'गर्म पानी और शहद का सेवन करें',
            'भाप लें और गर्म तरल पदार्थ पिएं',
            'धूम्रपान और धूल से बचें',
            'पर्याप्त आराम करें',
            'यदि कफ में खून आए तो तुरंत डॉक्टर से मिलें'
          ],
          urgency: 'यदि खांसी 2 सप्ताह से अधिक रहे या सांस लेने में कठिनाई हो तो डॉक्टर से सलाह लें',
          summary: 'खांसी आमतौर पर श्वसन संक्रमण या जलन के कारण होती है। गर्म तरल पदार्थ लें, भाप लें और आराम करें।'
        };
      } else if (isPunjabi) {
        return {
          condition: 'ਸਾਹ ਸੰਬੰਧੀ ਸੰਕਰਮਣ/ਖੰਘ',
          severity: 'ਘੱਟ ਤੋਂ ਮਧਿਮ',
          recommendations: [
            'ਗਰਮ ਪਾਣੀ ਅਤੇ ਸ਼ਹਿਦ ਦਾ ਸੇਵਨ ਕਰੋ',
            'ਭਾਫ਼ ਲਓ ਅਤੇ ਗਰਮ ਤਰਲ ਪਦਾਰਥ ਪੀਓ',
            'ਸਿਗਰਟ ਅਤੇ ਧੂੜ ਤੋਂ ਬਚੋ',
            'ਪਰ੍ਯਾਪਤ ਆਰਾਮ ਕਰੋ',
            'ਜੇ ਕਫ਼ ਵਿੱਚ ਖੂਨ ਆਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ'
          ],
          urgency: 'ਜੇ ਖੰਘ 2 ਹਫ਼ਤਿਆਂ ਤੋਂ ਜ਼ਿਆਦਾ ਰਹੇ ਜਾਂ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ',
          summary: 'ਖੰਘ ਆਮ ਤੌਰ ਤੇ ਸਾਹ ਸੰਬੰਧੀ ਸੰਕਰਮਣ ਜਾਂ ਜਲਣ ਕਾਰਨ ਹੁੰਦੀ ਹੈ। ਗਰਮ ਤਰਲ ਪਦਾਰਥ ਲਓ, ਭਾਫ਼ ਲਓ ਅਤੇ ਆਰਾਮ ਕਰੋ।'
        };
      }
      return {
        condition: 'Respiratory Infection/Cough',
        severity: 'Low to Medium',
        recommendations: [
          'Drink warm water with honey',
          'Inhale steam and consume warm liquids',
          'Avoid smoking and dust exposure',
          'Get adequate rest',
          'Seek immediate care if coughing up blood'
        ],
        urgency: 'Consult doctor if cough persists beyond 2 weeks or breathing difficulties occur',
        summary: 'Cough is commonly caused by respiratory infections or irritation. Take warm liquids, inhale steam, and rest.'
      };
    }

    // Rash/Skin symptoms
    if (text.includes('rash') || text.includes('skin') || text.includes('itch') || text.includes('red') || text.includes('दाने') || text.includes('खुजली') || text.includes('त्वचा') || text.includes('ਦਾਣੇ') || text.includes('ਖੁਜਲੀ') || text.includes('ਚਮੜੀ')) {
      if (isHindi) {
        return {
          condition: 'त्वचा संबंधी समस्या/एलर्जी',
          severity: 'कम से मध्यम',
          recommendations: [
            'ठंडे पानी से नहाएं और सूती कपड़े पहनें',
            'खुजली न करें और त्वचा को साफ रखें',
            'एलर्जी वाले खाद्य पदार्थों से बचें',
            'मॉइस्चराइज़र का उपयोग करें',
            'यदि दाने फैलते रहें तो त्वचा विशेषज्ञ से मिलें'
          ],
          urgency: 'यदि दाने तेजी से फैलें, बुखार के साथ हों, या सांस लेने में कठिनाई हो तो तुरंत डॉक्टर से मिलें',
          summary: 'त्वचा पर दाने आमतौर पर एलर्जी या जलन के कारण होते हैं। ठंडे पानी से नहाएं, खुजली न करें और साफ-सफाई रखें।'
        };
      } else if (isPunjabi) {
        return {
          condition: 'ਚਮੜੀ ਸੰਬੰਧੀ ਸਮੱਸਿਆ/ਐਲਰਜੀ',
          severity: 'ਘੱਟ ਤੋਂ ਮਧਿਮ',
          recommendations: [
            'ਠੰਡੇ ਪਾਣੀ ਨਾਲ ਨਹਾਓ ਅਤੇ ਸੂਤੀ ਕੱਪੜੇ ਪਹਿਨੋ',
            'ਖੁਜਲੀ ਨਾ ਕਰੋ ਅਤੇ ਚਮੜੀ ਨੂੰ ਸਾਫ਼ ਰੱਖੋ',
            'ਐਲਰਜੀ ਵਾਲੇ ਭੋਜਨ ਤੋਂ ਬਚੋ',
            'ਮਾਇਸਚਰਾਇਜ਼ਰ ਦੀ ਵਰਤੋਂ ਕਰੋ',
            'ਜੇ ਦਾਣੇ ਫੈਲਦੇ ਰਹਿਣ ਤਾਂ ਚਮੜੀ ਦੇ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ'
          ],
          urgency: 'ਜੇ ਦਾਣੇ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਣ, ਬੁਖਾਰ ਨਾਲ ਹੋਣ, ਜਾਂ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ',
          summary: 'ਚਮੜੀ ਤੇ ਦਾਣੇ ਆਮ ਤੌਰ ਤੇ ਐਲਰਜੀ ਜਾਂ ਜਲਣ ਕਾਰਨ ਹੁੰਦੇ ਹਨ। ਠੰਡੇ ਪਾਣੀ ਨਾਲ ਨਹਾਓ, ਖੁਜਲੀ ਨਾ ਕਰੋ ਅਤੇ ਸਾਫ਼-ਸਫ਼ਾਈ ਰੱਖੋ।'
        };
      }
      return {
        condition: 'Skin Irritation/Allergic Reaction',
        severity: 'Low to Medium',
        recommendations: [
          'Take cool baths and wear cotton clothing',
          'Avoid scratching and keep skin clean',
          'Identify and avoid allergens',
          'Use moisturizers regularly',
          'Consult dermatologist if rash spreads or worsens'
        ],
        urgency: 'Seek immediate care if rash spreads rapidly, accompanied by fever, or breathing difficulties',
        summary: 'Skin rashes are commonly caused by allergies or irritation. Take cool baths, avoid scratching, and maintain good hygiene.'
      };
    }

    // Vomiting/Nausea symptoms
    if (text.includes('vomit') || text.includes('nausea') || text.includes('throw up') || text.includes('sick') || text.includes('उल्टी') || text.includes('मतली') || text.includes('जी मिचलाना') || text.includes('ਉਲਟੀ') || text.includes('ਜੀ ਮਿਚਲਾਉਣਾ')) {
      if (isHindi) {
        return {
          condition: 'पेट संबंधी समस्या/गैस्ट्राइटिस',
          severity: 'मध्यम',
          recommendations: [
            'थोड़ा-थोड़ा पानी पिएं और हाइड्रेटेड रहें',
            'अदरक की चाय या नींबू पानी लें',
            'हल्का और सादा खाना खाएं (जैसे दलिया, टोस्ट)',
            'आराम करें और तनाव कम करें',
            'यदि उल्टी में खून आए तो तुरंत डॉक्टर से मिलें'
          ],
          urgency: 'यदि उल्टी लगातार हो, निर्जलीकरण के लक्षण हों, या पेट में तेज दर्द हो तो तुरंत चिकित्सा सहायता लें',
          summary: 'उल्टी आमतौर पर पेट की खराबी, संक्रमण या खाद्य विषाक्तता के कारण होती है। हाइड्रेटेड रहें, हल्का खाना खाएं और आराम करें।'
        };
      } else if (isPunjabi) {
        return {
          condition: 'ਪੇਟ ਸੰਬੰਧੀ ਸਮੱਸਿਆ/ਗੈਸਟ੍ਰਾਇਟਿਸ',
          severity: 'ਮਧਿਮ',
          recommendations: [
            'ਥੋੜਾ-ਥੋੜਾ ਪਾਣੀ ਪੀਓ ਅਤੇ ਹਾਇਡਰੇਟੇਡ ਰਹੋ',
            'ਅਦਰਕ ਦੀ ਚਾਹ ਜਾਂ ਨਿੰਬੂ ਪਾਣੀ ਲਓ',
            'ਹਲਕਾ ਅਤੇ ਸਾਦਾ ਖਾਣਾ ਖਾਓ (ਜਿਵੇਂ ਦਲੀਆ, ਟੋਸਟ)',
            'ਆਰਾਮ ਕਰੋ ਅਤੇ ਤਣਾਅ ਘਟਾਓ',
            'ਜੇ ਉਲਟੀ ਵਿੱਚ ਖੂਨ ਆਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ'
          ],
          urgency: 'ਜੇ ਉਲਟੀ ਲਗਾਤਾਰ ਹੋਵੇ, ਪਾਣੀ ਦੀ ਕਮੀ ਦੇ ਲੱਛਣ ਹੋਣ, ਜਾਂ ਪੇਟ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਹੋਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਲਓ',
          summary: 'ਉਲਟੀ ਆਮ ਤੌਰ ਤੇ ਪੇਟ ਦੀ ਖਰਾਬੀ, ਸੰਕਰਮਣ ਜਾਂ ਭੋਜਨ ਵਿਸ਼ਾਕਤਤਾ ਕਾਰਨ ਹੁੰਦੀ ਹੈ। ਹਾਇਡਰੇਟੇਡ ਰਹੋ, ਹਲਕਾ ਖਾਣਾ ਖਾਓ ਅਤੇ ਆਰਾਮ ਕਰੋ।'
        };
      }
      return {
        condition: 'Gastric Upset/Gastritis',
        severity: 'Medium',
        recommendations: [
          'Sip small amounts of water frequently to stay hydrated',
          'Try ginger tea or lemon water',
          'Eat bland, light foods (like porridge, toast)',
          'Rest and reduce stress',
          'Seek immediate care if vomiting blood'
        ],
        urgency: 'Seek immediate medical attention if vomiting persists, signs of dehydration occur, or severe abdominal pain',
        summary: 'Vomiting is commonly caused by stomach upset, infection, or food poisoning. Stay hydrated, eat light foods, and rest.'
      };
    }

    // Default response based on language
    if (isHindi) {
      return {
        condition: 'सामान्य स्वास्थ्य चिंता',
        severity: 'अज्ञात',
        recommendations: [
          'लक्षणों की बारीकी से निगरानी करें',
          'अच्छी स्वच्छता बनाए रखें',
          'हाइड्रेटेड रहें और पर्याप्त आराम करें',
          'बिना सलाह के दवा न लें',
          'लक्षणों की डायरी रखें'
        ],
        urgency: 'उचित मूल्यांकन के लिए स्वास्थ्य सेवा प्रदाता से सलाह लें',
        summary: 'आपके लक्षणों के लिए पेशेवर चिकित्सा मूल्यांकन की आवश्यकता है। अपनी स्थिति की निगरानी करें और उचित निदान व इलाज के लिए स्वास्थ्य सेवा प्रदाता से सलाह लें।'
      };
    } else if (isPunjabi) {
      return {
        condition: 'ਆਮ ਸਿਹਤ ਚਿੰਤਾ',
        severity: 'ਅਗਿਆਤ',
        recommendations: [
          'ਲੱਛਣਾਂ ਦੀ ਬਾਰੀਕੀ ਨਾਲ ਨਿਗਰਾਨੀ ਕਰੋ',
          'ਚੰਗੀ ਸਾਫ-ਸਫਾਈ ਬਣਾਈ ਰੱਖੋ',
          'ਹਾਇਡਰੇਟੇਡ ਰਹੋ ਅਤੇ ਪਰ੍ਯਾਪਤ ਆਰਾਮ ਕਰੋ',
          'ਬਿਨਾਂ ਸਲਾਹ ਦਵਾਈ ਨਾ ਲਓ',
          'ਲੱਛਣਾਂ ਦੀ ਡਾਇਰੀ ਰੱਖੋ'
        ],
        urgency: 'ਸਹੀ ਮੁਲਾਂਕਣ ਲਈ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ',
        summary: 'ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਲਈ ਪੇਸ਼ੇਵਰ ਡਾਕਟਰੀ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ। ਆਪਣੀ ਸਥਿਤੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਸਹੀ ਨਿਦਾਨ ਅਤੇ ਇਲਾਜ ਲਈ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
      };
    }

    // Default English response
    return {
      condition: 'General Health Concern',
      severity: 'Unknown',
      recommendations: [
        'Monitor symptoms closely',
        'Maintain good hygiene',
        'Stay hydrated and get adequate rest',
        'Avoid self-medication without consultation',
        'Keep a symptom diary'
      ],
      urgency: 'Consult healthcare provider for proper evaluation',
      summary: 'Your symptoms require professional medical evaluation. Monitor your condition, maintain good health practices, and consult a healthcare provider for proper diagnosis and treatment.'
    };
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice-Enabled Symptom Checker</h2>
        <p className="text-gray-600">Describe your symptoms by typing or speaking, and get preliminary health guidance.</p>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe Your Symptoms
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail... (e.g., 'I have fever, headache, and body aches for 2 days')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
          
          {/* Voice Assistant */}
          <div className="flex flex-col gap-2">
            <VoiceAssistant
              onVoiceInput={handleVoiceInput}
              textToSpeak={lastResult}
              language={i18n.language}
            />
          </div>
        </div>
        
        <button
          onClick={() => analyzeSymptoms()}
          disabled={!symptoms.trim() || isAnalyzing}
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Analyze Symptoms
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Preliminary Assessment</h3>
            </div>
            <p className="text-blue-700">{results.condition}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Severity Level:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(results.severity)}`}>
              {results.severity}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recommended Actions
            </h4>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Important Notice
            </h4>
            <p className="text-red-700 text-sm mb-2">{results.urgency}</p>
            <p className="text-red-600 text-xs">
              ⚠️ This is not a medical diagnosis. Always consult qualified healthcare professionals for proper medical advice.
            </p>
          </div>

          {/* Voice Output Controls */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">Click the speaker icon above to hear the assessment summary</span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Medical Disclaimer:</strong> This symptom checker provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers.
        </p>
      </div>
    </div>
  );
};

export default VoiceSymptomChecker;