# TaskFlow - Claude Code Configuration

This is a React + TypeScript + Vite project called TaskFlow with the following stack:

## Tech Stack

- **Framework**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 7.0.3
- **Routing**: TanStack Router 1.125.6
- **Database**: Supabase 2.50.4
- **State Management**: Zustand 5.0.6
- **UI Components**: Radix UI + Tailwind CSS 4.1.11
- **Forms**: React Hook Form 7.60.0 + Zod 4.0.2
- **Icons**: Lucide React 0.525.0
- **Styling**: Tailwind CSS with class-variance-authority

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run preview` - Preview production build
- `npm run commit` - Use Commitizen for conventional commits

## Project Structure

- `src/` - Source code
  - `components/` - React components
    - `auth/` - Authentication components
    - `ui/` - Reusable UI components (form, input, label)
  - `lib/` - Utility libraries (supabase.ts)
  - `routes/` - TanStack Router routes
  - `stores/` - Zustand stores
  - `main.tsx` - Application entry point
- `routeTree.gen.ts` - Auto-generated route tree

## Development Commands

- **Lint**: `npm run lint`
- **Type Check**: `npm run build` (includes TypeScript check)
- **Test**: No test framework configured yet

## Environment

- Uses `.env` for environment variables
- Supabase configuration in `src/lib/supabase.ts`

## Code Style

- Uses @antfu/eslint-config for consistent code formatting
- Conventional commits with Commitizen
- TypeScript strict mode enabled
