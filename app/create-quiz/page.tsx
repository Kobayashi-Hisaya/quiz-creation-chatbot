"use client";
import React, { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/ChatContainer';
import { RightPanel } from '@/components/RightPanel';
import { LearningTopicSelector } from '@/components/LearningTopicSelector';
import { useProblem } from '@/contexts/ProblemContext';
import { chatService } from '@/services/chatService';
import type { LearningTopic } from '@/components/LearningTopicSelector';

const HomePage: React.FC = () => {
  const { problemData, setLearningTopic } = useProblem();
  const [showTopicSelector, setShowTopicSelector] = useState(false);

  // ページ初回訪問時に学習項目が未設定の場合のみポップアップを表示
  useEffect(() => {
    const hasSelectedTopic = localStorage.getItem('hasSelectedLearningTopic');
    if (!hasSelectedTopic || !problemData.learningTopic) {
      setShowTopicSelector(true);
    }
  }, [problemData.learningTopic]);

  const handleTopicSelect = (topic: LearningTopic) => {
    setLearningTopic(topic);
    chatService.setLearningTopic(topic);
    localStorage.setItem('hasSelectedLearningTopic', 'true');
    setShowTopicSelector(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      minHeight: '600px'
    }}>
      <div style={{ 
        flex: '1',
        height: '100vh',
        minWidth: '300px',
        maxWidth: '50%'
      }}>
        <ChatContainer />
      </div>
      <div style={{ 
        flex: '1',
        height: '100vh',
        minWidth: '400px',
        maxWidth: '50%'
      }}>
        <RightPanel />
      </div>
      
      <LearningTopicSelector 
        isOpen={showTopicSelector}
        onSelect={handleTopicSelect}
      />
    </div>
  );
};

export default HomePage;