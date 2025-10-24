import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('[ProtectedRoute] 状態:', { user: user?.id, email: user?.email, loading });

  useEffect(() => {
    console.log('[ProtectedRoute] useEffect 実行:', { user: user?.id, loading });
    
    if (!loading && !user) {
      console.warn('[ProtectedRoute] ユーザーがいないため /login へリダイレクト');
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    console.log('[ProtectedRoute] loading 状態のまま...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ marginBottom: '20px' }}>読み込み中...</div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          (AuthContext: loading状態が続いています)
        </div>
      </div>
    );
  }

  if (!user) {
    console.warn('[ProtectedRoute] ユーザーなし - リダイレクト中');
    // リダイレクト中は何も表示しない
    return null;
  }

  console.log('[ProtectedRoute] children をレンダリング');
  return <>{children}</>;
};
