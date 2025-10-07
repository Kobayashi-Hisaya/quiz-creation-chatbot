import React from 'react';
import type { CreationMode } from './CreationModeSelector';

interface ModeChangeConfirmDialogProps {
  isOpen: boolean;
  newMode: CreationMode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModeChangeConfirmDialog: React.FC<ModeChangeConfirmDialogProps> = ({
  isOpen,
  newMode,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const modeText = newMode === 'auto' ? '自動生成' : '手動作成';

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
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span style={{
            fontSize: '24px',
            marginRight: '12px'
          }}>
            ⚠️
          </span>
          <h3 style={{ 
            margin: 0,
            fontSize: '18px',
            color: '#ff9800'
          }}>
            作成モード変更の確認
          </h3>
        </div>
        
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#856404'
          }}>
            <strong>「{modeText}」</strong>に切り替えると、以下の内容がクリアされます：
          </p>
          <ul style={{
            margin: '12px 0 0 0',
            paddingLeft: '20px',
            fontSize: '13px',
            color: '#856404'
          }}>
            <li>生成済みの選択式問題</li>
            <li>入力済みの解説内容</li>
            <li>その他の編集内容</li>
          </ul>
        </div>

        <p style={{ 
          fontSize: '14px',
          color: '#333',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          本当に「<strong>{modeText}</strong>」モードに切り替えますか？
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#ff9800',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            切り替える
          </button>
        </div>
      </div>
    </div>
  );
};