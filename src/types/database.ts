// Supabase database type definitions

export interface Profile {
  id: string; // UUID, references auth.users(id)
  email: string;
  is_admin: boolean;
  created_at: string; // ISO 8601 timestamp
}

export interface Problem {
  id: string; // UUID
  user_id: string; // UUID, references auth.users(id)
  problem_text: string;
  // プログラミング問題用フィールド
  code: string | null;
  language: string | null;
  learning_topic: string | null;
  code_with_blanks: string | null;
  choices: QuizChoice[] | null; // JSONB
  explanation: string | null;
  // データ整理問題用フィールド
  spreadsheet_url: string | null;
  spreadsheet_id: string | null;
  problem_category: string; // DEFAULT 'data_analysis'
  session_id: string | null; // UUID
  table_data: Record<string, unknown> | null; // JSONB
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface QuizChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ChatHistory {
  id: string; // UUID
  problem_id: string; // UUID, references problems(id)
  user_id: string; // UUID, references auth.users(id)
  chat_type: 'creation' | 'explanation';
  messages: ChatMessage[]; // JSONB
  created_at: string; // ISO 8601 timestamp
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ProblemComment {
  id: string; // UUID
  problem_id: string; // UUID, references problems(id)
  user_id: string; // UUID, references auth.users(id)
  content: string;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  is_edited: boolean; // 編集済みフラグ
}

export interface ProblemCommentWithUser extends ProblemComment {
  user_email?: string; // from profiles.email
}
