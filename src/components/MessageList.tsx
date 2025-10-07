import React, { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ 
      flex: 1, 
      padding: '16px', 
      overflowY: 'auto',
      backgroundColor: '#fafafa'
    }}>
      {messages.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginTop: '50px' 
        }}>
          Start a conversation with the AI chatbot!
        </div>
      )}
      
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          marginBottom: '16px' 
        }}>
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '12px 16px', 
            borderRadius: '18px',
            maxWidth: '70%',
            color: '#666'
          }}>
            Thinking...
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};