import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

const BACKEND_PORT = process.env.REACT_APP_SERVER_PORT || 3000;
const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT || 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: FRONTEND_PORT,

    proxy: {
      '/api': `http://localhost:${BACKEND_PORT}/`,
    },
    public: '/dist/',
  },
  
});
