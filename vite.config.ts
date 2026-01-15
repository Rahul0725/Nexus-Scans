import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY. 
      // JSON.stringify handles if it's undefined (becomes "undefined" string or simply undefined value in JS)
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  };
});