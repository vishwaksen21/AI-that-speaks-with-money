
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { FinancialData } from '@/ai/flows/data-extraction';
import { getFinancialData as fetchFinancialData, LOCAL_STORAGE_KEY } from '@/lib/mock-data';

interface FinancialDataContextType {
  financialData: FinancialData | null;
  setFinancialData: (data: FinancialData | null) => void;
  isLoading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [financialData, setFinancialDataState] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setFinancialData = useCallback((data: FinancialData | null) => {
    setFinancialDataState(data);
    if (typeof window !== 'undefined') {
      if (data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      // Dispatch a storage event to sync other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: LOCAL_STORAGE_KEY,
        newValue: data ? JSON.stringify(data) : null,
      }));
    }
  }, []);

  useEffect(() => {
    // Initial load from localStorage
    try {
      const data = fetchFinancialData();
      setFinancialDataState(data);
    } catch (error) {
      console.error("Failed to load initial financial data:", error);
    } finally {
      setIsLoading(false);
    }

    // Listen for changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY) {
        if (event.newValue) {
          try {
            setFinancialDataState(JSON.parse(event.newValue));
          } catch(e) {
            console.error("Failed to parse storage data:", e);
          }
        } else {
          setFinancialDataState(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <FinancialDataContext.Provider value={{ financialData, setFinancialData, isLoading }}>
      {children}
    </FinancialDataContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
}
