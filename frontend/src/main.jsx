import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthProvider } from './context/AuthContext'
import { seedDummyReviews } from './data/dummyReviews'
import './index.css'

// ⚠️ 페이지네이션 테스트용 더미 시드 — 확인 후 이 두 줄 제거
seedDummyReviews()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
