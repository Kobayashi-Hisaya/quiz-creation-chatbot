"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // ログイン済みの場合は問題作成ページへ
        router.push('/create-quiz');
      } else {
        // 未ログインの場合はログインページへ
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // リダイレクト中はローディング表示
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