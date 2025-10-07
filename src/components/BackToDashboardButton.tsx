import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const BackToDashboardButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

    const handleBack = () => {
    // problemページ以外なら確認ダイアログ
    if (!pathname.startsWith('/problem/')) {
      const confirmed = window.confirm('今Dashboardに戻ると、編集中の内容が失われます。本当に戻りますか？');
      if (!confirmed) return;
    }
    router.push('/dashboard');
  };

  return (
    <button
      onClick={handleBack}
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
      onMouseOver={e => {
        e.currentTarget.style.backgroundColor = '#2980b9';
      }}
      onMouseOut={e => {
        e.currentTarget.style.backgroundColor = '#3498db';
      }}
    >
      Dashboardに戻る
    </button>
  );
};

export default BackToDashboardButton;