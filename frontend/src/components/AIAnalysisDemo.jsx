import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AIAnalysisDemo = ({ selectedImage, onRemoveImage }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetAnalysis = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      // Simulate AI analysis with demo data
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

      // Create mock analysis result based on image type
      const mockResult = createMockAnalysisResult(selectedImage.type);
      
      // Navigate to AI Analysis page with results
      navigate('/ai-analysis', {
        state: {
          image: selectedImage.preview,
          imageFile: selectedImage.file,
          type: selectedImage.type,
          analysisResult: mockResult
        }
      });
      
      toast.success('AI analysis complete');
    } catch (error) {
      toast.error('AI analysis failed: ' + error.message);
      console.error('AI Analysis Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMockAnalysisResult = (type) => {
    const mockResults = {
      eye: {
        prediction: 'Cataract',
        confidence: 87,
        symptoms: ['Blurred vision', 'Light sensitivity', 'Halos around lights', 'Double vision'],
        info: 'Cataracts are very common as you get older. More than half of all Americans age 80 or older either have cataracts or have had surgery to get rid of cataracts.'
      },
      skin: {
        prediction: 'Benign',
        confidence: 92,
        symptoms: ['No concerning symptoms', 'Regular monitoring recommended'],
        info: 'This appears to be a benign skin condition. However, regular monitoring and annual dermatology checkups are recommended.'
      },
      bone: {
        prediction: 'No Fracture',
        confidence: 95,
        symptoms: ['No fracture-related symptoms'],
        info: 'No bone fractures detected in the X-ray image. If pain persists, consult with your healthcare provider.'
      }
    };

    return mockResults[type] || {
      prediction: 'Normal',
      confidence: 85,
      symptoms: ['No symptoms present'],
      info: 'Analysis complete. Please consult with a healthcare professional for detailed evaluation.'
    };
  };

  if (!selectedImage) return null;

  const getConditionColor = (type) => {
    switch(type) {
      case 'eye': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'skin': return 'bg-green-100 text-green-800 border-green-200';
      case 'bone': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionIcon = (type) => {
    switch(type) {
      case 'eye': return '👁️';
      case 'skin': return '🩹';
      case 'bone': return '🦴';
      default: return '📋';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{getConditionIcon(selectedImage.type)}</span>
        <div>
          <h3 className="text-lg font-semibold">AI Medical Analysis (Demo)</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(selectedImage.type)}`}>
            {selectedImage.type.charAt(0).toUpperCase() + selectedImage.type.slice(1)} Condition
          </span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <img
            src={selectedImage.preview}
            alt="Uploaded medical image"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
          />
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-500">Uploaded Image</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">Image uploaded successfully</span>
              </div>
              <p className="text-green-700 text-sm">
                Your medical image is ready for AI analysis. Click the button below to get instant diagnosis.
              </p>
            </div>
            
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 font-medium">Analyzing image with AI...</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">This may take a few seconds</p>
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800 font-medium">Demo Mode</span>
              </div>
              <p className="text-yellow-700 text-sm">
                This is a demonstration version. Results will open in a dedicated analysis page with mock data.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleGetAnalysis}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  loading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Get AI Analysis (Demo)'
                )}
              </button>
              <button
                onClick={onRemoveImage}
                disabled={loading}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisDemo;