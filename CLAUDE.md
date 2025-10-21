# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js + TypeScript educational application for creating programming quiz questions. The app uses LangChain and OpenAI GPT-4 to help educators create fill-in-the-blank code problems with multiple choice answers. The application includes Supabase integration for authentication and data persistence.
将来的にはVercelによりデプロイする予定

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

Create a `.env.local` file with the following environment variables:
```
# OpenAI API Key (server-side use)
OPENAI_API_KEY="YOUR_OPENAI_KEY"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="YOUR_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

## Architecture

### Next.js App Router Structure

The application uses Next.js 15 with App Router architecture. Pages are located in the `app/` directory:

1. **Root Page** (`app/page.tsx`) - Authentication router
   - Redirects to `/dashboard` if authenticated, `/login` if not

2. **LoginPage** (`app/login/page.tsx`) - Google authentication
   - Uses Supabase Auth UI for Google login
   - Redirects to `/dashboard` after successful login

3. **DashboardPage** (`app/dashboard/page.tsx`) - User's problem list
   - Shows user's created problems with preview
   - "Create New Problem" button navigates to `/create-mcq`
   - Click on problem navigates to `/problem/:id`

4. **Create MCQ Page** (`app/create-mcq/page.tsx`) - Problem creation interface
   - Left panel: ChatContainer for AI-guided problem creation
   - Right panel: RightPanel with ProblemDisplay and CodeEditor
   - Uses `chatService` for conversational problem creation

5. **Create Quiz Page** (`app/create-quiz/page.tsx`) - Quiz generation interface
   - Two modes: Auto-generation and Manual creation
   - Auto mode: Uses `quizGenerationService` for fill-in-the-blank generation
   - Manual mode: Manual editing with `___BLANK___` markers
   - Side panel: ExplanationChatContainer with `explanationChatService`

6. **Problem Detail Page** (`app/problem/[id]/page.tsx`) - View saved problems
   - Read-only view of completed problems
   - Displays chat histories (creation and explanation)
   - No editing capabilities

### API Routes

Server-side API endpoints in `app/api/`:
- Chat endpoints for OpenAI integration
- Handles server-side OpenAI API calls

### State Management

- **AuthContext** (`src/contexts/AuthContext.tsx`): Manages user authentication state via Supabase
  - Provides `useAuth()` hook for user info (id, email, isAdmin)
  - Handles Google authentication flow
- **ProblemContext** (`src/contexts/ProblemContext.tsx`): Global state for problem creation session
  - Manages problem data during creation flow
  - In-memory state during session, persisted to Supabase on completion
  - Accessed via `useProblem()` hook

### Key Services

- **chatService** ([src/services/chatService.ts](src/services/chatService.ts)): Conversational AI for guiding problem creation. Uses GPT-4 with guided prompts. Maintains conversation history in memory during session.

- **quizGenerationService** ([src/services/quizGenerationService.ts](src/services/quizGenerationService.ts)): Auto-generates quiz questions from problem text and code. Uses GPT-4o with structured prompts to create fill-in-the-blank questions with 4 choices (A is always correct). Returns JSON with `codeWithBlanks`, `choices`, etc.

- **explanationChatService** ([src/services/explanationChatService.ts](src/services/explanationChatService.ts)): Assists educators in writing explanations for quiz questions. Separate chat instance for explanation help.

- **problemService** ([src/services/problemService.ts](src/services/problemService.ts)): Handles all Supabase operations for problems and chat histories. Includes `saveProblem()`, `getProblems()`, `getProblemById()`, `getChatHistories()`, `deleteProblem()`, and admin functions.

All AI services use LangChain's ChatOpenAI wrapper with server-side API calls. Chat histories are maintained in memory during sessions and persisted to Supabase on completion.

### Monaco Editor Integration

The QuizCreationPage uses Monaco Editor via `@monaco-editor/react`:
- In manual mode, highlights `___BLANK___` markers with custom CSS decorations
- Uses refs (`editorRef`, `monacoRef`, `decorationsRef`) to manage decorations
- Updates highlights on content change via `updateHighlights()`

### Important Data Flow

1. User logs in with Google → redirected to `/dashboard`
2. User clicks "Create New Problem" → navigate to `/create-mcq`
3. User creates problem via chat → stored in ProblemContext (in-memory)
4. Navigate to `/create-quiz` → problem data loaded from context
5. Auto mode: problem + code sent to `quizGenerationService` → returns quiz with blanks and choices
6. Manual mode: user edits problem text, code (with `___BLANK___`), and inputs choices manually
7. Both modes: user can consult ExplanationChatContainer for help writing explanations
8. User clicks "Complete Problem" → saves everything to Supabase:
   - Problem data → `problems` table
   - Chat histories → `chat_histories` table (both creation and explanation)
9. Redirect to `/dashboard`

### Type Definitions

- **chat.ts** ([src/types/chat.ts](src/types/chat.ts)): Message types for chat UI (role, content, timestamp)
- **quiz.ts** ([src/types/quiz.ts](src/types/quiz.ts)): Quiz question structure, choices, blank spots, auto-generation request/response
- **database.ts** ([src/types/database.ts](src/types/database.ts)): Supabase table types (Profile, Problem, ChatHistory, ChatMessage)

## Key Patterns

- All AI services follow singleton pattern (e.g., `export const chatService = new ChatService()`)
- Fill-in-the-blank marker: `___BLANK___` (exactly 3 underscores, BLANK, 3 underscores)
- Learning topics: 制御構造 (control structures), クラス (classes), or custom strings
- Protected routes: `ProtectedRoute` redirects unauthenticated users to `/login`
- Admin routes: `AdminRoute` redirects non-admin users to `/dashboard`
- Server-side API calls: All OpenAI requests go through Next.js API routes to keep API keys secure

## Supabase Integration

This application uses Supabase for authentication and data persistence. All user data is stored in Supabase.

### Authentication Flow

- **Login required**: Users must authenticate with email/password before using the app
- **AuthContext** provides authentication state management
- **Email Authentication**: Uses Supabase Auth with email/password
- **User Management**: Administrators create user accounts in Supabase dashboard

### Database Schema

#### Tables
1. **profiles**: User profiles with admin flags (`id`, `email`, `is_admin`, `created_at`)
2. **problems**: User-created problems with all quiz data (`id`, `user_id`, `problem_text`, `code`, `code_with_blanks`, `choices`, `explanation`, etc.)
3. **chat_histories**: Conversation histories (`id`, `problem_id`, `user_id`, `chat_type`, `messages`, `created_at`)

All tables use Row Level Security (RLS) policies:
- Users can only view and create their own data
- Users can delete their own problems
- Admins can view all data and delete any problem
- Admins can update user profiles (admin flag)

### Important Data Persistence

- **Save timing**: Data is only persisted to Supabase when "Complete Problem" button is clicked
- **Session state**: Problem creation data is held in memory during the session
- **Unsaved data warning**: `beforeunload` event listener warns user if leaving without saving
- **Read-only viewing**: Past problems and chat histories are view-only; no editing or chat continuation
- **Data immutability**: Once saved, problems and chat histories cannot be modified

### Monaco Editor Integration

The Create Quiz page uses Monaco Editor via `@monaco-editor/react`:
- In manual mode, highlights `___BLANK___` markers with custom CSS decorations
- Uses refs (`editorRef`, `monacoRef`, `decorationsRef`) to manage decorations
- Updates highlights on content change via `updateHighlights()`

## Known Issues (from README.md)

- タブを変更して戻ってくると画面表示が切り替わってしまう (Display switches when changing tabs and returning)
- システムプロンプトが履歴に表示されてしまう (System prompts appear in chat history)

## Future TODOs (from README.md)

- ユーザーID,PWでの簡単な認証へ変更 (Change to simple ID/password authentication)
- グループ分けして、同グループの学生が登録した問題は確認・コメントできるようにする (Group functionality for students to review/comment on problems)
- プロンプトの洗練 (Prompt refinement)