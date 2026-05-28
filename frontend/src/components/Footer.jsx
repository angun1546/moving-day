import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: '서비스',
    items: ['포장이사', '반포장이사', '일반이사', '사무실 이사'],
  },
  {
    title: '회사',
    items: ['회사 소개', '이용약관', '개인정보처리방침'],
  },
  {
    title: '고객센터',
    items: ['02-304-2422', '평일 09:00 - 18:00', '주말·공휴일 휴무'],
  },
]

function Footer() {
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

          <div className="grid grid-cols-3 gap-8 text-sm">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-gray-900">{col.title}</p>
                <ul className="mt-3 space-y-2 text-gray-500">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <p>(주)이삿날 · 대표 이도현 · 사업자등록번호 463-87-00987</p>
          <p className="mt-1">서울특별시 은평구 가좌로10길 33-1 · 02-304-2422</p>
          <p className="mt-1">© 2026 이삿날. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
