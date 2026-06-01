import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import TopButton from './components/TopButton'
import NoticeBanner from './components/NoticeBanner'
import { useTapFeedback } from './hooks/useTapFeedback'

// 공통 레이아웃 (GNB + 본문 + Footer)
function App() {
  useTapFeedback() // 전역 버튼·링크 탭 피드백
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* 최근 공지 릴레이 배너 — 헤더 바로 아래 */}
      <div className="px-4 pt-4">
        <NoticeBanner />
      </div>
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <TopButton />
    </div>
  )
}

export default App
