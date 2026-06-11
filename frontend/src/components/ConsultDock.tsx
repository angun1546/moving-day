import { useState } from 'react'
import { Link } from 'react-router-dom'

// 카카오 채널 1:1 채팅 URL — 채널 관리자센터 '채널 정보'의 채팅 URL로 교체
// (예: http://pf.kakao.com/_xxxxx/chat). 비어 있으면 버튼은 보이되 동작 안 함.
const KAKAO_CHAT_URL = 'http://pf.kakao.com/_RZwss/chat'
// 대표 상담 전화
const TEL = '1577-3101'

// 우측 고정 상담 도크 — 손잡이로 열고 닫는 팝업 박스(카카오톡·맞춤 상담신청)
function ConsultDock() {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={`fixed right-0 top-1/2 z-40 -translate-y-1/2 transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* 손잡이 — 패널 왼쪽 바깥에 붙어 항상 노출(열기/닫기 토글) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '상담 메뉴 닫기' : '상담 메뉴 열기'}
        className="absolute right-full top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-xl bg-brand px-2 py-4 text-xs font-bold text-white shadow-lg transition hover:bg-brand-dark"
      >
        <span>{open ? '닫기' : '상담'}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points={open ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
        </svg>
      </button>

      {/* 상담 패널 */}
      <div className="w-40 overflow-hidden rounded-l-2xl border border-gray-200 bg-white shadow-xl sm:w-44">
        <div className="flex flex-col gap-2 p-3">
          {/* 카카오톡 상담 */}
          <a
            href={KAKAO_CHAT_URL || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 rounded-xl bg-kakao py-3 text-sm font-bold text-kakao-text transition hover:brightness-95"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
            </svg>
            카카오톡 상담
          </a>

          {/* 맞춤 상담신청 */}
          <Link
            to="/complaint"
            className="flex flex-col items-center gap-1 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            맞춤 상담신청
          </Link>
        </div>

        {/* 하단 — 연중무휴 안내 + 대표 전화 */}
        <div className="border-t border-gray-100 bg-brand-bg px-3 py-3 text-center">
          <p className="text-xs leading-relaxed text-gray-600">
            <span className="font-bold text-brand">무빙데이</span>는 연중무휴
            <br />
            상담 가능해요!
          </p>
          <a
            href={`tel:${TEL.replace(/\D/g, '')}`}
            className="mt-1 block text-lg font-extrabold text-brand"
          >
            {TEL}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ConsultDock
