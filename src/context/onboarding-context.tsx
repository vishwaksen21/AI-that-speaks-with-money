
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const ONBOARDING_KEY = 'onboarding-complete';

interface OnboardingContextType {
  isTourActive: boolean;
  startTour: () => void;
  stopTour: () => void;
  hasOnboarded: boolean;
  setHasOnboarded: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);
  
  const [hasOnboarded, setHasOnboardedState] = useState(() => {
    if (typeof window === 'undefined') return true; // Assume onboarded on server
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });

  const startTour = useCallback(() => setIsTourActive(true), []);
  const stopTour = useCallback(() => setIsTourActive(false), []);

  const setHasOnboarded = useCallback(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    setHasOnboardedState(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ isTourActive, startTour, stopTour, hasOnboarded, setHasOnboarded }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
