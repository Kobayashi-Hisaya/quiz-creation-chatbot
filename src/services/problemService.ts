import { supabase } from '@/lib/supabaseClient';
import type { Problem, ChatHistory, Profile, ChatMessage } from '@/types/database';
import type { QuizChoice } from '@/types/quiz';
import type { User } from '@supabase/supabase-js';

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
  chat_type: 'creation' | 'explanation' | 'review';
  messages: ChatMessage[];
}

/**
 * 問題とチャット履歴をSupabaseに保存
 */
export const saveProblem = async (
  problemData: SaveProblemData,
  chatHistories: ChatHistoryInput[],
  userInfo?: { id: string; email?: string }
): Promise<{ success: boolean; problemId?: string; error?: string }> => {
  try {
    console.log('[problemService] saveProblem 開始');
    console.log('[problemService] problemData:', problemData);
    console.log('[problemService] chatHistories:', chatHistories);
    console.log('[problemService] userInfo:', userInfo);

    let user;
    
    // 事前に渡されたユーザー情報を使用する場合
    if (userInfo && userInfo.id) {
      console.log('[problemService] 事前認証情報を使用');
      user = { id: userInfo.id, email: userInfo.email };
    } else {
      // 認証されたユーザーを取得
      console.log('[problemService] 認証チェック開始');
      
      let authError;
      try {
        console.log('[problemService] supabase.auth.getUser() 呼び出し開始');
        const authResult = await Promise.race([
          supabase.auth.getUser(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('認証チェックがタイムアウトしました')), 10000))
        ]) as { data: { user: User | null }, error: Error | null };
        
        user = authResult.data.user;
        authError = authResult.error;
        console.log('[problemService] 認証チェック完了');
      } catch (error) {
        console.error('[problemService] 認証チェック中にエラー:', error);
        authError = error;
        user = null;
      }
      
      console.log('[problemService] 認証結果:', { user: user?.id, email: user?.email, authError });
      
      if (authError || !user) {
        console.error('[problemService] Authentication error:', authError);
        return { success: false, error: '認証が必要です。ログインしてください。' };
      }
    }

    // Supabase設定とクライアント状態を確認
    console.log('[problemService] Supabase設定確認');
    console.log('[problemService] supabaseUrl:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[problemService] supabaseAnonKey:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定');
    console.log('[problemService] supabaseクライアント:', supabase);

    // 段階的接続テスト
    console.log('[problemService] 段階的接続テスト開始');
    
    // 1. 基本的な接続テスト
    try {
      console.log('[problemService] ステップ1: 基本接続テスト');
      const basicTest = await Promise.race([
        supabase.from('problems').select('count'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('基本接続タイムアウト')), 5000))
      ]) as { data: { count: number }[] | null, error: Error | null };
      
      console.log('[problemService] 基本接続テスト結果:', basicTest);
    } catch (basicError) {
      console.error('[problemService] 基本接続失敗:', basicError);
    }
    
    // 2. 認証付きテスト
    try {
      console.log('[problemService] ステップ2: 認証付きテスト');
      const authTest = await Promise.race([
        supabase.from('problems').select('id').eq('user_id', user.id).limit(1),
        new Promise((_, reject) => setTimeout(() => reject(new Error('認証付きテストタイムアウト')), 8000))
      ]) as { data: { id: string }[] | null, error: Error | null };
      
      console.log('[problemService] 認証付きテスト結果:', authTest);
      
      if (authTest.error) {
        console.error('[problemService] 認証付きテストエラー:', authTest.error);
        
        // RLSポリシーエラーの可能性をチェック
        if (authTest.error.message?.includes('policy') || authTest.error.message?.includes('permission')) {
          return { 
            success: false, 
            error: `アクセス権限エラー: ${authTest.error.message}. RLSポリシーを確認してください。` 
          };
        }
        
        return { 
          success: false, 
          error: `データベースエラー: ${authTest.error.message || authTest.error}` 
        };
      }
      
      console.log('[problemService] 接続テスト成功');
    } catch (error) {
      console.error('[problemService] 認証付きテストエラー:', error);
      
      // 最後の手段として直接APIコールを試す
      console.log('[problemService] 直接APIコール試行');
      try {
        const directApiCall = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/problems?select=id&limit=1`, {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('[problemService] 直接APIコール結果:', directApiCall.status, await directApiCall.text());
        
        if (!directApiCall.ok) {
          return { success: false, error: `API直接呼び出しエラー: ${directApiCall.status}` };
        }
      } catch (apiError) {
        console.error('[problemService] 直接APIコールエラー:', apiError);
        return { success: false, error: 'すべての接続方法が失敗しました。ネットワークまたはSupabase設定を確認してください。' };
      }
    }

    // セッションを明示的にリフレッシュ（Phase 2: タブ切り替え対策）
    console.log('[problemService] セッションリフレッシュ開始');
    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.warn('[problemService] セッションリフレッシュ警告:', refreshError);
        // リフレッシュ失敗は警告のみで続行（既存セッションが有効な可能性）
      } else {
        console.log('[problemService] セッションリフレッシュ成功');
      }
    } catch (refreshErr) {
      console.warn('[problemService] セッションリフレッシュ例外:', refreshErr);
      // リフレッシュ失敗は警告のみで続行
    }

    // 問題データを保存
    console.log('[problemService] 問題データ保存開始');
    const insertData = {
      user_id: user.id,
      ...problemData,
    };
    console.log('[problemService] 挿入データ:', insertData);

    // Phase 3: リトライロジック付きでデータベース挿入
    let problem, problemError;
    let retryCount = 0;
    const maxRetries = 1; // 1回だけリトライ

    while (retryCount <= maxRetries) {
      try {
        if (retryCount > 0) {
          console.log(`[problemService] リトライ ${retryCount}/${maxRetries}`);
          // リトライ前にセッションを再度リフレッシュ
          console.log('[problemService] リトライ前のセッションリフレッシュ');
          await supabase.auth.refreshSession();
          // 少し待機してから再試行
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('[problemService] Supabase insert 開始');
        const insertResult = await Promise.race([
          supabase
            .from('problems')
            .insert([insertData])
            .select()
            .single(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('データベース挿入がタイムアウトしました')), 20000)) // 15秒→20秒に延長
        ]) as { data: Problem | null, error: Error | null };

        problem = insertResult.data;
        problemError = insertResult.error;
        console.log('[problemService] Supabase insert 完了');

        // 成功したらループを抜ける
        if (!problemError && problem) {
          break;
        }

        // エラーがある場合、リトライするかチェック
        if (problemError) {
          console.error(`[problemService] 試行 ${retryCount + 1} でエラー:`, problemError);
          if (retryCount < maxRetries) {
            retryCount++;
            continue;
          }
        }

        break;
      } catch (error) {
        console.error(`[problemService] 試行 ${retryCount + 1} で例外:`, error);
        problemError = error;
        problem = null;

        if (retryCount < maxRetries) {
          retryCount++;
          continue;
        }

        break;
      }
    }

    console.log('[problemService] 問題保存結果:', { problem, problemError, retryCount });

    if (problemError || !problem) {
      console.error('[problemService] Problem save error:', problemError);
      return { success: false, error: `問題の保存に失敗しました（${retryCount + 1}回試行）: ${problemError instanceof Error ? problemError.message : JSON.stringify(problemError)}` };
    }

    // チャット履歴を保存
    console.log('[problemService] チャット履歴保存開始');
    const chatHistoryInserts = chatHistories.map((history) => ({
      problem_id: problem.id,
      user_id: user.id,
      chat_type: history.chat_type,
      messages: history.messages,
    }));

    console.log('[problemService] チャット履歴挿入データ:', chatHistoryInserts);

    const { error: chatError } = await supabase
      .from('chat_histories')
      .insert(chatHistoryInserts);

    console.log('[problemService] チャット履歴保存結果:', { chatError });

    if (chatError) {
      console.error('[problemService] Chat history save error:', chatError);
      return {
        success: false,
        error: `チャット履歴の保存に失敗しました: ${chatError.message}`,
      };
    }

    console.log('[problemService] 保存処理完了:', { problemId: problem.id });
    return { success: true, problemId: problem.id };
  } catch (error) {
    console.error('[problemService] Save problem error:', error);
    console.error('[problemService] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
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
