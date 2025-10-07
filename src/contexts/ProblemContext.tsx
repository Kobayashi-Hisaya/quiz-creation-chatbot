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
  // 初期データ（メモリ内のみで管理）
  const initialData: ProblemData = {
    problem: '',
    code: '',
    language: 'typescript',
    learningTopic: '制御構造'
  };

  const [problemData, setProblemData] = useState<ProblemData>(initialData);

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