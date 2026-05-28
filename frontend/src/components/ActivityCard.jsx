import { Link } from 'react-router-dom'

// 마이페이지 활동 내역 카드 — 클릭 시 해당 페이지로 이동
function ActivityCard({ to, label, count = 0 }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-gray-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 font-inter text-2xl font-bold text-brand">{count}건</p>
      <p className="mt-2 text-xs text-gray-400">자세히 보기 →</p>
    </Link>
  )
}

export default ActivityCard
