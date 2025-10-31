"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type LearningTopic = '制御構造' | 'クラス' | string;

interface ProblemData {
  problem: string;
  code: string;
  language: string;
  learningTopic: LearningTopic;
}

interface ProblemContextType {
  problemData: ProblemData;
  setProblemData: (data: ProblemData) => void;
  setLearningTopic: (topic: LearningTopic) => void;
  // Spreadsheet persistence helpers
  spreadsheetState: {
    spreadsheetId?: string | null;
    embedUrl?: string | null;
  } | null;
  setSpreadsheetState: (sheetId: string | null, embedUrl?: string | null) => void;
  clearPersistedSpreadsheet: () => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

// localStorageから同期的に初期値を読み込む関数
const getInitialSpreadsheetState = (userId: string | null): { spreadsheetId?: string | null; embedUrl?: string | null } | null => {
  if (!userId || typeof window === 'undefined') return null;

  const storageKey = `create-quiz:spreadsheet-state:${userId}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        spreadsheetId: parsed.spreadsheetId ?? null,
        embedUrl: parsed.embedUrl ?? null
      };
    }
  } catch (e) {
    console.warn('Failed to restore spreadsheet state', e);
  }

  return null;
};

export const ProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初期データ（メモリ内のみで管理）
  const initialData: ProblemData = {
    problem: '',
    code: '',
    language: 'typescript',
    learningTopic: '制御構造'
  };

  const [problemData, setProblemData] = useState<ProblemData>(initialData);

  const { user } = useAuth();

  // Spreadsheet state persisted per-user
  // 初期値として同期的にlocalStorageから読み込む
  const [spreadsheetState, setSpreadsheetStateInternal] = useState<{
    spreadsheetId?: string | null;
    embedUrl?: string | null;
  } | null>(() => getInitialSpreadsheetState(user?.id ?? null));

  const storageKey = user ? `create-quiz:spreadsheet-state:${user.id}` : null;

  // ユーザー変更時にlocalStorageから再読み込み
  useEffect(() => {
    const newState = getInitialSpreadsheetState(user?.id ?? null);
    setSpreadsheetStateInternal(newState);
  }, [user?.id]);

  // storageイベントのリスナー（他のタブでの変更を検知）
  useEffect(() => {
    if (!storageKey) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      try {
        if (e.newValue) {
          const parsed = JSON.parse(e.newValue);
          setSpreadsheetStateInternal({ spreadsheetId: parsed.spreadsheetId ?? null, embedUrl: parsed.embedUrl ?? null });
        } else {
          setSpreadsheetStateInternal(null);
        }
      } catch (err) {
        console.warn('Failed to parse storage event for spreadsheet state', err);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey]);

  const persistSpreadsheetState = useCallback((sheetId: string | null, embedUrl?: string | null) => {
    if (!storageKey) return;
    const payload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      spreadsheetId: sheetId,
      embedUrl: embedUrl ?? null,
    };
    try {
      if (sheetId) localStorage.setItem(storageKey, JSON.stringify(payload));
      else localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Failed to persist spreadsheet state', e);
    }
  }, [storageKey]);

  const setSpreadsheetState = useCallback((sheetId: string | null, embedUrl?: string | null) => {
    setSpreadsheetStateInternal({ spreadsheetId: sheetId, embedUrl: embedUrl ?? null });
    persistSpreadsheetState(sheetId, embedUrl ?? null);
  }, [persistSpreadsheetState]);

  const clearPersistedSpreadsheet = useCallback(() => {
    if (!storageKey) return;
    try { localStorage.removeItem(storageKey); } catch {}
    setSpreadsheetStateInternal(null);
  }, [storageKey]);

  // 学習項目のみを更新する関数
  const setLearningTopic = (topic: LearningTopic) => {
    const updatedData = { ...problemData, learningTopic: topic };
    setProblemData(updatedData);
  };

  return (
    <ProblemContext.Provider value={{ problemData, setProblemData, setLearningTopic, spreadsheetState, setSpreadsheetState, clearPersistedSpreadsheet }}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblem = () => {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblem must be used within a ProblemProvider');
  }
  return context;
};