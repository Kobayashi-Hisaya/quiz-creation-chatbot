# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a React + TypeScript educational application for creating programming quiz questions. The app uses LangChain and OpenAI GPT-4 to help educators create fill-in-the-blank code problems with multiple choice answers.
将来的にはVercelによりデプロイする予定

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
tsc -b && vite build

# Lint code
eslint .

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env` file from `.env.example` and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_actual_api_key_here
```

## Architecture

### Two-Page Application

1. **HomePage** (`/`) - Problem creation interface
   - Left panel: ChatContainer for dialoguing with AI to create problems
   - Right panel: RightPanel showing ProblemDisplay (problem text) and CodeEditor (code editor)
   - Uses `chatService` to guide users through creating programming problems

2. **QuizCreationPage** (`/quiz-creation`) - Quiz question generation interface
   - Two modes: Auto-generation and Manual creation
   - Auto mode: Uses `quizGenerationService` to automatically generate fill-in-the-blank questions with multiple choice options
   - Manual mode: Educator manually edits problem text, code (using `___BLANK___` markers), and choices
   - Side panel: ExplanationChatContainer for getting help writing explanations using `explanationChatService`

### State Management

- **ProblemContext**: Global state provider that manages problem data (problem text, code, language, learning topic)
- Persists to localStorage as `problemData`
- Accessed via `useProblem()` hook

### Key Services

- **chatService** ([src/services/chatService.ts](src/services/chatService.ts)): Conversational AI for guiding problem creation on HomePage. Uses GPT-4 with hardcoded example dialogue. Maintains conversation history in localStorage.

- **quizGenerationService** ([src/services/quizGenerationService.ts](src/services/quizGenerationService.ts)): Auto-generates quiz questions from problem text and code. Uses GPT-4o with structured prompts to create fill-in-the-blank questions with 4 choices (A is always correct). Returns JSON with `codeWithBlanks`, `choices`, etc.

- **explanationChatService** ([src/services/explanationChatService.ts](src/services/explanationChatService.ts)): Assists educators in writing explanations for quiz questions. Separate chat instance on QuizCreationPage.

All services use LangChain's ChatOpenAI wrapper and persist conversation history to localStorage.

### Monaco Editor Integration

The QuizCreationPage uses Monaco Editor via `@monaco-editor/react`:
- In manual mode, highlights `___BLANK___` markers with custom CSS decorations
- Uses refs (`editorRef`, `monacoRef`, `decorationsRef`) to manage decorations
- Updates highlights on content change via `updateHighlights()`

### Important Data Flow

1. User creates problem on HomePage → stored in ProblemContext
2. Navigate to QuizCreationPage → problem data loaded from context
3. Auto mode: problem + code sent to `quizGenerationService` → returns quiz with blanks and choices
4. Manual mode: user edits problem text, code (with `___BLANK___`), and inputs choices manually
5. Both modes: user can consult ExplanationChatContainer for help writing explanations

### Type Definitions

- **chat.ts**: Message types for chat UI (role, content, timestamp)
- **quiz.ts**: Quiz question structure, choices, blank spots, auto-generation request/response

## Key Patterns

- All AI services follow singleton pattern (e.g., `export const chatService = new ChatService()`)
- localStorage keys: `problemData`, `conversationHistory`, `explanationChatHistory`, `explanationChatMessages`, `hasSelectedLearningTopic`
- Fill-in-the-blank marker: `___BLANK___` (exactly 3 underscores, BLANK, 3 underscores)
- Learning topics: 制御構造 (control structures), クラス (classes), or custom strings

## Planned: Supabase Integration (Not Yet Implemented)
<!-- 
以下はSupabase統合の計画です。現在未実装ですが、
実装時の参考として残しています。

This section describes the planned Supabase integration.
Not yet implemented - keep for reference during implementation.
-->

This application uses Supabase for authentication and data persistence. All user data is stored in Supabase, and localStorage is not used.

### Environment Variables

Add these to `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Authentication Flow

- **Login required**: Users must authenticate with Google before using the app
- **No localStorage**: All data is persisted to Supabase, localStorage is not used
- **AuthContext** (`src/contexts/AuthContext.tsx`): Provides `useAuth()` hook for accessing user info (id, email, isAdmin)

### Database Schema

#### Tables
1. **profiles**: User profiles with admin flags
2. **problems**: User-created problems (problem_text, code, code_with_blanks, choices, explanation, etc.)
3. **chat_histories**: Conversation histories for both creation and explanation chats

All tables use Row Level Security (RLS) policies:
- Users can only view and create their own data
- Users can delete their own problems
- Admins can view all data and delete any problem
- Admins can update user profiles (admin flag)

### Page Structure (Updated)

1. **LoginPage** (`/login`) - Google authentication
   - Redirects to `/dashboard` after successful login

2. **DashboardPage** (`/dashboard`) - Landing page after login
   - Lists user's problem history (date, topic, problem preview)
   - "Create New Problem" button → navigates to HomePage
   - Click on problem → navigate to ProblemDetailPage

3. **ProblemDetailPage** (`/problem/:id`) - View saved problem (protected, read-only)
   - Displays problem details: problem text, code, code with blanks, choices, explanation, created date
   - **Chat history viewer (read-only)**:
     - Left panel: Creation chat history (chat_type: 'creation')
     - Right panel: Explanation chat history (chat_type: 'explanation')
     - **No input fields or send buttons** - history is displayed for reference only
   - Read-only (no editing of problem data or chat continuation)
   - "Back to Dashboard" button

4. **HomePage** (`/`) - Problem creation (protected)
   - Same as before but without localStorage
   - Uses in-memory state during session

5. **QuizCreationPage** (`/quiz-creation`) - Quiz generation (protected)
   - "Complete Problem" button saves to Supabase:
     - Problem data to `problems` table
     - Chat histories to `chat_histories` table (both creation and explanation chats)
   - Redirects to `/dashboard` after successful save
   - Warning dialog if user tries to leave without saving

6. **AdminPage** (`/admin`) - Admin dashboard (admin only)
   - View all users' problems and chat histories
   - Delete any problem (read-only viewing, no editing)
   - User management: view users, toggle admin privileges

### Services (Updated)

#### problemService ([src/services/problemService.ts](src/services/problemService.ts))
New service for Supabase operations:
- `saveProblem()`: Save problem + chat histories
- `getProblems()`: Fetch user's problems
- `getProblemById()`: Fetch specific problem
- `getChatHistories()`: Fetch chat histories for a problem
- `deleteProblem()`: Delete problem (cascades to chat_histories)
- `getAllProblems()`: Fetch all problems (admin only)
- `updateUserAdmin()`: Update user admin status (admin only)

#### chatService & explanationChatService
- No longer use localStorage
- Maintain conversation history in memory during session
- History is persisted to Supabase only on "Complete Problem"

### Data Flow (Updated)

1. User logs in with Google → redirected to `/dashboard`
2. User clicks "Create New Problem" → navigate to HomePage (`/`)
3. User creates problem on HomePage → stored in ProblemContext (in-memory)
4. Navigate to QuizCreationPage (`/quiz-creation`) → problem data loaded from context
5. User generates/edits quiz questions
6. User clicks "Complete Problem" → saves everything to Supabase:
   - Problem data → `problems` table
   - HomePage chat history → `chat_histories` (type: 'creation')
   - QuizCreationPage chat history → `chat_histories` (type: 'explanation')
7. Redirect to `/dashboard`
8. User clicks on a problem in Dashboard → navigate to ProblemDetailPage (`/problem/:id`)
9. ProblemDetailPage loads problem + chat histories from Supabase (display only, no editing or continuation)

### Important Notes

- **Save timing**: Only on "Complete Problem" button click
- **Unsaved data warning**: `beforeunload` event listener warns user if leaving without saving
- **Read-only viewing**: Past problems and chat histories are view-only; no editing or chat continuation
- **Data immutability**: Once saved, problems and chat histories cannot be modified
- **Admin setup**: First admin must be set manually in Supabase Dashboard (`profiles.is_admin = true`)
- **RLS policies**: Ensure proper Row Level Security for data protection

### Protected Routes

- `ProtectedRoute`: Redirects unauthenticated users to `/login`
- `AdminRoute`: Redirects non-admin users to `/dashboard`

### Type Definitions (Updated)

- **database.ts**: Supabase table types (Profile, Problem, ChatHistory)
- **auth.ts**: User type with admin flag

### localStorage Migration

All localStorage usage has been removed:
- ~~`problemData`~~ → Supabase `problems` table
- ~~`conversationHistory`~~ → Supabase `chat_histories` (type: 'creation')
- ~~`explanationChatHistory`~~ → Supabase `chat_histories` (type: 'explanation')
- ~~`explanationChatMessages`~~ → Removed
- ~~`hasSelectedLearningTopic`~~ → Session state only

### Features NOT Implemented

- **Problem editing**: Users cannot edit problems after creation
- **Chat continuation**: Users cannot continue conversations from saved problems
- **Problem updates**: The `problems` table has no UPDATE policy (immutable after creation)
- **Chat updates**: The `chat_histories` table has no UPDATE policy (immutable after creation)