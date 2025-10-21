"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { useProblem } from '@/contexts/ProblemContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreationModeSelector } from '@/components/CreationModeSelector';
import type { CreationMode } from '@/components/CreationModeSelector';
import { AutoGenerationMode } from '@/components/AutoGenerationMode';
import { ManualCreationMode } from '@/components/ManualCreationMode';
import { ExplanationChatContainer } from '@/components/ExplanationChatContainer';
import { ModeChangeConfirmDialog } from '@/components/ModeChangeConfirmDialog';
import type { AutoGenerationResponse } from '@/types/quiz';
import type * as monacoEditor from 'monaco-editor';
import { chatService } from '@/services/chatService';
import { explanationChatService } from '@/services/explanationChatService';
import { saveProblem } from '@/services/problemService';
import type { SaveProblemData, ChatHistoryInput } from '@/services/problemService';
import type { QuizChoice } from '@/types/quiz';
import BackToDashboardButton from '@/components/BackToDashboardButton';

const QuizCreationPage: React.FC = () => {
  const router = useRouter();
  const { problemData } = useProblem();
  const { user, profile, session, loading } = useAuth();
  
  // 問題データの確認
  console.log('QuizCreationPage 初期化:', problemData);
  console.log('認証状態:', { user: user?.id, email: user?.email, profile, session: !!session, loading });
  
  // 問題データが不完全な場合の警告
  useEffect(() => {
    if (!problemData.problem || !problemData.code) {
      console.warn('問題データが不完全です:', problemData);
      console.warn('problem:', problemData.problem);
      console.warn('code:', problemData.code);
    }
  }, [problemData]);
  
  const learningTopic = problemData.learningTopic || '';
  const [creationMode, setCreationMode] = useState<CreationMode>('auto');
  const [explanation, setExplanation] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<AutoGenerationResponse | null>(null);
  const [showModeChangeDialog, setShowModeChangeDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState<CreationMode>('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasManualData, setHasManualData] = useState(false);
  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
  const [codeWithBlanks, setCodeWithBlanks] = useState(problemData.code);
  const [editedProblem, setEditedProblem] = useState(problemData.problem);
  const [manualChoices, setManualChoices] = useState<QuizChoice[]>([]);
  const [manualExplanation, setManualExplanation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monacoEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleBackToHome = () => {
    router.push('/create-quiz');
  };

  const handleQuizGenerated = (quiz: AutoGenerationResponse) => {
    setGeneratedQuiz(quiz);
    setExplanation(quiz.explanation);
    // 自動生成時でも元のコードを保持するため、codeWithBlanksの更新をしない
    // if (quiz.codeWithBlanks) {
    //   setCodeWithBlanks(quiz.codeWithBlanks);
    // }
  };

  const handleModeChangeRequest = (newMode: CreationMode) => {
    // 編集内容があるかチェック
    const hasAutoContent = generatedQuiz !== null || explanation.trim() !== '';
    const hasEditingContent = hasAutoContent || hasManualData;
    
    if (hasEditingContent) {
      setPendingMode(newMode);
      setShowModeChangeDialog(true);
    } else {
      // 編集内容がない場合は直接変更
      setCreationMode(newMode);
    }
  };

  const handleModeChangeConfirm = () => {
    // 状態をリセット
    setGeneratedQuiz(null);
    setExplanation('');
    setHasManualData(false);
    setCodeWithBlanks(problemData.code);
    setEditedProblem(problemData.problem);
    setCreationMode(pendingMode);
    setShowModeChangeDialog(false);
  };

  const handleCodeChange = (value: string | undefined) => {
    setCodeWithBlanks(value || '');
  };

  const handleCodeReset = () => {
    setCodeWithBlanks(problemData.code);
  };

  const handleProblemReset = () => {
    setEditedProblem(problemData.problem);
  };

  const getLanguageLabel = (language: string): string => {
    const languageMap: Record<string, string> = {
      python: 'Python',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      csharp: 'C#',
      go: 'Go',
      rust: 'Rust',
      php: 'PHP',
      ruby: 'Ruby',
      swift: 'Swift',
      kotlin: 'Kotlin',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      sql: 'SQL',
      shell: 'Shell',
    };
    return languageMap[language] || language;
  };

  const handleModeChangeCancel = () => {
    setShowModeChangeDialog(false);
  };

  // ハイライト更新関数
  const updateHighlights = () => {
    if (editorRef.current && monacoRef.current && creationMode === 'manual') {
      const model = editorRef.current.getModel();
      if (model) {
        const text = model.getValue();
        const decorations = [];
        const regex = /___BLANK___/g;
        let match;
        
        console.log('Updating highlights for manual mode, text:', text);
        
        while ((match = regex.exec(text)) !== null) {
          const startPos = model.getPositionAt(match.index);
          const endPos = model.getPositionAt(match.index + match[0].length);
          
          console.log('Found ___BLANK___ at:', startPos, 'to', endPos);
          
          decorations.push({
            range: new monacoRef.current.Range(
              startPos.lineNumber,
              startPos.column,
              endPos.lineNumber,
              endPos.column
            ),
            options: {
              inlineClassName: 'my-blank-highlight'
            }
          });
        }
        
        console.log('Applying decorations:', decorations);
        // 古いデコレーションを削除して新しいものを適用
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, decorations);
      }
    }
  };

  // creationModeが変更されたときにハイライトを更新
  useEffect(() => {
    console.log('creationMode changed to:', creationMode);
    updateHighlights();
  }, [creationMode, codeWithBlanks]);

  // beforeunloadイベントリスナーを追加（未保存警告）
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, isSaving]);

  const handleFinish = async () => {
    console.log('=== 保存処理開始 ===');
    console.log('creationMode:', creationMode);
    console.log('problemData:', problemData);
    console.log('認証状態:', { user: user?.id, email: user?.email, profile, session: !!session, loading });
    console.log('explanation:', explanation);
    console.log('manualExplanation:', manualExplanation);
    console.log('generatedQuiz:', generatedQuiz);
    console.log('manualChoices:', manualChoices);
    console.log('codeWithBlanks:', codeWithBlanks);

    // 認証状態の確認
    if (!user || !session) {
      console.error('認証エラー: ユーザーがログインしていません');
      alert('ログインが必要です。ダッシュボードに戻ってログインしてください。');
      router.push('/dashboard');
      return;
    }
    
    // バリデーション
    const finalExplanation = creationMode === 'auto' ? explanation : manualExplanation;
    const finalChoices = creationMode === 'auto' ? generatedQuiz?.choices : manualChoices;
    const finalCodeWithBlanks = creationMode === 'auto' ? generatedQuiz?.codeWithBlanks : codeWithBlanks;

    console.log('=== バリデーション ===');
    console.log('finalExplanation:', finalExplanation);
    console.log('finalChoices:', finalChoices);
    console.log('finalCodeWithBlanks:', finalCodeWithBlanks);

    // 問題データの基本チェック
    if (!problemData.problem || !problemData.problem.trim()) {
      console.error('バリデーションエラー: 問題文が空');
      alert('問題文が設定されていません。「/create-quiz」ページで問題を作成してください。');
      return;
    }

    if (!problemData.code || !problemData.code.trim()) {
      console.error('バリデーションエラー: コードが空');
      alert('解答コードが設定されていません。「/create-quiz」ページでコードを作成してください。');
      return;
    }

    if (!finalExplanation || !finalExplanation.trim()) {
      console.error('バリデーションエラー: 解説が空');
      alert('解説を入力してください');
      return;
    }

    if (!finalChoices || finalChoices.length === 0 || !finalChoices.every(c => c.text.trim())) {
      console.error('バリデーションエラー: 選択肢が不正');
      console.log('選択肢の詳細:', finalChoices);
      alert('すべての選択肢を入力してください');
      return;
    }

    console.log('=== バリデーション通過 ===');
    setIsSaving(true);

    try {
      // 問題データを準備
      const problemToSave: SaveProblemData = {
        problem_text: creationMode === 'manual' ? editedProblem : problemData.problem,
        code: problemData.code,
        language: problemData.language,
        learning_topic: learningTopic || null,
        code_with_blanks: finalCodeWithBlanks || null,
        choices: finalChoices,
        explanation: finalExplanation,
      };

      console.log('=== 保存データ準備完了 ===');
      console.log('problemToSave:', problemToSave);

      // チャット履歴を準備
      const creationHistory = chatService.getConversationHistory();
      const explanationHistory = explanationChatService.getConversationHistory();

      console.log('=== チャット履歴取得 ===');
      console.log('creationHistory length:', creationHistory.length);
      console.log('explanationHistory length:', explanationHistory.length);

      const chatHistories: ChatHistoryInput[] = [];

      if (creationHistory.length > 0) {
        chatHistories.push({
          chat_type: 'creation',
          messages: creationHistory,
        });
      }

      if (explanationHistory.length > 0) {
        chatHistories.push({
          chat_type: 'explanation',
          messages: explanationHistory,
        });
      }

      console.log('=== Supabaseに保存開始 ===');
      console.log('chatHistories:', chatHistories);

      // Supabaseに保存
      const userInfo = user ? { id: user.id, email: user.email } : undefined;
      console.log('=== ユーザー情報を渡して保存 ===');
      console.log('userInfo:', userInfo);
      const result = await saveProblem(problemToSave, chatHistories, userInfo);

      console.log('=== 保存結果 ===');
      console.log('result:', result);

      if (result.success) {
        console.log('保存成功！');
        setHasUnsavedChanges(false);
        alert('問題が保存されました！');
        router.push('/dashboard');
      } else {
        console.error('保存失敗:', result.error);
        
        // エラーメッセージをより詳細に表示
        let errorMessage = `保存に失敗しました: ${result.error}`;
        if (result.error?.includes('タイムアウト')) {
          errorMessage += '\n\nネットワーク接続を確認して、もう一度お試しください。';
        } else if (result.error?.includes('認証')) {
          errorMessage += '\n\nログイン状態を確認してください。';
        } else if (result.error?.includes('接続')) {
          errorMessage += '\n\nデータベース接続に問題があります。しばらく待ってからお試しください。';
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      alert('保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
      console.log('=== 保存処理終了 ===');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* メイン: 選択式問題作成エリア */}
      <div style={{ 
        width: isChatPopupOpen ? '70%' : '100%',
        height: '100vh',
        minWidth: 0,
        flex: isChatPopupOpen ? '0 0 70%' : '1 1 100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        {/* ヘッダー */}
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ 
              fontWeight: 'bold', 
              fontSize: '18px',
              margin: 0,
              color: '#2c3e50',
              borderLeft: '4px solid #3498db',
              paddingLeft: '12px'
            }}>
              選択式問題の作成
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
                📚学習項目：
              </span>
              <div style={{
                padding: '6px 14px',
                border: '2px solid #e3f2fd',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                boxShadow: '0 2px 4px rgba(33, 150, 243, 0.15)',
                minWidth: '120px',
                textAlign: 'center',
                position: 'relative'
              }}>
                {learningTopic || '未設定'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsChatPopupOpen(true)}
              style={{
                padding: '6px 12px',
                border: '1px solid #4CAF50',
                borderRadius: '4px',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              💬 解説相談
            </button>
            <button
              onClick={handleBackToHome}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ← 戻る
            </button>
            <BackToDashboardButton />
          </div>
        </div>
        
        {/* コンテンツエリア */}
        <div style={{ 
          flex: 1, 
          padding: '20px',
          backgroundColor: '#fafafa',
          overflow: 'auto',
          minHeight: 0,
          position: 'relative'
        }}>
          {/* 作成モード選択 */}
          <CreationModeSelector 
            value={creationMode} 
            onChange={setCreationMode}
            onModeChangeRequest={handleModeChangeRequest}
            disabled={isGenerating}
          />

          {/* 手動作成の手順（手動モード時のみ表示） */}
          {creationMode === 'manual' && (
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(255, 193, 7, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>📝</span>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: 0,
                  color: '#856404'
                }}>
                  手動作成の手順
                </h4>
              </div>
              <ol style={{ 
                fontSize: '14px', 
                lineHeight: '1.6', 
                color: '#856404', 
                paddingLeft: '20px',
                margin: '0'
              }}>
                <li style={{ marginBottom: '6px' }}>
                  <strong>問題文</strong>と<strong>解答コード</strong>エリアで内容を編集
                </li>
                <li style={{ marginBottom: '6px' }}>
                  解答コードでは空欄を<strong><code style={{ 
                    backgroundColor: '#fff8dc', 
                    padding: '2px 4px', 
                    borderRadius: '3px',
                    fontSize: '13px'
                  }}>___BLANK___</code></strong>で表現してください
                </li>
                <li style={{ marginBottom: '6px' }}>
                  下の<strong>選択肢</strong>を入力（選択肢Aが正答です）
                </li>
                <li>
                  <strong>「リセットする」</strong>ボタンで問題文・コードを元に戻せます
                </li>
              </ol>
            </div>
          )}

          {/* 問題文と解答コード */}
          <div style={{ 
            marginBottom: '20px',
            display: 'flex',
            gap: '20px'
          }}>
            {/* 問題文 */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                  作成した問題文
                </h4>
                {creationMode === 'manual' && (
                  <button
                    onClick={handleProblemReset}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    リセットする
                  </button>
                )}
              </div>
              {creationMode === 'manual' ? (
                <textarea
                  value={editedProblem || ''}
                  onChange={(e) => setEditedProblem(e.target.value)}
                  placeholder="問題文を入力してください"
                  style={{
                    width: '97%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    height: '500px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <div style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  minHeight: '500px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {problemData.problem || '問題文が入力されていません'}
                </div>
              )}
            </div>

            {/* 解答コード */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                  作成した解答コード ({getLanguageLabel(problemData.language)})
                </h4>
                {creationMode == 'manual' && (<button
                  onClick={handleCodeReset}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  リセットする
                </button>)}
              </div>
              <div style={{ height: '500px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <Editor
                  height="100%"
                  language={problemData.language}
                  value={codeWithBlanks || problemData.code}
                  onChange={creationMode === 'manual' ? handleCodeChange : undefined}
                  onMount={(editor, monaco) => {
                    console.log('Monaco Editor mounted, creationMode:', creationMode);
                    // エディタとmonacoのrefを保存
                    editorRef.current = editor;
                    monacoRef.current = monaco;
                    
                    // テキスト変更時にハイライトを更新
                    editor.onDidChangeModelContent(() => {
                      updateHighlights();
                    });
                    
                    // 初期ハイライト
                    updateHighlights();
                  }}
                  options={{
                    readOnly: creationMode !== 'manual',
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  theme="vs-light"
                />
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '4px',
                marginBottom: '0'
              }}>
                {creationMode === 'manual' 
                  ? '空欄は「_ _ _BLANK_ _ _」で表現してください（編集可能）'
                  : '自動生成モード（表示のみ）'
                }
              </p>
            </div>
          </div>

          {/* モード別のコンテンツ */}
          {creationMode === 'auto' ? (
            <AutoGenerationMode
              learningTopic={learningTopic}
              onQuizGenerated={handleQuizGenerated}
              onGeneratingStateChange={setIsGenerating}
              explanation={explanation}
              onExplanationChange={setExplanation}
            />
          ) : (
            <ManualCreationMode
              learningTopic={learningTopic}
              onManualDataChange={setHasManualData}
              onChoicesChange={setManualChoices}
              onExplanationChange={setManualExplanation}
            />
          )}

          {/* 完了ボタン */}
          {(generatedQuiz || creationMode === 'manual') && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleFinish}
                disabled={isSaving}
                style={{
                  padding: '12px 30px',
                  backgroundColor: isSaving ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {isSaving ? '保存中...' : '問題作成完了'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 右側: 解説相談エリア */}
      <div style={{ 
        width: isChatPopupOpen ? '30%' : '0%',
        height: '100vh',
        minWidth: 0,
        flex: isChatPopupOpen ? '0 0 30%' : '0 0 0%',
        borderLeft: isChatPopupOpen ? '1px solid #ddd' : 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'white',
        overflow: 'hidden',
        opacity: isChatPopupOpen ? 1 : 0,
        visibility: isChatPopupOpen ? 'visible' : 'hidden'
      }}>
          {/* ヘッダー */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f8f9fa'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>解説相談</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  // 履歴クリア処理（メモリ内の履歴をクリア）
                  window.location.reload();
                }}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🗑️ 履歴クリア
              </button>
              <button
                onClick={() => setIsChatPopupOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* チャットコンテンツ */}
          <div style={{ 
            flex: 1,
            overflow: 'hidden'
          }}>
            <div style={{ height: '100%' }}>
              {isChatPopupOpen && <ExplanationChatContainer showHeader={false} />}
            </div>
          </div>
        </div>

      {/* Mode change confirmation dialog */}
      <ModeChangeConfirmDialog
        isOpen={showModeChangeDialog}
        newMode={pendingMode}
        onConfirm={handleModeChangeConfirm}
        onCancel={handleModeChangeCancel}
      />
    </div>
  );
};

export default QuizCreationPage
