import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseFromEnv = process.env.VITE_BASE || '/thebuilder/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: baseFromEnv,
})
