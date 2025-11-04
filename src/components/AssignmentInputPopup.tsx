import React, { useState, useEffect, useRef } from 'react';

interface AssignmentInputPopupProps {
  isOpen: boolean;
  onSubmit: (predicted_accuracy: number | null, predicted_answerTime: number | null) => void;
  onCancel: () => void;
}

export const AssignmentInputPopup: React.FC<AssignmentInputPopupProps> = ({
  isOpen,
  onSubmit,
  onCancel
}) => {
  const [predicted_accuracy, setPredicted_accuracy] = useState<number | null>(null);
  const [predicted_answerTime, setPredicted_answerTime] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const resetForm = () => {
    setPredicted_accuracy(null);
    setPredicted_answerTime('');
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = () => {
    const time = predicted_answerTime.trim() ? parseInt(predicted_answerTime, 10) : null;

    // バリデーション
    if (time !== null && (isNaN(time) || time < 60 || time > 900)) {
      alert('予想解答時間は1分～15分（60～900秒）の範囲で選択してください');
      return;
    }

    onSubmit(predicted_accuracy, time);
    resetForm();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // フォーカストラップとフォーカス管理
  useEffect(() => {
    if (isOpen) {
      // 現在のアクティブ要素を保存
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 最初の入力欄にフォーカス
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      // モーダル外のコンテンツをinertにする
      const appElement = document.getElementById('__next');
      if (appElement) {
        appElement.setAttribute('inert', 'true');
      }

      // Escapeキーでキャンセル
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancel();
        }
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        // inertを解除
        if (appElement) {
          appElement.removeAttribute('inert');
        }
        // フォーカスを元の位置に戻す
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, handleCancel]);

  if (!isOpen) return null;

  const accuracyOptions = Array.from({ length: 11 }, (_, i) => i * 10);

  // オーバーレイクリックを防ぐ（モーダルコンテンツ内のクリックは伝播させない）
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // オーバーレイ自体がクリックされた場合は何もしない（必須入力のため閉じない）
    e.stopPropagation();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // モーダルコンテンツ内のクリックは伝播を止める
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'auto' // すべてのポインターイベントをキャプチャ
      }}
      onClick={handleOverlayClick}
      ref={modalRef}
    >
      <div
        onClick={handleModalContentClick}
        style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '24px', 
          textAlign: 'center',
          color: '#333'
        }}>
          📝 作問課題を入力してください
        </h2>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          この問題の想定する正答率と解答時間を設定してください
        </p>

        {/* 予想正答率セクション */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            fontWeight: 'bold', 
            fontSize: '14px',
            color: '#333',
            display: 'block',
            marginBottom: '12px'
          }}>
            予想正答率（%）
          </label>
          <select
            ref={firstInputRef}
            value={predicted_accuracy !== null ? predicted_accuracy : ''}
            onChange={(e) => setPredicted_accuracy(e.target.value ? parseInt(e.target.value, 10) : null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #2196f3',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            <option value="">-- 選択してください --</option>
            {accuracyOptions.map((accuracy) => (
              <option key={accuracy} value={accuracy}>
                {accuracy}%
              </option>
            ))}
          </select>
          <p style={{ 
            fontSize: '12px', 
            color: '#999', 
            marginTop: '8px',
            marginBottom: '0'
          }}>
            その問題を解く際、学習者がどの程度正解できると予想するかを選択してください
          </p>
        </div>

        {/* 予想解答時間セクション */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            fontWeight: 'bold', 
            fontSize: '14px',
            color: '#333',
            display: 'block',
            marginBottom: '12px'
          }}>
            予想解答時間（分）
          </label>
          <select
            value={predicted_answerTime}
            onChange={(e) => setPredicted_answerTime(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #2196f3',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            <option value="">-- 選択してください --</option>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((minute) => (
              <option key={minute} value={String(minute * 60)}>
                {minute}分 ({minute * 60}秒)
              </option>
            ))}
          </select>
          <p style={{ 
            fontSize: '12px', 
            color: '#999', 
            marginTop: '8px',
            marginBottom: '0'
          }}>
            予想解答時間を1分～15分の範囲から選択してください
          </p>
        </div>

        {/* ボタン */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '12px'
        }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            登録
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '12px 32px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
