import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';

const VoiceAssistant = ({ onVoiceInput, textToSpeak, className = "", language = 'en' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  // Language mapping for speech recognition
  const getRecognitionLanguage = useCallback((lang) => {
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'pa': 'en-US', // Punjabi uses English recognition for now
      'es': 'es-ES',
      'fr': 'fr-FR'
    };
    return langMap[lang] || 'en-US';
  }, []);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return false;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = getRecognitionLanguage(language);

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech result:', transcript);
        setIsListening(false);
        if (onVoiceInput) {
          onVoiceInput(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error !== 'aborted') {
          switch (event.error) {
            case 'not-allowed':
              setError('Microphone access denied');
              setHasPermission(false);
              break;
            case 'no-speech':
              setError('No speech detected');
              break;
            default:
              setError('Voice recognition failed');
          }
        }
      };

      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      return false;
    }
  }, [language, onVoiceInput, getRecognitionLanguage]);

  // Initialize speech synthesis
  const initSpeechSynthesis = useCallback(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Ensure synthesis is ready
      if (synthRef.current.getVoices().length === 0) {
        synthRef.current.addEventListener('voiceschanged', () => {
          console.log('Voices loaded:', synthRef.current.getVoices().length);
        });
      }
      return true;
    }
    return false;
  }, []);

  // Check microphone permission
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      setHasPermission(result.state === 'granted');
      
      result.addEventListener('change', () => {
        setHasPermission(result.state === 'granted');
      });
    } catch (error) {
      console.log('Permission API not supported, will request on use');
    }
  }, []);

  useEffect(() => {
    const speechRecognitionSupported = initSpeechRecognition();
    const speechSynthesisSupported = initSpeechSynthesis();
    
    setIsSupported(speechRecognitionSupported && speechSynthesisSupported);
    
    if (speechRecognitionSupported) {
      checkMicrophonePermission();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [initSpeechRecognition, initSpeechSynthesis, checkMicrophonePermission]);

  // Remove auto-speak to prevent automatic speech

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setError('');
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      return false;
    }
  };

  const startListening = async () => {
    if (isListening) return;
    
    setError('');
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      // Initialize recognition if not exists
      if (!recognitionRef.current) {
        const success = initSpeechRecognition();
        if (!success) {
          setError('Speech recognition not supported');
          return;
        }
      }
      
      // Update language and start
      recognitionRef.current.lang = getRecognitionLanguage(language);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Microphone access denied or failed to start');
      setHasPermission(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if (!synthRef.current || !text) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Wait a bit for cancel to complete
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        // Configure utterance
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Select appropriate voice for language
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          let voice = null;
          
          if (language === 'hi') {
            voice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('hi'));
          } else if (language === 'pa') {
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
        }
        
        utterance.onstart = () => {
          console.log('Speech synthesis started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Speech synthesis ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          setIsSpeaking(false);
          setError('Speech synthesis failed. Please try again.');
        };
        
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error('Failed to create speech utterance:', error);
        setError('Failed to start speech. Please try again.');
        setIsSpeaking(false);
      }
    }, 100);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Voice not supported
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        {/* Voice Input Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-2 rounded-full transition-colors ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Voice Output Button */}
        <button
          onClick={isSpeaking ? stopSpeaking : () => textToSpeak && speakText(textToSpeak)}
          className={`p-2 rounded-full transition-colors ${
            isSpeaking 
              ? 'bg-orange-500 text-white animate-pulse' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
          disabled={!textToSpeak}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Status Indicator */}
        {(isListening || isSpeaking) && (
          <span className="text-xs text-gray-600">
            {isListening ? 'Listening...' : 'Speaking...'}
          </span>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-600 flex items-center gap-1 max-w-48">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;