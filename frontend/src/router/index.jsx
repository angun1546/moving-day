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
import MyQuotesPage from '../pages/MyQuotesPage'
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
import RequirePartner from '../components/RequirePartner'
import RequireAdmin from '../components/RequireAdmin'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import SearchResultsPage from '../pages/SearchResultsPage'
import BusinessMovePage from '../pages/BusinessMovePage'
import HomeMovePage from '../pages/HomeMovePage'
import CleaningPage from '../pages/CleaningPage'
import CleaningDetailPage from '../pages/CleaningDetailPage'
import StoragePage from '../pages/StoragePage'
import StorageDetailPage from '../pages/StorageDetailPage'
import DocumentPage from '../pages/DocumentPage'
import DocumentDetailPage from '../pages/DocumentDetailPage'
import AboutPage from '../pages/AboutPage'
import CulturePage from '../pages/CulturePage'
import CertificationsPage from '../pages/CertificationsPage'
import ProjectsPage from '../pages/ProjectsPage'
import GalleryPage from '../pages/GalleryPage'
import PortfolioPage from '../pages/PortfolioPage'
import VlogPage from '../pages/VlogPage'
import ComplaintPage from '../pages/ComplaintPage'
import TipBoardPage from '../pages/TipBoardPage'
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
      // 불편사항 접수 · 팁 게시판 (공용)
      { path: 'complaint', element: <ComplaintPage /> },
      { path: 'tips', element: <TipBoardPage /> },
      // 회원 영역
      { path: 'mypage', element: <MyPage /> },
      { path: 'mypage/quotes', element: <MyQuotesPage /> },
      { path: 'account', element: <AccountEditPage /> },
      // 공지사항
      { path: 'notice', element: <NoticePage /> },
      // 기업·관공서 이사 (B2B 전용 랜딩)
      { path: 'business', element: <BusinessMovePage /> },
      // 가정이사 (개인 전용 랜딩)
      { path: 'home', element: <HomeMovePage /> },
      // 청소 (상품 소개 랜딩 + 세부 상품 페이지)
      { path: 'cleaning', element: <CleaningPage /> },
      { path: 'cleaning/:slug', element: <CleaningDetailPage /> },
      // 창고보관 (상품 소개 랜딩 + 세부 상품 페이지)
      { path: 'storage', element: <StoragePage /> },
      { path: 'storage/:slug', element: <StorageDetailPage /> },
      // 문서보관·파쇄 (상품 소개 랜딩 + 세부 상품 페이지)
      { path: 'document', element: <DocumentPage /> },
      { path: 'document/:slug', element: <DocumentDetailPage /> },
      // 회사 소개 영역
      { path: 'about', element: <AboutPage /> },
      { path: 'culture', element: <CulturePage /> },
      { path: 'certifications', element: <CertificationsPage /> },
      // 무빙 프로젝트 (실적 + 갤러리·포트폴리오·브이로그)
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/gallery', element: <GalleryPage /> },
      { path: 'projects/portfolio', element: <PortfolioPage /> },
      { path: 'projects/vlog', element: <VlogPage /> },
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
          <RequirePartner>
            <PartnerDashboardPage />
          </RequirePartner>
        ),
      },
      // 내 입찰 현황 (제출한 입찰)
      {
        path: 'bids',
        element: (
          <RequirePartner>
            <PartnerBidsPage />
          </RequirePartner>
        ),
      },
      {
        path: 'profile',
        element: (
          <RequirePartner>
            <PartnerProfilePage />
          </RequirePartner>
        ),
      },
      { path: 'story', element: <PartnerStoryPage /> },
      { path: 'faq', element: <PartnerFaqPage /> },
      { path: 'mypage', element: <PartnerMyPage /> },
      { path: 'notice', element: <NoticePage /> },
      // 불편사항 접수 · 팁 게시판 (공용 컴포넌트, 파트너 레이아웃 유지)
      { path: 'complaint', element: <ComplaintPage /> },
      { path: 'tips', element: <TipBoardPage /> },
      // 파트너 사이트 검색
      { path: 'search', element: <SearchResultsPage scope="partner" /> },
    ],
  },
])
