import React, { useState, useEffect } from 'react';
import type { QuizChoice } from '../types/quiz';

interface ManualCreationModeProps {
  learningTopic: string;
  onManualDataChange?: (hasData: boolean) => void;
}

export const ManualCreationMode: React.FC<ManualCreationModeProps> = ({ onManualDataChange }) => {
  const [choices, setChoices] = useState<QuizChoice[]>([
    { id: 'A', text: '', isCorrect: true },
    { id: 'B', text: '', isCorrect: false },
    { id: 'C', text: '', isCorrect: false },
    { id: 'D', text: '', isCorrect: false }
  ]);


  const handleChoiceChange = (index: number, text: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index].text = text;
    setChoices(updatedChoices);
  };

  // 編集内容の変更を親に通知
  useEffect(() => {
    if (onManualDataChange) {
      const hasChoiceChanges = choices.some(choice => choice.text.trim() !== '');
      onManualDataChange(hasChoiceChanges);
    }
  }, [choices, onManualDataChange]);

  return (
    <div style={{ 
      display: 'flex',
      gap: '20px',
      marginBottom: '20px'
    }}>
      {/* 選択肢入力 */}
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          marginBottom: '12px' 
        }}>
          選択肢を入力してください
        </h4>
        {choices.map((choice, index) => (
          <div key={choice.id} style={{ marginBottom: '10px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '14px'
            }}>
              <span style={{ 
                minWidth: '30px',
                fontWeight: 'bold'
              }}>
                {choice.id}.
              </span>
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={index === 0 ? '正答を入力' : '誤答を入力'}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: choice.isCorrect ? '2px solid #4CAF50' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: choice.isCorrect ? '#f0f8f0' : 'white',
                  fontSize: '14px'
                }}
              />
              {choice.isCorrect && (
                <span style={{ color: '#4CAF50', marginLeft: '8px' }}>✓ 正答</span>
              )}
            </label>
          </div>
        ))}
      </div>

      {/* 解説入力 */}
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          marginBottom: '12px' 
        }}>
          解説
        </h4>
        <textarea
          placeholder="問題の解説を入力してください..."
          style={{
            width: '100%',
            height: '200px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            lineHeight: '1.6',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>
    </div>
  );
};