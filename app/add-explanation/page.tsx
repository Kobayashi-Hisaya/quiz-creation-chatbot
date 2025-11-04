"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Split from 'react-split';
import '@/styles/split.css';
import { DataSpreadsheetPanel } from '@/components/DataSpreadsheetPanel';
import { ExplanationChatContainer } from '@/components/ExplanationChatContainer';
import { TitleInputPopup } from '@/components/TitleInputPopup';
import { explanationChatService } from '@/services/explanationChatService';
import { reviewChatService } from '@/services/reviewChatService';
import { chatService } from '@/services/chatService';
import { useProblem } from '@/contexts/ProblemContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveProblem } from '@/services/problemService';

const HORIZONTAL_SPLIT_KEY = 'add-explanation-horizontal-split';
const VERTICAL_SPLIT_KEY = 'add-explanation-vertical-split';
const DEFAULT_HORIZONTAL_SIZES: number[] = [50, 50];
const DEFAULT_VERTICAL_SIZES: number[] = [60, 40]; // 上: AIチャット 60%, 下: 解説入力 40%

const getInitialSplitSizes = (key: string, defaultSizes: number[]): number[] => {
  if (typeof window === 'undefined') return defaultSizes;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as number[];
      if (Array.isArray(parsed) && parsed.length === 2) return parsed;
    }
  } catch (e) {
    console.warn('Failed to restore split sizes', e);
  }
  return defaultSizes;
};

const AddExplanationPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { problemData, spreadsheetState, clearTopicSelection } = useProblem();

  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [problemText, setProblemText] = useState<string>('');
  const [answerText, setAnswerText] = useState<string>('');
  const [learningTopic, setLearningTopic] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTitlePopup, setShowTitlePopup] = useState(false);

  const [horizontalSizes, setHorizontalSizes] = useState<number[]>(
    getInitialSplitSizes(HORIZONTAL_SPLIT_KEY, DEFAULT_HORIZONTAL_SIZES)
  );
  const [verticalSizes, setVerticalSizes] = useState<number[]>(
    getInitialSplitSizes(VERTICAL_SPLIT_KEY, DEFAULT_VERTICAL_SIZES)
  );

  const explanationInputRef = useRef<HTMLTextAreaElement>(null);

  // ページ初期化: sessionStorageからデータを読み込み
  useEffect(() => {
    const initializePage = async () => {
      try {
        // sessionStorageからデータを取得
        const storedSpreadsheetId = sessionStorage.getItem('currentSpreadsheetId');
        const storedProblemText = sessionStorage.getItem('problemText');
        const storedAnswerText = sessionStorage.getItem('answerText');
        const storedPredictedAccuracy = sessionStorage.getItem('predicted_accuracy');
        const storedPredictedAnswerTime = sessionStorage.getItem('predicted_answerTime');

        console.log('=== add-explanation ページ初期化 ===');
        console.log('storedPredictedAccuracy:', storedPredictedAccuracy);
        console.log('storedPredictedAnswerTime:', storedPredictedAnswerTime);

        if (!storedSpreadsheetId || !storedProblemText) {
          alert('必要なデータが見つかりません。create-quizページからやり直してください。');
          router.push('/create-quiz');
          return;
        }

        setSpreadsheetId(storedSpreadsheetId);
        setProblemText(storedProblemText);
        setAnswerText(storedAnswerText || '');

        // explanationChatServiceにコンテキストを設定
        explanationChatService.setProblemContext(storedProblemText, storedAnswerText || '');

        setIsInitialized(true);
      } catch (error) {
        console.error('ページ初期化エラー:', error);
        alert('ページの初期化に失敗しました。');
        router.push('/create-quiz');
      }
    };

    initializePage();
  }, [router]);

  // Split sizes の保存
  const handleHorizontalDragEnd = (sizes: number[]) => {
    setHorizontalSizes(sizes);
    localStorage.setItem(HORIZONTAL_SPLIT_KEY, JSON.stringify(sizes));
  };

  const handleVerticalDragEnd = (sizes: number[]) => {
    setVerticalSizes(sizes);
    localStorage.setItem(VERTICAL_SPLIT_KEY, JSON.stringify(sizes));
  };


  // 自動診断前にタイトル入力を促す
  const handleAutodiagnosis = async () => {
    if (!explanation.trim()) {
      const confirmed = window.confirm('解説が入力されていません。このまま保存しますか？');
      if (!confirmed) return;
    }

    // 作成チャット履歴のバリデーション
    const creationHistory = chatService.getConversationHistory();
    if (creationHistory.length === 0) {
      alert('問題作成チャット履歴が見つかりません。create-quizページから問題を作成してください。');
      return;
    }

    if (!user?.id) {
      alert('ユーザー情報が見つかりません。ログインし直してください。');
      return;
    }

    // タイトル入力ポップアップを表示
    setShowTitlePopup(true);
  };

  // タイトル入力後の処理
  const handleTitleSubmit = async (title: string) => {
    console.log('=== タイトル入力完了 ===');
    console.log('title:', title);
    setShowTitlePopup(false);

    try {
      setIsSaving(true);

      // sessionStorage から予想データを取得
      const storedPredictedAccuracy = sessionStorage.getItem('predicted_accuracy');
      const storedPredictedAnswerTime = sessionStorage.getItem('predicted_answerTime');
      
      const predicted_accuracy = storedPredictedAccuracy ? parseInt(storedPredictedAccuracy, 10) : null;
      const predicted_answerTime = storedPredictedAnswerTime ? parseInt(storedPredictedAnswerTime, 10) : null;

      console.log('=== 保存するデータの確認 ===');
      console.log('predicted_accuracy:', predicted_accuracy);
      console.log('predicted_answerTime:', predicted_answerTime);

      // 保存するデータを準備
      const saveData = {
        problem_text: problemText,
        code: problemData.code || answerText,
        language: problemData.language || '',
        learning_topic: problemData.learningTopic || '',
        code_with_blanks: null,
        choices: null,
        explanation: explanation.trim() || null,
        title: title,
        spreadsheet_url: spreadsheetState?.embedUrl || null,
        spreadsheet_id: spreadsheetId,
        problem_category: '',
        session_id: null,
        table_data: null,
        predicted_accuracy: predicted_accuracy,
        predicted_answerTime: predicted_answerTime,
      };

      // チャット履歴を取得（creation, explanation, review chat履歴を含める）
      const chatHistories = [
        {
          chat_type: 'creation' as const,
          messages: chatService.getConversationHistory(),
        },
        {
          chat_type: 'explanation' as const,
          messages: explanationChatService.getConversationHistory(),
        },
        {
          chat_type: 'review' as const,
          messages: reviewChatService.getConversationHistory(),
        },
      ];

      // Supabaseに保存
      const result = await saveProblem(saveData, chatHistories, {
        id: user!.id,
        email: user!.email || undefined,
      });

      if (result.success) {
        // Assessment spreadsheet を作成
        let assessmentSpreadsheetId: string | null = null;
        
        if (user?.email) {
          try {
            const assessmentResponse = await fetch('/api/gas/create-assessment-sheet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userEmail: user.email,
                sessionId: `assessment-${Date.now()}`,
                problemData: {
                  problem_text: saveData.problem_text,
                  explanation: saveData.explanation,
                  code: saveData.code,
                  language: saveData.language,
                  learning_topic: saveData.learning_topic,
                  predicted_accuracy: saveData.predicted_accuracy,
                  predicted_answerTime: saveData.predicted_answerTime,
                }
              })
            });

            if (assessmentResponse.ok) {
              const assessmentResult = await assessmentResponse.json();
              assessmentSpreadsheetId = assessmentResult.spreadsheet.spreadsheetId;
            } else {
              console.error('Assessment spreadsheet creation failed:', assessmentResponse.statusText);
            }
          } catch (error) {
            console.error('Error creating assessment spreadsheet:', error);
          }
        }

        // SessionStorage に問題データを保存
        const sessionData = {
          problemData: {
            ...saveData,
            assessment_spreadsheet_id: assessmentSpreadsheetId
          },
          chatHistories: chatHistories,
        };

        sessionStorage.setItem('problemDataForAssessment', JSON.stringify(sessionData));

        // sessionStorageをクリア
        sessionStorage.removeItem('currentSpreadsheetId');
        sessionStorage.removeItem('problemText');
        sessionStorage.removeItem('answerText');

        // agent-assessment ページに遷移
        router.push('/agent-assessment');
      } else {
        throw new Error(result.error || '保存に失敗しました');
      }
    } catch (error) {
      console.error('保存エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      alert(`問題の保存に失敗しました：${errorMessage}\n\nしばらく待ってからもう一度お試しください。`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleCancel = () => {
    console.log('=== タイトル入力キャンセル ===');
    setShowTitlePopup(false);
  };

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <TitleInputPopup
        isOpen={showTitlePopup}
        onSubmit={handleTitleSubmit}
        onCancel={handleTitleCancel}
      />
      <Split
        className="split-horizontal"
        sizes={horizontalSizes}
        minSize={[400, 400]}
        gutterSize={8}
        direction="horizontal"
        onDragEnd={handleHorizontalDragEnd}
      >
        {/* 左側: スプレッドシート */}
        <div style={{ height: '100vh', overflow: 'hidden' }}>
          {spreadsheetId && (
            <DataSpreadsheetPanel
              userEmail={user?.email}
              onError={(error) => console.error('Spreadsheet error:', error)}
            />
          )}
        </div>

        {/* 右側: Explanation入力 + チャット */}
        <div style={{ height: '100vh', overflow: 'hidden' }}>
          <Split
            className="split-vertical"
            sizes={verticalSizes}
            minSize={[300, 200]}
            gutterSize={8}
            direction="vertical"
            onDragEnd={handleVerticalDragEnd}
          >
            {/* 上部: AIチャット */}
            <div style={{ height: '100%', overflow: 'hidden' }}>
              <ExplanationChatContainer showHeader={false} />
            </div>

            {/* 下部: Explanation入力欄 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                borderTop: '1px solid #ddd',
                overflow: 'auto',
              }}
            >
              <h2 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold' }}>
                解説文を作成
              </h2>
              <textarea
                ref={explanationInputRef}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="問題の解説を入力してください..."
                style={{
                  flex: 1,
                  minHeight: '100px',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical',
                  fontFamily: 'monospace',
                }}
              />
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <button
                  onClick={() => router.push('/create-quiz')}
                  style={{
                    padding: '10px 20px',
                    fontSize: '13px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ← 問題作成画面に戻る
                </button>
                <button
                  onClick={handleAutodiagnosis}
                  disabled={isSaving}
                  style={{
                    padding: '5px 10px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: isSaving ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSaving ? '処理中...' : '自動診断'}
                </button>
              </div>
            </div>
          </Split>
        </div>
      </Split>
    </div>
  );
};

export default AddExplanationPage;
