import React, { useState, useEffect, useCallback } from 'react';
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

  // 新しいデータ整理問題用スプレッドシートを作成
  const createNewSheet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const finalSessionId = currentSessionId || gasClientService.generateSessionId();
      setCurrentSessionId(finalSessionId);

      const result = await gasClientService.createDataProblemSheet(userEmail, finalSessionId);

      if (result) {
        setCurrentSpreadsheetId(result.spreadsheet.spreadsheetId);
        const embedUrl = gasClientService.getEmbedUrl(result.spreadsheet.spreadsheetId);
        setEmbedUrl(embedUrl);
        setIsConnected(true);
        
        // 親コンポーネントに通知
        onSpreadsheetCreated?.(result.spreadsheet.spreadsheetId, embedUrl);
        
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
    }
  }, [currentSessionId, userEmail, onSpreadsheetCreated, onError]);

  // 既存のスプレッドシート接続機能は現在未使用（将来的な拡張用）

  // ポーリング機能は削除済み（送信時取得に変更）

  // 手動でデータを取得（内部用）
  const fetchCurrentData = async () => {
    if (currentSpreadsheetId) {
      const data = await gasClientService.getSheetData(currentSpreadsheetId);
      if (data) {
        onDataChange?.(data);
      }
    }
  };

  // 外部から現在のデータを取得（送信時取得用）
  const getCurrentData = useCallback(async (): Promise<DataProblemTemplateData | null> => {
    if (currentSpreadsheetId) {
      try {
        return await gasClientService.getSheetData(currentSpreadsheetId);
      } catch (error) {
        console.error('Error fetching spreadsheet data:', error);
        return null;
      }
    } else {
      console.warn('No spreadsheet ID available for data fetch');
      return null;
    }
  }, [currentSpreadsheetId]);

  // ポーリング削除により、クリーンアップも不要

  // 親コンポーネントにgetCurrentData関数を渡す
  useEffect(() => {
    if (onGetCurrentDataRef) {
      onGetCurrentDataRef(getCurrentData);
    }
  }, [currentSpreadsheetId, onGetCurrentDataRef, getCurrentData]);

  // セッション開始時に自動でシート作成（初回のみ実行）
  useEffect(() => {
    if (!isConnected && !isLoading && !error) {
      createNewSheet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* ツールバー */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#2d3748' 
          }}>
            📊 データ整理問題シート
          </span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#48bb78'
          }} />
          <span style={{ fontSize: '12px', color: '#4a5568' }}>送信時に最新データを取得</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchCurrentData}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔄 手動更新
          </button>
          
          {currentSpreadsheetId && (
            <a
              href={gasClientService.getEditUrl(currentSpreadsheetId)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 12px',
                backgroundColor: '#48bb78',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              🔗 新しいタブで開く
            </a>
          )}
        </div>
      </div>

      {/* スプレッドシート埋め込み */}
      {embedUrl && (
        <div style={{ flex: 1, minHeight: 0 }}>
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