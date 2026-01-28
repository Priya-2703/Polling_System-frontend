import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);
  const [trackerId, setTrackerId] = useState(null);
  // const [voteId, setVoteId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Backend step -> Frontend route mapping
  const stepRoutes = {
    REGISTER: '/form',
    VOTE: '/vote',
    SURVEY: '/survey',
    CM_VOTE: '/candidate',
    THANKS: '/thanks'
  };

  // Public pages - no redirect needed
  const publicPaths = ['/', '/privacy', '/terms', '/about', '/contact', '/status'];

  // ✅ FIXED: checkUserStatus with proper redirect
  const checkUserStatus = async (forceRedirect = true) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/status`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await res.json();

      // Update state
      setCurrentStep(data.step);
      setTrackerId(data.tracker_id || null);

      // ✅ KEY FIX: Always redirect if forceRedirect is true
      if (forceRedirect) {
        const expectedPath = stepRoutes[data.step];
        
        if (expectedPath && location.pathname !== expectedPath) {
          navigate(expectedPath, { replace: true });
        }
      }

      return data; // Return data for caller to use

    } catch (error) {
      console.error("Status Check Failed:", error);
      setCurrentStep('REGISTER');
      
      if (forceRedirect) {
        navigate('/form', { replace: true });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    // setVoteId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('voteId');
    sessionStorage.removeItem('voteId');
  };


  // Initial check on app load
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip redirect for public paths on initial load
    if (publicPaths.includes(currentPath)) {
      checkUserStatus(false); // Don't force redirect
    } else {
      checkUserStatus(true); // Force redirect
    }
  }, []);

  const contextValue = {
    loading,
    currentStep,
    trackerId,
    // voteId,
    // setVoteId,
    checkUserStatus,
    stepRoutes,
    clearAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};