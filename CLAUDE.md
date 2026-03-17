a# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, Claude generates the code, and it renders live in a sandboxed iframe — all without writing files to disk.

## Commands

```bash
npm run setup        # First-time setup: install deps, prisma generate, run migrations
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest
npm run db:reset     # Reset SQLite database
```

Running a single test:
```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture

The app is a Next.js 15 App Router project with a 3-panel UI: chat, code editor, preview.

### Data Flow

1. User types a prompt → `ChatProvider` sends it to `/api/chat`
2. `/api/chat` streams a response from Claude (via `@ai-sdk/anthropic`) with two custom tools:
   - `str_replace_editor` — creates or edits files via string replacement
   - `file_manager` — renames or deletes files/directories
3. Tool call results are handled by `FileSystemProvider`, which updates the in-memory `VirtualFileSystem`
4. The preview iframe reads from the virtual file system, transforms JSX, and renders the component live

### Key Files

| File | Purpose |
|------|---------|
| `src/app/main-content.tsx` | Root 3-panel layout (chat, editor, preview) |
| `src/app/api/chat/route.ts` | Streaming AI endpoint with tool definitions |
| `src/lib/file-system.ts` | In-memory virtual file system (no disk writes) |
| `src/lib/contexts/chat-context.tsx` | Chat state via Vercel AI SDK |
| `src/lib/contexts/file-system-context.tsx` | File system state + tool call handling |
| `src/lib/provider.ts` | Language model abstraction with mock fallback |
| `src/components/preview/PreviewFrame.tsx` | Sandboxed iframe rendering |
| `src/components/editor/CodeEditor.tsx` | Monaco editor integration |
| `src/actions/index.ts` | Auth server actions (signup, signin, signout) |
| `src/middleware.ts` | JWT validation for protected routes |

### Auth & Persistence

- JWT-based auth with HTTP-only cookies (7-day expiration), bcrypt password hashing
- Anonymous users can generate components but cannot save projects
- Authenticated users get persistent projects stored in SQLite via Prisma
- Projects serialize chat messages and the full virtual file system as JSON in the DB

### Database Schema

```
User { id, email, password, projects[] }
Project { id, name, userId?, messages (JSON), data (JSON), timestamps }
```

## Environment

Set `ANTHROPIC_API_KEY` in `.env` to enable real Claude calls. Without it, the app falls back to a mock provider (`src/lib/provider.ts`).

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **AI:** Vercel AI SDK, `@ai-sdk/anthropic` (Claude)
- **DB:** Prisma + SQLite
- **Styling:** Tailwind CSS v4, shadcn/ui (new-york style), Radix UI
- **Editor:** Monaco Editor
- **Tests:** Vitest + Testing Library (jsdom environment)
- **Path alias:** `@/*` → `./src/*`
