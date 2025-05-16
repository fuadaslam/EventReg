import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface UserRegistrationData {
  name: string;
  phone: string;
  email: string;
  gender: string;
  unit: string;
  locality: string;
  area: string;
  city: string;
  state: string;
}

interface AppContextType {
  registrationData: UserRegistrationData;
  updateRegistrationData: (data: Partial<UserRegistrationData>) => void;
  userPhoto: string | null;
  setUserPhoto: (photo: string | null) => void;
  badgeImage: string | null;
  setBadgeImage: (badge: string | null) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

const defaultRegistrationData: UserRegistrationData = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  unit: '',
  locality: '',
  area: '',
  city: '',
  state: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<UserRegistrationData>(defaultRegistrationData);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [badgeImage, setBadgeImage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial state
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateRegistrationData = (data: Partial<UserRegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const value = {
    registrationData,
    updateRegistrationData,
    userPhoto,
    setUserPhoto,
    badgeImage,
    setBadgeImage,
    isOffline,
    setIsOffline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};