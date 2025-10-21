import { supabase } from '@/lib/supabaseClient';
import type { Problem, ChatHistory, Profile, ChatMessage } from '@/types/database';
import type { QuizChoice } from '@/types/quiz';

export interface SaveProblemData {
  problem_text: string;
  // プログラミング問題用フィールド
  code: string | null;
  language: string | null;
  learning_topic: string | null;
  code_with_blanks: string | null;
  choices: QuizChoice[] | null;
  explanation: string | null;
  // データ整理問題用フィールド
  spreadsheet_url?: string | null;
  spreadsheet_id?: string | null;
  problem_category?: string;
  session_id?: string | null;
  table_data?: Record<string, unknown> | null;
}

export interface ChatHistoryInput {
  chat_type: 'creation' | 'explanation';
  messages: ChatMessage[];
}

/**
 * 問題とチャット履歴をSupabaseに保存
 */
export const saveProblem = async (
  problemData: SaveProblemData,
  chatHistories: ChatHistoryInput[]
): Promise<{ success: boolean; problemId?: string; error?: string }> => {
  try {
    // 認証されたユーザーを取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return { success: false, error: '認証が必要です。ログインしてください。' };
    }

    // 問題データを保存
    const { data: problem, error: problemError } = await supabase
      .from('problems')
      .insert([
        {
          user_id: user.id,
          ...problemData,
        },
      ])
      .select()
      .single();

    if (problemError) {
      console.error('Problem save error:', problemError);
      return { success: false, error: `問題の保存に失敗しました: ${problemError.message}` };
    }

    // チャット履歴を保存
    const chatHistoryInserts = chatHistories.map((history) => ({
      problem_id: problem.id,
      user_id: user.id,
      chat_type: history.chat_type,
      messages: history.messages,
    }));

    const { error: chatError } = await supabase
      .from('chat_histories')
      .insert(chatHistoryInserts);

    if (chatError) {
      console.error('Chat history save error:', chatError);
      return {
        success: false,
        error: `チャット履歴の保存に失敗しました: ${chatError.message}`,
      };
    }

    return { success: true, problemId: problem.id };
  } catch (error) {
    console.error('Save problem error:', error);
    const errorMessage = error instanceof Error ? error.message : '予期しないエラーが発生しました';
    return { success: false, error: errorMessage };
  }
};

/**
 * 指定ユーザーの問題一覧を取得（作成日時降順）
 */
export const getProblems = async (
  userId: string
): Promise<{ success: boolean; problems?: Problem[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get problems error:', error);
      return { success: false, error: '問題の取得に失敗しました' };
    }

    return { success: true, problems: data };
  } catch (error) {
    console.error('Get problems error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * 特定の問題を取得
 */
export const getProblemById = async (
  id: string
): Promise<{ success: boolean; problem?: Problem; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get problem by id error:', error);
      return { success: false, error: '問題の取得に失敗しました' };
    }

    return { success: true, problem: data };
  } catch (error) {
    console.error('Get problem by id error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * 指定問題のチャット履歴を取得（creation/explanation両方）
 */
export const getChatHistories = async (
  problemId: string
): Promise<{ success: boolean; chatHistories?: ChatHistory[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('chat_histories')
      .select('*')
      .eq('problem_id', problemId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Get chat histories error:', error);
      return { success: false, error: 'チャット履歴の取得に失敗しました' };
    }

    return { success: true, chatHistories: data };
  } catch (error) {
    console.error('Get chat histories error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * 問題を削除（chat_historiesはCASCADE削除される）
 */
export const deleteProblem = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('problems').delete().eq('id', id);

    if (error) {
      console.error('Delete problem error:', error);
      return { success: false, error: '問題の削除に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete problem error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * 全問題を取得（管理者用）
 */
export const getAllProblems = async (): Promise<{
  success: boolean;
  problems?: Problem[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get all problems error:', error);
      return { success: false, error: '問題の取得に失敗しました' };
    }

    return { success: true, problems: data };
  } catch (error) {
    console.error('Get all problems error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * ユーザーの管理者権限を更新（管理者用）
 */
export const updateUserAdmin = async (
  userId: string,
  isAdmin: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId);

    if (error) {
      console.error('Update user admin error:', error);
      return { success: false, error: '管理者権限の更新に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Update user admin error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * 全ユーザーを取得（管理者用）
 */
export const getAllUsers = async (): Promise<{
  success: boolean;
  users?: Profile[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get all users error:', error);
      return { success: false, error: 'ユーザーの取得に失敗しました' };
    }

    return { success: true, users: data };
  } catch (error) {
    console.error('Get all users error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};
