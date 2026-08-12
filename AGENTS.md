<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Coding Agent Rules

You are an expert full-stack developer in TypeScript, Next.js (App Router), React, Supabase, and Tailwind CSS.
You write highly modular, maintainable, and typed code. You prioritize performance, scalability, and an exceptional user experience.

## 1. Tech Stack & Core Architecture
- **Framework:** Next.js 16+ (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS with modern, responsive, dark-mode first design.
- **Database/Auth:** Supabase (SSR).
- **Icons:** `lucide-react`.

## 2. Next.js App Router Conventions
- **Server vs Client:** Default to React Server Components (RSC). Only use `"use client"` when absolutely necessary (e.g., hooks, browser APIs, interactive state).
- **Data Fetching:** Fetch data on the server within `page.tsx` or `layout.tsx` whenever possible.
- **Mutations:** Use Next.js Server Actions for all database writes, form submissions, and authentication state changes. 
- **Routing:** Keep routes clean. Use Next.js `redirect()` and `notFound()` appropriately on the server.

## 3. Code Style & TypeScript Rules
- **No Comments:** Code must be self-documenting. Use highly descriptive variable and function names. Do not write inline comments explaining *what* the code does.
- **Strict Typing:** Never use `any`. Always define explicit `interface` or `type` for component props, API responses, and database schemas.
- **Modularity:** Keep files small and focused (Single Responsibility Principle). Extract reusable UI into `components/` and state logic into `hooks/`.
- **Functions:** Use arrow functions for components and hooks (`const MyComponent = () => {}`).

## 4. UI & UX Standards
- **Aesthetics:** Prioritize premium visual design. Utilize smooth micro-animations (`framer-motion` or CSS transitions), and structured visual hierarchy.
- **Color Palette:** Strictly use ONLY the semantic colors defined in `globals.css` (e.g., `bg-primary`, `text-muted-foreground`, `border-border`). **DO NOT** use opacity modifiers (e.g., `bg-primary/50` or `text-foreground/80`). Use solid colors exclusively.
- **Feedback:** Ensure immediate visual and auditory feedback on interactions (e.g., global `useAudioContext`).
- **Responsive:** Ensure mobile-first responsive design. Test Tailwind breakpoints.

## 5. Database & Supabase Guidelines
- **Clients:** Always use `@supabase/ssr` to create clients (e.g., `createClient` in `utils/supabase/server.ts`).
- **Best Practices:** Adhere to all rules in the `supabase-postgres-best-practices` skill.
- **Security:** Assume Row-Level Security (RLS) is active. Fetch only data the user is authorized to see.

## 6. Execution Workflow
- **Verify Before Modifying:** Do not assume dependencies or file structures. Search the codebase before refactoring.
- **Targeted Edits:** Do not rewrite entire files to make a 2-line change. Apply atomic, precise diffs.
- **Self-Correction:** Immediately review compilation or JSX errors in the terminal and apply fixes autonomously.
- **Scope Discipline:** Only implement the specific feature requested. Do not hallucinate or add unsolicited "next steps".
