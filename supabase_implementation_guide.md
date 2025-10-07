# Supabase実装ガイド - Claude Code用指示書

## 実装概要

既存のReact + TypeScript教育アプリケーションにSupabaseを統合し、Google認証とデータ永続化を実装してください。ユーザーは過去に作成した問題と対話履歴を閲覧できますが、編集・継続はできません。

## 必要なパッケージ

```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

## Supabaseプロジェクト設定

### 環境変数（.envに追加）
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### データベーススキーマ

以下のテーブルを作成してください：

#### 1. `profiles` テーブル
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) ポリシー
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

#### 2. `problems` テーブル
```sql
CREATE TABLE problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_text TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  learning_topic TEXT,
  code_with_blanks TEXT,
  choices JSONB,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS ポリシー
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own problems" ON problems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problems" ON problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own problems" ON problems
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all problems" ON problems
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete all problems" ON problems
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

#### 3. `chat_histories` テーブル
```sql
CREATE TABLE chat_histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_type TEXT NOT NULL, -- 'creation' or 'explanation'
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS ポリシー
ALTER TABLE chat_histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat histories" ON chat_histories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat histories" ON chat_histories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat histories" ON chat_histories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

#### 4. トリガー（updated_atの自動更新）
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 実装要件

### 1. Supabaseクライアントの初期化

`src/lib/supabaseClient.ts`を作成：
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2. 型定義の追加

`src/types/database.ts`を作成し、Supabaseテーブルの型を定義してください。

### 3. 認証機能の実装

#### AuthContextの作成（`src/contexts/AuthContext.tsx`）
- `useAuth()`フックを提供
- Google認証の実装
- ユーザー情報（id, email, isAdmin）の管理
- ログイン/ログアウト機能

#### ProtectedRouteコンポーネントの作成
- 未認証ユーザーをログイン画面にリダイレクト

### 4. ページ構成の変更

#### 新規ページ: `LoginPage` (`/login`)
- Google認証ボタンを配置
- `@supabase/auth-ui-react`の`Auth`コンポーネントを使用
- 認証成功後は`/dashboard`にリダイレクト

#### 新規ページ: `DashboardPage` (`/dashboard`)
- ログイン直後のランディングページ
- **ユーザーの問題履歴一覧を表示**:
  - 作成日時（降順）
  - 学習トピック
  - 問題文の冒頭（最初の50文字程度）
- 各問題をクリックすると詳細表示（閲覧専用）
- 「新しい問題を作成する」ボタン → `/`（現HomePage）に遷移

#### 新規ページ: `ProblemDetailPage` (`/problem/:id`)
- **閲覧専用**の問題詳細ページ
- 表示内容:
  - 問題文
  - コード（元のコードと空欄付きコードの両方）
  - 選択肢
  - 解説
  - 作成日時
- **チャット履歴の表示（閲覧のみ）**:
  - 左パネル: 問題作成時のチャット履歴（chat_type: 'creation'）を表示
  - 右パネル: 解説作成時のチャット履歴（chat_type: 'explanation'）を表示
  - **入力フィールドや送信ボタンは配置しない**（完全に読み取り専用）
- 「Dashboardに戻る」ボタン

#### 既存ページの変更: `HomePage` (`/`)
- ProtectedRouteで保護
- localStorageの使用を完全に削除
- ProblemContextは保持（セッション中の一時データ管理用）

#### 既存ページの変更: `QuizCreationPage` (`/quiz-creation`)
- ProtectedRouteで保護
- 「問題作成完了」ボタンで以下をSupabaseに保存:
  - `problems`テーブル: 問題データ全体
  - `chat_histories`テーブル: 
    - HomePageの会話履歴（chat_type: 'creation'）
    - QuizCreationPageの会話履歴（chat_type: 'explanation'）
- **保存成功後は`/dashboard`にリダイレクト**
- ページ離脱時の警告実装（`beforeunload`イベント）

#### 新規ページ: `AdminPage` (`/admin`)
- 管理者のみアクセス可能
- **全ユーザーの問題一覧を表示**:
  - ユーザーメール
  - 作成日時
  - 学習トピック
  - 問題文の冒頭
- 各問題をクリックして詳細閲覧（ProblemDetailPageと同様の閲覧専用ビュー）
- **削除機能**: 各問題に削除ボタンを配置
- **全ユーザーの対話履歴も閲覧可能**: 問題詳細ページでチャット履歴を表示
- **ユーザー管理セクション**:
  - 全ユーザー一覧
  - 管理者権限の付与/剥奪（`profiles.is_admin`の更新）
  - ユーザーの問題数・最終作成日時の表示

### 5. サービス層の変更

#### `src/services/problemService.ts`（新規作成）
以下の関数を実装：
- `saveProblem(problemData, chatHistories)`: 問題と対話履歴を保存
- `getProblems(userId)`: ユーザーの問題一覧を取得
- `getProblemById(id)`: 特定の問題を取得
- `getChatHistories(problemId)`: 特定の問題のチャット履歴を取得
- `deleteProblem(id)`: 問題を削除（関連するchat_historiesも CASCADE削除される）
- `getAllProblems()`: 全問題を取得（管理者用）
- `updateUserAdmin(userId, isAdmin)`: ユーザーの管理者権限を更新（管理者用）

#### 既存サービスの変更
- `chatService.ts`: localStorageの使用を削除、メモリ内で会話を保持
- `explanationChatService.ts`: 同上
- `quizGenerationService.ts`: 変更不要

### 6. ルーティングの更新（`src/App.tsx`）

```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  <Route path="/problem/:id" element={<ProtectedRoute><ProblemDetailPage /></ProtectedRoute>} />
  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  <Route path="/quiz-creation" element={<ProtectedRoute><QuizCreationPage /></ProtectedRoute>} />
  <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
  <Route path="*" element={<Navigate to="/dashboard" />} />
</Routes>
```

### 7. 重要な実装ポイント

#### localStorageの完全削除
以下のlocalStorageキーを全て削除：
- `problemData`
- `conversationHistory`
- `explanationChatHistory`
- `explanationChatMessages`
- `hasSelectedLearningTopic`

#### 保存タイミング
- QuizCreationPageの「問題作成完了」ボタン押下時のみ保存
- 保存前にページを離れようとすると警告表示

#### 閲覧専用の実装
- ProblemDetailPageでは全てのデータを読み取り専用で表示
- チャット履歴は過去のメッセージを表示するのみ
- 入力フィールド、送信ボタン、編集ボタンなどは一切配置しない

#### エラーハンドリング
- Supabaseエラーを適切にキャッチし、ユーザーにわかりやすく表示
- 認証エラー時は自動的にログイン画面にリダイレクト

#### レスポンシブデザイン
- 既存のデザインを踏襲
- DashboardPage、ProblemDetailPage、AdminPageも適切なUIで実装

## 実装手順

1. Supabaseクライアントと型定義を作成
2. AuthContextと認証関連コンポーネントを実装
3. ProtectedRouteとAdminRouteを実装
4. LoginPageを実装
5. problemServiceを実装
6. DashboardPageを実装
7. ProblemDetailPageを実装（閲覧専用、チャット履歴表示のみ）
8. HomePage・QuizCreationPageからlocalStorageを削除し、Supabase連携に変更
9. AdminPageを実装
10. ルーティングを更新
11. 既存のchatService・explanationChatServiceからlocalStorageを削除
12. テスト・デバッグ

## 注意事項

- OpenAI APIキーは引き続き環境変数で管理
- Supabaseの認証設定でGoogleプロバイダーを有効化すること
- RLS（Row Level Security）ポリシーを必ず設定し、セキュリティを確保
- 管理者アカウントは初回のみSupabase Dashboardから手動で`profiles.is_admin = true`を設定
- **問題データの編集機能は実装しない**（新規作成と閲覧・削除のみ）
- **チャット履歴の継続機能は実装しない**（過去のメッセージの閲覧のみ）

## 検証項目

- [ ] Google認証でログイン/ログアウトできる
- [ ] ログインしないとアプリを使用できない
- [ ] 問題作成完了時にSupabaseに保存される
- [ ] Dashboardで自分の問題履歴が表示される
- [ ] 過去の問題を開いて閲覧できる（編集不可）
- [ ] 過去の問題のチャット履歴が表示される（閲覧のみ、入力フィールドなし）
- [ ] ページ離脱時に警告が表示される
- [ ] 管理者アカウントで全ユーザーのデータを閲覧できる
- [ ] 管理者が問題を削除できる
- [ ] 管理者が問題の詳細とチャット履歴を閲覧できる
- [ ] 管理者が他ユーザーに管理者権限を付与できる
- [ ] RLSポリシーが正しく動作し、他ユーザーのデータにアクセスできない
