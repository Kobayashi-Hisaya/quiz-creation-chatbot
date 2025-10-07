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
  code: string;
  language: string;
  learning_topic: string | null;
  code_with_blanks: string | null;
  choices: QuizChoice[] | null; // JSONB
  explanation: string | null;
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
