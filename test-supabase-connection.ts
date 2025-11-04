/**
 * Supabase 接続テストスクリプト
 * 実行方法: npx ts-node test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 設定確認:');
console.log('- URL:', SUPABASE_URL ? '✓ 設定済み' : '✗ 未設定');
console.log('- Anon Key:', SUPABASE_ANON_KEY ? '✓ 設定済み' : '✗ 未設定');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase の環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('\n📡 Supabase 接続テスト中...');
    
    // セッション確認
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session:', session ? '✓ セッション存在' : '✗ セッションなし');
    
    if (sessionError) {
      console.error('Session Error:', sessionError);
    }

    // プロファイルテーブル確認
    console.log('\n📋 テーブル確認:');
    const { data: profiles, error: profileError, count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (profileError) {
      console.error('❌ profiles テーブルエラー:', profileError.message);
    } else {
      console.log(`✓ profiles テーブル: ${profileCount || 0} 件`);
    }

    // 問題テーブル確認
    const { data: problems, error: problemError, count: problemCount } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true });
    
    if (problemError) {
      console.error('❌ problems テーブルエラー:', problemError.message);
    } else {
      console.log(`✓ problems テーブル: ${problemCount || 0} 件`);
    }

    // コメントテーブル確認
    const { data: comments, error: commentError, count: commentCount } = await supabase
      .from('problem_comments')
      .select('*', { count: 'exact', head: true });
    
    if (commentError) {
      console.error('❌ problem_comments テーブルエラー:', commentError.message);
    } else {
      console.log(`✓ problem_comments テーブル: ${commentCount || 0} 件`);
    }

    console.log('\n✅ Supabase 接続テスト完了');
  } catch (error) {
    console.error('❌ 予期しないエラー:', error);
    process.exit(1);
  }
}

testConnection().then(() => process.exit(0));
