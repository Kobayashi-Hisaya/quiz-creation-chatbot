import React from 'react';

export type CreationMode = 'auto' | 'manual';

interface CreationModeSelectorProps {
  value: CreationMode;
  onChange: (mode: CreationMode) => void;
  onModeChangeRequest?: (newMode: CreationMode) => void;
  disabled?: boolean;
}

export const CreationModeSelector: React.FC<CreationModeSelectorProps> = ({ value, onChange, onModeChangeRequest, disabled = false }) => {
  const handleModeChange = (newMode: CreationMode) => {
    if (disabled || newMode === value) {
      return;
    }
    
    if (onModeChangeRequest) {
      onModeChangeRequest(newMode);
    } else {
      onChange(newMode);
    }
  };
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        fontWeight: 'bold', 
        marginBottom: '12px',
        fontSize: '14px'
      }}>
        作成モード
      </label>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '12px',
        opacity: disabled ? 0.6 : 1
      }}>
        <label style={{
          display: 'block',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: value === 'auto' ? '2px solid #4CAF50' : '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px 16px',
          backgroundColor: value === 'auto' ? '#f8fff8' : 'white',
          transition: 'all 0.2s ease-in-out',
          flex: '1',
          minWidth: '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <input
              type="radio"
              name="creationMode"
              value="auto"
              checked={value === 'auto'}
              onChange={() => handleModeChange('auto')}
              disabled={disabled}
              style={{ 
                marginRight: '12px',
                marginTop: '2px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transform: 'scale(1.2)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '15px',
                fontWeight: '600',
                color: value === 'auto' ? '#2e7d32' : '#333',
                marginBottom: '4px'
              }}>
                🤖 自動生成
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: disabled ? '#999' : '#666',
                lineHeight: '1.4'
              }}>
                AIが学習項目に基づいて穴埋め箇所と選択肢を自動生成
              </div>
            </div>
          </div>
        </label>
        
        <label style={{
          display: 'block',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: value === 'manual' ? '2px solid #4CAF50' : '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px 16px',
          backgroundColor: value === 'manual' ? '#f8fff8' : 'white',
          transition: 'all 0.2s ease-in-out',
          flex: '1',
          minWidth: '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <input
              type="radio"
              name="creationMode"
              value="manual"
              checked={value === 'manual'}
              onChange={() => handleModeChange('manual')}
              disabled={disabled}
              style={{ 
                marginRight: '12px',
                marginTop: '2px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transform: 'scale(1.2)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '15px',
                fontWeight: '600',
                color: value === 'manual' ? '#2e7d32' : '#333',
                marginBottom: '4px'
              }}>
                ✏️ 手動作成
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: disabled ? '#999' : '#666',
                lineHeight: '1.4'
              }}>
                穴埋め箇所を手動で選択し、選択肢を自分で作成
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};