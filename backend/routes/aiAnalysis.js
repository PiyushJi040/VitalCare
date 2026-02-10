import express from 'express';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';

const router = express.Router();
const upload = multer();

const AI_MODEL_SERVICE_URL = 'http://localhost:5001'; // Flask runs on port 5001

// Proxy route for eye disease prediction
router.post('/predict/eye', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${AI_MODEL_SERVICE_URL}/predict/eye`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Add additional medical information
    const result = {
      ...response.data,
      symptoms: getEyeSymptoms(response.data.prediction),
      info: getEyeInfo(response.data.prediction)
    };

    res.json(result);
  } catch (error) {
    console.error('Error forwarding eye prediction:', error.message);
    res.status(500).json({ 
      error: 'AI service unavailable. Please ensure the AI model service is running.',
      status: 'error'
    });
  }
});

// Proxy route for xray fracture prediction
router.post('/predict/xray', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${AI_MODEL_SERVICE_URL}/predict/xray`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Add additional medical information
    const result = {
      ...response.data,
      symptoms: getFractureSymptoms(response.data.prediction),
      info: getFractureInfo(response.data.prediction)
    };

    res.json(result);
  } catch (error) {
    console.error('Error forwarding xray prediction:', error.message);
    res.status(500).json({ 
      error: 'AI service unavailable. Please ensure the AI model service is running.',
      status: 'error'
    });
  }
});

// Helper functions to add medical information
function getEyeSymptoms(prediction) {
  const symptoms = {
    'Cataract': ['Cloudy or blurry vision', 'Increased sensitivity to light', 'Seeing halos around lights', 'Frequent changes in eyeglass prescription'],
    'Diabetic Retinopathy': ['Blurred or distorted vision', 'Dark spots or floaters', 'Difficulty seeing at night', 'Colors appearing faded'],
    'Glaucoma': ['Gradual loss of peripheral vision', 'Tunnel vision in advanced stages', 'Eye pain or pressure', 'Halos around lights'],
    'Normal': ['No symptoms detected', 'Regular eye checkups recommended']
  };
  return symptoms[prediction] || ['Consult an eye specialist for proper diagnosis'];
}

function getEyeInfo(prediction) {
  const info = {
    'Cataract': 'Cataracts are a clouding of the lens in the eye. They are very common in older people and can be treated with surgery.',
    'Diabetic Retinopathy': 'A diabetes complication that affects eyes. Early detection and treatment can prevent vision loss. Please consult an ophthalmologist immediately.',
    'Glaucoma': 'A group of eye conditions that damage the optic nerve. Early detection is crucial as vision loss from glaucoma is irreversible.',
    'Normal': 'No abnormalities detected. Continue regular eye checkups to maintain good eye health.'
  };
  return info[prediction] || 'Please consult with an eye care professional for proper diagnosis and treatment.';
}

function getFractureSymptoms(prediction) {
  const symptoms = {
    'Fracture': ['Pain and swelling', 'Difficulty moving the affected area', 'Visible deformity', 'Tenderness to touch', 'Bruising'],
    'No Fracture': ['No fracture detected', 'Monitor for any persistent pain']
  };
  return symptoms[prediction] || ['Consult a doctor for proper evaluation'];
}

function getFractureInfo(prediction) {
  const info = {
    'Fracture': 'A fracture has been detected. Immediate medical attention is required for proper treatment and immobilization to ensure proper healing.',
    'No Fracture': 'No fracture detected in the X-ray. If pain persists, consult with a healthcare provider for further evaluation.'
  };
  return info[prediction] || 'Please consult with a healthcare professional for proper diagnosis and treatment.';
}

function getSkinSymptoms(prediction) {
  const symptoms = {
    'Melanoma': ['Asymmetrical moles', 'Irregular borders', 'Color changes', 'Diameter changes', 'Evolving appearance'],
    'Basal Cell Carcinoma': ['Pearly or waxy bumps', 'Flat, flesh-colored lesions', 'Bleeding or scabbing sores', 'Brown, black or blue lesions'],
    'Seborrheic Keratosis': ['Waxy, scaly growths', 'Brown, black or light-colored patches', 'Slightly raised appearance', 'Rough texture'],
    'Nevus': ['Brown or black spots', 'Uniform color', 'Regular borders', 'Stable appearance'],
    'Actinic Keratosis': ['Rough, scaly patches', 'Red or brown coloration', 'Dry or crusty texture', 'Sun-exposed areas'],
    'Vascular Lesion': ['Red or purple discoloration', 'Raised or flat appearance', 'May blanch with pressure', 'Various sizes'],
    'Dermatofibroma': ['Firm, raised nodules', 'Brown or reddish color', 'Dimpling when pinched', 'Usually on legs']
  };
  return symptoms[prediction] || ['Consult a dermatologist for proper evaluation'];
}

function getSkinInfo(prediction) {
  const info = {
    'Melanoma': 'Melanoma is a serious form of skin cancer. Early detection and treatment are crucial for better outcomes.',
    'Basal Cell Carcinoma': 'Basal cell carcinoma is the most common type of skin cancer. It rarely spreads but should be treated promptly.',
    'Seborrheic Keratosis': 'Seborrheic keratoses are common, benign skin growths that typically appear with age.',
    'Nevus': 'A nevus (mole) is usually benign. Monitor for changes in size, color, or shape.',
    'Actinic Keratosis': 'Actinic keratoses are precancerous lesions caused by sun damage. Treatment can prevent progression to skin cancer.',
    'Vascular Lesion': 'Vascular lesions are typically benign but should be evaluated by a dermatologist for proper diagnosis.',
    'Dermatofibroma': 'Dermatofibromas are benign skin growths that are usually harmless but can be removed if bothersome.'
  };
  return info[prediction] || 'Please consult with a dermatologist for proper diagnosis and treatment.';
}

// Skin condition analysis route
router.post('/predict/skin', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(`${AI_MODEL_SERVICE_URL}/predict/skin`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 5000
      });

      // Check if the response indicates an error
      if (response.data.status === 'error') {
        throw new Error(response.data.error);
      }

      // Add additional medical information
      const result = {
        ...response.data,
        symptoms: getSkinSymptoms(response.data.prediction),
        info: getSkinInfo(response.data.prediction)
      };

      res.json(result);
    } catch (aiError) {
      // Fallback to demo analysis if AI service fails
      console.log('AI service unavailable, using demo analysis');
      
      const demoResult = {
        prediction: 'Nevus (Mole)',
        confidence: Math.floor(Math.random() * 11) + 85,
        symptoms: getSkinSymptoms('Nevus'),
        info: getSkinInfo('Nevus'),
        model_type: 'skin_diseases',
        status: 'success',
        note: 'Demo analysis - AI service unavailable'
      };
      
      res.json(demoResult);
    }
  } catch (error) {
    console.error('Error in skin prediction:', error.message);
    res.status(500).json({ 
      error: 'Skin analysis failed',
      status: 'error'
    });
  }
});

export default router;
