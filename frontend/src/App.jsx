import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import TopButton from './components/TopButton'
import ConsultDock from './components/ConsultDock'
import NoticeBanner from './components/NoticeBanner'
import { useTapFeedback } from './hooks/useTapFeedback'

// 공통 레이아웃 (GNB + 본문 + Footer)
function App() {
  useTapFeedback() // 전역 버튼·링크 탭 피드백
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* 최근 공지 바 — GNB 바로 아래 가로 꽉 찬 띠(X로 닫기) */}
      <NoticeBanner />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <TopButton />
      <ConsultDock />
    </div>
  )
}

export default App
