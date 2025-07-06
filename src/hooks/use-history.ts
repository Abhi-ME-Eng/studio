'use client';

import { HistoryItem } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const HISTORY_STORAGE_KEY = 'sahayak-ai-history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prevHistory) => {
      const newHistoryItem: HistoryItem = {
        ...item,
        id: new Date().toISOString() + Math.random(),
        timestamp: Date.now(),
      };
      const updatedHistory = [newHistoryItem, ...prevHistory];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
      return updatedHistory;
    });
  }, []);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error);
    }
  }, []);

  return { history, addHistoryItem, isLoaded, clearHistory };
}
