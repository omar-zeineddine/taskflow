# TaskFlow - Modern Task Management Platform

TaskFlow is a real-time task management application built with React, TypeScript, and Supabase. It provides teams with an intuitive Kanban-style interface for managing tasks, real-time collaboration features, and comprehensive user management capabilities.

## 🚀 Features

### 🩻 Core

- **Authent System**
  - User registration and login
  - Session management with Zustand store
  - Protected routes and auth guards
  - Email-based password reset
  - Automatic user profile creation

- **Full Task Management**
  - Create, read, update, and delete tasks
  - Task fields: title, description, status, assignee, timestamps
  - Task assignment to team members
  - Optimistic UI updates

- **Interactive Kanban Board**
  - Three-column layout: "To Do", "In Progress", "Done"
  - Drag and drop functionality between columns
  - Real-time updates when other users make changes
  - Visual feedback for recently updated tasks

### 🎯 Enhanced Features

- **Team Management**
  - Task assignment and reassignment
  - User avatars and profile information
  - Online presence indicators

- **Advanced Search & Filtering**
  - Filter by assignee
  - Date range filtering
  - Combined filter support

- **Responsive Design**
  - Mobile-first responsive layout
  - Modern UI with shadcn/ui components
  - Dark/light theme support
  - Smooth animations and transitions

- **Real-time Collaboration**
  - Live task updates across all connected users
  - Real-time presence system
  - Instant notifications for task changes
  - Optimistic UI with conflict resolution

### 🛠️ Technical Features

- **Type-Safe Development**
  - Full TypeScript implementation
  - Zod validation schemas
  - Type-safe API interactions

- **Modern Architecture**
  - React 19
  - Zustand for state management
  - TanStack Router for routing
  - Supabase for backend services

- **Performance Optimizations**
  - Optimistic updates
  - real-time subscriptions
  - Lazy loading and code splitting

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: Shadcn - Radix UI + Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Drag & Drop**: @dnd-kit

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Supabase account** (free tier)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/omar-zeineddine/taskflow.git
cd taskflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for the project to be set up

#### Configure Environment Variables

1. Copy the environment template:

   ```bash
   cp env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   You can find these values in your Supabase project settings under "API".

#### Set Up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Run the database schema script:

   ```bash
   # Copy the contents of src/db/database-schema.sql
   # and paste it into the Supabase SQL Editor
   ```

3. Enable real-time features:

   ```bash
   # Copy the contents of src/db/enable-realtime.sql
   # and paste it into the Supabase SQL Editor
   ```

4. (Optional) Set up presence and chat features:
   ```bash
   # Copy the contents of src/db/presence-and-chat-schema.sql
   # and paste it into the Supabase SQL Editor
   ```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🐳 Docker Setup (Alternative)

If you prefer using Docker for development:

### 1. Create Environment File

```bash
cp env.example .env.local
# Fill in your Supabase credentials
```

### 2. Start with Docker Compose

```bash
docker-compose up
```

The application will be available at `http://localhost:5173`

## 📝 Usage Guide

### Getting Started

1. **Register**: Create a new account or log in with existing credentials
2. **Profile Setup**: Your profile is automatically created from your email
3. **Create Tasks**: Start by creating your first task
4. **Invite Team**: Share the app with your team members
5. **Collaborate**: Watch real-time updates as your team works

### Key Features

- **Drag & Drop**: Move tasks between columns by dragging
- **Real-time Updates**: See changes instantly when others edit tasks
- **Search**: Use the search bar to find specific tasks
- **Filter**: Filter tasks by assignee or date range
- **Assign**: Click on any task to assign it to team members

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run commit          # Use conventional commits

# Routing
npm run generate-routes # Generate route tree
npm run watch-routes    # Watch route changes
```

### Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── tasks/          # Task management components
│   ├── ui/             # Reusable UI components
│   └── ...
├── routes/             # TanStack Router routes
├── stores/             # Zustand stores
├── services/           # API services
├── types/              # TypeScript types
├── lib/                # Utility functions
└── db/                 # Database schemas
```

### Code Style

- **ESLint**: Configured with @antfu/eslint-config
- **TypeScript**: Strict mode enabled
- **Conventional Commits**: Using Commitizen
- **Formatting**: Automatic formatting on save

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `npm run commit`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
