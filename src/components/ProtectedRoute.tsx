import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // 認証状態を読み込み中の場合はローディング表示
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        読み込み中...
      </div>
    );
  }

  // 未認証の場合はログインページにリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 認証済みの場合は子要素を表示
  return <>{children}</>;
};
