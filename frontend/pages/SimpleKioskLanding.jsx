import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Heart, Users, Stethoscope, Package, User, ShieldCheck, 
  Sparkles, Brain, Video, MessageSquare, Activity, Zap,
  Globe, Shield, Clock, TrendingUp
} from "lucide-react";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const SimpleKioskLanding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const roles = [
    { 
      icon: Users, 
      title: t("healthAssistant"), 
      path: "/ha-auth", 
      gradient: "from-cyan-500 to-blue-500",
      glow: "group-hover:shadow-cyan-500/50"
    },
    { 
      icon: Stethoscope, 
      title: t("doctor"), 
      path: "/doctor-auth", 
      gradient: "from-emerald-500 to-teal-500",
      glow: "group-hover:shadow-emerald-500/50"
    },
    { 
      icon: User, 
      title: t("patient"), 
      path: "/patient-login", 
      gradient: "from-purple-500 to-pink-500",
      glow: "group-hover:shadow-purple-500/50"
    },
    { 
      icon: Package, 
      title: t("pharmacyManager"), 
      path: "/pharmacy-login", 
      gradient: "from-orange-500 to-red-500",
      glow: "group-hover:shadow-orange-500/50"
    },
    { 
      icon: ShieldCheck, 
      title: t("admin"), 
      path: "/admin-login", 
      gradient: "from-rose-500 to-pink-600",
      glow: "group-hover:shadow-rose-500/50"
    }
  ];

  const features = [
    { icon: Brain, label: "AI Analysis", value: "3 Models", color: "text-cyan-400" },
    { icon: Video, label: "Video Calls", value: "HD Quality", color: "text-purple-400" },
    { icon: MessageSquare, label: "AI Chatbot", value: "24/7 Active", color: "text-pink-400" },
    { icon: Shield, label: "Secure", value: "Encrypted", color: "text-emerald-400" }
  ];

  const stats = [
    { icon: Globe, value: "173", label: t("villagesServed"), color: "from-cyan-500 to-blue-500" },
    { icon: Users, value: "1000+", label: t("patientsHelped"), color: "from-purple-500 to-pink-500" },
    { icon: Clock, value: "24/7", label: t("doctorAvailability"), color: "from-emerald-500 to-teal-500" },
    { icon: TrendingUp, value: "95%", label: "Satisfaction", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlobalLanguageSelector />
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Heart className="h-16 w-16 text-pink-500 animate-pulse" fill="currentColor" />
              <Sparkles className="h-8 w-8 text-cyan-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-6xl md:text-7xl font-black space-font gradient-text">
              MediConnect AI
            </h1>
          </div>
          <p className="text-2xl text-slate-300 font-medium">
            {t("connectingRuralHealthcare")}
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Zap className="h-5 w-5 text-yellow-400" />
            <p className="text-lg">{t("servingVillages")}</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-effect rounded-2xl p-6 text-center card-hover"
            >
              <feature.icon className={`h-10 w-10 mx-auto mb-3 ${feature.color}`} />
              <div className="text-sm text-slate-400 mb-1">{feature.label}</div>
              <div className="text-xl font-bold text-white">{feature.value}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="glass-effect rounded-2xl p-6 text-center card-hover group"
            >
              <div className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Role Selection */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 space-font">
            {t("selectYourRole")}
          </h2>
          <p className="text-slate-400 text-lg">Choose your portal to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <button
              key={index}
              onClick={() => navigate(role.path)}
              className="group glass-effect rounded-2xl p-8 card-hover relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className={`bg-gradient-to-br ${role.gradient} p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg ${role.glow} transition-all`}>
                <role.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:gradient-text transition-all">
                {role.title}
              </h3>
            </button>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto neon-glow">
            <Activity className="h-16 w-16 text-cyan-400 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-4 space-font">
              Experience Next-Gen Healthcare
            </h3>
            <p className="text-slate-300 text-lg mb-8">
              AI-powered diagnostics, instant consultations, and 24/7 medical support
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/patient-login')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-purple-500/50"
              >
                Get Started Now
              </button>
              <button
                onClick={() => navigate('/ai-analysis')}
                className="glass-effect text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform border border-purple-500/50"
              >
                Try AI Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>Powered by Advanced AI & Machine Learning</p>
          <p className="mt-2">© 2024 MediConnect AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleKioskLanding;
