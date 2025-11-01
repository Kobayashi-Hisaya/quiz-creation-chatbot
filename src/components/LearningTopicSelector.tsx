import React, { useState } from 'react';

export type LearningTopic = 'モンテカルロ法' | string;

interface LearningTopicSelectorProps {
  isOpen: boolean;
  onSelect: (topic: LearningTopic) => void;
}

export const LearningTopicSelector: React.FC<LearningTopicSelectorProps> = ({ isOpen, onSelect }) => {
  const [selectedTopic, setSelectedTopic] = useState<'モンテカルロ法' | 'その他'>('モンテカルロ法');
  const [customTopic, setCustomTopic] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedTopic === 'その他') {
      if (customTopic.trim()) {
        onSelect(customTopic.trim());
      } else {
        alert('学習項目を入力してください');
        return;
      }
    } else {
      onSelect(selectedTopic);
    }
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
          学習項目を選択してください
        </h2>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          今回学習したいプログラミングのトピックを選んでください
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '12px',
            cursor: 'pointer',
            padding: '12px',
            border: selectedTopic === 'モンテカルロ法' ? '2px solid #2196f3' : '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: selectedTopic === 'モンテカルロ法' ? '#f0f8ff' : 'white'
          }}>
            <input
              type="radio"
              name="learningTopic"
              value="モンテカルロ法"
              checked={selectedTopic === 'モンテカルロ法'}
              onChange={(e) => setSelectedTopic(e.target.value as 'モンテカルロ法')}
              style={{ marginRight: '8px' }}
            />
            <strong>モンテカルロ法</strong>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginLeft: '24px' }}>
              乱数を用いたシミュレーション方法
            </div>
          </label>
                    
          <label style={{ 
            display: 'block', 
            marginBottom: '12px',
            cursor: 'pointer',
            padding: '12px',
            border: selectedTopic === 'その他' ? '2px solid #2196f3' : '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: selectedTopic === 'その他' ? '#f0f8ff' : 'white'
          }}>
            <input
              type="radio"
              name="learningTopic"
              value="その他"
              checked={selectedTopic === 'その他'}
              onChange={(e) => setSelectedTopic(e.target.value as 'その他')}
              style={{ marginRight: '8px' }}
            />
            <strong>その他（今回は選択しない）</strong>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginLeft: '24px' }}>
              自由記述で学習したい項目を入力
            </div>
          </label>

          {selectedTopic === 'その他' && (
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="学習したい項目を入力してください（例: 関数、データ構造、アルゴリズム）"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                marginTop: '12px',
                boxSizing: 'border-box'
              }}
            />
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#2196f3',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
};