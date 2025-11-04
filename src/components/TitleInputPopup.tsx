import React, { useState, useEffect } from 'react';

interface TitleInputPopupProps {
  isOpen: boolean;
  onSubmit: (title: string) => void;
  onCancel: () => void;
  initialTitle?: string; // 初期タイトル（オプション）
}

export const TitleInputPopup: React.FC<TitleInputPopupProps> = ({ isOpen, onSubmit, onCancel, initialTitle = '' }) => {
  const [title, setTitle] = useState(initialTitle);

  // initialTitleが変更されたら更新
  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');
    } else {
      alert('問題のタイトルを入力してください');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setTitle('');
    onCancel();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '24px', 
          textAlign: 'center',
          color: '#333'
        }}>
          問題のタイトルを入力してください
        </h2>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          作成した問題を識別するための名前を設定してください
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例: ループ処理の基本、クラスの継承方法"
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #2196f3',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
          <p style={{ 
            fontSize: '12px', 
            color: '#999', 
            marginTop: '8px',
            marginBottom: '0'
          }}>
            Enterキーで送信、Escapeキーでキャンセル
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '12px'
        }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            登録
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '12px 32px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
