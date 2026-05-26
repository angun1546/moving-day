import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import QuotePage from '../pages/QuotePage'
import QuoteDonePage from '../pages/QuoteDonePage'
import { createQuote } from '../services/quotes'

// 데이터 모드 라우터 설정
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'quote', element: <QuotePage />, action: createQuote },
      { path: 'quote/done', element: <QuoteDonePage /> },
    ],
  },
])
