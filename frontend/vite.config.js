import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // GitHub Pages user site (kodowou.github.io) is served at root
  plugins: [react()],
  server: { port: 3000, host: true },
  preview: { port: 3000, host: true },
});
