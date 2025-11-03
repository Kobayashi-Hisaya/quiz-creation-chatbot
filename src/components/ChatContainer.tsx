import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '../types/chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { chatService } from '../services/chatService';
import { useAuth } from '@/contexts/AuthContext';
import { useProblem } from '@/contexts/ProblemContext';
import type { DataProblemTemplateData } from '../services/gasClientService';

interface ChatContainerProps {
  spreadsheetData?: DataProblemTemplateData | null;
  fetchLatestSpreadsheetData?: () => Promise<DataProblemTemplateData | null>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  spreadsheetData,
  fetchLatestSpreadsheetData
}) => {
  const { user } = useAuth();
  const { problemData } = useProblem();
  const hasInitialized = useRef(false);

  // per-user storage key (学習項目を含める)
  const storageKey = user
    ? `chatMessages:${user.id}:${problemData.learningTopic}`
    : 'chatMessages:anon';

  // localStorageからメッセージ履歴を読み込む
  const loadMessages = (): Message[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedMessages = JSON.parse(stored) as Message[];
        return parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
    }
    return [];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);

  // メッセージをlocalStorageに保存
  const saveMessages = useCallback((msgs: Message[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(msgs));
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
    }
  }, [storageKey]);

  // messagesが変更されたらlocalStorageに保存（デバウンス）
  useEffect(() => {
    const handle = setTimeout(() => saveMessages(messages), 300);
    return () => clearTimeout(handle);
  }, [messages, saveMessages]);

  // storage イベントで他タブからの更新を反映
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      try {
        if (e.newValue) {
          const parsed = JSON.parse(e.newValue) as Message[];
          setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.warn('Failed to parse chat storage event', err);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey]);

  // スプレッドシートデータが変更されたらChatServiceに反映
  useEffect(() => {
    if (spreadsheetData) {
      chatService.setSpreadsheetData(spreadsheetData);
    }
  }, [spreadsheetData]);

  // 初期化: 学習項目の設定と初期メッセージの表示
  useEffect(() => {
    // StrictModeでの二重実行を防ぐ
    if (hasInitialized.current) return;

    const learningTopic = problemData.learningTopic;

    // 学習項目が設定されており、メッセージが空の場合のみ初期化
    if (learningTopic && messages.length === 0) {
      // ChatServiceに学習項目を設定
      chatService.setLearningTopic(learningTopic);

      // 初期メッセージを取得して表示
      const initialMessage: Message = {
        id: 'initial-' + Date.now().toString(),
        content: chatService.getInitialMessage(),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages([initialMessage]);
      hasInitialized.current = true;
    }
  }, [problemData.learningTopic, messages.length]);

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
      // 送信前に最新のスプレッドシートデータを取得
      if (fetchLatestSpreadsheetData) {
        const latestData = await fetchLatestSpreadsheetData();
        if (latestData) {
          chatService.setSpreadsheetData(latestData);
        }
      }

      const botResponse = await chatService.sendMessage(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error && (error.message.includes('spreadsheet') || error.message.includes('fetch'))) {
        errorContent = 'スプレッドシートのデータ取得中にエラーが発生しました。再度お試しください。';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    chatService.clearHistory();
    setMessages([]);
    try { localStorage.removeItem(storageKey); } catch {}
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100%',
      border: 'none',
      borderRadius: '0',
      overflow: 'hidden'
    }}>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '16px', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold' }}>作問用チャットボット</span>
      </div>
      
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
    </div>
  );
};