import React, { useState, useEffect, useRef } from 'react';
import { sheetsClientService, type QuizTemplateData } from '@/services/sheetsClientService';

interface GoogleSheetsPanelProps {
  onDataChange?: (data: QuizTemplateData) => void;
  onError?: (error: string) => void;
}

export const GoogleSheetsPanel: React.FC<GoogleSheetsPanelProps> = ({
  onDataChange,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSpreadsheetId, setCurrentSpreadsheetId] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 新しいスプレッドシートを作成
  const createNewSheet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const result = await sheetsClientService.createNewSheet(`Quiz Template - ${timestamp}`);

      if (result) {
        setCurrentSpreadsheetId(result.spreadsheetId);
        setEmbedUrl(result.embedUrl);
        setIsConnected(true);
        
        // データ変更の監視を開始
        startDataPolling(result.spreadsheetId);
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
  };

  // 既存のスプレッドシートに接続
  const connectToExistingSheet = async (spreadsheetId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // データ取得をテストして接続確認
      const testData = await sheetsClientService.getSheetData(spreadsheetId);
      
      if (testData !== null) {
        setCurrentSpreadsheetId(spreadsheetId);
        const url = sheetsClientService.getEmbedUrl(spreadsheetId);
        setEmbedUrl(url);
        setIsConnected(true);
        
        // データ変更の監視を開始
        startDataPolling(spreadsheetId);
      } else {
        throw new Error('Failed to connect to spreadsheet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // データ変更の監視を開始
  const startDataPolling = (spreadsheetId: string) => {
    if (pollingIntervalRef.current) {
      sheetsClientService.stopPolling(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = sheetsClientService.startPolling(
      spreadsheetId,
      (data) => {
        onDataChange?.(data);
      },
      3000 // 3秒間隔でポーリング
    );
  };

  // データ変更の監視を停止
  const stopDataPolling = () => {
    if (pollingIntervalRef.current) {
      sheetsClientService.stopPolling(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // 手動でデータを取得
  const fetchCurrentData = async () => {
    if (currentSpreadsheetId) {
      const data = await sheetsClientService.getSheetData(currentSpreadsheetId);
      if (data) {
        onDataChange?.(data);
      }
    }
  };

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      stopDataPolling();
    };
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
          ⚠️ Google Sheets 接続エラー
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

  // 初期状態 - 接続方法の選択
  if (!isConnected && !isLoading) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f7fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        margin: '16px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>
          📊 Google Sheets 連携
        </h3>
        <p style={{ marginBottom: '20px', color: '#4a5568' }}>
          問題文とコードの入力にGoogle Sheetsを使用します
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={createNewSheet}
            style={{
              padding: '12px 24px',
              backgroundColor: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🆕 新しいシートを作成
          </button>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginTop: '8px'
          }}>
            <input
              type="text"
              placeholder="既存のシートIDを入力"
              id="existingSheetId"
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e0',
                borderRadius: '4px',
                fontSize: '14px',
                width: '200px'
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('existingSheetId') as HTMLInputElement;
                if (input.value.trim()) {
                  connectToExistingSheet(input.value.trim());
                }
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔗 接続
            </button>
          </div>
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
          <p style={{ color: '#4a5568' }}>Google Sheets を準備中...</p>
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
            📊 問題作成シート
          </span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#48bb78'
          }} />
          <span style={{ fontSize: '12px', color: '#4a5568' }}>接続中</span>
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
            🔄 更新
          </button>
          
          {embedUrl && (
            <a
              href={embedUrl}
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
            src={`${embedUrl}&embedded=true`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="Google Sheets Template"
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