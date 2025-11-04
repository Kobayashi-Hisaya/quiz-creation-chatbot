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
  modified_explanation?: string | null; // 修正後の解説
  title: string | null;
  predicted_accuracy?: number | null;
  predicted_answerTime?: number | null;
  // データ整理問題用フィールド
  spreadsheet_url?: string | null;
  spreadsheet_id?: string | null;
  problem_category?: string;
  session_id?: string | null;
  table_data?: Record<string, unknown> | null;
  // 診断用スプレッドシート
  assessment_spreadsheet_id?: string | null;
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
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      user = authUser;
      console.log('[problemService] 認証結果:', { user: user?.id, email: user?.email, authError });
      
      if (authError || !user) {
        console.error('[problemService] Authentication error:', authError);
        return { success: false, error: '認証が必要です。ログインしてください。' };
      }
    }

    // Supabase設定確認（デバッグ用）
    console.log('[problemService] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing');
    console.log('[problemService] Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing');

    // 問題データを保存
    console.log('[problemService] 問題データ保存開始');
    const insertData = {
      user_id: user.id,
      ...problemData,
    };
    console.log('[problemService] 挿入データ:', insertData);

    let problem: Problem | null = null;
    let problemError: any = null;
    try {
      console.log('[problemService] Supabase insert 開始', new Date().toISOString());
      
      // タイムアウトなしで直接実行（Supabaseのデフォルトタイムアウトに任せる）
      const insertResult = await supabase
        .from('problems')
        .insert([insertData])
        .select()
        .single();
      
      problem = insertResult.data;
      problemError = insertResult.error;
      console.log('[problemService] Supabase insert 完了', new Date().toISOString());
      console.log('[problemService] Insert結果:', { 
        hasData: !!problem, 
        hasError: !!problemError,
        errorCode: problemError?.code,
        errorMessage: problemError?.message 
      });
    } catch (error) {
      console.error('[problemService] Supabase insert 例外エラー:', error);
      console.error('[problemService] エラー詳細:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      problemError = error;
      problem = null;
    }

    console.log('[problemService] 問題保存結果:', { problem, problemError });

    if (problemError || !problem) {
      console.error('[problemService] Problem save error:', problemError);
      return { success: false, error: `問題の保存に失敗しました: ${problemError instanceof Error ? problemError.message : JSON.stringify(problemError)}` };
    }


    // チャット履歴を保存
    console.log('[problemService] チャット履歴保存開始');
    const chatHistoryInserts = chatHistories.map((history) => ({
      problem_id: problem.id,
      user_id: user.id,
      chat_type: history.chat_type,
      messages: history.messages,
    }));

    console.log('[problemService] チャット履歴挿入データ件数:', chatHistoryInserts.length);
    console.log('[problemService] チャット履歴サイズ概算:', JSON.stringify(chatHistoryInserts).length, 'bytes');

    let chatError: any = null;
    try {
      console.log('[problemService] チャット履歴 insert 開始', new Date().toISOString());
      
      // タイムアウトなしで直接実行
      const chatResult = await supabase
        .from('chat_histories')
        .insert(chatHistoryInserts);
      
      chatError = chatResult.error;
      console.log('[problemService] チャット履歴 insert 完了', new Date().toISOString());
    } catch (error) {
      console.error('[problemService] チャット履歴挿入例外エラー:', error);
      console.error('[problemService] エラー詳細:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      chatError = error;
    }

    console.log('[problemService] チャット履歴保存結果:', { 
      hasError: !!chatError,
      errorCode: chatError?.code,
      errorMessage: chatError?.message 
    });

    if (chatError) {
      console.error('[problemService] Chat history save error:', chatError);
      return {
        success: false,
        error: `チャット履歴の保存に失敗しました: ${chatError instanceof Error ? chatError.message : String(chatError)}`,
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
    console.log('[problemService] getProblems 開始:', { userId });
    
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('[problemService] getProblems Supabase レスポンス:', {
      hasData: !!data,
      dataLength: data?.length,
      hasError: !!error,
      errorCode: error?.code,
      errorMessage: error?.message
    });

    if (error) {
      console.error('[problemService] Get problems error:', error);
      return { success: false, error: '問題の取得に失敗しました' };
    }

    console.log('[problemService] getProblems 成功:', data?.length || 0, '件');
    return { success: true, problems: data };
  } catch (error) {
    console.error('[problemService] Get problems 例外:', error);
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
      .order('updated_at', { ascending: false });

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
 * 全問題を作成者情報付きで取得（BBS用）
 */
export const getAllProblemsWithAuthor = async (): Promise<{
  success: boolean;
  problems?: (Problem & { author_email?: string })[];
  error?: string;
}> => {
  try {
    // 全問題を取得
    const { data: problems, error: problemsError } = await supabase
      .from('problems')
      .select('*')
      .order('updated_at', { ascending: false });

    if (problemsError) {
      console.error('Get all problems error:', problemsError);
      return { success: false, error: '問題の取得に失敗しました' };
    }

    // 全プロフィールを取得
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email');

    if (profilesError) {
      console.error('Get profiles error:', profilesError);
      // プロフィール取得失敗でも問題は返す（author_emailなし）
      return { success: true, problems: problems || [] };
    }

    // プロフィールマップを作成
    const profileMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile.email;
      return acc;
    }, {} as Record<string, string>);

    // 問題にメールアドレスを追加
    const problemsWithAuthor = (problems || []).map((problem) => ({
      ...problem,
      author_email: profileMap[problem.user_id] || undefined,
    }));

    return { success: true, problems: problemsWithAuthor };
  } catch (error) {
    console.error('Get all problems with author error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * グループに属するユーザの問題のみを取得（グループBBS用）
 */
export const getProblemsInGroup = async (
  userId: string
): Promise<{
  success: boolean;
  problems?: (Problem & { author_name?: string })[];
  groupId?: string;
  error?: string;
}> => {
  try {
    // ユーザーのグループIDを取得
    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('group_id')
      .eq('id', userId)
      .single();

    if (userProfileError) {
      console.error('Get user profile error:', userProfileError);
      return { success: false, error: 'ユーザーのグループ情報を取得できません' };
    }

    const groupId = userProfile?.group_id;

    if (!groupId) {
      console.warn('User has no group assigned:', userId);
      return { success: true, problems: [] };
    }

    // 同じグループのユーザーを取得（student_nameを含む）
    const { data: groupUsers, error: groupUsersError } = await supabase
      .from('profiles')
      .select('id, student_name')
      .eq('group_id', groupId);

    if (groupUsersError) {
      console.error('Get group users error:', groupUsersError);
      return { success: false, error: 'グループユーザーの取得に失敗しました' };
    }

    const userIds = (groupUsers || []).map((u) => u.id);

    if (userIds.length === 0) {
      return { success: true, problems: [] };
    }

    // グループユーザーが作成した問題を取得
    const { data: problems, error: problemsError } = await supabase
      .from('problems')
      .select('*')
      .in('user_id', userIds)
      .order('updated_at', { ascending: false });

    if (problemsError) {
      console.error('Get problems error:', problemsError);
      return { success: false, error: '問題の取得に失敗しました' };
    }

    // プロフィールマップを作成（student_name用）
    const profileMap = (groupUsers || []).reduce((acc, profile) => {
      acc[profile.id] = profile.student_name;
      return acc;
    }, {} as Record<string, string>);

    // 問題に学生名を追加
    const problemsWithAuthor = (problems || []).map((problem) => ({
      ...problem,
      author_name: profileMap[problem.user_id] || undefined,
    }));

    return { success: true, problems: problemsWithAuthor, groupId };
  } catch (error) {
    console.error('Get problems in group error:', error);
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

/**
 * 問題にコメントを追加
 */
export const addCommentToProblem = async (
  problemId: string,
  userId: string,
  content: string
): Promise<{ success: boolean; commentId?: string; error?: string }> => {
  try {
    console.log('[problemService] addCommentToProblem 開始:', {
      problemId,
      userId,
      contentLength: content.length
    });

    const { data, error } = await supabase
      .from('problem_comments')
      .insert([{ problem_id: problemId, user_id: userId, content }])
      .select()
      .single();

    console.log('[problemService] addCommentToProblem 結果:', { data, error });

    if (error) {
      console.error('[problemService] Add comment error:', error);
      return {
        success: false,
        error: `コメント追加エラー: ${error.message || JSON.stringify(error)}`
      };
    }

    return { success: true, commentId: data?.id };
  } catch (error) {
    console.error('[problemService] Add comment exception:', error);
    return {
      success: false,
      error: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown'}`
    };
  }
};

/**
 * 問題のコメント一覧を取得（作成者情報付き）
 */
export const getProblemComments = async (
  problemId: string
): Promise<{
  success: boolean;
  comments?: (any & { user_email?: string })[];
  error?: string;
}> => {
  try {
    // コメントを取得
    const { data: comments, error: commentsError } = await supabase
      .from('problem_comments')
      .select('*')
      .eq('problem_id', problemId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Get comments error:', commentsError);
      return { success: false, error: 'コメントの取得に失敗しました' };
    }

    // ユーザー情報を取得
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email');

    if (profilesError) {
      // プロフィール取得失敗でもコメントは返す
      return { success: true, comments: comments || [] };
    }

    // プロフィールマップを作成
    const profileMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile.email;
      return acc;
    }, {} as Record<string, string>);

    // コメントにメールアドレスを追加
    const commentsWithUser = (comments || []).map((comment) => ({
      ...comment,
      user_email: profileMap[comment.user_id] || '不明',
    }));

    return { success: true, comments: commentsWithUser };
  } catch (error) {
    console.error('Get problem comments error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * コメントを削除
 */
export const deleteComment = async (
  commentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('problem_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Delete comment error:', error);
      return { success: false, error: 'コメントの削除に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
};

/**
 * コメントを編集
 */
export const updateComment = async (
  commentId: string,
  content: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('[problemService] updateComment 開始:', {
      commentId,
      contentLength: content.length,
      content: content.substring(0, 50) + '...'
    });

    const updateData = {
      content,
      updated_at: new Date().toISOString(),
      is_edited: true
    };

    console.log('[problemService] 更新データ:', updateData);

    const { data, error } = await supabase
      .from('problem_comments')
      .update(updateData)
      .eq('id', commentId)
      .select();

    console.log('[problemService] updateComment API 結果:', { data, error });

    if (error) {
      console.error('[problemService] Update comment error:', error);
      return { success: false, error: `コメント編集エラー: ${error.message}` };
    }

    console.log('[problemService] updateComment 成功:', data);
    return { success: true };
  } catch (error) {
    console.error('[problemService] Update comment exception:', error);
    return { success: false, error: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown'}` };
  }
};

/**
 * 複数の問題のコメント数を取得
 */
export const getProblemsCommentCounts = async (
  problemIds: string[]
): Promise<Record<string, number>> => {
  try {
    if (problemIds.length === 0) {
      return {};
    }

    const { data: comments, error } = await supabase
      .from('problem_comments')
      .select('problem_id')
      .in('problem_id', problemIds);

    if (error) {
      console.error('Get comment counts error:', error);
      return {};
    }

    // コメント数をカウント
    const counts: Record<string, number> = {};
    problemIds.forEach(id => {
      counts[id] = 0;
    });

    (comments || []).forEach((comment) => {
      counts[comment.problem_id]++;
    });

    return counts;
  } catch (error) {
    console.error('Get comment counts exception:', error);
    return {};
  }
};
