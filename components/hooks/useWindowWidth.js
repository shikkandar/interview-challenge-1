// hooks/useWindowWidth.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const WindowWidthContext = createContext();

// Create the provider component
export const WindowWidthProvider = ({ children }) => {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallerDevice(width < 500);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowWidthContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowWidthContext.Provider>
  );
};

// Custom hook to use the context (optional, for convenience)
export const useWindowWidth = () => useContext(WindowWidthContext);
