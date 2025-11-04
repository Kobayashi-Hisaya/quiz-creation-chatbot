import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { reviewChatService } from '../services/reviewChatService';
import { useAuth } from '../contexts/AuthContext';

interface ReviewChatContainerProps {
  showHeader?: boolean;
  learningTopic: string;
}

export const ReviewChatContainer: React.FC<ReviewChatContainerProps> = ({
  showHeader = true,
  learningTopic
}) => {
  const { user } = useAuth();

  // localStorageからメッセージ履歴を読み込む
  const loadMessages = (): Message[] => {
    try {
      const userId = user?.id || 'anonymous';
      const storageKey = `review-chat-messages:${userId}:${learningTopic}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedMessages = JSON.parse(stored) as Message[];
        return parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load review chat messages from localStorage:', error);
    }
    return [];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // StrictMode対策：初期化中フラグ（useRefはStrictModeでもリセットされない）
  const initializingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // メッセージをlocalStorageに保存
  useEffect(() => {
    try {
      const userId = user?.id || 'anonymous';
      const storageKey = `review-chat-messages:${userId}:${learningTopic}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save review chat messages to localStorage:', error);
    }
  }, [messages, user?.id, learningTopic]);

  // learningTopicが変更されたら初期化フラグをリセット
  useEffect(() => {
    setHasInitialized(false);
    initializingRef.current = false;
    // 進行中のリクエストがあればキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [learningTopic]);

  // チャット初期化（1回のみ実行）
  useEffect(() => {
    // 既に初期化中の場合はスキップ（StrictMode対策）
    if (initializingRef.current) {
      return;
    }

    if (learningTopic && !hasInitialized && messages.length === 0) {
      // 初期化開始フラグを立てる
      initializingRef.current = true;
      reviewChatService.setLearningTopic(learningTopic);

      // 固定の初期メッセージを即座に表示（API呼び出しなし）
      const initialMessageContent = reviewChatService.getInitialMessage();
      const botMessage: Message = {
        id: Date.now().toString(),
        content: initialMessageContent,
        sender: 'bot',
        timestamp: new Date(),
      };

      // 初期メッセージをReviewChatServiceのconversationHistoryに追加
      reviewChatService.addInitialMessage(initialMessageContent);

      setMessages([botMessage]);
      setHasInitialized(true);

      // 【旧実装: コメントアウト】確認後に削除予定
      // // AbortControllerを作成
      // const abortController = new AbortController();
      // abortControllerRef.current = abortController;
      //
      // // 最初の質問を自動的に取得
      // const initializeChat = async () => {
      //   setIsLoading(true);
      //   try {
      //     const initialMessage = `こんにちは。「${learningTopic}」について復習したいです。よろしくお願いします。`;
      //     const botResponse = await reviewChatService.sendMessage(initialMessage, abortController.signal);
      //
      //     // リクエストがキャンセルされていたら処理しない
      //     if (abortController.signal.aborted) {
      //       return;
      //     }
      //
      //     const botMessage: Message = {
      //       id: Date.now().toString(),
      //       content: botResponse,
      //       sender: 'bot',
      //       timestamp: new Date(),
      //     };
      //     setMessages([botMessage]);
      //     setHasInitialized(true); // 初期化完了フラグを設定
      //   } catch (error) {
      //     // AbortErrorの場合はログを出さない（意図的なキャンセル）
      //     if (error instanceof Error && error.name === 'AbortError') {
      //       console.log('Chat initialization was cancelled');
      //     } else {
      //       console.error('Failed to initialize chat:', error);
      //     }
      //   } finally {
      //     setIsLoading(false);
      //     abortControllerRef.current = null;
      //   }
      // };
      //
      // initializeChat();
    }

    // クリーンアップ関数：コンポーネントアンマウント時にリクエストをキャンセル
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [learningTopic, hasInitialized]); // messages.lengthを依存配列から削除（循環依存の解消）

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // AbortControllerを作成
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const botResponse = await reviewChatService.sendMessage(content, abortController.signal);

      // リクエストがキャンセルされていたら処理しない
      if (abortController.signal.aborted) {
        return;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // AbortErrorの場合はエラーメッセージを表示しない
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Message request was cancelled');
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
        console.error('Failed to send message:', error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearHistory = () => {
    reviewChatService.clearHistory();
    setMessages([]);
    setHasInitialized(false); // 初期化フラグをリセット
    const userId = user?.id || 'anonymous';
    const storageKey = `review-chat-messages:${userId}:${learningTopic}`;
    localStorage.removeItem(storageKey);
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
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>復習チャット - {learningTopic}</span>
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
