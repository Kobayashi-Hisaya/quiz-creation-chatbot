import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      // テキストエリアの高さをリセット
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // テキストエリアの高さを自動調整
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid #ddd",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Shift+Enter for new line)"
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            outline: "none",
            fontSize: "14px",
            resize: "none",
            fontFamily: "inherit",
            lineHeight: "1.4",
            minHeight: "40px",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: isLoading || !message.trim() ? "not-allowed" : "pointer",
            opacity: isLoading || !message.trim() ? 0.5 : 1,
            fontSize: "14px",
            fontWeight: "bold",
            minWidth: "60px",
            height: "55px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
