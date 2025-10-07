import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // useAuthのパスに合わせてください

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        background: '#c0392b',
        border: '1px solid #c0392b',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      ログアウト
    </button>
  );
};

export default LogoutButton;