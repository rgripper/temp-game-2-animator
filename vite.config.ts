import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { comlink } from "vite-plugin-comlink";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), comlink()],
  build: {
    target: 'es2022'
  },
  worker: {
    format: 'es',
    plugins: [comlink()],
  },
})
