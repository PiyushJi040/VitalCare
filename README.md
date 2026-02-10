# 🏥 MediConnect AI - Smart Telemedicine Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

**AI-Powered Telemedicine Platform for Rural Healthcare**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation)

</div>

---

## 🌟 Features

### 🤖 AI-Powered Medical Analysis
- **Eye Disease Detection** - Cataract, Diabetic Retinopathy, Glaucoma detection
- **Bone Fracture Analysis** - X-ray analysis for fracture detection
- **Skin Condition Assessment** - Dermatological condition identification
- Real-time AI predictions with confidence scores

### 👥 Multi-Role Dashboard System
- **Patient Portal** - Book appointments, upload medical images, video consultations
- **Doctor Portal** - Manage patients, conduct video calls, review AI analysis
- **Health Assistant** - Patient registration, queue management, doctor coordination
- **Pharmacy Manager** - Prescription management, inventory tracking
- **Admin Panel** - System monitoring, user management, analytics

### 📹 Real-Time Communication
- HD video consultations with WebRTC
- Socket.IO powered real-time messaging
- AI chatbot for 24/7 medical assistance
- Multi-language support (i18n)

### 🔐 Security & Blockchain
- JWT-based authentication
- Blockchain-powered prescription management
- Encrypted data transmission
- HIPAA-compliant data handling

### 🎨 Modern UI/UX
- Dark theme with neon accents
- Glass morphism design
- Responsive mobile-first design
- Smooth animations with Framer Motion
- Lucide React icons

---

## 🛠 Tech Stack

### Frontend
```
React 19.1.1          - UI Framework
React Router DOM      - Navigation
Tailwind CSS 4.1      - Styling
Framer Motion         - Animations
Lucide React          - Icons
Axios                 - HTTP Client
Socket.IO Client      - Real-time Communication
i18next               - Internationalization
React Hot Toast       - Notifications
```

### Backend
```
Node.js + Express     - Server Framework
MongoDB + Mongoose    - Database
Socket.IO             - WebSocket Server
JWT                   - Authentication
Multer                - File Upload
Bcrypt                - Password Hashing
Helmet                - Security Headers
Morgan                - Logging
```

### AI/ML Services
```
Flask                 - API Server
TensorFlow/Keras      - Deep Learning
PIL                   - Image Processing
NumPy                 - Numerical Computing
```

---

## 📁 Project Structure

```
telemedicinee-app/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Entry point
│   ├── pages/               # Page components
│   ├── context/             # React context
│   ├── services/            # API services
│   └── package.json
│
├── backend/                  # Node.js Backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── uploads/             # File uploads
│   ├── server.js            # Server entry point
│   └── package.json
│
├── AI_Model/                 # Flask AI Service
│   ├── ml model/            # Trained models
│   │   ├── eyediseases_model.keras
│   │   ├── fracture_classification_model.keras
│   │   └── skin_disease_classifier.keras
│   ├── app.py               # Flask application
│   └── requirement.txt      # Python dependencies
│
├── README.md                 # This file
└── LICENSE                   # MIT License
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v16 or higher
- **Python** 3.8 or higher
- **MongoDB** (local or Atlas)
- **Git**

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/telemedicinee-app.git
cd telemedicinee-app
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/telemedicine
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

### 4️⃣ AI Model Setup
```bash
cd AI_Model
pip install -r requirement.txt
```

**Important:** Place your trained ML models in `AI_Model/ml model/`:
- `eyediseases_model.keras`
- `fracture_classification_model.keras`
- `skin_disease_classifier.keras`

---

## 🎯 Running the Application

### Option 1: Manual Start (3 Terminals)

**Terminal 1 - AI Service:**
```bash
cd AI_Model
python app.py
# Runs on http://localhost:5001
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Option 2: Using Batch Files (Windows)
```bash
# Start all services at once
start-all-services.bat
```

---

## 📱 Usage

### Patient Flow
1. Navigate to `http://localhost:5173`
2. Click **Patient** role
3. Sign up or login
4. Upload medical images for AI analysis
5. Book appointments with doctors
6. Join video consultations
7. Chat with AI assistant

### Doctor Flow
1. Select **Doctor** role
2. Login with credentials
3. View patient queue
4. Review AI analysis results
5. Conduct video consultations
6. Prescribe medications

### Health Assistant Flow
1. Select **Health Assistant** role
2. Register new patients
3. Manage patient queue
4. Coordinate with doctors

---

## 🔌 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/verify
```

### AI Analysis
```http
POST /api/ai/predict/eye
POST /api/ai/predict/xray
POST /api/ai/predict/skin
```

### Patients
```http
GET    /api/patients/profile
PUT    /api/patients/profile
GET    /api/patients/appointments
POST   /api/patients/appointments
```

### Doctors
```http
GET    /api/doctors/list
GET    /api/doctors/:id
POST   /api/doctors/availability
GET    /api/doctors/appointments
```

### Prescriptions
```http
POST   /api/prescriptions/create
GET    /api/prescriptions/:patientId
PUT    /api/prescriptions/:id/verify
```

---

## 🤖 AI Models

### Eye Disease Detection
- **Input:** Retinal fundus images
- **Output:** Cataract, Diabetic Retinopathy, Glaucoma, Normal
- **Accuracy:** ~92%

### Bone Fracture Detection
- **Input:** X-ray images
- **Output:** Fracture, No Fracture
- **Accuracy:** ~89%

### Skin Disease Classification
- **Input:** Skin lesion images
- **Output:** Various skin conditions
- **Accuracy:** ~87%

---

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/telemedicine
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### AI Service
```env
FLASK_PORT=5001
MODEL_PATH=./ml model/
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: ['patient', 'doctor', 'health_assistant', 'pharmacy', 'admin'],
  phone: String,
  createdAt: Date
}
```

### Appointment Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  date: Date,
  time: String,
  status: ['pending', 'confirmed', 'completed', 'cancelled'],
  reason: String
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Frontend Development** - React, Tailwind CSS, UI/UX
- **Backend Development** - Node.js, Express, MongoDB
- **AI/ML Development** - TensorFlow, Keras, Flask
- **DevOps** - Deployment, CI/CD

---

## 📞 Support

For support and questions:
- 📧 Email: support@mediconnect.ai
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/telemedicinee-app/issues)
- 📖 Docs: [Documentation](https://docs.mediconnect.ai)

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice-based symptom checker
- [ ] Integration with wearable devices
- [ ] Advanced analytics dashboard
- [ ] Multi-hospital network support
- [ ] Telemedicine kiosk hardware integration

---

## 🙏 Acknowledgments

- TensorFlow team for ML frameworks
- React team for amazing frontend library
- MongoDB for database solutions
- All open-source contributors

---

<div align="center">

**Made with ❤️ for Rural Healthcare**

⭐ Star us on GitHub — it motivates us a lot!

</div>
