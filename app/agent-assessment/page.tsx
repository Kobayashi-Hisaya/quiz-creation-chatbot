'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Split from 'react-split';
import '@/styles/split.css';
import { useAuth } from '@/contexts/AuthContext';
import { useProblem } from '@/contexts/ProblemContext';
import { saveProblem } from '@/services/problemService';
import type { SaveProblemData, ChatHistoryInput } from '@/services/problemService';
import { explanationChatService } from '@/services/explanationChatService';
import { reviewChatService } from '@/services/reviewChatService';
import { chatService } from '@/services/chatService';
import { assessmentService } from '@/services/assessmentService';
import type { DataProblemTemplateData } from '@/services/gasClientService';

interface ProblemDataToSave extends SaveProblemData {
  title: string;
}

interface SessionData {
  problemData: ProblemDataToSave;
  chatHistories: ChatHistoryInput[];
}

export default function AgentAssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { clearTopicSelection, clearPersistedSpreadsheet } = useProblem();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [learningTopic, setLearningTopic] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [currentSpreadsheetData, setCurrentSpreadsheetData] = useState<DataProblemTemplateData | null>(null);
  const [problemText, setProblemText] = useState<string>('');
  const [answerText, setAnswerText] = useState<string>('');
  
  // 編集フィールドの状態管理
  const [editedProblemText, setEditedProblemText] = useState<string>('');
  const [editedCode, setEditedCode] = useState<string>('');
  const [editedExplanation, setEditedExplanation] = useState<string>('');
  const [editedChoices, setEditedChoices] = useState<any[]>([]);

  // Split sizes の管理（localStorage に保存）
  const VERTICAL_SPLIT_KEY = 'agent-assessment-vertical-split';
  const DEFAULT_VERTICAL_SIZES: number[] = [85, 15]; // 上下 85:15（スプレッドシート広め）
  
  const getInitialVerticalSizes = (): number[] => {
    if (typeof window === 'undefined') return DEFAULT_VERTICAL_SIZES;
    try {
      const raw = localStorage.getItem(VERTICAL_SPLIT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as number[];
        if (Array.isArray(parsed) && parsed.length === 2) return parsed;
      }
    } catch (e) {
      console.warn('Failed to restore vertical split sizes', e);
    }
    return DEFAULT_VERTICAL_SIZES;
  };

  const [verticalSizes, setVerticalSizes] = useState<number[]>(getInitialVerticalSizes);

  const handleVerticalDragEnd = (newSizes: number[]) => {
    setVerticalSizes(newSizes);
    try {
      localStorage.setItem(VERTICAL_SPLIT_KEY, JSON.stringify(newSizes));
    } catch (e) {
      console.warn('Failed to save vertical split sizes', e);
    }
  };

  // 近未来風ボタンスタイル定義
  const getButtonStyle = (type: 'primary' | 'success' | 'warning' | 'danger' | 'secondary', isDisabled: boolean = false) => {
    const baseStyle = {
      padding: '10px 20px',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    const colors = {
      primary: {
        bg: '#00d4ff',
        hover: '#00a8cc',
        shadow: 'rgba(0, 212, 255, 0.2)'
      },
      success: {
        bg: '#00ff88',
        hover: '#00cc66',
        shadow: 'rgba(0, 255, 136, 0.2)'
      },
      warning: {
        bg: '#ffb800',
        hover: '#ff9800',
        shadow: 'rgba(255, 184, 0, 0.2)'
      },
      danger: {
        bg: '#ff3366',
        hover: '#cc0033',
        shadow: 'rgba(255, 51, 102, 0.2)'
      },
      secondary: {
        bg: '#4a5568',
        hover: '#2d3748',
        shadow: 'rgba(74, 85, 104, 0.2)'
      }
    };

    const colorSet = colors[type];
    const bg = isDisabled ? '#ccc' : colorSet.bg;
    const shadow = isDisabled ? 'none' : `0 0 10px ${colorSet.shadow}, 0 0 20px ${colorSet.shadow}`;

    return {
      ...baseStyle,
      backgroundColor: bg,
      boxShadow: shadow,
      color: type === 'success' ? '#000' : 'white',
      fontWeight: 'bold',
      textShadow: type !== 'success' ? '0 0 8px rgba(0,0,0,0.2)' : 'none'
    };
  };

  // SessionStorage から問題データを取得
  useEffect(() => {
    const initializeData = async () => {
      try {
        const stored = sessionStorage.getItem('problemDataForAssessment');
        if (!stored) {
          setError('問題データが見つかりません。作成画面から再度作成してください。');
          setLoading(false);
          return;
        }

        const data: SessionData = JSON.parse(stored);
        setSessionData(data);
        console.log('[AgentAssessment] 問題データ取得:', data);
        
        // 学習項目を取得（チャット履歴削除用）
        const storedLearningTopic = sessionStorage.getItem('learningTopic') || data.problemData.learning_topic || '';
        setLearningTopic(storedLearningTopic);
        console.log('[AgentAssessment] 学習項目:', storedLearningTopic);
        
        // 編集フィールドを初期化
        setEditedProblemText(data.problemData.problem_text || '');
        setEditedCode(data.problemData.code || '');
        setEditedExplanation(data.problemData.explanation || '');
        setEditedChoices(data.problemData.choices || []);
        
        // スプレッドシートデータを取得
        if (data.problemData.spreadsheet_id) {
          console.log('[AgentAssessment] スプレッドシートデータ取得開始:', data.problemData.spreadsheet_id);
          try {
            const response = await fetch(`/api/gas/get-problem-data?spreadsheetId=${data.problemData.spreadsheet_id}`);
            if (response.ok) {
              const spreadsheetData = await response.json();
              console.log('[AgentAssessment] スプレッドシートデータ取得成功:', spreadsheetData);
              setCurrentSpreadsheetData(spreadsheetData);

              // スプレッドシートから問題文と回答を取得
              if (spreadsheetData.sheets && spreadsheetData.sheets.length > 0) {
                const firstSheet = spreadsheetData.sheets[0];
                if (firstSheet.problemText) {
                  setProblemText(firstSheet.problemText);
                  console.log('[AgentAssessment] 問題文を取得:', firstSheet.problemText);
                }
                if (firstSheet.answerText) {
                  setAnswerText(firstSheet.answerText);
                  console.log('[AgentAssessment] 回答を取得:', firstSheet.answerText);
                }
              }
            } else {
              console.warn('[AgentAssessment] スプレッドシートデータ取得失敗:', response.status);
            }
          } catch (err) {
            console.error('[AgentAssessment] スプレッドシートデータ取得エラー:', err);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('[AgentAssessment] SessionStorage エラー:', err);
        setError('問題データの読み込みに失敗しました。');
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // スプレッドシートデータをassessmentServiceに同期
  useEffect(() => {
    if (currentSpreadsheetData) {
      assessmentService.setSpreadsheetData(currentSpreadsheetData);
      console.log('[AgentAssessment] スプレッドシートデータをassessmentServiceに同期');
    }
  }, [currentSpreadsheetData]);

  // 問題文と回答をassessmentServiceに同期
  useEffect(() => {
    if (problemText && answerText) {
      assessmentService.setProblemContext(problemText, answerText);
      console.log('[AgentAssessment] 問題コンテキストをassessmentServiceに同期');
    }
  }, [problemText, answerText]);

  // 解説をassessmentServiceに同期（編集フィールドの変更を監視）
  useEffect(() => {
    assessmentService.setExplanation(editedExplanation);
  }, [editedExplanation]);

  // スプレッドシートデータが取得できた後に自動診断を実行
  useEffect(() => {
    if (currentSpreadsheetData && sessionData && problemText && answerText && !isDiagnosing && !diagnosisResult) {
      console.log('[AgentAssessment] 全てのデータ取得完了 - 自動診断を開始');
      runDiagnosis();
    }
  }, [currentSpreadsheetData, sessionData, problemText, answerText]);

  // 自動診断を実行（同期されたデータを使用）
  const runDiagnosis = async () => {
    if (!sessionData?.problemData) {
      console.error('[AgentAssessment] 問題データが見つかりません');
      return;
    }

    setIsDiagnosing(true);
    try {
      console.log('[AgentAssessment] 診断開始: assessmentServiceを使用（同期されたデータ）');
      console.log('[AgentAssessment] 問題文:', problemText);
      console.log('[AgentAssessment] 回答:', answerText);
      console.log('[AgentAssessment] 解説:', editedExplanation);
      console.log('[AgentAssessment] スプレッドシートデータ:', currentSpreadsheetData);

      // 同期されたデータを使用して診断を実行（引数なし）
      const diagnosisText = await assessmentService.runDiagnosis();

      setDiagnosisResult(diagnosisText);
      console.log('[AgentAssessment] 診断完了');
    } catch (err) {
      console.error('[AgentAssessment] 診断エラー:', err);
      const errorMessage = err instanceof Error ? err.message : '診断処理中にエラーが発生しました。';
      setDiagnosisResult(errorMessage);
    } finally {
      setIsDiagnosing(false);
    }
  };



  
  // 問題保存ボタンクリック（修正後の解説を保存してダッシュボードへ）
  const handleSaveProblem = async () => {
    if (!sessionData || !user) {
      alert('エラーが発生しました。作成画面から再度作成してください。');
      return;
    }

    setIsSaving(true);

    try {
      const userInfo = { id: user.id, email: user.email };
      
      // 修正後の解説を modified_explanation として保存
      const updatedProblemData = {
        ...sessionData.problemData,
        modified_explanation: editedExplanation // 修正後の解説を設定
      };

      const result = await saveProblem(updatedProblemData, sessionData.chatHistories, { id: user.id, email: user.email || undefined });

      console.log('[AgentAssessment] 保存結果:', result);

      if (result.success) {
        console.log('[AgentAssessment] 問題保存成功 - セッションをクリア開始');
        
        if (user?.id) {
          // review chat履歴のクリア
          if (learningTopic) {
            const reviewStorageKey = `review-chat-messages:${user.id}:${learningTopic}`;
            localStorage.removeItem(reviewStorageKey);
            console.log(`localStorage removed: ${reviewStorageKey}`);
          }

          // explanation chat履歴のクリア
          const explanationStorageKey = `explanation-chat-messages:${user.id}`;
          localStorage.removeItem(explanationStorageKey);
          console.log(`localStorage removed: ${explanationStorageKey}`);

          // chat (問題作成チャット) 履歴のクリア
          const chatStorageKey = `chatMessages:${user.id}:${learningTopic}`;
          localStorage.removeItem(chatStorageKey);
          console.log(`localStorage removed: ${chatStorageKey}`);
        }

        // SessionStorage を全てクリア
        sessionStorage.removeItem('problemDataForAssessment');
        sessionStorage.removeItem('problemTitle');
        sessionStorage.removeItem('learningTopic');
        sessionStorage.removeItem('explanation');
        sessionStorage.removeItem('predicted_accuracy');
        sessionStorage.removeItem('predicted_answerTime');
        // ブラウザバック対応用のデータもクリア
        sessionStorage.removeItem('currentSpreadsheetId');
        sessionStorage.removeItem('problemText');
        sessionStorage.removeItem('answerText');
        
        // ProblemContext のスプレッドシート情報をクリア
        clearPersistedSpreadsheet();
        
        // 学習項目選択状態をクリア
        clearTopicSelection();

        // チャットサービスの履歴もクリア
        chatService.clearHistory();
        reviewChatService.clearHistory();
        explanationChatService.clearHistory();
        
        console.log('[AgentAssessment] 全てのセッション情報をクリアしました');
        
        alert('問題が保存されました！');
        router.push('/dashboard');
      } else {
        console.error('[AgentAssessment] 保存失敗:', result.error);
        alert(`問題の保存に失敗しました: ${result.error}`);
      }
    } catch (err) {
      console.error('[AgentAssessment] 保存エラー:', err);
      alert('問題の保存中にエラーが発生しました。');
    } finally {
      setIsSaving(false);
    }
  };

  // 正規登録ボタンクリック
  const handleRegisterProblem = async () => {
    if (!sessionData || !user) {
      alert('エラーが発生しました。作成画面から再度作成してください。');
      return;
    }

    setIsSaving(true);

    try {
      const userInfo = { id: user.id, email: user.email };
      const result = await saveProblem(sessionData.problemData, sessionData.chatHistories, userInfo);

      console.log('[AgentAssessment] 保存結果:', result);

      if (result.success) {
        console.log('[AgentAssessment] 問題登録成功 - セッションをクリア開始');

        if (user?.id) {
          // review chat履歴のクリア
          if (learningTopic) {
            const reviewStorageKey = `review-chat-messages:${user.id}:${learningTopic}`;
            localStorage.removeItem(reviewStorageKey);
            console.log(`localStorage removed: ${reviewStorageKey}`);
          }

          // explanation chat履歴のクリア
          const explanationStorageKey = `explanation-chat-messages:${user.id}`;
          localStorage.removeItem(explanationStorageKey);
          console.log(`localStorage removed: ${explanationStorageKey}`);

          // chat (問題作成チャット) 履歴のクリア
          const chatStorageKey = `chatMessages:${user.id}:${learningTopic}`;
          localStorage.removeItem(chatStorageKey);
          console.log(`localStorage removed: ${chatStorageKey}`);
        }

        // SessionStorage を全てクリア
        sessionStorage.removeItem('problemDataForAssessment');
        sessionStorage.removeItem('problemTitle');
        sessionStorage.removeItem('learningTopic');
        sessionStorage.removeItem('explanation');
        sessionStorage.removeItem('predicted_accuracy');
        sessionStorage.removeItem('predicted_answerTime');

        // ブラウザバック対応用のデータもクリア
        sessionStorage.removeItem('currentSpreadsheetId');
        sessionStorage.removeItem('problemText');
        sessionStorage.removeItem('answerText');

        // チャットサービスの履歴もクリア
        chatService.clearHistory();
        reviewChatService.clearHistory();
        explanationChatService.clearHistory();
        
        // ProblemContext のスプレッドシート情報をクリア
        clearPersistedSpreadsheet();
        
        // 学習項目選択状態をクリア
        clearTopicSelection();
        
        console.log('[AgentAssessment] 全てのセッション情報をクリアしました');
        
        alert('問題が正規に登録されました！');
        router.push('/dashboard');
      } else {
        console.error('[AgentAssessment] 保存失敗:', result.error);
        alert(`問題の登録に失敗しました: ${result.error}`);
      }
    } catch (err) {
      console.error('[AgentAssessment] 登録エラー:', err);
      alert('問題の登録中にエラーが発生しました。');
    } finally {
      setIsSaving(false);
    }
  };

  // キャンセルボタンクリック
  const handleCancel = () => {
    const confirmCancel = confirm('このままキャンセルすると、作成した問題は保存されません。よろしいですか？');
    if (confirmCancel) {
      // localStorageのチャット履歴をクリア
      if (user?.id) {
        if (learningTopic) {
          const reviewStorageKey = `review-chat-messages:${user.id}:${learningTopic}`;
          localStorage.removeItem(reviewStorageKey);
          console.log(`localStorage removed: ${reviewStorageKey}`);
        }
        const explanationStorageKey = `explanation-chat-messages:${user.id}`;
        localStorage.removeItem(explanationStorageKey);
        console.log(`localStorage removed: ${explanationStorageKey}`);
        
        const chatStorageKey = `chatMessages:${user.id}:${learningTopic}`;
        localStorage.removeItem(chatStorageKey);
        console.log(`localStorage removed: ${chatStorageKey}`);
      }

      sessionStorage.removeItem('problemDataForAssessment');
      sessionStorage.removeItem('problemTitle');
      sessionStorage.removeItem('learningTopic');
      sessionStorage.removeItem('explanation');
      sessionStorage.removeItem('predicted_accuracy');
      sessionStorage.removeItem('predicted_answerTime');
      sessionStorage.removeItem('currentSpreadsheetId');
      sessionStorage.removeItem('problemText');
      sessionStorage.removeItem('answerText');

      // チャットサービスの履歴もクリア
      chatService.clearHistory();
      reviewChatService.clearHistory();
      explanationChatService.clearHistory();

      router.push('/dashboard');
    }
  };

  // create-mcqページに戻る（SessionStorageデータを保持）
  const handleBackToEdit = () => {
    // 編集内容をsessionDataに反映してSessionStorageに保存
    if (sessionData) {
      const updatedSessionData = {
        ...sessionData,
        problemData: {
          ...sessionData.problemData,
          problem_text: editedProblemText,
          code: editedCode,
          explanation: editedExplanation,
          choices: editedChoices
        }
      };
      sessionStorage.setItem('problemDataForAssessment', JSON.stringify(updatedSessionData));
      console.log('[AgentAssessment] 編集内容を保存:', updatedSessionData);
    }
    // SessionStorageは保持したまま create-mcq に戻る
    router.push('/create-mcq');
  };

  // Dashboardに戻る
  const handleBackToDashboard = () => {
    const confirmCancel = confirm('Dashboardに戻ると、作成中の問題は保存されません。よろしいですか？');
    if (confirmCancel) {
      // localStorageのチャット履歴をクリア
      if (user?.id) {
        if (learningTopic) {
          const reviewStorageKey = `review-chat-messages:${user.id}:${learningTopic}`;
          localStorage.removeItem(reviewStorageKey);
          console.log(`localStorage removed: ${reviewStorageKey}`);
        }
        const explanationStorageKey = `explanation-chat-messages:${user.id}`;
        localStorage.removeItem(explanationStorageKey);
        console.log(`localStorage removed: ${explanationStorageKey}`);
        
        const chatStorageKey = `chatMessages:${user.id}:${learningTopic}`;
        localStorage.removeItem(chatStorageKey);
        console.log(`localStorage removed: ${chatStorageKey}`);
      }

      sessionStorage.removeItem('problemDataForAssessment');
      sessionStorage.removeItem('problemTitle');
      sessionStorage.removeItem('learningTopic');
      sessionStorage.removeItem('explanation');
      sessionStorage.removeItem('predicted_accuracy');
      sessionStorage.removeItem('predicted_answerTime');
      sessionStorage.removeItem('currentSpreadsheetId');
      sessionStorage.removeItem('problemText');
      sessionStorage.removeItem('answerText');

      // チャットサービスの履歴もクリア
      chatService.clearHistory();
      reviewChatService.clearHistory();
      explanationChatService.clearHistory();

      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '16px',
          color: '#666'
        }}>
          読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '18px',
            color: '#c33',
            marginBottom: '20px'
          }}>
            ⚠️ エラー
          </div>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '20px'
          }}>
            {error}
          </p>
          <button
            onClick={() => router.push('/create-quiz')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00d4ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.8), inset 0 0 10px rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            問題作成ページに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f0f4f8',
        borderBottom: '2px solid #00d4ff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 15px rgba(0, 212, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{
            fontWeight: 'bold',
            fontSize: '18px',
            margin: 0,
            color: '#2c3e50',
            borderLeft: '4px solid #00d4ff',
            paddingLeft: '12px',
            textShadow: '0 0 10px rgba(0, 212, 255, 0.2)'
          }}>
            🤖 自動診断・修正
          </h1>
          <div style={{
            height: '30px',
            width: '1px',
            backgroundColor: '#bbb',
            margin: '0 4px'
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📋 問題：
            </span>
            <div style={{
              padding: '6px 14px',
              border: '2px solid #f3e5f5',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#f3e5f5',
              color: '#7b1fa2',
              boxShadow: '0 2px 4px rgba(156, 39, 176, 0.15)',
              minWidth: '120px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {sessionData.problemData.title || 'タイトル未定'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleBackToEdit}
            style={{
              padding: '6px 12px',
              border: '2px solid #00d4ff',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              color: '#00d4ff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 0 6px rgba(0, 212, 255, 0.3)',
              boxShadow: '0 0 8px rgba(0, 212, 255, 0.15)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.05)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 212, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← 戻る
          </button>
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: '6px 12px',
              backgroundColor: '#00d4ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 0 6px rgba(0,0,0,0.2)',
              boxShadow: '0 0 12px rgba(0, 212, 255, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 0 18px rgba(0, 212, 255, 0.5), inset 0 0 6px rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* メインコンテンツエリア - 2カラムレイアウト */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* 左側：自動診断結果 */}
        <div style={{
          flex: '0 0 50%',
          borderRight: '2px solid #e0e0e0',
          backgroundColor: '#fafafa',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '20px',
            flex: 1,
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginTop: 0,
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #9c27b0'
            }}>
              AI診断結果
            </h2>

            {/* 診断ボタン */}
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={runDiagnosis}
                disabled={isDiagnosing}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: isDiagnosing ? '#95a5a6' : '#00d4ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: isDiagnosing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: isDiagnosing ? 'none' : '0 4px 15px rgba(0, 212, 255, 0.3)',
                  opacity: isDiagnosing ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!isDiagnosing) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)';
                    e.currentTarget.style.backgroundColor = '#00a8cc';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isDiagnosing) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                    e.currentTarget.style.backgroundColor = '#00d4ff';
                  }
                }}
              >
                {isDiagnosing ? '診断中...' : '🤖 AI診断を実行'}
              </button>
            </div>

            {/* 診断状態の表示 */}
            {isDiagnosing ? (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#856404',
                  fontWeight: '500'
                }}>
                  診断中...
                </p>
              </div>
            ) : diagnosisResult ? (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                padding: '16px',
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#2c3e50',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {diagnosisResult}
                </p>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#1565c0',
                  fontStyle: 'italic'
                }}>
                  上のボタンをクリックして診断を開始してください。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 右側：修正スペース（スプレッドシート + 解説編集 + 保存ボタン） */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          <Split
            sizes={verticalSizes}
            minSize={150}
            gutterSize={8}
            direction="vertical"
            cursor="row-resize"
            className="split-flex"
            onDragEnd={handleVerticalDragEnd}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
          {/* 上部：スプレッドシート */}
          <div style={{
            height: '100%',
            backgroundColor: 'white',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#1a1a2e',
              color: 'white',
              borderBottom: '3px solid #00d4ff',
              flexShrink: 0
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                スプレッドシート（編集・診断）
              </h2>
            </div>

            <div style={{
              flex: 1,
              position: 'relative',
              backgroundColor: '#f9f9f9',
              overflow: 'hidden'
            }}>
              {sessionData?.problemData?.spreadsheet_id ? (
                <iframe
                  src={`https://docs.google.com/spreadsheets/d/${sessionData.problemData.spreadsheet_id}/edit`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  title="作業用スプレッドシート（スプシ①）"
                  allowFullScreen
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  スプレッドシートが作成されていません
                </div>
              )}
            </div>
          </div>

          {/* 下部：解説編集 */}
          <div style={{
            height: '100%',
            backgroundColor: '#ffffff',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#2c3e50',
              color: 'white',
              borderBottom: '2px solid #3498db',
              flexShrink: 0
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                解説編集
              </h3>
            </div>

            <div style={{
              flex: 1,
              padding: '16px',
              overflow: 'auto'
            }}>
              <textarea
                value={editedExplanation}
                onChange={(e) => setEditedExplanation(e.target.value)}
                placeholder="解説を入力してください..."
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </Split>

        {/* 問題保存ボタンブロック（独立） */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderTop: '2px solid #e0e0e0',
          flexShrink: 0
        }}>
          <button
            onClick={handleSaveProblem}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: isSaving ? '#95a5a6' : '#00ff88',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: isSaving ? 'none' : '0 4px 15px rgba(0, 255, 136, 0.3)',
              opacity: isSaving ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!isSaving) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.5)';
                e.currentTarget.style.backgroundColor = '#00cc66';
              }
            }}
            onMouseOut={(e) => {
              if (!isSaving) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.3)';
                e.currentTarget.style.backgroundColor = '#00ff88';
              }
            }}
          >
            {isSaving ? '保存中...' : '✓ 問題保存してダッシュボードへ'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}