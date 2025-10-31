import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DataSpreadsheetPanel } from "./DataSpreadsheetPanel";
import { useProblem } from "../contexts/ProblemContext";
import type { DataProblemTemplateData } from "@/services/gasClientService";

const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  typescript: "// ここにコードを書いてください\nfunction solution() {\n  \n}\n",
  javascript: "// ここにコードを書いてください\nfunction solution() {\n  \n}\n",
  python: "# ここにコードを書いてください\ndef solution():\n    pass\n",
  java: "// ここにコードを書いてください\npublic class Solution {\n    public void solution() {\n        \n    }\n}\n",
  cpp: "// ここにコードを書いてください\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    \n}\n",
  c: "// ここにコードを書いてください\n#include <stdio.h>\n\nvoid solution() {\n    \n}\n",
  csharp: "// ここにコードを書いてください\nusing System;\n\npublic class Solution {\n    public void solution() {\n        \n    }\n}\n",
  go: '// ここにコードを書いてください\npackage main\n\nimport "fmt"\n\nfunc solution() {\n    \n}\n',
  rust: "// ここにコードを書いてください\nfn solution() {\n    \n}\n",
  php: "<?php\n// ここにコードを書いてください\nfunction solution() {\n    \n}\n",
  ruby: "# ここにコードを書いてください\ndef solution\n  \nend\n",
  swift: "// ここにコードを書いてください\nfunc solution() {\n    \n}\n",
  kotlin: "// ここにコードを書いてください\nfun solution() {\n    \n}\n",
  html: "<!DOCTYPE html>\n<html>\n<head>\n    <title>Solution</title>\n</head>\n<body>\n    \n</body>\n</html>\n",
  css: "/* ここにCSSを書いてください */\n.solution {\n    \n}\n",
  json: '{\n    "solution": "ここにJSONを書いてください"\n}\n',
  sql: "-- ここにSQLを書いてください\nSELECT * FROM table_name;\n",
  shell: '#!/bin/bash\n# ここにシェルスクリプトを書いてください\necho "Hello World"\n',
};

interface RightPanelProps {
  onSpreadsheetDataChange?: (data: DataProblemTemplateData) => void;
  onSpreadsheetCreated?: (spreadsheetId: string, embedUrl: string) => void;
  onGetCurrentDataRef?: (getCurrentData: () => Promise<DataProblemTemplateData | null>) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
  onSpreadsheetDataChange, 
  onSpreadsheetCreated,
  onGetCurrentDataRef 
}) => {
  const router = useRouter();
  const { problemData, setProblemData, spreadsheetState, setSpreadsheetState } = useProblem();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  // データ整理問題スプレッドシートからのデータ変更を処理
  const handleSheetsDataChange = useCallback((data: DataProblemTemplateData) => {
    // スプレッドシートのデータをProblemContextに反映
    setProblemData({
      problem: data.problemText || '',
      // GAS の answerText を frontend の problemData.code にマッピングする (Aプラン)
      code: data.code || data.answerText || '',
      language: 'data_analysis', // 新しいカテゴリ
      learningTopic: 'data_analysis', // データ整理固定
    });
    
    // 親コンポーネント（HomePage）にもデータ変更を通知
    if (onSpreadsheetDataChange) {
      onSpreadsheetDataChange(data);
    }
  }, [setProblemData, onSpreadsheetDataChange]);

  // スプレッドシート作成時の処理
  const handleSpreadsheetCreated = (sheetId: string, embedUrl: string) => {
    setSpreadsheetId(sheetId);
    try { setSpreadsheetState(sheetId, embedUrl); } catch {}
    console.log('Spreadsheet created:', sheetId, embedUrl);
    
    // 親コンポーネント（HomePage）にも通知
    if (onSpreadsheetCreated) {
      onSpreadsheetCreated(sheetId, embedUrl);
    }
  };

  // ProblemContext から復元されたスプレッドシートIDを反映
  React.useEffect(() => {
    if (spreadsheetState?.spreadsheetId) {
      setSpreadsheetId(spreadsheetState.spreadsheetId);
    }
  }, [spreadsheetState]);

  // エラーハンドリング
  const handleSheetsError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleTransitionToQuiz = () => {
    // データが入力されているかチェック
    if (!problemData.problem?.trim()) {
      alert('問題文を入力してからクイズ作成に進んでください');
      return;
    }

    if (!spreadsheetId) {
      alert('スプレッドシートが作成されていません');
      return;
    }

    // スプレッドシートIDをセッションストレージに保存
    sessionStorage.setItem('currentSpreadsheetId', spreadsheetId);

    setIsTransitioning(true);
    // Next.jsのルーターで遷移
    router.push("/create-mcq");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #ddd",
      }}
    >
      {/* エラー表示 */}
      {error && (
        <div style={{
          padding: "12px",
          backgroundColor: "#fff5f5",
          border: "1px solid #fed7d7",
          color: "#c53030",
          fontSize: "14px",
          margin: "8px"
        }}>
          {error}
        </div>
      )}

      {/* データ整理問題スプレッドシート パネル */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <DataSpreadsheetPanel 
          onDataChange={handleSheetsDataChange}
          onSpreadsheetCreated={handleSpreadsheetCreated}
          onError={handleSheetsError}
          onGetCurrentDataRef={onGetCurrentDataRef}
        />
      </div>

      {/* 現在のデータ表示（デバッグ用） */}
      {/* 現在のデータ表示（デバッグ用） は削除（運用/UXにより不要） */}

      {/* フッター */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          minHeight: "50px",
        }}
      >
        <div style={{ fontSize: "12px", color: "#666" }}>
          💡 スプレッドシートで問題文とデータ操作内容を入力してください（メッセージ送信時に最新データを自動取得）
        </div>
        
        <button
          onClick={handleTransitionToQuiz}
          disabled={isTransitioning || !problemData.problem?.trim() || !spreadsheetId}
          style={{
            padding: "12px 20px",
            backgroundColor: isTransitioning || !problemData.problem?.trim() || !spreadsheetId 
              ? "#ccc" 
              : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isTransitioning || !problemData.problem?.trim() || !spreadsheetId 
              ? "not-allowed" 
              : "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => {
            if (!isTransitioning && problemData.problem?.trim() && spreadsheetId) {
              e.currentTarget.style.backgroundColor = "#45a049";
            }
          }}
          onMouseOut={(e) => {
            if (!isTransitioning && problemData.problem?.trim() && spreadsheetId) {
              e.currentTarget.style.backgroundColor = "#4CAF50";
            }
          }}
        >
          {isTransitioning ? "移行中..." : "選択式問題の作成に移る"}
        </button>
      </div>
    </div>
  );
};
