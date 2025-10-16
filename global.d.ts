/// <reference types="node" />

// Global type declarations for Node.js APIs
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DROPBOX_SIGN_API_KEY?: string;
    DROPBOX_SIGN_TEST_MODE?: string;
    BLOB_READ_WRITE_TOKEN?: string;
    NEXT_PUBLIC_APP_URL?: string;
    [key: string]: string | undefined;
  }

  interface Global {
    prisma: any;
  }
}

// Extend ProcessEnv with project-specific vars; Buffer/process types come from @types/node
