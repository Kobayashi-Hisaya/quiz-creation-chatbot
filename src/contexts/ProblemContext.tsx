"use client";
import React, { createContext, useContext, useState } from 'react';

export type LearningTopic = '制御構造' | 'クラス' | string;

interface ProblemData {
  problem: string;
  code: string;
  language: string;
  learningTopic: LearningTopic;
  expectedAccuracy: number | null; // 予想正答率（0-100%）
  expectedAnswerTime: number | null; // 予想解答時間（秒）
}

interface ProblemContextType {
  problemData: ProblemData;
  setProblemData: (data: ProblemData) => void;
  setLearningTopic: (topic: LearningTopic) => void;
  setAssignmentData: (accuracy: number | null, answerTime: number | null) => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初期データ（メモリ内のみで管理）
  const initialData: ProblemData = {
    problem: '',
    code: '',
    language: 'typescript',
    learningTopic: '制御構造',
    expectedAccuracy: null,
    expectedAnswerTime: null,
  };

  const [problemData, setProblemData] = useState<ProblemData>(initialData);

  // 学習項目のみを更新する関数
  const setLearningTopic = (topic: LearningTopic) => {
    const updatedData = { ...problemData, learningTopic: topic };
    setProblemData(updatedData);
  };

  // 作問課題データを更新する関数
  const setAssignmentData = (accuracy: number | null, answerTime: number | null) => {
    const updatedData = { ...problemData, expectedAccuracy: accuracy, expectedAnswerTime: answerTime };
    setProblemData(updatedData);
  };

  return (
    <ProblemContext.Provider value={{ problemData, setProblemData, setLearningTopic, setAssignmentData }}>
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