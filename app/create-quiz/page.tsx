"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChatContainer } from '@/components/ChatContainer';
import { RightPanel } from '@/components/RightPanel';
import { LearningTopicSelector } from '@/components/LearningTopicSelector';
import { useProblem } from '@/contexts/ProblemContext';
import { chatService } from '@/services/chatService';
import type { LearningTopic } from '@/components/LearningTopicSelector';
import type { DataProblemTemplateData } from '@/services/gasClientService';

const HomePage: React.FC = () => {
  const { problemData, setLearningTopic } = useProblem();
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [hasSelectedTopic, setHasSelectedTopic] = useState(false);
  const [currentSpreadsheetData, setCurrentSpreadsheetData] = useState<DataProblemTemplateData | null>(null);
  const [, setCurrentSpreadsheetId] = useState<string | null>(null);
  const [getCurrentDataRef, setGetCurrentDataRef] = useState<(() => Promise<DataProblemTemplateData | null>) | null>(null);


  // ページ初回訪問時に学習項目が未設定の場合のみポップアップを表示
  useEffect(() => {
    if (!hasSelectedTopic || !problemData.learningTopic) {
      setShowTopicSelector(true);
    }
  }, [hasSelectedTopic, problemData.learningTopic]);

  const handleTopicSelect = (topic: LearningTopic) => {
    setLearningTopic(topic);
    chatService.setLearningTopic(topic);
    setHasSelectedTopic(true);
    setShowTopicSelector(false);
  };

  // スプレッドシートデータの変更を処理
  const handleSpreadsheetDataChange = (data: DataProblemTemplateData) => {
    setCurrentSpreadsheetData(data);
  };

  // スプレッドシート作成時の処理
  const handleSpreadsheetCreated = (spreadsheetId: string) => {
    setCurrentSpreadsheetId(spreadsheetId);
  };

  // getCurrentData関数の参照を受け取る
  const handleGetCurrentDataRef = useCallback((getCurrentData: () => Promise<DataProblemTemplateData | null>) => {
    setGetCurrentDataRef(() => getCurrentData);
  }, []);

  // 最新のスプレッドシートデータを取得する関数（送信時取得用）
  const fetchLatestSpreadsheetData = useCallback(async (): Promise<DataProblemTemplateData | null> => {
    if (getCurrentDataRef) {
      try {
        return await getCurrentDataRef();
      } catch (error) {
        console.error('Error fetching latest spreadsheet data:', error);
        return null;
      }
    } else {
      console.warn('Data fetch function not available');
      return null;
    }
  }, [getCurrentDataRef]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      minHeight: '600px'
    }}>
      <div style={{ 
        flex: '1',
        height: '100vh',
        minWidth: '300px',
        maxWidth: '50%'
      }}>
        <ChatContainer 
          spreadsheetData={currentSpreadsheetData} 
          fetchLatestSpreadsheetData={fetchLatestSpreadsheetData}
        />
      </div>
      <div style={{ 
        flex: '1',
        height: '100vh',
        minWidth: '400px',
        maxWidth: '50%'
      }}>
        <RightPanel 
          onSpreadsheetDataChange={handleSpreadsheetDataChange}
          onSpreadsheetCreated={handleSpreadsheetCreated}
          onGetCurrentDataRef={handleGetCurrentDataRef}
        />
      </div>
      
      <LearningTopicSelector 
        isOpen={showTopicSelector}
        onSelect={handleTopicSelect}
      />
    </div>
  );
};

export default HomePage;