import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 개발 중에는 /api 요청을 백엔드 서버(4000)로 프록시한다
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // npm run dev 시 OS 기본(외부) 브라우저로 자동 오픈 — IDE 내장 미리보기 사용 안 함
    open: true,
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
})
