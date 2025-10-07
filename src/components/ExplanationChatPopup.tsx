import React from 'react';
import { ExplanationChatContainer } from './ExplanationChatContainer';
import { explanationChatService } from '../services/explanationChatService';

interface ExplanationChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplanationChatPopup: React.FC<ExplanationChatPopupProps> = ({ isOpen, onClose }) => {
  const handleClearHistory = () => {
    explanationChatService.clearHistory();
    localStorage.removeItem('explanationChatMessages');
    // チャットコンテナの再レンダリングを促すために、少し遅延してから強制リロード
    window.location.reload();
  };

  return (
    <>
      {/* オーバーレイ（背景クリック用） */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999
          }}
          onClick={onClose}
        />
      )}

      {/* サイドパネル */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? '0' : '-400px',
          width: '400px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'right 0.3s ease-in-out'
        }}
      >
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f8f9fa'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>解説相談</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleClearHistory}
              style={{
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️ 履歴クリア
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* チャットコンテンツ */}
        <div style={{ 
          flex: 1,
          overflow: 'hidden'
        }}>
          <div style={{ height: '100%' }}>
            <ExplanationChatContainer showHeader={false} />
          </div>
        </div>
      </div>
    </>
  );
};