/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_VERCEL_ENV?: "production" | "preview" | "development";
  readonly VITE_VERCEL_BRANCH_URL?: string;
  readonly VITE_VERCEL_PROJECT_PRODUCTION_URL?: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
