import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
  lastSyncTime: string;
  showSmsModal: boolean;
  setShowSmsModal: (show: boolean) => void;
  cachedQueue: {
    token: string;
    position: number;
    farmersAhead: number;
    estimatedTurn: string;
    centreName: string;
  };
  triggerSmsAlert: (data?: any) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("10:42 AM");
  const [showSmsModal, setShowSmsModal] = useState(false);

  const [cachedQueue, setCachedQueue] = useState({
    token: "A127",
    position: 8,
    farmersAhead: 7,
    estimatedTurn: "11:40 AM",
    centreName: "Pauri Procurement Centre"
  });

  const toggleOffline = () => {
    setIsOffline(prev => !prev);
    if (!isOffline) {
      // Formatted current time as last sync time
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const triggerSmsAlert = (data?: any) => {
    if (data) {
      setCachedQueue(prev => ({ ...prev, ...data }));
    }
    setShowSmsModal(true);
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        toggleOffline,
        lastSyncTime,
        showSmsModal,
        setShowSmsModal,
        cachedQueue,
        triggerSmsAlert
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
};
