# MediConnect AI - Demo Credentials

## All Login Credentials

### Patient Portal
- **Email:** patient@demo.com
- **Password:** demo123
- **URL:** http://localhost:5173/patient-login

### Doctor Portal
- **Email:** doctor@demo.com
- **Password:** doctor123
- **URL:** http://localhost:5173/doctor-auth

### Admin Portal
- **Email:** admin@demo.com
- **Password:** admin123
- **URL:** http://localhost:5173/admin-login

### Pharmacy Manager
- **Email:** pharmacy@demo.com
- **Password:** pharmacy123
- **URL:** http://localhost:5173/pharmacy-login

### Health Assistant
- **Email:** assistant@demo.com
- **Password:** assistant123
- **URL:** http://localhost:5173/ha-auth

---

## How to Seed Demo Users

Run this command in the backend directory:
```bash
cd backend
node seedDemoUsers.js
```

---

## Dark Theme Applied

All pages now use dark theme:
- Background: gray-900
- Cards: gray-800
- Text: white/gray-300
- Inputs: gray-700 with gray-600 borders

---

## Starting the Application

**Terminal 1 - AI Service:**
```bash
cd AI_Model
python app.py
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Access at: http://localhost:5173
