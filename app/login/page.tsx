"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { user, signInWithEmail } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

  // すでにログイン済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('メールアドレスを入力してください。');
      return false;
    }
    if (!email.includes('@')) {
      setError('正しいメールアドレスを入力してください。');
      return false;
    }
    if (!password.trim()) {
      setError('パスワードを入力してください。');
      return false;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithEmail(email.trim(), password);
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      // Supabaseのエラーメッセージに基づいて適切な日本語メッセージを表示
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('Invalid login credentials')) {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('メールアドレスが確認されていません。');
      } else if (errorMessage.includes('Too many requests')) {
        setError('ログイン試行回数が上限に達しました。しばらく待ってから再試行してください。');
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      }
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

        {/* ログインフォーム */}
        <form onSubmit={handleEmailLogin}>
          {/* メールアドレス入力 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="例: student@school.edu.jp"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: isLoading ? '#f5f5f5' : 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3498db';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            />
          </div>

          {/* パスワード入力 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              パスワード
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="パスワードを入力"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '50px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: isLoading ? '#f5f5f5' : 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3498db';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: '#666',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '表示' : '非表示'}
              </button>
            </div>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: isLoading ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '17px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#2980b9';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#3498db';
              }
            }}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

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
            アカウントは管理者によって事前に作成されます。<br />
            ログイン情報がわからない場合は管理者にお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
