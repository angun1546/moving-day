import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import QuoteMethodPage from '../pages/QuoteMethodPage'
import QuoteTypePage from '../pages/QuoteTypePage'
import QuoteFormPage from '../pages/QuoteFormPage'
import QuoteDonePage from '../pages/QuoteDonePage'
import BidComparePage from '../pages/BidComparePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import UserReviewPage from '../pages/UserReviewPage'
import UserFaqPage from '../pages/UserFaqPage'
import MyPage from '../pages/MyPage'
import AccountEditPage from '../pages/AccountEditPage'
import NoticePage from '../pages/NoticePage'
import PartnerLayout from '../components/PartnerLayout'
import PartnerHomePage from '../pages/PartnerHomePage'
import PartnerDashboardPage from '../pages/PartnerDashboardPage'
import PartnerProfilePage from '../pages/PartnerProfilePage'
import PartnerStoryPage from '../pages/PartnerStoryPage'
import PartnerFaqPage from '../pages/PartnerFaqPage'
import PartnerMyPage from '../pages/PartnerMyPage'
import PartnerBidsPage from '../pages/PartnerBidsPage'
import RequireAuth from '../components/RequireAuth'
import RequireAdmin from '../components/RequireAdmin'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import SearchResultsPage from '../pages/SearchResultsPage'
import { createQuote } from '../services/quotes'

// 데이터 모드 라우터 (고객: '/' 레이아웃 / 업체: '/partner' 레이아웃)
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      // 견적: 방식 → 이사종류 → 폼 (3단계)
      { path: 'quote', element: <QuoteMethodPage /> },
      { path: 'quote/done', element: <QuoteDonePage /> },
      // 입찰 비교 (견적 신청 후 받은 업체 입찰 비교·선택)
      { path: 'quote/bids', element: <BidComparePage /> },
      { path: 'quote/:method', element: <QuoteTypePage /> },
      {
        path: 'quote/:method/:type',
        element: <QuoteFormPage />,
        action: createQuote,
      },
      // 인증
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      // 고객 리뷰
      { path: 'reviews', element: <UserReviewPage /> },
      // FAQ (자주 묻는 질문 + Q&A)
      { path: 'faq', element: <UserFaqPage /> },
      // 회원 영역
      { path: 'mypage', element: <MyPage /> },
      { path: 'account', element: <AccountEditPage /> },
      // 공지사항
      { path: 'notice', element: <NoticePage /> },
      // 사이트 검색 (검색어로 연관 페이지 찾기)
      { path: 'search', element: <SearchResultsPage scope="user" /> },
      // 관리자 대시보드 (admin 전용 가드)
      {
        path: 'admin',
        element: (
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        ),
      },
    ],
  },
  // 업체(파트너) 전용 영역 — 별도 레이아웃
  {
    path: '/partner',
    element: <PartnerLayout />,
    children: [
      { index: true, element: <PartnerHomePage /> },
      // 로그인 필요: 입찰 목록·업체 정보
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <PartnerDashboardPage />
          </RequireAuth>
        ),
      },
      // 내 입찰 현황 (제출한 입찰)
      {
        path: 'bids',
        element: (
          <RequireAuth>
            <PartnerBidsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: (
          <RequireAuth>
            <PartnerProfilePage />
          </RequireAuth>
        ),
      },
      { path: 'story', element: <PartnerStoryPage /> },
      { path: 'faq', element: <PartnerFaqPage /> },
      { path: 'mypage', element: <PartnerMyPage /> },
      { path: 'notice', element: <NoticePage /> },
      // 파트너 사이트 검색
      { path: 'search', element: <SearchResultsPage scope="partner" /> },
    ],
  },
])
