import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import QuoteMethodPage from '../pages/QuoteMethodPage'
import QuoteTypePage from '../pages/QuoteTypePage'
import QuoteFormPage from '../pages/QuoteFormPage'
import QuoteDonePage from '../pages/QuoteDonePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import { createQuote } from '../services/quotes'

// 데이터 모드 라우터 설정
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      // 견적: 방식 → 이사종류 → 폼 (3단계)
      { path: 'quote', element: <QuoteMethodPage /> },
      { path: 'quote/done', element: <QuoteDonePage /> },
      { path: 'quote/:method', element: <QuoteTypePage /> },
      {
        path: 'quote/:method/:type',
        element: <QuoteFormPage />,
        action: createQuote,
      },
      // 인증
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
])
