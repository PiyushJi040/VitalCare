export const getPageName = (pathname) => {
  const path = pathname.replace('/', '');
  
  const pageMap = {
    'ha-home': 'ha-home',
    'doctor-home': 'doctor-home', 
    'patient-dashboard': 'patient-dashboard',
    'ai-analysis': 'ai-analysis',
    'voice-features': 'voice-features',
    'ai-health-assistant': 'ai-health-assistant',
    'symptom-checker': 'symptom-checker',
    'pharmacy-dashboard': 'pharmacy-dashboard',
    'admin-dashboard': 'admin-dashboard',
    'emergency': 'emergency',
    'analytics': 'analytics'
  };
  
  return pageMap[path] || 'default';
};