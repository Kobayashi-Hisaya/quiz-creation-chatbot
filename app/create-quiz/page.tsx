"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Split from 'react-split';
import '@/styles/split.css';
import { ChatContainer } from '@/components/ChatContainer';
import { RightPanel } from '@/components/RightPanel';
import { LearningTopicSelector, type LearningTopic } from '@/components/LearningTopicSelector';
import { AssignmentInputPopup } from '@/components/AssignmentInputPopup';
import { useProblem } from '@/contexts/ProblemContext';
import { chatService } from '@/services/chatService';
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
  const { problemData, setLearningTopic, spreadsheetState, hasTopicBeenSelected, setAssignmentData } = useProblem();
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [hasSelectedTopic, setHasSelectedTopic] = useState(false);
  const [currentSpreadsheetData, setCurrentSpreadsheetData] = useState<DataProblemTemplateData | null>(null);
  const [, setCurrentSpreadsheetId] = useState<string | null>(null);
  const getCurrentDataRef = useRef<(() => Promise<DataProblemTemplateData | null>) | null>(null);
  const [isDataRestored, setIsDataRestored] = useState(false);
  const [restorationAttempted, setRestorationAttempted] = useState(false);
  const [hasShownAssignmentPopup, setHasShownAssignmentPopup] = useState(false); // ポップアップを1回のみ表示するフラグ
  const [hasAssignmentData, setHasAssignmentData] = useState(false); // 作問課題データが既に存在するかのフラグ

  // Split sizes (percent).
  const [splitSizes, setSplitSizes] = useState<number[]>(getInitialSplitSizes);

  // ページ初期化時に作問課題データを復元
  useEffect(() => {
    console.log('=== create-quiz ページ初期化 ===');
    console.log('hasTopicBeenSelected:', hasTopicBeenSelected);
    console.log('learningTopic:', problemData.learningTopic);
    console.log('predicted_accuracy:', problemData.predicted_accuracy);
    console.log('predicted_answerTime:', problemData.predicted_answerTime);

    // SessionStorageから作問課題データを復元
    const storedAccuracy = sessionStorage.getItem('predicted_accuracy');
    const storedAnswerTime = sessionStorage.getItem('predicted_answerTime');

    if (storedAccuracy || storedAnswerTime) {
      const accuracy = storedAccuracy ? parseInt(storedAccuracy, 10) : null;
      const answerTime = storedAnswerTime ? parseInt(storedAnswerTime, 10) : null;
      
      console.log('[create-quiz] 作問課題データを復元:', { accuracy, answerTime });
      
      // ProblemContextに復元（まだ設定されていない場合のみ）
      if (problemData.predicted_accuracy === null && problemData.predicted_answerTime === null) {
        setAssignmentData(accuracy, answerTime);
      }
      
      setHasAssignmentData(true); // データがあることをマーク
    }
  }, [hasTopicBeenSelected, problemData.learningTopic, problemData.predicted_accuracy, problemData.predicted_answerTime, setAssignmentData]);

  // TopicSelectorは review-learning-topic ページで表示されるため、ここでは表示しない
  // useEffect(() => {
  //   if (!hasTopicBeenSelected) {
  //     setShowTopicSelector(true);
  //   }
  // }, [hasTopicBeenSelected]);

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

  // スプレッドシートデータが取得できた時に作問課題ポップアップを表示（1回のみ、既にデータがある場合はスキップ）
  useEffect(() => {
    if (
      currentSpreadsheetData &&
      hasTopicBeenSelected &&
      problemData.predicted_accuracy === null &&
      problemData.predicted_answerTime === null &&
      !hasShownAssignmentPopup &&
      !hasAssignmentData // 既にデータがある場合は表示しない
    ) {
      console.log('=== スプレッドシートデータ取得完了 ===');
      console.log('作問課題ポップアップを表示します');
      setShowAssignmentPopup(true);
      setHasShownAssignmentPopup(true); // フラグを立てて2回目以降は表示しない
    } else if (hasAssignmentData) {
      console.log('[create-quiz] 作問課題データが既に存在するため、ポップアップをスキップします');
    }
  }, [currentSpreadsheetData, hasTopicBeenSelected, problemData.predicted_accuracy, problemData.predicted_answerTime, hasShownAssignmentPopup, hasAssignmentData]);

  const handleTopicSelect = (topic: LearningTopic) => {
    setLearningTopic(topic);
    chatService.setLearningTopic(topic);
    setShowTopicSelector(false);
    // 作問課題ポップアップは表示しない（スプレッドシートデータ取得後に表示される）
  };

  const handleAssignmentSubmit = (predicted_accuracy: number | null, predicted_answerTime: number | null) => {
    console.log('=== 作問課題データを保存 ===');
    console.log('predicted_accuracy:', predicted_accuracy);
    console.log('predicted_answerTime:', predicted_answerTime);
    
    // ProblemContext に保存
    setAssignmentData(predicted_accuracy, predicted_answerTime);
    
    // sessionStorage にも保存（ページ遷移時の Context 初期化対策）
    sessionStorage.setItem('predicted_accuracy', predicted_accuracy !== null ? String(predicted_accuracy) : '');
    sessionStorage.setItem('predicted_answerTime', predicted_answerTime !== null ? String(predicted_answerTime) : '');
    
    setShowAssignmentPopup(false);
  };

  const handleAssignmentCancel = () => {
    setShowAssignmentPopup(false);
  };

    // スプレッドシートデータの変更を処理
  const handleSpreadsheetDataChange = (data: DataProblemTemplateData) => {
    setCurrentSpreadsheetData(data);
  };

  // スプレッドシート作成時の処理
  const handleSpreadsheetCreated = useCallback((spreadsheetId: string) => {
    console.log('=== スプレッドシート作成完了 ===');
    console.log('spreadsheetId:', spreadsheetId);
    setCurrentSpreadsheetId(spreadsheetId);
  }, []);

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
        style={{
          height: '100vh',
          width: '100vw',
          // ポップアップが開いている時は背景をブロック
          pointerEvents: showAssignmentPopup ? 'none' : 'auto'
        }}
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
            isBlocked={showAssignmentPopup}
          />
        </div>
      </Split>

       {/* LearningTopicSelector は review-learning-topic ページで表示されるため削除 */}
       
      <AssignmentInputPopup
        isOpen={showAssignmentPopup}
        onSubmit={handleAssignmentSubmit}
        onCancel={handleAssignmentCancel}
      />
    </>
  );
};

export default HomePage;