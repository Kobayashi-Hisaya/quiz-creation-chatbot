import React, { useState, useEffect } from 'react';
import type { Message } from '../types/chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { explanationChatService } from '../services/explanationChatService';

interface ExplanationChatContainerProps {
  showHeader?: boolean;
}

export const ExplanationChatContainer: React.FC<ExplanationChatContainerProps> = ({ showHeader = true }) => {
  // localStorageからメッセージ履歴を読み込む
  const loadMessages = (): Message[] => {
    try {
      const stored = localStorage.getItem('explanationChatMessages');
      if (stored) {
        const parsedMessages = JSON.parse(stored) as Message[];
        return parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load explanation chat messages from localStorage:', error);
    }
    return [];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);

  // メッセージをlocalStorageに保存
  const saveMessages = (msgs: Message[]) => {
    try {
      localStorage.setItem('explanationChatMessages', JSON.stringify(msgs));
    } catch (error) {
      console.error('Failed to save explanation chat messages to localStorage:', error);
    }
  };

  // messagesが変更されたらlocalStorageに保存
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponse = await explanationChatService.sendMessage(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    explanationChatService.clearHistory();
    setMessages([]);
    localStorage.removeItem('explanationChatMessages');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      border: 'none',
      borderRadius: '0',
      overflow: 'hidden'
    }}>
      {showHeader && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>解説相談</span>
          <button
            onClick={handleClearHistory}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            🗑️ 履歴クリア
          </button>
        </div>
      )}
      
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
    </div>
  );
};