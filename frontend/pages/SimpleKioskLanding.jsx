import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Stethoscope, Package, User, ShieldCheck } from "lucide-react";

const SimpleKioskLanding = () => {
  const navigate = useNavigate();

  const roles = [
    { icon: Users, title: "Health Assistant", path: "/ha-auth", gradient: "from-cyan-500 to-blue-500" },
    { icon: Stethoscope, title: "Doctor", path: "/doctor-auth", gradient: "from-emerald-500 to-teal-500" },
    { icon: User, title: "Patient", path: "/patient-login", gradient: "from-purple-500 to-pink-500" },
    { icon: Package, title: "Pharmacy Manager", path: "/pharmacy-login", gradient: "from-orange-500 to-red-500" },
    { icon: ShieldCheck, title: "Admin", path: "/admin-login", gradient: "from-rose-500 to-pink-600" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="h-16 w-16 text-pink-500 animate-pulse" fill="currentColor" />
            <h1 className="text-6xl md:text-7xl font-black gradient-text">
              MediConnect AI
            </h1>
          </div>
          <p className="text-2xl text-slate-300 font-medium">
            Connecting Rural Healthcare
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Select Your Role
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <button
              key={index}
              onClick={() => navigate(role.path)}
              className="group glass-effect rounded-2xl p-8 card-hover relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${role.gradient} p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg transition-all`}>
                <role.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:gradient-text transition-all">
                {role.title}
              </h3>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>Powered by Advanced AI & Machine Learning</p>
          <p className="mt-2">© 2024 MediConnect AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleKioskLanding;
