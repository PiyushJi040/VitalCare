import express from 'express';
import axios from 'axios';

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCtOKb3jxxXg3lzbwA2TPwRRhiBzmnDxyY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let prompt;
    if (language === 'hi') {
      prompt = `आप SWASTH नामक टेलीमेडिसिन प्लेटफॉर्म के लिए एक सहायक चिकित्सा AI सहायक हैं।
      सहायक, सटीक चिकित्सा जानकारी प्रदान करें और हमेशा उपयोगकर्ताओं को गंभीर चिंताओं के लिए स्वास्थ्य पेशेवरों से सलाह लेने की सिफारिश करें।
      जवाब संक्षिप्त और मित्रवत रखें। कृपया हिंदी में उत्तर दें। उपयोगकर्ता का प्रश्न: ${message}`;
    } else if (language === 'pa') {
      prompt = `ਤੁਸੀਂ SWASTH ਨਾਮਕ ਟੈਲੀਮੈਡੀਸਿਨ ਪਲੇਟਫਾਰਮ ਲਈ ਇੱਕ ਸਹਾਇਕ ਮੈਡੀਕਲ AI ਸਹਾਇਕ ਹੋ।
      ਸਹਾਇਕ, ਸਟੀਕ ਮੈਡੀਕਲ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰੋ ਅਤੇ ਹਮੇਸ਼ਾ ਯੂਜ਼ਰਾਂ ਨੂੰ ਗੰਭੀਰ ਚਿੰਤਾਵਾਂ ਲਈ ਸਿਹਤ ਪੇਸ਼ੇਵਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋ।
      ਜਵਾਬ ਸੰਖੇਪ ਅਤੇ ਦੋਸਤਾਨਾ ਰੱਖੋ। ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਯੂਜ਼ਰ ਦਾ ਸਵਾਲ: ${message}`;
    } else {
      prompt = `You are a helpful medical AI assistant for a telemedicine platform called SWASTH. 
      Provide helpful, accurate medical information while always recommending users consult with healthcare professionals for serious concerns.
      Keep responses concise and friendly. User question: ${message}`;
    }

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const botResponse = response.data.candidates[0].content.parts[0].text;
    
    res.json({
      response: botResponse,
      status: 'success'
    });

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    // Provide a helpful fallback response
    const fallbackResponse = getFallbackResponse(message, language);
    
    res.json({
      response: fallbackResponse,
      status: 'success',
      note: 'Fallback response - AI service temporarily unavailable'
    });
  }
});

function getFallbackResponse(message, language = 'en') {
  const lowerMessage = message.toLowerCase();
  
  // Check for Hindi/Punjabi keywords
  const hindiKeywords = ['बुखार', 'सिरदर्द', 'खांसी', 'पेट', 'दाने', 'उल्टी', 'नमस्ते', 'हैलो'];
  const punjabKeywords = ['ਬੁਖਾਰ', 'ਸਿਰ ਦਰਦ', 'ਖੰਘ', 'ਪੇਟ', 'ਦਾਣੇ', 'ਉਲਟੀ', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਹੈਲੋ'];
  
  const isHindi = hindiKeywords.some(keyword => message.includes(keyword)) || language === 'hi';
  const isPunjabi = punjabKeywords.some(keyword => message.includes(keyword)) || language === 'pa';
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || message.includes('बुखार') || message.includes('ਬੁਖਾਰ')) {
    if (isHindi) return 'बुखार के लिए, आराम करें और हाइड्रेटेड रहें। यदि तापमान 101°F (38.3°C) से अधिक है या बना रहता है, तो स्वास्थ्य सेवा प्रदाता से सलाह लें।';
    if (isPunjabi) return 'ਬੁਖਾਰ ਲਈ, ਆਰਾਮ ਕਰੋ ਅਤੇ ਹਾਈਡ੍ਰੇਟਿਡ ਰਹੋ। ਜੇ ਤਾਪਮਾਨ 101°F (38.3°C) ਤੋਂ ਜ਼ਿਆਦਾ ਹੈ ਜਾਂ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ, ਤਾਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
    return 'For fever, rest and stay hydrated. If temperature exceeds 101°F (38.3°C) or persists, consult a healthcare provider.';
  }
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain') || lowerMessage.includes('migraine') || message.includes('सिरदर्द') || message.includes('सिर') || message.includes('ਸਿਰ ਦਰਦ') || message.includes('ਸਿਰ')) {
    if (isHindi) return 'सिरदर्द के लिए, शांत, अंधेरे कमरे में आराम करें, हाइड्रेटेड रहें और तनाव कम करें। यदि गंभीर या लगातार है, तो कृपया स्वास्थ्य सेवा प्रदाता से सलाह लें।';
    if (isPunjabi) return 'ਸਿਰ ਦਰਦ ਲਈ, ਸ਼ਾਂਤ, ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ, ਹਾਈਡ੍ਰੇਟਿਡ ਰਹੋ ਅਤੇ ਤਣਾਅ ਘਟਾਓ। ਜੇ ਗੰਭੀਰ ਜਾਂ ਲਗਾਤਾਰ ਹੈ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
    return 'For headaches, rest in a quiet, dark room, stay hydrated, and reduce stress. If severe or persistent, please consult a healthcare provider.';
  }
  if (lowerMessage.includes('cough') || lowerMessage.includes('coughing') || lowerMessage.includes('cold') || message.includes('खांसी') || message.includes('ਖੰਘ')) {
    if (isHindi) return 'खांसी के लिए गर्म पानी पिएं, शहद लें, भाप लें और धूम्रपान से बचें। यदि 2 सप्ताह से अधिक रहे तो डॉक्टर से मिलें।';
    if (isPunjabi) return 'ਖੰਘ ਲਈ ਗਰਮ ਪਾਣੀ ਪੀਓ, ਸ਼ਹਿਦ ਲਓ, ਭਾਫ਼ ਲਓ ਅਤੇ ਸਿਗਰਟ ਤੋਂ ਬਚੋ। ਜੇ 2 ਹਫ਼ਤਿਆਂ ਤੋਂ ਜ਼ਿਆਦਾ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।';
    return 'For cough, drink warm water, take honey, inhale steam, and avoid smoking. If it persists for more than 2 weeks, see a doctor.';
  }
  if (lowerMessage.includes('rash') || lowerMessage.includes('skin') || lowerMessage.includes('itch') || lowerMessage.includes('red') || message.includes('दाने') || message.includes('खुजली') || message.includes('त्वचा') || message.includes('ਦਾਣੇ') || message.includes('ਖੁਜਲੀ') || message.includes('ਚਮੜੀ')) {
    if (isHindi) return 'दाने या खुजली के लिए ठंडे पानी से नहाएं, सूती कपड़े पहनें, खुजली न करें और एलर्जी वाले खाद्य पदार्थों से बचें। यदि बढ़ते रहें तो त्वचा विशेषज्ञ से मिलें।';
    if (isPunjabi) return 'ਦਾਣੇ ਜਾਂ ਖੁਜਲੀ ਲਈ ਠੰਡੇ ਪਾਣੀ ਨਾਲ ਨਹਾਓ, ਸੂਤੀ ਕੱਪੜੇ ਪਹਿਨੋ, ਖੁਜਲੀ ਨਾ ਕਰੋ ਅਤੇ ਐਲਰਜੀ ਵਾਲੇ ਭੋਜਨ ਤੋਂ ਬਚੋ। ਜੇ ਵਧਦੇ ਰਹਿਣ ਤਾਂ ਚਮੜੀ ਦੇ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।';
    return 'For rashes or itching, take cool baths, wear cotton clothing, avoid scratching, and identify allergens. Consult a dermatologist if it worsens.';
  }
  if (lowerMessage.includes('vomit') || lowerMessage.includes('nausea') || lowerMessage.includes('throw up') || lowerMessage.includes('sick') || message.includes('उल्टी') || message.includes('मतली') || message.includes('जी मिचलाना') || message.includes('ਉਲਟੀ') || message.includes('ਜੀ ਮਿਚਲਾਉਣਾ')) {
    if (isHindi) return 'उल्टी के लिए थोड़ा-थोड़ा पानी पिएं, अदरक की चाय लें, हल्का खाना खाएं और आराम करें। यदि निरंतर हो या खून आए तो तुरंत डॉक्टर से मिलें।';
    if (isPunjabi) return 'ਉਲਟੀ ਲਈ ਥੋੜਾ-ਥੋੜਾ ਪਾਣੀ ਪੀਓ, ਅਦਰਕ ਦੀ ਚਾਹ ਲਓ, ਹਲਕਾ ਖਾਣਾ ਖਾਓ ਅਤੇ ਆਰਾਮ ਕਰੋ। ਜੇ ਲਗਾਤਾਰ ਹੋਵੇ ਜਾਂ ਖੂਨ ਆਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।';
    return 'For vomiting, sip small amounts of water, try ginger tea, eat bland foods, and rest. Seek immediate care if vomiting persists or contains blood.';
  }
  if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea') || message.includes('पेट') || message.includes('ਪੇਟ')) {
    if (isHindi) return 'पेट की समस्याओं के लिए, चावल या टोस्ट जैसे सादे खाद्य पदार्थों की कोशिश करें, हाइड्रेटेड रहें, और आराम करें। यदि लक्षण गंभीर हैं, तो स्वास्थ्य सेवा प्रदाता से सलाह लें।';
    if (isPunjabi) return 'ਪੇਟ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਲਈ, ਚਾਵਲ ਜਾਂ ਟੋਸਟ ਵਰਗੇ ਸਾਦੇ ਭੋਜਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ, ਹਾਈਡ੍ਰੇਟਿਡ ਰਹੋ, ਅਤੇ ਆਰਾਮ ਕਰੋ। ਜੇ ਲੱਛਣ ਗੰਭੀਰ ਹਨ, ਤਾਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਸਲਾਹ ਕਰੋ।';
    return 'For stomach issues, try bland foods like rice or toast, stay hydrated, and rest. If symptoms are severe or persistent, consult a healthcare provider.';
  }
  
  if (isHindi) return 'आपके प्रश्न के लिए धन्यवाद। जबकि मुझे कनेक्टिविटी समस्याएं हो रही हैं, मैं व्यक्तिगत चिकित्सा सलाह के लिए स्वास्थ्य पेशेवर से परामर्श करने की सलाह देता हूं। आप हमारे प्लेटफॉर्म के माध्यम से अपॉइंटमेंट भी बुक कर सकते हैं।';
  if (isPunjabi) return 'ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਜਦੋਂ ਕਿ ਮੈਨੂੰ ਕਨੈਕਟਿਵਿਟੀ ਸਮੱਸਿਆਵਾਂ ਹੋ ਰਹੀਆਂ ਹਨ, ਮੈਂ ਨਿੱਜੀ ਮੈਡੀਕਲ ਸਲਾਹ ਲਈ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹਾਂ। ਤੁਸੀਂ ਸਾਡੇ ਪਲੇਟਫਾਰਮ ਰਾਹੀਂ ਅਪੌਇੰਟਮੈਂਟ ਵੀ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ।';
  return 'Thank you for your question. While I\'m having connectivity issues, I recommend consulting with a healthcare professional for personalized medical advice. You can also book an appointment through our platform.';
}

export default router;