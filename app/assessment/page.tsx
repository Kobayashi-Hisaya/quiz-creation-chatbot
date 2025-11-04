'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProblemById, getProblemComments, addCommentToProblem, deleteComment, updateComment, getChatHistories } from '@/services/problemService';
import { useAuth } from '@/contexts/AuthContext';
import type { Problem, QuizChoice } from '@/types/database';
import { gasClientService } from '@/services/gasClientService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Comment {
  id: string;
  problem_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  user_email?: string;
}

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, groupId } = useAuth();
  const problemId = searchParams.get('problemId');

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 問題解答管理
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // コメント管理
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // 解説の折りたたみ管理
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  // 提案コメント管理
  const [suggestionContent, setSuggestionContent] = useState<string | null>(null);
  const [isSuggestionExpanded, setIsSuggestionExpanded] = useState(false);

  // スプレッドシートID取得ヘルパー関数
  const getSpreadsheetId = (problem: Problem | null): string | null => {
    if (!problem) return null;

    // 1. spreadsheet_idが存在すればそれを優先
    if (problem.spreadsheet_id) {
      return problem.spreadsheet_id;
    }

    // 2. spreadsheet_urlからIDを抽出
    if (problem.spreadsheet_url) {
      const match = problem.spreadsheet_url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // 初期ロード
  useEffect(() => {
    if (!problemId) {
      setError('問題IDが指定されていません');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // 問題を取得
      const problemResult = await getProblemById(problemId);
      if (problemResult.success && problemResult.problem) {
        setProblem(problemResult.problem);
      } else {
        setError(problemResult.error || '問題の取得に失敗しました');
      }

      // コメントを取得
      const commentsResult = await getProblemComments(problemId);
      if (commentsResult.success && commentsResult.comments) {
        setComments(commentsResult.comments);
      }

      // チャット履歴を取得（suggestion タイプのみ）
      const chatHistoriesResult = await getChatHistories(problemId);
      if (chatHistoriesResult.success && chatHistoriesResult.chatHistories) {
        // suggestion タイプのみ抽出
        const suggestionHistory = chatHistoriesResult.chatHistories.find(
          (history) => history.chat_type === 'suggestion'
        );
        if (suggestionHistory) {
          // assistant ロールのメッセージのみ取得
          const assistantMessage = suggestionHistory.messages.find(
            (msg) => msg.role === 'assistant'
          );
          if (assistantMessage) {
            setSuggestionContent(assistantMessage.content);
          }
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [problemId]);

  // 問題への回答処理
  const handleSubmitAnswer = () => {
    if (!selectedChoice || !problem || !problem.choices) return;

    const selected = problem.choices.find((c) => c.id === selectedChoice);
    const correct = selected?.isCorrect || false;

    setIsCorrect(correct);
    setAnswered(true);
  };

  // コメント追加処理
  const handleAddComment = async () => {
    if (!commentInput.trim() || !problemId || !user) {
      console.warn('[Assessment] コメント投稿前チェック失敗:', {
        hasComment: !!commentInput.trim(),
        hasProblemId: !!problemId,
        hasUser: !!user
      });
      return;
    }

    setSubmittingComment(true);
    console.log('[Assessment] コメント投稿開始:', {
      problemId,
      userId: user.id,
      content: commentInput.substring(0, 50) + '...'
    });

    try {
      const result = await addCommentToProblem(problemId, user.id, commentInput.trim());
      console.log('[Assessment] コメント投稿結果:', result);

      if (result.success) {
        setCommentInput('');
        // コメント一覧をリロード
        const commentsResult = await getProblemComments(problemId);
        if (commentsResult.success && commentsResult.comments) {
          setComments(commentsResult.comments);
        }
      } else {
        console.error('[Assessment] コメント追加エラー:', result.error);
        alert('コメント追加に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('[Assessment] コメント投稿例外:', error);
      alert('コメント投稿中にエラーが発生しました');
    }

    setSubmittingComment(false);
  };

  // コメント削除処理
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('このコメントを削除しますか?')) return;

    const result = await deleteComment(commentId);
    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId));
    } else {
      alert('コメント削除に失敗しました');
    }
  };

  // コメント編集開始
  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // コメント編集キャンセル
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // コメント編集完了
  const handleSaveEditComment = async (commentId: string) => {
    if (!editingContent.trim()) {
      alert('コメントは空にできません');
      return;
    }

    console.log('[Assessment] コメント編集開始:', {
      commentId,
      newContent: editingContent.substring(0, 50) + '...'
    });

    const result = await updateComment(commentId, editingContent.trim());
    console.log('[Assessment] コメント編集結果:', result);

    if (result.success) {
      console.log('[Assessment] コメント編集成功、コメント一覧をリロード');
      setEditingCommentId(null);
      setEditingContent('');
      // コメント一覧をリロード
      const commentsResult = await getProblemComments(problemId!);
      console.log('[Assessment] リロード後のコメント:', commentsResult.comments);
      if (commentsResult.success && commentsResult.comments) {
        setComments(commentsResult.comments);
      }
    } else {
      console.error('[Assessment] コメント編集失敗:', result.error);
      alert('コメント編集に失敗しました: ' + result.error);
    }
  };

  // コメント入力のキーダウンハンドラ（Enter送信）
  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // 編集テキスト入力のキーダウンハンドラ
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, commentId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEditComment(commentId);
    } else if (e.key === 'Escape') {
      handleCancelEditComment();
    }
  };

  // 問題作成者かどうかを判定
  const isCreator = problem && user && problem.user_id === user.id;

  // group_id による提案コメント表示制御
  const shouldShowSuggestion = (groupId: number | null | undefined): boolean => {
    // group_id が null/undefined の場合は表示
    if (groupId === null || groupId === undefined) {
      return true;
    }
    // group_id が 1, 2, 3, 7 の場合は表示
    return [1, 2, 3, 7].includes(groupId);
  };

  const handleBackToBBS = () => {
    router.push('/bbs');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* ヘッダー */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            margin: 0,
            marginBottom: '8px'
          }}>
            ✨ {problem?.title || '問題診断'}
          </h1>
          {!loading && problem && (
            <div style={{
              fontSize: '13px',
              color: '#666',
              paddingLeft: '8px'
            }}>
              <span style={{ marginRight: '16px' }}>
                <strong>言語:</strong> {problem.language || '不明'}
              </span>
              <span style={{ marginRight: '16px' }}>
                <strong>トピック:</strong> {problem.learning_topic || '不明'}
              </span>
              <span>
                <strong>作成日:</strong> {new Date(problem.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginLeft: '20px' }}>
          <button
            onClick={handleBackToBBS}
            style={{
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#229954';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#27ae60';
            }}
          >
            グループモード
          </button>
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3498db';
            }}
          >
            ダッシュボード
          </button>
        </div>
      </div>

      {/* メインコンテンツ（2分割） */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '20px'
      }}>
        {/* ======================== 左側：問題レビュー画面 ======================== */}
        <div>
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              fontSize: '16px',
              color: '#666'
            }}>
              読み込み中...
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '15px'
            }}>
              エラー: {error}
            </div>
          )}

          {!loading && problem && (() => {
            const spreadsheetId = getSpreadsheetId(problem);

            // スプレッドシートIDがある場合
            if (spreadsheetId) {
              const embedUrl = gasClientService.getEmbedUrl(spreadsheetId);
              return (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  padding: '20px',
                  height: 'calc(100vh - 200px)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginTop: 0,
                    marginBottom: '15px'
                  }}>
                    作成された問題
                  </h3>
                  <iframe
                    src={embedUrl}
                    style={{
                      flex: 1,
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }}
                    title="Problem Spreadsheet"
                    allowFullScreen
                  />
                </div>
              );
            }

            // 従来の表示（スプレッドシートIDがない場合）
            return (
              <div>
                {/* 問題文 */}
              <div style={{
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginTop: 0,
                  marginBottom: '12px'
                }}>
                  問題文
                </h3>
                <p style={{
                  whiteSpace: 'pre-wrap',
                  color: '#333',
                  lineHeight: '1.6',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  {problem.problem_text}
                </p>
              </div>

              {/* ソースコード */}
              {problem.code && (
                <div style={{
                  marginBottom: '20px',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginTop: 0,
                    marginBottom: '12px'
                  }}>
                    ソースコード
                  </h3>
                  <pre style={{
                    backgroundColor: '#f9f9f9',
                    padding: '12px',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    margin: 0,
                    border: '1px solid #e0e0e0'
                  }}>
                    {problem.code}
                  </pre>
                </div>
              )}

              {/* 穴埋めコード */}
              {problem.code_with_blanks && (
                <div style={{
                  marginBottom: '20px',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginTop: 0,
                    marginBottom: '12px'
                  }}>
                    穴埋めコード（___BLANK___を埋めよ）
                  </h3>
                  <pre style={{
                    backgroundColor: '#fff3cd',
                    padding: '12px',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    margin: 0,
                    border: '1px solid #ffc107'
                  }}>
                    {problem.code_with_blanks}
                  </pre>
                </div>
              )}

              {/* 選択肢（回答パート） */}
              {problem.choices && problem.choices.length > 0 && (
                <div style={{
                  marginBottom: '20px',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginTop: 0,
                    marginBottom: '12px'
                  }}>
                    選択肢
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                    {problem.choices.map((choice) => (
                      <label
                        key={choice.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: selectedChoice === choice.id ? '#e8f4f8' : '#f8f9fa',
                          border: selectedChoice === choice.id ? '2px solid #3498db' : '1px solid #ddd',
                          borderRadius: '6px',
                          cursor: answered ? 'default' : 'pointer',
                          fontSize: '14px',
                          opacity: answered && selectedChoice !== choice.id ? 0.6 : 1
                        }}
                      >
                        <input
                          type="radio"
                          name="choice"
                          value={choice.id}
                          checked={selectedChoice === choice.id}
                          onChange={(e) => !answered && setSelectedChoice(e.target.value)}
                          disabled={answered}
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                        />
                        <span>{choice.id}. {choice.text}</span>
                      </label>
                    ))}
                  </div>

                  {/* 回答ボタン */}
                  {!answered && (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedChoice}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: selectedChoice ? '#3498db' : '#bdc3c7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: selectedChoice ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (selectedChoice) {
                          e.currentTarget.style.backgroundColor = '#2980b9';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedChoice) {
                          e.currentTarget.style.backgroundColor = '#3498db';
                        }
                      }}
                    >
                      回答する
                    </button>
                  )}

                  {/* 正誤判定 */}
                  {answered && (
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
                      border: `2px solid ${isCorrect ? '#28a745' : '#f5c6cb'}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: isCorrect ? '#155724' : '#721c24',
                      textAlign: 'center'
                    }}>
                      {isCorrect ? '✓ 正解です！' : '✗ 不正解です'}
                    </div>
                  )}
                </div>
              )}

              </div>
            );
          })()}
        </div>

        {/* ======================== 右側：解説とコメント ======================== */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* 解説セクション（折りたたみ可能） */}
          {!loading && problem && (problem.modified_explanation || problem.explanation) && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#e7f3ff',
                  borderBottom: isExplanationExpanded ? '1px solid #b3d9ff' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#d4e8f7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#e7f3ff';
                }}
              >
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  margin: 0
                }}>
                  📘 解説
                </h3>
                <span style={{
                  fontSize: '18px',
                  color: '#3498db',
                  fontWeight: 'bold'
                }}>
                  {isExplanationExpanded ? '▲' : '▼'}
                </span>
              </div>
              {isExplanationExpanded && (
                <div style={{
                  padding: '20px',
                }}>
                  <p style={{
                    whiteSpace: 'pre-wrap',
                    color: '#333',
                    lineHeight: '1.6',
                    margin: 0,
                    fontSize: '14px'
                  }}>
                    {problem.modified_explanation || problem.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 提案コメントセクション（折りたたみ可能） */}
          {!loading && suggestionContent && shouldShowSuggestion(groupId) && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => setIsSuggestionExpanded(!isSuggestionExpanded)}
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#e7f3ff',
                  borderBottom: isSuggestionExpanded ? '1px solid #b3d9ff' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#d4e8f7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#e7f3ff';
                }}
              >
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  margin: 0
                }}>
                  💡 議論のためのヒント
                </h3>
                <span style={{
                  fontSize: '18px',
                  color: '#3498db',
                  fontWeight: 'bold'
                }}>
                  {isSuggestionExpanded ? '▲' : '▼'}
                </span>
              </div>
              {isSuggestionExpanded && (
                <div style={{
                  padding: '20px',
                  color: '#333',
                  lineHeight: '1.6',
                  fontSize: '14px'
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {suggestionContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {/* コメントセクション */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginTop: 0,
              marginBottom: '15px'
            }}>
              学習コミュニティ
            </h3>

            {/* コメント入力フォーム */}
            {user ? (
              <div style={{ marginBottom: '15px' }}>
                <textarea
                  placeholder="質問や意見をコメントしてください...（Shift+Enterで改行、Enterで送信）"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'none',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={submittingComment || !commentInput.trim()}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: commentInput.trim() ? '#3498db' : '#bdc3c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: commentInput.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (commentInput.trim()) {
                      e.currentTarget.style.backgroundColor = '#2980b9';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (commentInput.trim()) {
                      e.currentTarget.style.backgroundColor = '#3498db';
                    }
                  }}
                >
                  {submittingComment ? 'コメント中...' : 'コメントを投稿'}
                </button>
              </div>
            ) : (
              <div style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#856404'
              }}>
                コメント投稿にはログインが必要です
              </div>
            )}

            {/* コメント一覧 */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '5px'
            }}>
              {commentsLoading ? (
                <p style={{ textAlign: 'center', color: '#999', fontSize: '13px' }}>
                  コメント読み込み中...
                </p>
              ) : comments.length === 0 ? (
                <p style={{
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '13px',
                  padding: '20px 0'
                }}>
                  コメントはまだありません
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {comments.map((comment) => {
                    // コメント色分けロジック
                    let bgColor: string;
                    let borderColor: string;
                    let textColor: string;
                    let badge: string | null = null;

                    // デバッグログ
                    console.log('[Assessment] コメント色分け判定:', {
                      commentUserId: comment.user_id,
                      currentUserId: user?.id,
                      problemCreatorId: problem?.user_id,
                      isMyComment: user && comment.user_id === user.id,
                      isProblemCreatorComment: problem && comment.user_id === problem.user_id,
                      commentEmail: comment.user_email
                    });

                    if (user && comment.user_id === user.id) {
                      // 自分のコメント：黄緑
                      bgColor = '#d4f1d4';
                      borderColor = '#90ee90';
                      textColor = '#228b22';
                      badge = 'あなた';
                    } else if (problem && comment.user_id === problem.user_id) {
                      // 問題作成者のコメント：空色
                      bgColor = '#d4e8f7';
                      borderColor = '#b3d9ff';
                      textColor = '#0056b3';
                      badge = '出題者';
                    } else {
                      // その他のコメント：灰色
                      bgColor = '#e8e8e8';
                      borderColor = '#bbb';
                      textColor = '#333';
                      badge = null;
                    }

                    return (
                      <div
                        key={comment.id}
                        style={{
                          padding: '12px',
                          backgroundColor: bgColor,
                          border: `1px solid ${borderColor}`,
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '6px'
                        }}>
                          <div>
                            <strong style={{
                              color: textColor
                            }}>
                              {comment.user_email}
                              {badge && (
                                <span style={{
                                  marginLeft: '6px',
                                  fontSize: '11px',
                                  backgroundColor: badge === 'あなた' ? '#90ee90' : '#ffc107',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  color: '#333',
                                  fontWeight: 'bold'
                                }}>
                                  {badge}
                                </span>
                              )}
                            </strong>
                            <p style={{
                              margin: '4px 0 0 0',
                              fontSize: '11px',
                              color: '#666'
                            }}>
                              {new Date(comment.created_at).toLocaleString('ja-JP')}
                              {comment.is_edited && (
                                <span style={{
                                  marginLeft: '8px',
                                  color: '#999',
                                  fontStyle: 'italic'
                                }}>
                                  (修正: {new Date(comment.updated_at).toLocaleString('ja-JP')})
                                </span>
                              )}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {user && comment.user_id === user.id && editingCommentId !== comment.id && (
                              <button
                                onClick={() => handleStartEditComment(comment)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#3498db',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  padding: '2px 6px',
                                  textDecoration: 'underline'
                                }}
                              >
                                編集
                              </button>
                            )}
                            {user && (comment.user_id === user.id || (problem && user.id === problem.user_id)) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#e74c3c',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  padding: '2px 6px'
                                }}
                              >
                                削除
                              </button>
                            )}
                          </div>
                        </div>

                        {/* コメント内容（編集モード） */}
                        {editingCommentId === comment.id ? (
                          <div>
                            <textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              onKeyDown={(e) => handleEditKeyDown(e, comment.id)}
                              style={{
                                width: '100%',
                                height: '60px',
                                padding: '8px',
                                border: '1px solid #3498db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontFamily: 'inherit',
                                resize: 'none',
                                marginBottom: '8px',
                                boxSizing: 'border-box'
                              }}
                              autoFocus
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleSaveEditComment(comment.id)}
                                style={{
                                  flex: 1,
                                  padding: '6px',
                                  backgroundColor: '#27ae60',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                保存
                              </button>
                              <button
                                onClick={handleCancelEditComment}
                                style={{
                                  flex: 1,
                                  padding: '6px',
                                  backgroundColor: '#bdc3c7',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                キャンセル
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p style={{
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            color: '#333',
                            lineHeight: '1.5'
                          }}>
                            {comment.content}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>読み込み中...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}
