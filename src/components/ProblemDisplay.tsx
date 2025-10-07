import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useProblem } from '../contexts/ProblemContext';

export const ProblemDisplay: React.FC = () => {
  const { problemData } = useProblem();
  const [codeWithBlanks, setCodeWithBlanks] = useState(problemData.code);

  const handleCodeChange = (value: string | undefined) => {
    setCodeWithBlanks(value || '');
  };

  const handleReset = () => {
    setCodeWithBlanks(problemData.code);
  };

  const getLanguageLabel = (language: string): string => {
    const languageMap: Record<string, string> = {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      csharp: 'C#',
      go: 'Go',
      rust: 'Rust',
      php: 'PHP',
      ruby: 'Ruby',
      swift: 'Swift',
      kotlin: 'Kotlin',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      sql: 'SQL',
      shell: 'Shell',
    };
    return languageMap[language] || language;
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        選択式問題作成
      </div>
      
      {/* 問題文表示 */}
      <div style={{ 
        height: '50%', 
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
        <div style={{
          flex: 1,
          padding: '16px',
          overflow: 'auto',
          backgroundColor: 'white',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {problemData.problem || '問題文が入力されていません'}
        </div>
      </div>
      
      {/* コード表示 */}
      <div style={{ 
        height: '50%', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ddd',
          fontWeight: 'bold',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>解答コード ({getLanguageLabel(problemData.language)})</span>
          <button
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            リセットする
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={problemData.language}
            value={codeWithBlanks || '// コードが入力されていません'}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
            }}
            theme="vs-light"
          />
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          padding: '8px 16px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #ddd'
        }}>
          空欄は「___Blank___」で表現してください
        </div>
      </div>
    </div>
  );
};