import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import VideoCall from "../src/components/VideoCall";
import AIChatBot from "../src/components/AIChatBot";
import AIAnalysis from "../src/components/AIAnalysis";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";
import PrescriptionBlockchain from "../src/components/PrescriptionBlockchain";

import { 
  Search, Upload, Video, MessageCircle, Calendar, User, Star, Clock, 
  MapPin, LogOut, ArrowLeft, AlertTriangle, Activity, Bot, Heart,
  Eye, Bone, Scan, Sparkles, Zap
} from "lucide-react";

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  const handleLogout = () => {
    logout();
    toast.success(t("loginSuccess"));
    navigate("/landing");
  };

  const [doctors] = useState([
    { id: 1, name: "Dr. Priya Sharma", nameKey: "drSarahJohnson", specialty: "General Medicine", rating: 4.8, availability: "Available", location: "AIIMS Delhi", experience: "10 years" },
    { id: 2, name: "Dr. Rajesh Kumar", nameKey: "drRajeshKumar", specialty: "Dermatology", rating: 4.9, availability: "Busy", location: "Safdarjung Hospital", experience: "8 years" },
    { id: 3, name: "Dr. Sunita Gupta", nameKey: "drSunitaGupta", specialty: "Ophthalmology", rating: 4.7, availability: "Available", location: "Aravind Eye Care", experience: "12 years" },
    { id: 4, name: "Dr. Amit Singh", nameKey: "drAmitSingh", specialty: "Orthopedics", rating: 4.6, availability: "Available", location: "Fortis Hospital", experience: "15 years" }
  ]);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoCall = (doctorId) => {
    const newRoomId = `room-${Date.now()}-${doctorId}`;
    setRoomId(newRoomId);
    setShowVideoCall(true);
  };

  const closeVideoCall = () => {
    setShowVideoCall(false);
    setRoomId('');
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage({ file, type, preview: URL.createObjectURL(file) });
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const submitBooking = () => {
    if (!bookingData.date || !bookingData.time || !bookingData.reason) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success(`Appointment booked with ${t(selectedDoctor.nameKey)} on ${bookingData.date} at ${bookingData.time}`);
    setShowBookingModal(false);
    setBookingData({ date: '', time: '', reason: '' });
    setSelectedDoctor(null);
  };

  const quickActions = [
    { 
      icon: AlertTriangle, 
      title: t("emergency"), 
      desc: t("getImmediateMedicalHelp"),
      gradient: "from-red-500 to-rose-600",
      action: () => navigate("/emergency")
    },
    { 
      icon: Heart, 
      title: t("healthMonitor"), 
      desc: t("trackVitalSigns"),
      gradient: "from-emerald-500 to-teal-600",
      action: () => navigate("/health-monitor")
    },
    { 
      icon: Bot, 
      title: t("aiSymptomChecker"), 
      desc: t("checkSymptomsWithAI"),
      gradient: "from-purple-500 to-pink-600",
      action: () => navigate("/symptom-checker")
    }
  ];

  const uploadTypes = [
    { 
      id: 'eye', 
      icon: Eye, 
      title: t("eyeCondition"), 
      desc: t("uploadEyeImages"),
      gradient: "from-cyan-500 to-blue-600"
    },
    { 
      id: 'skin', 
      icon: Scan, 
      title: t("skinCondition"), 
      desc: t("uploadSkinImages"),
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      id: 'bone', 
      icon: Bone, 
      title: t("xrayBone"), 
      desc: t("uploadXrayImages"),
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <GlobalLanguageSelector />
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              className="glass-effect px-4 py-2 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-slate-300 hover:text-white"
              onClick={() => navigate("/landing")}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToHome")}
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-cyan-400" />
                <p className="text-cyan-400 text-lg font-medium">
                  {t("hello")} {user?.name || "Patient"}
                </p>
              </div>
              <h1 className="text-5xl font-black gradient-text space-font">{t("patientDashboard")}</h1>
              <p className="text-slate-400 mt-2">{t("findDoctorsUploadImages")}</p>
            </div>
          </div>
          <button 
            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 font-semibold shadow-lg hover:shadow-red-500/50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" /> {t("logout")}
          </button>
        </header>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="h-8 w-8 text-yellow-400" />
            {t("quickAccess")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="glass-effect rounded-2xl p-6 card-hover group text-left"
              >
                <div className={`bg-gradient-to-br ${action.gradient} p-4 rounded-xl w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                <p className="text-slate-400">{action.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("searchDoctors")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-effect rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Doctor Listings */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">{t("availableDoctors")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{t(doctor.nameKey)}</h3>
                    <p className="text-slate-400 text-sm">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-300">
                    <Star className="h-4 w-4 text-yellow-400 mr-2 fill-yellow-400" />
                    {doctor.rating} {t("rating")}
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <MapPin className="h-4 w-4 mr-2 text-cyan-400" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Clock className="h-4 w-4 mr-2 text-purple-400" />
                    {doctor.experience}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    doctor.availability === "Available" 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}>
                    {doctor.availability === "Available" ? t("available") : t("busy")}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleVideoCall(doctor.id)}
                    disabled={doctor.availability !== "Available"}
                  >
                    <Video className="h-4 w-4" /> {t("call")}
                  </button>
                  <button 
                    className="flex-1 glass-effect text-white px-3 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    <Calendar className="h-4 w-4" /> {t("book")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Image Upload Sections */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">{t("uploadMedicalImages")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {uploadTypes.map((type) => (
              <div key={type.id} className="glass-effect rounded-2xl p-8 card-hover text-center">
                <div className={`bg-gradient-to-br ${type.gradient} p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg`}>
                  <type.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                <p className="text-slate-400 text-sm mb-6">{type.desc}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, type.id)}
                  className="hidden"
                  id={`${type.id}-upload`}
                />
                <label
                  htmlFor={`${type.id}-upload`}
                  className={`bg-gradient-to-r ${type.gradient} text-white px-6 py-3 rounded-xl cursor-pointer hover:scale-105 transition-transform inline-flex items-center gap-2 font-semibold shadow-lg`}
                >
                  <Upload className="h-5 w-5" />
                  {t("chooseFile")}
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* AI Analysis Section */}
        <AIAnalysis 
          selectedImage={selectedImage} 
          onRemoveImage={() => setSelectedImage(null)}
        />

        {/* Blockchain Prescription Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">My Prescriptions</h2>
          <PrescriptionBlockchain 
            patientId={user?.id || 'demo-patient-123'} 
          />
        </section>

        {/* AI Chatbot Toggle */}
        <button
          onClick={() => setShowChatBot(!showChatBot)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 neon-glow"
        >
          <MessageCircle className="h-7 w-7" />
        </button>

        {/* Video Call Modal */}
        {showVideoCall && (
          <VideoCall
            roomId={roomId}
            userId="patient"
            onClose={closeVideoCall}
          />
        )}

        {/* AI Chatbot */}
        {showChatBot && (
          <AIChatBot />
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-effect rounded-3xl p-8 w-full max-w-md border border-purple-500/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Book Appointment</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-white text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 glass-effect rounded-xl">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{t(selectedDoctor.nameKey)}</p>
                    <p className="text-sm text-slate-400">{selectedDoctor.specialty}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 glass-effect rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Time</label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="w-full p-3 glass-effect rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Reason for visit</label>
                  <textarea
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                    placeholder="Describe your symptoms or reason for consultation"
                    rows={3}
                    className="w-full p-3 glass-effect rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 glass-effect text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
