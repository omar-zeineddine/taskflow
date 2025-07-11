/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as DashboardRouteImport } from './routes/dashboard'
import { Route as IndexRouteImport } from './routes/index'
import { Route as TasksIndexRouteImport } from './routes/tasks/index'
import { Route as AuthResetPasswordRouteImport } from './routes/auth/reset-password'
import { Route as AuthRegisterRouteImport } from './routes/auth/register'
import { Route as AuthLoginRouteImport } from './routes/auth/login'
import { Route as AuthForgotPasswordRouteImport } from './routes/auth/forgot-password'
import { Route as TasksTaskIdIndexRouteImport } from './routes/tasks/$taskId/index'

const DashboardRoute = DashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const TasksIndexRoute = TasksIndexRouteImport.update({
  id: '/tasks/',
  path: '/tasks/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthResetPasswordRoute = AuthResetPasswordRouteImport.update({
  id: '/auth/reset-password',
  path: '/auth/reset-password',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRegisterRoute = AuthRegisterRouteImport.update({
  id: '/auth/register',
  path: '/auth/register',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthLoginRoute = AuthLoginRouteImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthForgotPasswordRoute = AuthForgotPasswordRouteImport.update({
  id: '/auth/forgot-password',
  path: '/auth/forgot-password',
  getParentRoute: () => rootRouteImport,
} as any)
const TasksTaskIdIndexRoute = TasksTaskIdIndexRouteImport.update({
  id: '/tasks/$taskId/',
  path: '/tasks/$taskId/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/tasks': typeof TasksIndexRoute
  '/tasks/$taskId': typeof TasksTaskIdIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/tasks': typeof TasksIndexRoute
  '/tasks/$taskId': typeof TasksTaskIdIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/tasks/': typeof TasksIndexRoute
  '/tasks/$taskId/': typeof TasksTaskIdIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/register'
    | '/auth/reset-password'
    | '/tasks'
    | '/tasks/$taskId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/dashboard'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/register'
    | '/auth/reset-password'
    | '/tasks'
    | '/tasks/$taskId'
  id:
    | '__root__'
    | '/'
    | '/dashboard'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/register'
    | '/auth/reset-password'
    | '/tasks/'
    | '/tasks/$taskId/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DashboardRoute: typeof DashboardRoute
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute
  AuthLoginRoute: typeof AuthLoginRoute
  AuthRegisterRoute: typeof AuthRegisterRoute
  AuthResetPasswordRoute: typeof AuthResetPasswordRoute
  TasksIndexRoute: typeof TasksIndexRoute
  TasksTaskIdIndexRoute: typeof TasksTaskIdIndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/tasks/': {
      id: '/tasks/'
      path: '/tasks'
      fullPath: '/tasks'
      preLoaderRoute: typeof TasksIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/reset-password': {
      id: '/auth/reset-password'
      path: '/auth/reset-password'
      fullPath: '/auth/reset-password'
      preLoaderRoute: typeof AuthResetPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/register': {
      id: '/auth/register'
      path: '/auth/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthRegisterRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/forgot-password': {
      id: '/auth/forgot-password'
      path: '/auth/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/tasks/$taskId/': {
      id: '/tasks/$taskId/'
      path: '/tasks/$taskId'
      fullPath: '/tasks/$taskId'
      preLoaderRoute: typeof TasksTaskIdIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRoute: DashboardRoute,
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
  AuthLoginRoute: AuthLoginRoute,
  AuthRegisterRoute: AuthRegisterRoute,
  AuthResetPasswordRoute: AuthResetPasswordRoute,
  TasksIndexRoute: TasksIndexRoute,
  TasksTaskIdIndexRoute: TasksTaskIdIndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
