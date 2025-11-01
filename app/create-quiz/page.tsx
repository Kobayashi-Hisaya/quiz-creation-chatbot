"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Split from 'react-split';
import '@/styles/split.css';
import { ChatContainer } from '@/components/ChatContainer';
import { RightPanel } from '@/components/RightPanel';
import { LearningTopicSelector } from '@/components/LearningTopicSelector';
import { useProblem } from '@/contexts/ProblemContext';
import { chatService } from '@/services/chatService';
import type { LearningTopic } from '@/components/LearningTopicSelector';
import type { DataProblemTemplateData } from '@/services/gasClientService';

const SPLIT_STORAGE_KEY = 'create-quiz-split';
const DEFAULT_SPLIT_SIZES: number[] = [50, 50];

// splitSizesの初期値をlocalStorageから同期的に読み込む
const getInitialSplitSizes = (): number[] => {
  if (typeof window === 'undefined') return DEFAULT_SPLIT_SIZES;
  try {
    const raw = localStorage.getItem(SPLIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as number[];
      if (Array.isArray(parsed) && parsed.length === 2) return parsed;
    }
  } catch (e) {
    console.warn('Failed to restore split sizes', e);
  }
  return DEFAULT_SPLIT_SIZES;
};

const HomePage: React.FC = () => {
  const { problemData, setLearningTopic, spreadsheetState, hasTopicBeenSelected } = useProblem();
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [currentSpreadsheetData, setCurrentSpreadsheetData] = useState<DataProblemTemplateData | null>(null);
  const [, setCurrentSpreadsheetId] = useState<string | null>(null);
  const getCurrentDataRef = useRef<(() => Promise<DataProblemTemplateData | null>) | null>(null);
  const [isDataRestored, setIsDataRestored] = useState(false);
  const [restorationAttempted, setRestorationAttempted] = useState(false);

  // Split sizes (percent).
  const [splitSizes, setSplitSizes] = useState<number[]>(getInitialSplitSizes);

  // ページ初回訪問時に学習項目が未設定の場合のみポップアップを表示
  useEffect(() => {
    if (!hasTopicBeenSelected) {
      setShowTopicSelector(true);
    }
  }, [hasTopicBeenSelected]);

  // ページロード時にスプレッドシートデータを復元（1回のみ実行）
  useEffect(() => {
    if (
      !restorationAttempted &&
      !isDataRestored &&
      getCurrentDataRef.current &&
      spreadsheetState?.spreadsheetId &&
      !currentSpreadsheetData
    ) {
      setRestorationAttempted(true); // 先に試行フラグを立てる
      const restoreData = async () => {
        try {
          const data = await getCurrentDataRef.current!();
          if (data) {
            setCurrentSpreadsheetData(data);
            setIsDataRestored(true);
          }
        } catch (error) {
          console.error('Failed to restore spreadsheet data:', error);
          // エラー時は試行済みだが復元未完了状態にする
        }
      };
      restoreData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restorationAttempted, isDataRestored, spreadsheetState?.spreadsheetId, currentSpreadsheetData]);

  const handleTopicSelect = (topic: LearningTopic) => {
    setLearningTopic(topic);
    chatService.setLearningTopic(topic);
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
    getCurrentDataRef.current = getCurrentData;
  }, []);

  // 最新のスプレッドシートデータを取得する関数（送信時取得用）
  const fetchLatestSpreadsheetData = useCallback(async (): Promise<DataProblemTemplateData | null> => {
    if (getCurrentDataRef.current) {
      try {
        return await getCurrentDataRef.current();
      } catch (error) {
        console.error('Error fetching latest spreadsheet data:', error);
        return null;
      }
    } else {
      console.warn('Data fetch function not available');
      return null;
    }
  }, []);

  // attach double-click on gutters to reset to default sizes
  useEffect(() => {
    const onDbl = () => {
      setSplitSizes(DEFAULT_SPLIT_SIZES);
      try { localStorage.setItem(SPLIT_STORAGE_KEY, JSON.stringify(DEFAULT_SPLIT_SIZES)); } catch {}
    };

    const gutters = Array.from(document.querySelectorAll('[class*="gutter"]')) as HTMLElement[];
    gutters.forEach(g => g.addEventListener('dblclick', onDbl));
    return () => gutters.forEach(g => g.removeEventListener('dblclick', onDbl));
  }, []);

  return (
    <>
      <Split
        className="quiz-split"
        sizes={splitSizes}
        minSize={[300, 400]}
        gutterSize={8}
        onDragEnd={(newSizes: number[]) => {
          setSplitSizes(newSizes);
          try { localStorage.setItem(SPLIT_STORAGE_KEY, JSON.stringify(newSizes)); } catch {}
        }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <div style={{ minWidth: 300, height: '100vh' }}>
          <ChatContainer 
            spreadsheetData={currentSpreadsheetData} 
            fetchLatestSpreadsheetData={fetchLatestSpreadsheetData}
          />
        </div>

        <div style={{ minWidth: 400, height: '100vh' }}>
          <RightPanel 
            onSpreadsheetDataChange={handleSpreadsheetDataChange}
            onSpreadsheetCreated={handleSpreadsheetCreated}
            onGetCurrentDataRef={handleGetCurrentDataRef}
          />
        </div>
      </Split>

      <LearningTopicSelector 
        isOpen={showTopicSelector}
        onSelect={handleTopicSelect}
      />
    </>
  );
};

export default HomePage;