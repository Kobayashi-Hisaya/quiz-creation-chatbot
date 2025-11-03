"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getProblemById, getChatHistories } from '@/services/problemService';
import type { Problem, ChatMessage } from '@/types/database';

const ProblemDetailPageContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [creationChat, setCreationChat] = useState<ChatMessage[]>([]);
  const [explanationChat, setExplanationChat] = useState<ChatMessage[]>([]);
  const [reviewChat, setReviewChat] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'review' | 'creation' | 'explanation'>('review');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!problemId) return;

      setLoading(true);
      setError(null);

      // 問題データを取得
      const problemResult = await getProblemById(problemId);
      if (!problemResult.success || !problemResult.problem) {
        setError(problemResult.error || '問題の取得に失敗しました');
        setLoading(false);
        return;
      }
      setProblem(problemResult.problem);

      // チャット履歴を取得
      const chatResult = await getChatHistories(problemId);
      if (chatResult.success && chatResult.chatHistories) {
        const creation = chatResult.chatHistories.find(
          (ch) => ch.chat_type === 'creation'
        );
        const explanation = chatResult.chatHistories.find(
          (ch) => ch.chat_type === 'explanation'
        );
        const review = chatResult.chatHistories.find(
          (ch) => ch.chat_type === 'review'
        );

        if (creation) setCreationChat(creation.messages);
        if (explanation) setExplanationChat(explanation.messages);
        if (review) setReviewChat(review.messages);
      }

      setLoading(false);
    };

    fetchData();
  }, [problemId]);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
        }}
      >
        読み込み中...
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '16px',
          }}
        >
          {error || '問題が見つかりませんでした'}
        </div>
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
          }}
        >
          Dashboardに戻る
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2c3e50',
            margin: 0,
          }}
        >
          問題詳細
        </h1>
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
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2980b9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3498db';
          }}
        >
          Dashboardに戻る
        </button>
      </div>

      {/* メタ情報（ヘッダー直下） */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto 20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '14px', color: '#666' }}>
          作成日時: {formatDate(problem.created_at)}
        </div>
        {problem.learning_topic && (
          <div
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            {problem.learning_topic}
          </div>
        )}
        {problem.language && (
          <div
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            {problem.language}
          </div>
        )}
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* spreadsheet_id が存在する場合は2カラムレイアウト */}
        {problem.spreadsheet_id ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60% 40%',
              gap: '20px',
              height: 'calc(100vh - 200px)',
            }}
          >
            {/* 左パネル: スプレッドシート */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {problem.spreadsheet_url ? (
                <iframe
                  src={problem.spreadsheet_url}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title="スプレッドシート"
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: '#999',
                    fontSize: '16px',
                  }}
                >
                  スプレッドシートURLが設定されていません
                </div>
              )}
            </div>

            {/* 右パネル: 解説 + チャット履歴 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                height: '100%',
              }}
            >
              {/* 解説セクション（固定高） */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '12px',
                    marginTop: 0,
                  }}
                >
                  解説
                </h2>
                <div
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#2c3e50',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >
                  {problem.explanation || '解説がありません'}
                </div>
              </div>

              {/* チャット履歴セクション（タブUI） */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* タブヘッダー */}
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '2px solid #e0e0e0',
                    backgroundColor: '#fafafa',
                  }}
                >
                  {['review', 'creation', 'explanation'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as 'review' | 'creation' | 'explanation')}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        backgroundColor: activeTab === tab ? 'white' : 'transparent',
                        color: activeTab === tab ? '#3498db' : '#666',
                        border: 'none',
                        borderBottom: activeTab === tab ? '2px solid #3498db' : 'none',
                        marginBottom: activeTab === tab ? '-2px' : '0',
                        fontSize: '14px',
                        fontWeight: activeTab === tab ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        if (activeTab !== tab) {
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (activeTab !== tab) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {tab === 'review' ? '復習' : tab === 'creation' ? '作問' : '解説'}
                    </button>
                  ))}
                </div>

                {/* タブコンテンツ */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                  }}
                >
                  {activeTab === 'review' && (
                    <ChatHistoryPanel
                      title=""
                      messages={reviewChat}
                    />
                  )}
                  {activeTab === 'creation' && (
                    <ChatHistoryPanel
                      title=""
                      messages={creationChat}
                    />
                  )}
                  {activeTab === 'explanation' && (
                    <ChatHistoryPanel
                      title=""
                      messages={explanationChat}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* spreadsheet_id がない場合は従来のレイアウト */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                marginBottom: '30px',
              }}
            >
              {/* 問題文 */}
              <div style={{ marginBottom: '30px' }}>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '12px',
                  }}
                >
                  問題文
                </h2>
                <div
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#2c3e50',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {problem.problem_text}
                </div>
              </div>

              {/* 元のコード */}
              {problem.code && (
                <div style={{ marginBottom: '30px' }}>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      marginBottom: '12px',
                    }}
                  >
                    元のコード
                  </h2>
                  <pre
                    style={{
                      backgroundColor: '#282c34',
                      color: '#abb2bf',
                      padding: '16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                    }}
                  >
                    {problem.code}
                  </pre>
                </div>
              )}

              {/* 空欄付きコード */}
              {problem.code_with_blanks && (
                <div style={{ marginBottom: '30px' }}>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      marginBottom: '12px',
                    }}
                  >
                    空欄付きコード
                  </h2>
                  <pre
                    style={{
                      backgroundColor: '#282c34',
                      color: '#abb2bf',
                      padding: '16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                    }}
                  >
                    {problem.code_with_blanks}
                  </pre>
                </div>
              )}

              {/* 選択肢 */}
              {problem.choices && problem.choices.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      marginBottom: '12px',
                    }}
                  >
                    選択肢
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {problem.choices.map((choice, index) => (
                      <div
                        key={choice.id || index}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: choice.isCorrect ? '#d5f4e6' : '#f8f9fa',
                          border: choice.isCorrect
                            ? '2px solid #27ae60'
                            : '1px solid #dee2e6',
                          borderRadius: '6px',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: choice.isCorrect ? '#27ae60' : '#666',
                          }}
                        >
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span style={{ flex: 1 }}>{choice.text}</span>
                        {choice.isCorrect && (
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: '#27ae60',
                            }}
                          >
                            ✓ 正解
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 解説 */}
              {problem.explanation && (
                <div>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      marginBottom: '12px',
                    }}
                  >
                    解説
                  </h2>
                  <div
                    style={{
                      fontSize: '15px',
                      lineHeight: '1.8',
                      color: '#2c3e50',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {problem.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* チャット履歴セクション（タブUI） */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              {/* タブヘッダー */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '2px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                }}
              >
                {['review', 'creation', 'explanation'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as 'review' | 'creation' | 'explanation')}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: activeTab === tab ? 'white' : 'transparent',
                      color: activeTab === tab ? '#3498db' : '#666',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid #3498db' : 'none',
                      marginBottom: activeTab === tab ? '-2px' : '0',
                      fontSize: '14px',
                      fontWeight: activeTab === tab ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      if (activeTab !== tab) {
                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeTab !== tab) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {tab === 'review' ? '復習' : tab === 'creation' ? '作問' : '解説'}
                  </button>
                ))}
              </div>

              {/* タブコンテンツ */}
              <div
                style={{
                  padding: '20px',
                  minHeight: '400px',
                }}
              >
                {activeTab === 'review' && (
                  <ChatHistoryPanel
                    title=""
                    messages={reviewChat}
                  />
                )}
                {activeTab === 'creation' && (
                  <ChatHistoryPanel
                    title=""
                    messages={creationChat}
                  />
                )}
                {activeTab === 'explanation' && (
                  <ChatHistoryPanel
                    title=""
                    messages={explanationChat}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ChatHistoryPanel: React.FC<{
  title: string;
  messages: ChatMessage[];
}> = ({ title, messages }) => {
  // システムメッセージをフィルタリング
  const filteredMessages = messages.filter(message => message.role !== 'system');

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: title ? '20px' : '0',
        borderRadius: '12px',
        boxShadow: title ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '20px',
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {filteredMessages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999',
              fontSize: '14px',
            }}
          >
            チャット履歴がありません
          </div>
        ) : (
          filteredMessages.map((message, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                backgroundColor:
                  message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: '8px',
                borderLeft:
                  message.role === 'user'
                    ? '4px solid #2196f3'
                    : '4px solid #9e9e9e',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: message.role === 'user' ? '#1976d2' : '#666',
                  marginBottom: '6px',
                }}
              >
                {message.role === 'user' ? 'ユーザー' : 'アシスタント'}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#2c3e50',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProblemDetailPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProblemDetailPageContent />
    </ProtectedRoute>
  );
};

export default ProblemDetailPage;
