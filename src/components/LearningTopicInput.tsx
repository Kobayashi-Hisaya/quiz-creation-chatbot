import React from 'react';

interface LearningTopicInputProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const LearningTopicInput: React.FC<LearningTopicInputProps> = ({ value, readOnly = false }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        fontWeight: 'bold', 
        fontSize: '14px',
        color: '#333',
        display: 'block',
        marginBottom: '8px'
      }}>
        📚 学習項目
      </label>
      <div style={{ 
        display: 'inline-block',
        minWidth: '200px',
        maxWidth: '100%'
      }}>
        <div style={{
          padding: '12px 16px',
          border: '2px solid #e3f2fd',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          boxShadow: '0 2px 4px rgba(33, 150, 243, 0.1)',
          display: 'inline-block',
          width: 'auto',
          minWidth: '200px'
        }}>
          {value || '学習項目が設定されていません'}
        </div>
      </div>
      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '4px',
        marginBottom: '0'
      }}>
        {readOnly 
          ? 'ホームページで選択された学習項目です' 
          : 'この問題で学習する内容やテーマを入力してください'
        }
      </p>
    </div>
  );
};