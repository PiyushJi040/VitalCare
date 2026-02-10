// Voice utilities for better speech recognition and synthesis handling

export class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isInitialized = false;
    this.currentUtterance = null;
    this.onError = null;
    this.onSuccess = null;
  }

  // Initialize voice services
  async initialize() {
    try {
      // Check browser support
      if (!this.checkSupport()) {
        throw new Error('Voice features not supported in this browser');
      }

      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }

      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
        await this.loadVoices();
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Voice initialization failed:', error);
      if (this.onError) this.onError(error.message);
      return false;
    }
  }

  // Check browser support
  checkSupport() {
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    const mediaDevicesSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    
    return speechRecognitionSupported && speechSynthesisSupported && mediaDevicesSupported;
  }

  // Setup speech recognition
  setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = 'en-US';
  }

  // Load available voices
  async loadVoices() {
    return new Promise((resolve) => {
      if (this.synthesis.getVoices().length > 0) {
        resolve(this.synthesis.getVoices());
      } else {
        this.synthesis.addEventListener('voiceschanged', () => {
          resolve(this.synthesis.getVoices());
        });
      }
    });
  }

  // Request microphone permission
  async requestMicrophonePermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      if (this.onError) this.onError('Microphone access denied. Please allow microphone access.');
      return false;
    }
  }

  // Start speech recognition
  async startRecognition(language = 'en-US') {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    // Request permission first
    const hasPermission = await this.requestMicrophonePermission();
    if (!hasPermission) {
      throw new Error('Microphone permission required');
    }

    this.recognition.lang = language;
    
    return new Promise((resolve, reject) => {
      this.recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Stop speech recognition
  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Speak text
  async speakText(text, options = {}) {
    if (!this.synthesis || !text) {
      throw new Error('Speech synthesis not available or no text provided');
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    return new Promise((resolve, reject) => {
      // Wait a bit for cancel to complete
      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          this.currentUtterance = utterance;

          // Configure utterance
          utterance.rate = options.rate || 0.8;
          utterance.pitch = options.pitch || 1;
          utterance.volume = options.volume || 1;

          // Select voice if specified
          if (options.language) {
            const voices = this.synthesis.getVoices();
            const voice = voices.find(v => v.lang.startsWith(options.language));
            if (voice) utterance.voice = voice;
          }

          utterance.onstart = () => {
            console.log('Speech synthesis started');
          };

          utterance.onend = () => {
            console.log('Speech synthesis ended');
            this.currentUtterance = null;
            resolve();
          };

          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.currentUtterance = null;
            reject(new Error(`Speech synthesis error: ${event.error}`));
          };

          this.synthesis.speak(utterance);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Stop speech synthesis
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis && this.synthesis.speaking;
  }

  // Check if currently listening
  isListening() {
    return this.recognition && this.recognition.state === 'listening';
  }

  // Get available voices
  getVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  // Get voices for specific language
  getVoicesForLanguage(language) {
    const voices = this.getVoices();
    return voices.filter(voice => voice.lang.startsWith(language));
  }

  // Cleanup
  cleanup() {
    this.stopRecognition();
    this.stopSpeaking();
    this.recognition = null;
    this.synthesis = null;
    this.isInitialized = false;
  }
}

// Create singleton instance
export const voiceManager = new VoiceManager();

// Utility functions
export const initializeVoice = async () => {
  return await voiceManager.initialize();
};

export const checkVoiceSupport = () => {
  return voiceManager.checkSupport();
};

export const requestMicPermission = async () => {
  return await voiceManager.requestMicrophonePermission();
};

// Language mapping for speech recognition
export const getRecognitionLanguage = (language) => {
  const langMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'pa': 'en-US', // Punjabi uses English recognition
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-BR',
    'ru': 'ru-RU',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN'
  };
  return langMap[language] || 'en-US';
};

// Get appropriate voice for language
export const getVoiceForLanguage = (language) => {
  const voices = voiceManager.getVoices();
  
  // Try to find a voice that matches the language
  let voice = voices.find(v => v.lang.startsWith(language));
  
  // Fallback to English if no voice found
  if (!voice) {
    voice = voices.find(v => v.lang.startsWith('en'));
  }
  
  // Final fallback to first available voice
  if (!voice && voices.length > 0) {
    voice = voices[0];
  }
  
  return voice;
};

export default voiceManager;