import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import TopButton from './components/TopButton'

// 공통 레이아웃 (GNB + 본문 + Footer)
function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
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
