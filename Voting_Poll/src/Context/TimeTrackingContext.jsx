// context/TimeTrackingContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TimeTrackingContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const TimeTrackingProvider = ({ children }) => {
  const location = useLocation();
  
  const [trackingData, setTrackingData] = useState({
    sessionStart: null,
    sessionEnd: null,
    totalSessionTime: 0,
    pages: {
      '/': { totalTime: 0, visits: 0 },
      '/form': { totalTime: 0, visits: 0 },
      '/vote': { totalTime: 0, visits: 0 },
      '/survey': { totalTime: 0, visits: 0 },
      '/candidate': { totalTime: 0, visits: 0 },
      '/thanks': { totalTime: 0, visits: 0 },
      '/status': { totalTime: 0, visits: 0 },
    }
  });

  const pageEnterTime = useRef(Date.now());
  const currentPage = useRef(location.pathname);
  const sessionStartTime = useRef(Date.now());
  
  // ✅ Track latest data for beforeunload
  const trackingDataRef = useRef(trackingData);
  
  // ✅ Keep ref updated
  useEffect(() => {
    trackingDataRef.current = trackingData;
  }, [trackingData]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ${seconds % 60} sec`;
    return `${Math.floor(seconds / 3600)} hr ${Math.floor((seconds % 3600) / 60)} min`;
  };

  // Page change track
  useEffect(() => {
    const now = Date.now();
    const timeSpentOnPrevPage = Math.round((now - pageEnterTime.current) / 1000);

    if (currentPage.current) {
      setTrackingData(prev => ({
        ...prev,
        pages: {
          ...prev.pages,
          [currentPage.current]: {
            totalTime: (prev.pages[currentPage.current]?.totalTime || 0) + timeSpentOnPrevPage,
            visits: (prev.pages[currentPage.current]?.visits || 0)
          }
        }
      }));
      console.log(`📍 Left "${currentPage.current}" - Spent: ${timeSpentOnPrevPage} seconds`);
    }

    pageEnterTime.current = now;
    currentPage.current = location.pathname;

    setTrackingData(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [location.pathname]: {
          ...prev.pages[location.pathname],
          visits: (prev.pages[location.pathname]?.visits || 0) + 1
        }
      }
    }));

    console.log(`📍 Entered "${location.pathname}"`);
  }, [location.pathname]);

  // Session start
  useEffect(() => {
    sessionStartTime.current = Date.now();
    setTrackingData(prev => ({
      ...prev,
      sessionStart: new Date().toLocaleString('ta-IN')
    }));
    console.log('🟢 Session Started:', new Date().toLocaleString());
  }, []);

  // Tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Math.round((Date.now() - pageEnterTime.current) / 1000);
        console.log(`👀 Tab hidden - Time on ${currentPage.current}: ${timeSpent}s`);
      } else {
        pageEnterTime.current = Date.now();
        console.log('👀 Tab visible again');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ✅ FIXED: Browser/Tab close track
  useEffect(() => {
    const handleBeforeUnload = () => {
      const now = Date.now();
      const currentPageTime = Math.round((now - pageEnterTime.current) / 1000);
      const totalSession = Math.round((now - sessionStartTime.current) / 1000);

      // ✅ Use ref instead of state (state might be stale)
      const latestData = trackingDataRef.current;

      const finalData = {
        ...latestData,
        sessionEnd: new Date().toLocaleString('ta-IN'),
        totalSessionTime: totalSession,
        pages: {
          ...latestData.pages,
          [currentPage.current]: {
            ...latestData.pages[currentPage.current],
            totalTime: (latestData.pages[currentPage.current]?.totalTime || 0) + currentPageTime
          }
        }
      };

      console.log('🔴 Session Ended:', finalData);

      // LocalStorage save
      const history = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
      history.push(finalData);
      localStorage.setItem('sessionHistory', JSON.stringify(history));

      // ✅ FIXED: Use Blob with proper Content-Type
      const blob = new Blob([JSON.stringify(finalData)], { 
        type: 'application/json' 
      });
      
      navigator.sendBeacon(`${API_BASE_URL}/api/analytics/log-time`, blob);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []); // ✅ Empty dependency - use ref instead

  const getCurrentSessionTime = () => {
    return Math.round((Date.now() - sessionStartTime.current) / 1000);
  };

  const getCurrentPageTime = () => {
    return Math.round((Date.now() - pageEnterTime.current) / 1000);
  };

  return (
    <TimeTrackingContext.Provider value={{ 
      trackingData, 
      formatTime,
      getCurrentSessionTime,
      getCurrentPageTime,
      currentPage: currentPage.current
    }}>
      {children}
    </TimeTrackingContext.Provider>
  );
};

export const useTimeTracking = () => useContext(TimeTrackingContext);