import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useProblem } from '@/contexts/ProblemContext';
import { gasClientService, type DataProblemTemplateData } from '@/services/gasClientService';

interface DataSpreadsheetPanelProps {
  userEmail?: string;
  sessionId?: string;
  onDataChange?: (data: DataProblemTemplateData) => void;
  onSpreadsheetCreated?: (spreadsheetId: string, embedUrl: string) => void;
  onError?: (error: string) => void;
  onGetCurrentDataRef?: (getCurrentData: () => Promise<DataProblemTemplateData | null>) => void;
}

export const DataSpreadsheetPanel: React.FC<DataSpreadsheetPanelProps> = ({
  userEmail = 'user@example.com',
  sessionId,
  onDataChange,
  onSpreadsheetCreated,
  onError,
  onGetCurrentDataRef
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSpreadsheetId, setCurrentSpreadsheetId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [isDataRestored, setIsDataRestored] = useState(false);
  const [restorationAttempted, setRestorationAttempted] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSpreadsheetRestored, setIsSpreadsheetRestored] = useState(false);

  const { spreadsheetState, setSpreadsheetState } = useProblem();

  // 新しいデータ整理問題用スプレッドシートを作成
  const createNewSheet = useCallback(async () => {
    if (isCreatingSheet) return; // 既に作成中の場合は何もしない
    
    setIsCreatingSheet(true);
    setIsLoading(true);
    setError(null);

    try {
      const finalSessionId = currentSessionId || gasClientService.generateSessionId();
      setCurrentSessionId(finalSessionId);

      const result = await gasClientService.createDataProblemSheet(userEmail, finalSessionId);

      if (result) {
        const sheetId = result.spreadsheet.spreadsheetId;
        setCurrentSpreadsheetId(sheetId);
        const newEmbedUrl = gasClientService.getEmbedUrl(sheetId);
        setEmbedUrl(newEmbedUrl);
        setIsConnected(true);

        // persist into ProblemContext (per-user)
        try { setSpreadsheetState(sheetId, newEmbedUrl); } catch {}

        // 親コンポーネントに通知
        onSpreadsheetCreated?.(sheetId, newEmbedUrl);
        
        // データ変更の監視を開始（ポーリング → 送信時取得に変更のため無効化）
        // startDataPolling(result.spreadsheet.spreadsheetId);
      } else {
        throw new Error('Failed to create spreadsheet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setIsCreatingSheet(false);
    }
  }, [currentSessionId, userEmail, onSpreadsheetCreated, onError, setSpreadsheetState, isCreatingSheet]);

  // createNewSheetのrefを作成（useEffectの依存配列から除外するため）
  const createNewSheetRef = useRef(createNewSheet);

  // createNewSheetが更新されたらrefも更新
  useEffect(() => {
    createNewSheetRef.current = createNewSheet;
  }, [createNewSheet]);

  // 既存のスプレッドシート接続機能は現在未使用（将来的な拡張用）

  // ポーリング機能は削除済み（送信時取得に変更）

  // (手動取得関数は UI から削除したため内部で直接は使わない)

  // 外部から現在のデータを取得（送信時取得用）
  const getCurrentData = useCallback(async (): Promise<DataProblemTemplateData | null> => {
    if (currentSpreadsheetId) {
      try {
        const data = await gasClientService.getSheetData(currentSpreadsheetId);
        if (data) onDataChange?.(data);
        return data;
      } catch (error) {
        console.error('Error fetching spreadsheet data:', error);
        return null;
      }
    } else {
      console.warn('No spreadsheet ID available for data fetch');
      return null;
    }
  }, [currentSpreadsheetId, onDataChange]);

  // ポーリング削除により、クリーンアップも不要

  // 親コンポーネントにgetCurrentData関数を渡す
  useEffect(() => {
    if (onGetCurrentDataRef) {
      onGetCurrentDataRef(getCurrentData);
    }
  }, [onGetCurrentDataRef, getCurrentData]);

  // セッション開始時に自動でシート作成（初回のみ実行）
  useEffect(() => {
    // spreadsheetStateは常にnullまたは値を持つ（undefinedなし）

    // If we have a persisted spreadsheet from ProblemContext, restore it instead of creating a new one.
    if (spreadsheetState?.spreadsheetId && !isSpreadsheetRestored) {
      setCurrentSpreadsheetId(spreadsheetState.spreadsheetId);
      setEmbedUrl(spreadsheetState.embedUrl ?? null);
      setIsConnected(true);
      setIsSpreadsheetRestored(true);
      return;
    }

    // Only create if: no saved sheet AND not restored yet
    if (
      spreadsheetState === null &&
      !isSpreadsheetRestored &&
      !isConnected &&
      !isLoading &&
      !error &&
      !isCreatingSheet
    ) {
      createNewSheetRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadsheetState, isLoading, error, isCreatingSheet]);

  // 既存スプレッドシートのデータ復元（1回のみ実行）
  useEffect(() => {
    if (
      !restorationAttempted &&
      !isDataRestored &&
      currentSpreadsheetId &&
      isConnected &&
      onDataChange &&
      spreadsheetState?.spreadsheetId === currentSpreadsheetId &&
      spreadsheetState?.spreadsheetId // 確実にspreadsheetIdが存在することを確認
    ) {
      setRestorationAttempted(true); // 先に試行フラグを立てる
      const restoreData = async () => {
        try {
          const data = await gasClientService.getSheetData(currentSpreadsheetId);
          if (data && onDataChange) {
            onDataChange(data);
            setIsDataRestored(true); // 成功時のみ復元完了フラグを立てる
          }
        } catch (error) {
          console.error('Failed to restore spreadsheet data:', error);
          // エラー時は試行済みだが復元未完了状態にする
        }
      };
      restoreData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restorationAttempted, isDataRestored, currentSpreadsheetId, isConnected, spreadsheetState?.spreadsheetId]);

  // エラー状態の表示
  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#fff5f5',
        border: '1px solid #fed7d7',
        borderRadius: '8px',
        margin: '16px'
      }}>
        <h3 style={{ color: '#c53030', marginBottom: '12px' }}>
          ⚠️ スプレッドシート接続エラー
        </h3>
        <p style={{ color: '#742a2a', marginBottom: '16px' }}>{error}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={createNewSheet}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            新しいシートを作成
          </button>
          <button
            onClick={() => setError(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            リトライ
          </button>
        </div>
      </div>
    );
  }

  // ローディング状態
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        backgroundColor: '#f7fafc',
        margin: '16px',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #4299e1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#4a5568' }}>データ整理問題用シートを準備中...</p>
        </div>
      </div>
    );
  }

  // スプレッドシート表示
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      margin: '0',
      padding: '0'
    }}>
      {/* スプレッドシート埋め込み */}
      {embedUrl && (
        <div style={{ flex: 1, minHeight: 0, backgroundColor: 'white' }}>
          <iframe
            src={embedUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="Data Analysis Problem Spreadsheet"
          />
        </div>
      )}

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};