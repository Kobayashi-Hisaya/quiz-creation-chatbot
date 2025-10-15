"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getProblems } from '@/services/problemService';
import { supabase } from '@/lib/supabaseClient';
import type { Problem } from '@/types/database';

const DashboardPageContent: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLクリーンアップ処理（認証コールバック後のトークン削除）
  useEffect(() => {
    const handleAuthCallback = async () => {
      // URLにハッシュ（認証トークン）が含まれているかチェック
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('🔧 Cleaning up authentication tokens from URL...');
        
        try {
          // Supabaseセッションを確立（URLのトークンを使用）
          const { data, error } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log('✅ Session established, cleaning URL...');
            // URLからハッシュを削除してクリーンなURLにする
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('✅ URL cleaned up successfully');
          } else if (error) {
            console.error('❌ Session establishment failed:', error);
          }
        } catch (error) {
          console.error('❌ Auth callback handling failed:', error);
        }
      }
    };

    handleAuthCallback();
  }, []); // 一度だけ実行

  useEffect(() => {
    const fetchProblems = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      const result = await getProblems(user.id);

      if (result.success && result.problems) {
        setProblems(result.problems);
      } else {
        setError(result.error || '問題の取得に失敗しました');
      }

      setLoading(false);
    };

    fetchProblems();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateNew = () => {
    router.push('/create-quiz');
  };

  const handleProblemClick = (problemId: string) => {
    router.push(`/problem/${problemId}`);
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

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#2c3e50',
          margin: 0
        }}>
          問題履歴
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCreateNew}
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
            新しい問題を作成する
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#c0392b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#e74c3c';
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
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
            {error}
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
              color: '#666',
              marginBottom: '30px'
            }}>
              まだ問題が作成されていません
            </p>
            <button
              onClick={handleCreateNew}
              style={{
                padding: '12px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
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
              最初の問題を作成する
            </button>
          </div>
        )}

        {!loading && !error && problems.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleProblemClick(problem.id)}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #e0e0e0'
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
                {/* 作成日時 */}
                <div style={{
                  fontSize: '13px',
                  color: '#999',
                  marginBottom: '12px'
                }}>
                  {formatDate(problem.created_at)}
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
                    marginBottom: '12px'
                  }}>
                    {problem.learning_topic}
                  </div>
                )}

                {/* 問題文の冒頭 */}
                <div style={{
                  fontSize: '15px',
                  color: '#2c3e50',
                  lineHeight: '1.6',
                  marginTop: '8px'
                }}>
                  {truncateText(problem.problem_text, 50)}
                </div>

                {/* 言語情報 */}
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #eee'
                }}>
                  言語: {problem.language}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;
