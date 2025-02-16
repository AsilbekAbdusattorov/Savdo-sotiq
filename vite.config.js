import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0', // Tarmoqdan tashqarida ham ishlashini ta'minlash
  },
  preview: {
    allowedHosts: ['savdo-sotiq-2.onrender.com', 'localhost', '127.0.0.1'],
  },
})
