import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, Bone, CheckCircle, AlertTriangle, FileText, Brain, Activity } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AIAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const { image, imageFile, type, analysisResult } = location.state || {};
    if (!image || !imageFile || !type) {
      toast.error('No image data found');
      navigate('/patient-dashboard');
      return;
    }
    
    setImageData({ image, imageFile, type });
    
    // If analysis result is already provided, use it directly
    if (analysisResult) {
      const formattedResult = formatAnalysisResult(analysisResult, type);
      setAnalysisResult(formattedResult);
      setLoading(false);
      toast.success('AI Analysis loaded successfully!');
    } else {
      performAIAnalysis(imageFile, type);
    }
  }, [location.state, navigate]);

  const performAIAnalysis = async (imageFile, type) => {
    setLoading(true);
    
    try {
      let endpoint = '';
      if (type === 'eye') {
        endpoint = '/api/ai/predict/eye';
      } else if (type === 'bone') {
        endpoint = '/api/ai/predict/xray';
      } else if (type === 'skin') {
        endpoint = '/api/ai/predict/skin';
      } else {
        throw new Error('AI analysis for this condition is not yet supported.');
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      
      if (result.status === 'success') {
        const formattedResult = formatAnalysisResult(result, type);
        setAnalysisResult(formattedResult);
        toast.success('AI Analysis completed successfully!');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast.error(`AI Analysis failed: ${error.message}`);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysisResult = (result, type) => {
    const condition = result.prediction;
    const confidence = result.confidence;
    
    return {
      condition: condition,
      confidence: confidence,
      severity: calculateSeverity(condition, confidence),
      description: getConditionDescription(condition, type),
      symptoms: result.symptoms || getConditionSymptoms(condition, type),
      info: result.info || getConditionInfo(condition, type),
      treatment: getConditionTreatment(condition, type),
      modelUsed: getModelName(type),
      analysisDate: new Date().toISOString(),
      urgency: calculateUrgency(condition, confidence, type),
      followUp: getFollowUpRecommendation(condition, type)
    };
  };

  const getModelName = (type) => {
    switch(type) {
      case 'eye': return 'Eye Disease Detection Model';
      case 'bone': return 'Fracture Detection Model';
      case 'skin': return 'Skin Condition Analysis Model';
      default: return 'Medical AI Model';
    }
  };

  const getConditionDescription = (condition, type) => {
    const descriptions = {
      // Eye conditions
      'Cataract': 'Clouding of the natural lens of the eye, causing vision problems.',
      'Diabetic Retinopathy': 'Damage to blood vessels in the retina due to diabetes.',
      'Glaucoma': 'Group of eye conditions that damage the optic nerve.',
      'Normal': type === 'eye' ? 'No abnormalities detected in the eye examination.' : 'No abnormalities detected.',
      // Bone conditions
      'Fracture': 'A break or crack in the bone structure detected.',
      'No Fracture': 'No bone fractures detected in the X-ray image.',
      // Skin conditions
      'Melanoma': 'A serious form of skin cancer that develops in melanocytes.',
      'Basal Cell Carcinoma': 'The most common type of skin cancer.',
      'Benign': 'Non-cancerous skin condition detected.',
    };
    return descriptions[condition] || `Detected condition: ${condition}`;
  };

  const getConditionSymptoms = (condition, type) => {
    const symptoms = {
      'Cataract': ['Blurred vision', 'Light sensitivity', 'Halos around lights', 'Double vision'],
      'Diabetic Retinopathy': ['Blurred vision', 'Dark spots', 'Vision loss', 'Color perception changes'],
      'Glaucoma': ['Gradual vision loss', 'Eye pain', 'Nausea', 'Tunnel vision'],
      'Normal': ['No symptoms present'],
      'Fracture': ['Pain', 'Swelling', 'Bruising', 'Deformity', 'Limited mobility'],
      'No Fracture': ['No fracture-related symptoms'],
      'Melanoma': ['Asymmetrical moles', 'Irregular borders', 'Color changes', 'Diameter changes'],
      'Basal Cell Carcinoma': ['Pearly bumps', 'Flat lesions', 'Bleeding sores', 'Waxy appearance'],
      'Benign': ['No concerning symptoms']
    };
    return symptoms[condition] || ['Consult healthcare provider for symptoms'];
  };

  const getConditionInfo = (condition, type) => {
    const info = {
      'Cataract': 'Cataracts are very common as you get older. More than half of all Americans age 80 or older either have cataracts or have had surgery to get rid of cataracts.',
      'Diabetic Retinopathy': 'This condition is a leading cause of blindness in adults. Early detection and treatment can prevent severe vision loss.',
      'Glaucoma': 'Often called the "silent thief of sight" because it can cause irreversible vision loss without early symptoms.',
      'Fracture': 'Bone fractures require immediate medical attention to ensure proper healing and prevent complications.',
      'Melanoma': 'Early detection of melanoma significantly improves treatment outcomes. Regular skin checks are important.',
      'Basal Cell Carcinoma': 'While rarely life-threatening, early treatment prevents extensive tissue damage.'
    };
    return info[condition] || 'Please consult with a healthcare professional for detailed information.';
  };

  const getConditionTreatment = (condition, type) => {
    const treatments = {
      'Cataract': {
        immediate: ['Use brighter lighting', 'Wear sunglasses', 'Update prescription glasses'],
        medication: ['Surgery may be required', 'Regular eye examinations', 'Monitor progression']
      },
      'Diabetic Retinopathy': {
        immediate: ['Control blood sugar strictly', 'Regular monitoring', 'Avoid smoking'],
        medication: ['Anti-VEGF injections', 'Laser therapy', 'Steroid injections']
      },
      'Glaucoma': {
        immediate: ['Regular eye pressure monitoring', 'Follow medication schedule'],
        medication: ['Eye drops to reduce pressure', 'Oral medications', 'Surgery if needed']
      },
      'Fracture': {
        immediate: ['Immobilize the area', 'Apply ice', 'Seek immediate medical attention'],
        medication: ['Pain relievers', 'Anti-inflammatory drugs', 'Calcium supplements']
      },
      'Melanoma': {
        immediate: ['Avoid sun exposure', 'Seek immediate dermatologist consultation'],
        medication: ['Surgical removal', 'Immunotherapy', 'Targeted therapy']
      }
    };
    return treatments[condition] || {
      immediate: ['Consult healthcare provider'],
      medication: ['As prescribed by doctor']
    };
  };

  const calculateUrgency = (condition, confidence, type) => {
    const urgentConditions = ['Glaucoma', 'Diabetic Retinopathy', 'Fracture', 'Melanoma'];
    const moderateConditions = ['Cataract', 'Basal Cell Carcinoma'];
    
    if (urgentConditions.includes(condition) && confidence > 80) {
      return 'High';
    } else if (moderateConditions.includes(condition) && confidence > 70) {
      return 'Medium';
    }
    return 'Low';
  };

  const calculateSeverity = (condition, confidence) => {
    if (condition === 'Normal' || condition === 'No Fracture' || condition === 'Benign') return 'Mild';
    if (confidence > 90) return 'High';
    if (confidence > 70) return 'Medium';
    return 'Mild';
  };

  const getFollowUpRecommendation = (condition, type) => {
    const followUps = {
      'Cataract': 'Schedule regular eye exams. Surgery may be needed if vision significantly impaired.',
      'Diabetic Retinopathy': 'Urgent ophthalmologist consultation required. Control diabetes strictly.',
      'Glaucoma': 'Immediate ophthalmologist consultation. Regular monitoring essential.',
      'Normal': 'Continue regular eye care and annual checkups.',
      'Fracture': 'Seek immediate orthopedic consultation. Immobilize and get X-ray confirmation.',
      'No Fracture': 'Monitor for pain. Consult doctor if symptoms persist.',
      'Melanoma': 'Urgent dermatologist consultation required. Avoid sun exposure.',
      'Benign': 'Regular skin monitoring recommended. Annual dermatology checkup.'
    };
    return followUps[condition] || 'Consult with a healthcare professional for proper evaluation.';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Mild': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getConditionIcon = (type) => {
    switch(type) {
      case 'eye': return <Eye className="h-5 w-5 text-blue-600" />;
      case 'bone': return <Bone className="h-5 w-5 text-orange-600" />;
      case 'skin': return <Activity className="h-5 w-5 text-green-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Brain className="h-8 w-8 text-blue-600 absolute top-4 left-1/2 transform -translate-x-1/2" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">AI Analysis in Progress...</h2>
          <p className="text-gray-300 mb-2">Our trained AI model is examining your medical image</p>
          <p className="text-sm text-blue-400 font-medium">
            Using: {imageData?.type && getModelName(imageData.type)}
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Analysis Failed</h2>
          <p className="text-gray-300 mb-4">Unable to analyze the image. Please try again.</p>
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/patient-dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-600 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Medical Analysis</h1>
              <p className="text-gray-400">Powered by Advanced AI Models</p>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Analyzed Image</h3>
              {imageData && (
                <img
                  src={imageData.image}
                  alt="Medical analysis"
                  className="w-full h-48 object-cover rounded-lg border mb-4"
                />
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {imageData?.type && getConditionIcon(imageData.type)}
                  <span className="font-medium text-gray-300">
                    {imageData?.type === 'eye' ? 'Eye Condition Analysis' : 
                     imageData?.type === 'bone' ? 'Bone Condition Analysis' : 
                     imageData?.type === 'skin' ? 'Skin Condition Analysis' : 'Medical Analysis'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-300">Analysis Complete</span>
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Confidence Score</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analysisResult.confidence}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${analysisResult.confidence}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mb-3">AI Confidence Level</p>
                {analysisResult.modelUsed && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-1">Model Used:</p>
                    <p className="text-sm text-blue-700">{analysisResult.modelUsed}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="lg:col-span-2">
            {/* Diagnosis */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Diagnosis</h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(analysisResult.urgency)}`}>
                    {analysisResult.urgency} Priority
                  </span>
                  <span className={`text-sm font-medium ${getSeverityColor(analysisResult.severity)}`}>
                    {analysisResult.severity}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">{analysisResult.condition}</h4>
              <p className="text-gray-300 mb-4">{analysisResult.description}</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> This AI analysis is for informational purposes only. 
                  Please consult with a qualified healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>

            {/* Medical Information */}
            {analysisResult.info && (
              <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Medical Information</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700 leading-relaxed">{analysisResult.info}</p>
                </div>
              </div>
            )}

            {/* Symptoms */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Common Symptoms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-300">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatment Plan */}
            {analysisResult.treatment && (
              <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Recommended Treatment</h3>
                
                {/* Immediate Care */}
                <div className="mb-6">
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Immediate Care
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.treatment.immediate.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium min-w-fit">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Medication */}
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Medication
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.treatment.medication.map((med, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium min-w-fit">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-300">{med}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Follow-up */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Follow-up Care</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800">{analysisResult.followUp}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPage;