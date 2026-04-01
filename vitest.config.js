import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',           // simulates browser DOM
    globals: true,                  // allows describe/test/expect without imports
    setupFiles: './src/setupTests.js',
    css: false,                     // skip CSS processing — faster tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/data/**'],
    },
  },
})