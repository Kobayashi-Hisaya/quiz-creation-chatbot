import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProblemInput } from "./ProblemInput";
import { CodeEditor } from "./CodeEditor";
import { useProblem } from "../contexts/ProblemContext";

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

export const RightPanel: React.FC = () => {
  const router = useRouter();
  const { problemData, setProblemData } = useProblem();
  
  // ProblemContextから初期値を設定
  const [language, setLanguage] = useState(problemData.language || "typescript");
  const [code, setCode] = useState(problemData.code || DEFAULT_CODE_TEMPLATES[problemData.language || "typescript"]);
  const [problem, setProblem] = useState(problemData.problem || "");

  const handleProblemChange = (newProblem: string) => {
    setProblem(newProblem);
    // リアルタイムでlocalStorageに保存
    setProblemData({
      problem: newProblem,
      code,
      language,
      learningTopic: problemData.learningTopic,
    });
  };

  const handleCodeChange = (newCode: string | undefined) => {
    const updatedCode = newCode || "";
    setCode(updatedCode);
    // リアルタイムでlocalStorageに保存
    setProblemData({
      problem,
      code: updatedCode,
      language,
      learningTopic: problemData.learningTopic,
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    const newCode = DEFAULT_CODE_TEMPLATES[newLanguage] || "// Write your code here\n";
    setLanguage(newLanguage);
    setCode(newCode);
    // リアルタイムでlocalStorageに保存
    setProblemData({
      problem,
      code: newCode,
      language: newLanguage,
      learningTopic: problemData.learningTopic,
    });
  };

  const handleTransitionToQuiz = () => {
    setProblemData({
      problem,
      code,
      language,
      learningTopic: problemData.learningTopic,
    });

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
      <ProblemInput onProblemChange={handleProblemChange} initialValue={problem} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <CodeEditor value={code} onChange={handleCodeChange} language={language} onLanguageChange={handleLanguageChange} />
        </div>
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "flex-end",
            flexShrink: 0,
            minHeight: "50px",
          }}
        >
          <button
            onClick={handleTransitionToQuiz}
            style={{
              padding: "12px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#45a049";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#4CAF50";
            }}
          >
            選択式問題の作成に移る
          </button>
        </div>
      </div>
    </div>
  );
};
