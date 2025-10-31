"use client";
import React, { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/ChatContainer';
import { RightPanel } from '@/components/RightPanel';
import { LearningTopicSelector } from '@/components/LearningTopicSelector';
import { AssignmentInputPopup } from '@/components/AssignmentInputPopup';
import { useProblem } from '@/contexts/ProblemContext';
import { chatService } from '@/services/chatService';
import type { LearningTopic } from '@/components/LearningTopicSelector';

const HomePage: React.FC = () => {
  const { problemData, setLearningTopic, setAssignmentData } = useProblem();
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [hasSelectedTopic, setHasSelectedTopic] = useState(false);

  // ページ初回訪問時に学習項目が未設定の場合のみポップアップを表示
  useEffect(() => {
    if (!hasSelectedTopic || !problemData.learningTopic) {
      setShowTopicSelector(true);
    }
  }, [hasSelectedTopic, problemData.learningTopic]);

  const handleTopicSelect = (topic: LearningTopic) => {
    setLearningTopic(topic);
    chatService.setLearningTopic(topic);
    setHasSelectedTopic(true);
    setShowTopicSelector(false);
    
    // 作問課題ポップアップを表示
    setShowAssignmentPopup(true);
  };

  const handleAssignmentSubmit = (accuracy: number | null, answerTime: number | null) => {
    setAssignmentData(accuracy, answerTime);
    setShowAssignmentPopup(false);
  };

  const handleAssignmentCancel = () => {
    setShowAssignmentPopup(false);
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

      <AssignmentInputPopup
        isOpen={showAssignmentPopup}
        onSubmit={handleAssignmentSubmit}
        onCancel={handleAssignmentCancel}
      />
    </div>
  );
};

export default HomePage;