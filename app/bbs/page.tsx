'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProblemsInGroup, getProblemsCommentCounts } from '@/services/problemService';
import { useAuth } from '@/contexts/AuthContext';
import type { Problem } from '@/types/database';

interface ProblemWithAuthor extends Problem {
  author_name?: string;
  commentCount?: number;
}

export default function BBSPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [problems, setProblems] = useState<ProblemWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      // グループに属する問題を取得
      const result = await getProblemsInGroup(user.id);

      if (result.success && result.problems) {
        // グループIDを設定
        if (result.groupId) {
          setGroupId(result.groupId);
        }
        
        // コメント数を取得
        const problemIds = result.problems.map((p) => p.id);
        const commentCounts = await getProblemsCommentCounts(problemIds);

        // 問題にコメント数を追加
        const problemsWithCommentCounts = result.problems.map((p) => ({
          ...p,
          commentCount: commentCounts[p.id] || 0
        }));

        setProblems(problemsWithCommentCounts);
      } else {
        setError(result.error || '問題の取得に失敗しました');
      }
      setLoading(false);
    };

    fetchProblems();
  }, [user]);

  const handleProblemClick = (problemId: string) => {
    router.push(`/assessment?problemId=${problemId}`);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* ヘッダー */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2c3e50',
            margin: 0
          }}>
            コミュニティ問題集
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
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3498db';
            }}
          >
            ダッシュボードに戻る
          </button>
        </div>

        {/* グループ表示 */}
        {groupId && (
          <div style={{
            backgroundColor: '#e8f5e9',
            border: '2px solid #66bb6a',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 2px 8px rgba(102, 187, 106, 0.2)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2e7d32',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}>
              グループ{groupId} 相互評価画面
            </h2>
          </div>
        )}
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <p style={{
          fontSize: '15px',
          color: '#666',
          marginBottom: '20px'
        }}>
          同じグループメンバーが作成した問題を確認できます。
        </p>

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

        {!loading && !error && problems.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              fontSize: '18px',
              color: '#666'
            }}>
              問題がまだ登録されていません
            </p>
          </div>
        )}

        {!loading && !error && problems.length > 0 && (
          <>
            <p style={{
              fontSize: '15px',
              color: '#666',
              marginBottom: '20px'
            }}>
              全問題数: {problems.length}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              {problems.map((problem) => {
                const isMyProblem = problem.user_id === user?.id;
                return (
                  <div
                    key={problem.id}
                    onClick={() => handleProblemClick(problem.id)}
                    style={{
                      backgroundColor: isMyProblem ? '#f0fdf4' : 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: isMyProblem ? '2px solid #86efac' : '1px solid #e0e0e0',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    {/* 自分が作成したマーク */}
                    {isMyProblem && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
                      }}>
                        ✓ 自分が作成
                      </div>
                    )}

                    {/* 作成者情報 */}
                    <div style={{
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '8px'
                    }}>
                      <div>作成者: {problem.author_name || '不明'}</div>
                    </div>

                  {/* 作成日時とコメント数 */}
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div>更新日: {problem.updated_at ? formatDate(problem.updated_at) : '不明'}</div>
                    <div style={{
                      backgroundColor: '#e8f4f8',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '500',
                      color: '#3498db'
                    }}>
                      コメント: {problem.commentCount || 0}
                    </div>
                  </div>

                  {/* 学習トピック */}
                  {problem.learning_topic && (
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#3498db',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      marginBottom: '12px',
                      width: 'fit-content'
                    }}>
                      {problem.learning_topic}
                    </div>
                  )}

                  {/* 問題タイトル */}
                  <div style={{
                    fontSize: '15px',
                    color: '#2c3e50',
                    lineHeight: '1.6',
                    marginTop: '8px',
                    flex: 1,
                    fontWeight: '600'
                  }}>
                    {truncateText(problem.title || 'タイトル未定', 50)}
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
