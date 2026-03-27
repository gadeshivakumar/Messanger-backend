import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // allows access from mobile (0.0.0.0 or local IP)
    port: 5173,         // optional; default is 5173
  },
})
