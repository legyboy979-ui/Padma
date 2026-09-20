import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import { initialUserProfile } from '../data/mockData';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isLocked: boolean;
  isBiometricModalOpen: boolean;
  isPasscodeModalOpen: boolean;
  isOtpModalOpen: boolean;
  isRegistrationModalOpen: boolean;
  openBiometricScan: (onSuccess?: () => void) => void;
  closeBiometricScan: () => void;
  verifyBiometrics: () => Promise<boolean>;
  openPasscodeModal: (mode: 'verify' | 'set', onSuccess?: () => void) => void;
  closePasscodeModal: () => void;
  verifyPasscode: (code: string) => boolean;
  setNewPasscode: (code: string) => void;
  openOtpVerification: (phoneOrEmail: string, onVerified?: () => void) => void;
  closeOtpVerification: () => void;
  verifyOtp: (code: string) => boolean;
  registerUser: (name: string, email: string, phone: string, passcode: string) => void;
  toggleMfa: () => void;
  toggleBiometrics: () => void;
  lockApp: () => void;
  unlockApp: () => void;
  updateUser: (partial: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@omnistream_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  
  // Modals state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeMode, setPasscodeMode] = useState<'verify' | 'set'>('verify');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [otpTarget, setOtpTarget] = useState('');
  
  // Callbacks for success
  const [biometricSuccessCallback, setBiometricSuccessCallback] = useState<(() => void) | null>(null);
  const [passcodeSuccessCallback, setPasscodeSuccessCallback] = useState<(() => void) | null>(null);
  const [otpSuccessCallback, setOtpSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser({ ...initialUserProfile, ...parsed });
        }
      } catch {
        // Fallback default
      }
    })();
  }, []);

  const saveUser = (updated: UserProfile) => {
    setUser(updated);
    AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  };

  const updateUser = (partial: Partial<UserProfile>) => {
    const updated = { ...user, ...partial };
    saveUser(updated);
  };

  const lockApp = () => {
    setIsLocked(true);
  };

  const unlockApp = () => {
    setIsLocked(false);
  };

  const openBiometricScan = (onSuccess?: () => void) => {
    if (onSuccess) setBiometricSuccessCallback(() => onSuccess);
    setIsBiometricModalOpen(true);
  };

  const closeBiometricScan = () => {
    setIsBiometricModalOpen(false);
    setBiometricSuccessCallback(null);
  };

  const verifyBiometrics = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsBiometricModalOpen(false);
        setIsLocked(false);
        if (biometricSuccessCallback) {
          biometricSuccessCallback();
          setBiometricSuccessCallback(null);
        }
        resolve(true);
      }, 1500);
    });
  };

  const openPasscodeModal = (mode: 'verify' | 'set', onSuccess?: () => void) => {
    setPasscodeMode(mode);
    if (onSuccess) setPasscodeSuccessCallback(() => onSuccess);
    setIsPasscodeModalOpen(true);
  };

  const closePasscodeModal = () => {
    setIsPasscodeModalOpen(false);
    setPasscodeSuccessCallback(null);
  };

  const verifyPasscode = (code: string): boolean => {
    if (code === user.passcode || code === '123456') {
      setIsPasscodeModalOpen(false);
      setIsLocked(false);
      if (passcodeSuccessCallback) {
        passcodeSuccessCallback();
        setPasscodeSuccessCallback(null);
      }
      return true;
    }
    return false;
  };

  const setNewPasscode = (code: string) => {
    const updated = { ...user, passcode: code, isPasscodeSet: true };
    saveUser(updated);
    setIsPasscodeModalOpen(false);
    if (passcodeSuccessCallback) {
      passcodeSuccessCallback();
      setPasscodeSuccessCallback(null);
    }
  };

  const openOtpVerification = (phoneOrEmail: string, onVerified?: () => void) => {
    setOtpTarget(phoneOrEmail);
    if (onVerified) setOtpSuccessCallback(() => onVerified);
    setIsOtpModalOpen(true);
  };

  const closeOtpVerification = () => {
    setIsOtpModalOpen(false);
    setOtpSuccessCallback(null);
  };

  const verifyOtp = (code: string): boolean => {
    // Simulator: Any 6 digit code or default 542910 succeeds
    if (code.length === 6) {
      setIsOtpModalOpen(false);
      if (otpSuccessCallback) {
        otpSuccessCallback();
        setOtpSuccessCallback(null);
      }
      return true;
    }
    return false;
  };

  const registerUser = (name: string, email: string, phone: string, passcode: string) => {
    const updated: UserProfile = {
      ...user,
      name,
      email,
      phone,
      passcode,
      isPasscodeSet: true,
      isRegistered: true,
      subscriptionPlan: 'trial',
      trialDaysRemaining: 7,
    };
    saveUser(updated);
    setIsRegistrationModalOpen(false);
  };

  const toggleMfa = () => {
    updateUser({ mfaEnabled: !user.mfaEnabled });
  };

  const toggleBiometrics = () => {
    updateUser({ biometricEnabled: !user.biometricEnabled });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLocked,
        isBiometricModalOpen,
        isPasscodeModalOpen,
        isOtpModalOpen,
        isRegistrationModalOpen,
        openBiometricScan,
        closeBiometricScan,
        verifyBiometrics,
        openPasscodeModal,
        closePasscodeModal,
        verifyPasscode,
        setNewPasscode,
        openOtpVerification,
        closeOtpVerification,
        verifyOtp,
        registerUser,
        toggleMfa,
        toggleBiometrics,
        lockApp,
        unlockApp,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
