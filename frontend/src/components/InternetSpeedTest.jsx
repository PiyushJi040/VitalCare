import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';

const InternetSpeedTest = () => {
  const [speed, setSpeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    testInternetSpeed();
  }, []);

  const testInternetSpeed = async () => {
    try {
      const startTime = Date.now();
      const response = await fetch('https://httpbin.org/bytes/1000000', { 
        cache: 'no-cache' 
      });
      const endTime = Date.now();
      
      if (response.ok) {
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = 1000000 * 8;
        const speedBps = bitsLoaded / duration;
        const speedMbps = (speedBps / (1024 * 1024)).toFixed(1);
        
        setSpeed(speedMbps);
      } else {
        setSpeed('N/A');
      }
    } catch (error) {
      setSpeed('N/A');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsVisible(false), 5000);
    }
  };

  const getSpeedColor = () => {
    if (!speed || speed === 'N/A') return 'text-gray-600';
    const speedNum = parseFloat(speed);
    if (speedNum >= 10) return 'text-green-600';
    if (speedNum >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSpeedIcon = () => {
    if (!speed || speed === 'N/A') return <WifiOff className="h-4 w-4" />;
    const speedNum = parseFloat(speed);
    if (speedNum >= 5) return <Wifi className="h-4 w-4" />;
    return <WifiOff className="h-4 w-4" />;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Activity className="h-4 w-4 text-blue-600 animate-spin" />
          ) : (
            getSpeedIcon()
          )}
          <span className="text-sm font-medium text-gray-700">Internet Speed</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="text-center">
        {isLoading ? (
          <div className="text-sm text-gray-600">Testing...</div>
        ) : (
          <div className={`text-lg font-bold ${getSpeedColor()}`}>
            {speed} {speed !== 'N/A' ? 'Mbps' : ''}
          </div>
        )}
      </div>
      
      {!isLoading && speed !== 'N/A' && (
        <div className="text-xs text-gray-500 text-center mt-1">
          {parseFloat(speed) >= 10 ? 'Excellent' : 
           parseFloat(speed) >= 5 ? 'Good' : 'Slow'}
        </div>
      )}
    </div>
  );
};

export default InternetSpeedTest;