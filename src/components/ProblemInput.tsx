import React, { useState, useEffect } from 'react';

interface ProblemInputProps {
  onProblemChange: (problem: string) => void;
  initialValue?: string;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ onProblemChange, initialValue = '' }) => {
  const [problem, setProblem] = useState(initialValue);

  // initialValueが変更されたら内部状態を更新
  useEffect(() => {
    setProblem(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setProblem(value);
    onProblemChange(value);
  };

  return (
    <div style={{ 
      height: '30%', 
      display: 'flex', 
      flexDirection: 'column',
      borderBottom: '1px solid #ddd'
    }}>
      <div style={{ 
        padding: '12px 16px', 
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        問題文
      </div>
      <textarea
        value={problem}
        onChange={handleChange}
        placeholder="ここに問題文を入力してください..."
        style={{
          flex: 1,
          padding: '16px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
      />
    </div>
  );
};