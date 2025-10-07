"use client";
import React, { createContext, useContext, useState } from 'react';

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
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // localStorageから初期データを読み込み
  const loadFromStorage = (): ProblemData => {
    try {
      const stored = localStorage.getItem('problemData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load problem data from localStorage:', error);
    }
    return {
      problem: '',
      code: '',
      language: 'typescript',
      learningTopic: '制御構造'
    };
  };

  const [problemData, setProblemDataState] = useState<ProblemData>(loadFromStorage);

  // localStorageに保存する関数
  const setProblemData = (data: ProblemData) => {
    setProblemDataState(data);
    try {
      localStorage.setItem('problemData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save problem data to localStorage:', error);
    }
  };

  // 学習項目のみを更新する関数
  const setLearningTopic = (topic: LearningTopic) => {
    const updatedData = { ...problemData, learningTopic: topic };
    setProblemData(updatedData);
  };

  return (
    <ProblemContext.Provider value={{ problemData, setProblemData, setLearningTopic }}>
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