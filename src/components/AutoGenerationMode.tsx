import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useProblem } from '../contexts/ProblemContext';
import { quizGenerationService } from '../services/quizGenerationService';
import type { AutoGenerationResponse, QuizChoice } from '../types/quiz';

interface AutoGenerationModeProps {
  learningTopic: string;
  onQuizGenerated: (quiz: AutoGenerationResponse) => void;
  onGeneratingStateChange?: (isGenerating: boolean) => void;
}

export const AutoGenerationMode: React.FC<AutoGenerationModeProps> = ({ 
  learningTopic, 
  onQuizGenerated,
  onGeneratingStateChange
}) => {
  const { problemData } = useProblem();
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成中状態の変更を親に通知
  const updateGeneratingState = (generating: boolean) => {
    setIsGenerating(generating);
    if (onGeneratingStateChange) {
      onGeneratingStateChange(generating);
    }
  };
  const [generatedQuiz, setGeneratedQuiz] = useState<AutoGenerationResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!learningTopic.trim()) {
      setError('学習項目を入力してください');
      return;
    }

    if (!problemData.problem.trim() || !problemData.code.trim()) {
      setError('問題文とコードが必要です');
      return;
    }

    updateGeneratingState(true);
    setError('');

    try {
      const response = await quizGenerationService.generateQuiz({
        problemText: problemData.problem,
        code: problemData.code,
        language: problemData.language,
        learningTopic: learningTopic
      });

      // 解説を空にして渡す
      const responseWithoutExplanation = { ...response, explanation: '' };
      setGeneratedQuiz(responseWithoutExplanation);
      onQuizGenerated(responseWithoutExplanation);
    } catch (error) {
      setError(error instanceof Error ? error.message : '問題の生成に失敗しました');
    } finally {
      updateGeneratingState(false);
    }
  };

  const getChoiceStyle = (choice: QuizChoice) => ({
    padding: '10px',
    margin: '5px 0',
    border: choice.isCorrect ? '2px solid #4CAF50' : '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: choice.isCorrect ? '#f0f8f0' : 'white',
    fontSize: '14px'
  });

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            padding: '12px 24px',
            backgroundColor: isGenerating ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isGenerating ? '生成中...' : 'AI で問題を自動生成'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '4px',
          color: '#d32f2f',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {generatedQuiz && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            生成された問題
          </h3>

          {/* 問題文 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              問題文
            </h4>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {generatedQuiz.problemText}
            </div>
          </div>

          {/* 穴埋めコード、選択肢、解説 */}
          <div style={{ 
            display: 'flex',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* 左側: 穴埋めコード */}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                穴埋めコード
              </h4>
              <div style={{ height: '600px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <Editor
                  height="100%"
                  language={problemData.language}
                  value={generatedQuiz.codeWithBlanks}
                  onMount={(editor, monaco) => {
                    // ___BLANK___をハイライト表示するためのデコレーションを追加
                    const model = editor.getModel();
                    if (model) {
                      const text = model.getValue();
                      const decorations = [];
                      const regex = /___BLANK___/g;
                      let match;
                      
                      while ((match = regex.exec(text)) !== null) {
                        const startPos = model.getPositionAt(match.index);
                        const endPos = model.getPositionAt(match.index + match[0].length);
                        
                        decorations.push({
                          range: new monaco.Range(
                            startPos.lineNumber,
                            startPos.column,
                            endPos.lineNumber,
                            endPos.column
                          ),
                          options: {
                            inlineClassName: 'my-blank-highlight'
                          }
                        });
                      }
                      
                      editor.deltaDecorations([], decorations);
                    }
                  }}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  theme="vs-light"
                />
              </div>
            </div>

            {/* 右側: 選択肢と解説 */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '600px'
            }}>
              {/* 右上: 選択肢 */}
              <div style={{ flex: 1, marginBottom: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  選択肢
                </h4>
                <div style={{ 
                  // border: '1px solid #ddd', 
                  borderRadius: '4px',
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  height: '200px',
                  overflow: 'auto'
                }}>
                  {generatedQuiz.choices.map((choice) => (
                    <div key={choice.id} style={getChoiceStyle(choice)}>
                      <strong>{choice.id}.</strong> {choice.text}
                      {choice.isCorrect && (
                        <span style={{ color: '#4CAF50', marginLeft: '8px' }}>✓ 正答</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 右下: 解説入力 */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  解説
                </h4>
                <textarea
                  placeholder="問題の解説を入力してください..."
                  style={{
                    width: '96%',
                    height: '280px',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};