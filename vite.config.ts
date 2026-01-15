import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Expose API_KEY specifically
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill the process.env object to avoid "process is not defined" in some libs
      'process.env': {}
    }
  };
});