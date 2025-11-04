import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Message } from '../types/chat';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: isUser ? 'flex-end' : 'flex-start', 
      marginBottom: '16px' 
    }}>
      <div style={{ 
        backgroundColor: isUser ? '#2196f3' : '#e3f2fd', 
        color: isUser ? 'white' : '#333',
        padding: '10px 16px', 
        borderRadius: '18px',
        maxWidth: '70%',
        wordBreak: 'break-word'
      }}>
        <div className="message-content" style={isUser ? {
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '13px',
          lineHeight: '1.2'
        } : {
          fontSize: '13px',
          lineHeight: '1.2'
        }}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.7, 
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};