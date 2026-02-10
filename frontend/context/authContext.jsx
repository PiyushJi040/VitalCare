import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // Demo login credentials
    const demoEmail = "demo@example.com";
    const demoPassword = "demopassword";

    if (email === demoEmail && password === demoPassword) {
      // Map roles to demo user data
      const demoUsers = {
        admin: { id: "demo-admin", name: "Demo Admin", role: "admin" },
        doctor: { id: "demo-doctor", name: "Demo Doctor", role: "doctor" },
        "health-assistant": { id: "demo-ha", name: "Demo Health Assistant", role: "health-assistant" },
        patient: { id: "demo-patient", name: "Demo Patient", role: "patient" },
        pharmacy: { id: "demo-pharmacy", name: "Demo Pharmacy Manager", role: "pharmacy" },
      };

      const demoUser = demoUsers[role] || { id: "demo-user", name: "Demo User", role: role || "patient" };
      const demoToken = "demo-token";

      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));

      setUser(demoUser);
      return { success: true, user: demoUser };
    }

    try {
      const response = await authAPI.login(email, password, role);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};