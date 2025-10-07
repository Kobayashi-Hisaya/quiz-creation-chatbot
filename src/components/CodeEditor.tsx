import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "shell", label: "Shell" },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language, onLanguageChange }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "14px" }}>解答ソースコード</span>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            backgroundColor: "white",
            fontSize: "12px",
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: false,
            folding: true,
            foldingHighlight: true,
            showFoldingControls: "mouseover",
          }}
        />
      </div>
    </div>
  );
};
