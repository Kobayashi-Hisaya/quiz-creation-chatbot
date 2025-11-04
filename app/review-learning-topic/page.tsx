"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProblem } from '@/contexts/ProblemContext';
import { LearningTopicSelector, LearningTopic } from '@/components/LearningTopicSelector';
import { ReviewChatContainer } from '@/components/ReviewChatContainer';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ReviewLearningTopicPage: React.FC = () => {
  const router = useRouter();
  const { problemData, setLearningTopic, hasTopicBeenSelected } = useProblem();
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  // ページ読み込み時にTopicSelectorを表示（トピック未選択の場合）
  useEffect(() => {
    if (!hasTopicBeenSelected) {
      setShowTopicSelector(true);
    } else {
      setSelectedTopic(problemData.learningTopic);
    }
  }, [hasTopicBeenSelected, problemData.learningTopic]);

  const handleTopicSelect = (topic: LearningTopic) => {
    setLearningTopic(topic);
    setSelectedTopic(topic);
    setShowTopicSelector(false);

    // sessionStorageに学習項目を保存（create-mcq/page.tsx, add-explanation/page.tsxでのlocalStorageクリアに使用）
    sessionStorage.setItem('learningTopic', topic);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGoToCreateQuiz = () => {
    router.push('/create-quiz');
  };

  return (
    <ProtectedRoute>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#2196f3',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>学習項目の復習</h1>
            {selectedTopic && (
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                学習項目: {selectedTopic}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#2196f3',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              ダッシュボードに戻る
            </button>
            {selectedTopic && (
              <button
                onClick={handleGoToCreateQuiz}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                問題作成に移る
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}>
          {selectedTopic ? (
            <ReviewChatContainer
              showHeader={true}
              learningTopic={selectedTopic}
            />
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: '18px',
              color: '#666'
            }}>
              学習項目を選択してください
            </div>
          )}
        </div>

        {/* Topic Selector Modal */}
        <LearningTopicSelector
          isOpen={showTopicSelector}
          onSelect={handleTopicSelect}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ReviewLearningTopicPage;
