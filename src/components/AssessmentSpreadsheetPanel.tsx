import React, { useState, useCallback, useRef, useEffect } from 'react';
import { gasClientService, type DataProblemTemplateData } from '@/services/gasClientService';

interface ProblemData {
  problem_text: string;
  code?: string | null;
  language?: string | null;
  learning_topic?: string | null;
  code_with_blanks?: string | null;
  choices?: Array<{ id: string; text: string; isCorrect: boolean }> | null;
  explanation?: string | null;
  title?: string | null;
  predicted_accuracy?: number | null;
  predicted_answerTime?: number | null;
  assessment_spreadsheet_id?: string | null;
}

interface AssessmentSpreadsheetPanelProps {
  userEmail?: string;
  problemData: ProblemData;
  onDataChange?: (data: any) => void;
  onError?: (error: string) => void;
  onGetCurrentDataRef?: (getCurrentData: () => Promise<any | null>) => void;
}

export const AssessmentSpreadsheetPanel: React.FC<AssessmentSpreadsheetPanelProps> = ({
  userEmail = 'user@example.com',
  problemData,
  onDataChange,
  onError,
  onGetCurrentDataRef
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSpreadsheetId, setCurrentSpreadsheetId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);

  // 新しい評価用スプレッドシートを作成
  const createAssessmentSheet = useCallback(async () => {
    if (isCreatingSheet) return;
    
    setIsCreatingSheet(true);
    setIsLoading(true);
    setError(null);

    try {
      const finalSessionId = currentSessionId || gasClientService.generateSessionId();
      setCurrentSessionId(finalSessionId);

      // 問題データをスプレッドシート形式に変換
      const assessmentData = {
        problemText: problemData.problem_text,
        code: problemData.code,
        language: problemData.language,
        learningTopic: problemData.learning_topic || '',
        codeWithBlanks: problemData.code_with_blanks || '',
        choices: (problemData.choices || []).map((c, idx) => ({
          option: String.fromCharCode(65 + idx), // A, B, C, D...
          text: c.text,
          isCorrect: c.isCorrect
        })),
        explanation: problemData.explanation,
        title: problemData.title,
        expectedAccuracy: problemData.predicted_accuracy || null,
        expectedAnswerTime: problemData.predicted_answerTime || null,
      };

      // 評価用のスプレッドシートを作成
      const result = await gasClientService.createAssessmentSheet(userEmail, finalSessionId, assessmentData);

      if (result) {
        const sheetId = result.spreadsheet.spreadsheetId;
        setCurrentSpreadsheetId(sheetId);
        const newEmbedUrl = gasClientService.getEmbedUrl(sheetId);
        setEmbedUrl(newEmbedUrl);
        setIsConnected(true);
      } else {
        throw new Error('Failed to create assessment spreadsheet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setIsCreatingSheet(false);
    }
  }, [currentSessionId, userEmail, problemData, isCreatingSheet, onError]);

  // 外部から現在のデータを取得
  const getCurrentData = useCallback(async () => {
    if (currentSpreadsheetId) {
      try {
        const data = await gasClientService.getAssessmentSheetData(currentSpreadsheetId);
        if (data) onDataChange?.(data);
        return data;
      } catch (error) {
        console.error('Error fetching assessment spreadsheet data:', error);
        return null;
      }
    }
    return null;
  }, [currentSpreadsheetId, onDataChange]);

  // refを外部に公開（親が呼び出せるように）
  useEffect(() => {
    onGetCurrentDataRef?.(getCurrentData);
  }, [getCurrentData, onGetCurrentDataRef]);

  // マウント時にシートを作成
  useEffect(() => {
    if (!isConnected && !isLoading) {
      createAssessmentSheet();
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '12px',
      padding: '12px'
    }}>
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#ffebee',
          border: '1px solid #ef5350',
          borderRadius: '4px',
          color: '#c62828',
          fontSize: '12px'
        }}>
          エラー: {error}
        </div>
      )}

      {isLoading && (
        <div style={{
          padding: '12px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #1976d2',
          borderRadius: '4px',
          color: '#0d47a1',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          スプレッドシートを準備中...
        </div>
      )}

      {isConnected && embedUrl && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            修正用スプレッドシート
          </div>
          <iframe
            src={embedUrl}
            style={{
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '300px',
              backgroundColor: 'white'
            }}
            title="Assessment Spreadsheet"
            allowFullScreen
          />
          <div style={{
            fontSize: '11px',
            color: '#999',
            textAlign: 'center'
          }}>
            スプレッドシート内で問題の各フィールドを直接編集できます
          </div>
        </div>
      )}

      {!isConnected && !isLoading && (
        <button
          onClick={createAssessmentSheet}
          disabled={isCreatingSheet}
          style={{
            padding: '10px',
            backgroundColor: isCreatingSheet ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isCreatingSheet ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {isCreatingSheet ? '作成中...' : 'スプレッドシートを作成'}
        </button>
      )}
    </div>
  );
};
