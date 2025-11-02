'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { saveProblem } from '@/services/problemService';
import type { SaveProblemData, ChatHistoryInput } from '@/services/problemService';
import { AssessmentSpreadsheetPanel } from '@/components/AssessmentSpreadsheetPanel';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  
  // 編集フィールドの状態管理
  const [editedProblemText, setEditedProblemText] = useState<string>('');
  const [editedCode, setEditedCode] = useState<string>('');
  const [editedExplanation, setEditedExplanation] = useState<string>('');
  const [editedChoices, setEditedChoices] = useState<any[]>([]);

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
      
      // 編集フィールドを初期化
      setEditedProblemText(data.problemData.problem_text || '');
      setEditedCode(data.problemData.code || '');
      setEditedExplanation(data.problemData.explanation || '');
      setEditedChoices(data.problemData.choices || []);
      
      // データ取得後、自動診断を実行
      runDiagnosis();
    } catch (err) {
      console.error('[AgentAssessment] SessionStorage エラー:', err);
      setError('問題データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  // 自動診断を実行
  const runDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      // Assessment spreadsheet データを取得（もし存在する場合）
      let spreadsheetData = null;
      if (sessionData?.problemData?.assessment_spreadsheet_id) {
        try {
          const sheetResponse = await fetch(
            `/api/gas/get-assessment-data?spreadsheetId=${sessionData.problemData.assessment_spreadsheet_id}`
          );
          if (sheetResponse.ok) {
            spreadsheetData = await sheetResponse.json();
            console.log('[AgentAssessment] スプレッドシートデータ取得:', spreadsheetData);
          }
        } catch (error) {
          console.warn('[AgentAssessment] スプレッドシートデータ取得エラー:', error);
        }
      }

      console.log('[AgentAssessment] 診断開始: /api/chat にリクエスト送信');
      
      // プロンプトを構築
      let systemPrompt = 'あなたは教育用の問題作成アシスタントです。以下の問題を分析し、改善提案をしてください。';
      
      if (spreadsheetData) {
        systemPrompt += '\n\n【問題データ（スプレッドシート）】\n';
        if (spreadsheetData.sheets && spreadsheetData.sheets.length > 0) {
          const firstSheet = spreadsheetData.sheets[0];
          if (firstSheet.tableData) {
            systemPrompt += '以下は問題の詳細情報です：\n';
            firstSheet.tableData.slice(0, 15).forEach((row: any[], index: number) => {
              if (Array.isArray(row)) {
                const rowText = row.join(' | ');
                if (rowText.trim()) {
                  systemPrompt += `行${index + 1}: ${rowText}\n`;
                }
              }
            });
          }
        }
      }

      // LangChainのメッセージ形式に変換
      const messages = [
        {
          role: 'user',
          content: `以下の問題について、医学的な正確性、わかりやすさ、難易度のバランスなどの観点から分析し、改善提案をしてください。\n\n【問題テキスト】\n${sessionData?.problemData?.problem_text || 'なし'}\n\n【選択肢】\n${sessionData?.problemData?.choices?.map((c: any, i: number) => `${String.fromCharCode(65 + i)}. ${c.text}${c.isCorrect ? ' (正解)' : ''}`).join('\n') || 'なし'}\n\n【解説】\n${sessionData?.problemData?.explanation || 'なし'}`
        }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          systemPrompt: systemPrompt,
          model: 'gpt-4o',
          temperature: 0.7
        }),
      });

      console.log('[AgentAssessment] レスポンス受信:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AgentAssessment] エラーレスポンス:', errorText);
        throw new Error(`診断リクエストが失敗しました (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('[AgentAssessment] レスポンスJSON:', data);
      
      // レスポンスの形式に応じて処理
      const diagnosisText = data.content || data.reply || 'AI応答が得られませんでした。';
      setDiagnosisResult(diagnosisText);
      console.log('[AgentAssessment] 診断結果:', diagnosisText);
    } catch (err) {
      console.error('[AgentAssessment] 診断エラー:', err);
      setDiagnosisResult('診断処理中にエラーが発生しました。詳細はコンソールを確認してください。');
    } finally {
      setIsDiagnosing(false);
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
        // SessionStorage をクリア
        sessionStorage.removeItem('problemDataForAssessment');
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
      sessionStorage.removeItem('problemDataForAssessment');
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
      sessionStorage.removeItem('problemDataForAssessment');
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

      {/* スクロール可能なコンテンツ - 2分割レイアウト */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* 左側：診断結果パネル */}
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
              🤖 AI診断結果
            </h2>

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
                  ⏳ 診断中...
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
                  診断結果がまだ取得されていません。
                </p>
              </div>
            )}

            {/* 診断情報 */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                📋 問題情報
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>タイトル:</strong> {sessionData?.problemData.title || 'タイトル未定'}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>学習トピック:</strong> {sessionData?.problemData.learning_topic || '未設定'}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>言語:</strong> {sessionData?.problemData.language || '不明'}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>選択肢数:</strong> {sessionData?.problemData.choices?.length || 0}個
              </p>
            </div>
          </div>
        </div>

        {/* 右側：診断用スプレッドシートパネル */}
        <div style={{
          flex: '0 0 50%',
          backgroundColor: 'white',
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
              borderBottom: '2px solid #2196f3'
            }}>
              📊 診断用スプレッドシート
            </h2>

            {sessionData?.problemData?.assessment_spreadsheet_id ? (
              <AssessmentSpreadsheetPanel
                userEmail={user?.email || ''}
                problemData={sessionData.problemData}
                onDataChange={(data) => {
                  console.log('Spreadsheet data changed:', data);
                }}
                onError={(error) => {
                  console.error('Spreadsheet error:', error);
                }}
              />
            ) : (
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
                  📋 スプレッドシートが作成されていません
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 下部アクションボタン */}
        <div style={{
          padding: '16px 20px',
          borderTop: '2px solid #00d4ff',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
          flexShrink: 0,
          backgroundColor: '#f5f5f5'
        }}>
          <button
            onClick={handleRegisterProblem}
            disabled={isSaving}
            style={getButtonStyle('success', isSaving) as any}
            onMouseOver={(e) => {
              if (!isSaving) {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.4), inset 0 0 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSaving) {
                e.currentTarget.style.boxShadow = `0 0 10px rgba(0, 255, 136, 0.2), 0 0 20px rgba(0, 255, 136, 0.15)`;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isSaving ? '⏳ 登録中...' : '✅ 登録'}
          </button>

          <button
            onClick={handleCancel}
            style={getButtonStyle('danger') as any}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 51, 102, 0.4), inset 0 0 8px rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = `0 0 10px rgba(255, 51, 102, 0.2), 0 0 20px rgba(255, 51, 102, 0.15)`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ❌ キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
