import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const sessionId = localStorage.getItem('session_id');
    const storedRole = localStorage.getItem('user_role');
    
    if (sessionId && storedRole) {
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (role, sessionId) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('user_role', role);
    if (sessionId) {
      localStorage.setItem('session_id', sessionId);
    }
  };

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem('session_id');
    localStorage.removeItem('user_role');
  };

  const value = {
    userRole,
    isAuthenticated,
    userData,
    login,
    logout,
    setUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

