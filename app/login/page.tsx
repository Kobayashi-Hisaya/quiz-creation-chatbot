"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  // すでにログイン済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/create-quiz');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
      setError('ログインに失敗しました。もう一度お試しください。');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        padding: '50px 60px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '12px'
          }}>
            作問学習支援ツール
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            lineHeight: '1.6'
          }}>
            プログラミングの問題を作成するための教育支援アプリケーションです
          </p>
        </div>

        {/* Googleログインボタン */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px 24px',
            backgroundColor: isLoading ? '#ccc' : '#cfcfcfff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '17px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#a1a1a1ff';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#cfcfcfff';
            }
          }}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          {isLoading ? 'ログイン中...' : 'Googleでログイン'}
        </button>

        {/* エラーメッセージ */}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '4px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* フッター */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.6' }}>
            初回ログイン時にアカウントが自動的に作成されます。<br />
            続行することで、利用規約に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
