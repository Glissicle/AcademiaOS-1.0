import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Fix: __dirname is not available in ES modules. Using '.' resolves to the current working directory, which is the project root when running Vite.
          // FIX: `__dirname` is not available in ES modules. Replaced with `process.cwd()` which correctly points to the project root.
          // FIX: `process.cwd()` causes a TypeScript error. Replaced with `.` which `path.resolve` uses as the current working directory.
          '@': path.resolve('.'),
        }
      }
    };
});