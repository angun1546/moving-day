import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const COLUMNS = [
  {
    title: '서비스',
    items: [
      { label: '기업·관공서 이사', to: '/business' },
      { label: '문서보관·파쇄', to: '/document' },
      { label: '창고보관', to: '/storage' },
      { label: '가정이사', to: '/home' },
      { label: '청소', to: '/cleaning' },
    ],
  },
  {
    title: '회사',
    items: [
      { label: '기업소개', to: '/about' },
      { label: '기업문화', to: '/culture' },
      { label: '인증현황', to: '/certifications' },
      { label: '정보처리방침', modal: true },
      { auth: true },
    ],
  },
  {
    title: '고객센터',
    items: ['1577-3101', '연중무휴 상담 가능', '평일 09:00 - 18:00'],
  },
]

function Footer() {
  const { user, logout } = useAuth()
  const [privacyOpen, setPrivacyOpen] = useState(false)

  // 팝업 열렸을 때 Esc로 닫기
  useEffect(() => {
    if (!privacyOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPrivacyOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [privacyOpen])

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-bold text-brand">이삿날</p>
            <p className="mt-2 text-sm text-gray-500">
              믿을 수 있는 이사 견적 비교 플랫폼
            </p>
            <Link
              to="/partner"
              className="mt-3 inline-block text-sm font-semibold text-brand transition hover:underline"
            >
              무브 마스터 파트너센터 →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3 sm:gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-gray-900">{col.title}</p>
                <ul className="mt-3 space-y-2 text-gray-500">
                  {col.items.map((item) => {
                    // 단순 텍스트
                    if (typeof item === 'string') {
                      return <li key={item}>{item}</li>
                    }
                    // 로그인 / 로그아웃 (로그인 상태에 따라)
                    if (item.auth) {
                      return (
                        <li key="auth">
                          {user ? (
                            <button
                              type="button"
                              onClick={logout}
                              className="text-left transition hover:text-brand"
                            >
                              로그아웃
                            </button>
                          ) : (
                            <Link
                              to="/login"
                              className="transition hover:text-brand"
                            >
                              로그인
                            </Link>
                          )}
                        </li>
                      )
                    }
                    // 팝업 트리거 (정보처리방침)
                    if (item.modal) {
                      return (
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={() => setPrivacyOpen(true)}
                            className="text-left transition hover:text-brand"
                          >
                            {item.label}
                          </button>
                        </li>
                      )
                    }
                    // 페이지 링크
                    return (
                      <li key={item.label}>
                        <Link to={item.to ?? '#'} className="transition hover:text-brand">
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <p>(주)이삿날 · 대표 이장민 · 사업자등록번호 463-87-00987</p>
          <p className="mt-1">서울특별시 은평구 가좌로10길 33-1 · 1577-3101</p>
          <p className="mt-1">© 2026 이삿날. All rights reserved.</p>
        </div>
      </div>

      {/* 정보처리방침 팝업 — 내용 공란 */}
      {privacyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="정보처리방침"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPrivacyOpen(false)}
          />
          <div
            className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-brand-bg shadow-xl"
            style={{ maxHeight: '80vh' }}
          >
            <div className="flex items-center justify-between border-b border-brand-light px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">정보처리방침</h2>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label="닫기"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* 내용 공란 */}
            <div
              className="flex-1 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-gray-700"
              style={{ minHeight: '12rem' }}
            />
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
