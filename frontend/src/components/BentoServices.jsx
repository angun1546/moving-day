import { Link } from 'react-router-dom'

// 대표 서비스(포장이사)는 넓게 강조, 나머지는 벤토 카드로 구획화
const SERVICES = [
  {
    icon: '📦',
    title: '포장이사',
    desc: '짐 싸기부터 운반, 정리까지 한 번에. 가장 많이 찾는 대표 서비스입니다.',
    featured: true,
  },
  { icon: '🪑', title: '반포장이사', desc: '깨지기 쉬운 짐만 포장해 비용을 아끼는 실속형' },
  { icon: '🚚', title: '일반이사', desc: '운반 중심의 가성비 이사' },
  { icon: '🏢', title: '사무실 이사', desc: '업무 공백 없이 빠르고 정확하게' },
  { icon: '🛡️', title: '파손 보상', desc: '만일의 사고도 안심. 투명한 보상 절차' },
]

function ServiceCard({ icon, title, desc, featured }) {
  if (featured) {
    return (
      <div className="rounded-3xl bg-brand p-8 text-white transition hover:-translate-y-1 hover:shadow-lg md:col-span-2">
        <span className="text-4xl">{icon}</span>
        <h3 className="mt-4 text-2xl font-bold">{title}</h3>
        <p className="mt-2 max-w-md leading-relaxed text-brand-light">{desc}</p>
      </div>
    )
  }
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  )
}

function BentoServices() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Service
      </p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">필요한 이사만, 골라서</h2>
      <p className="mt-3 text-gray-600">
        상황에 맞는 서비스를 선택하면 그에 맞는 업체 견적을 받아볼 수 있어요.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>

      {/* 기업·관공서(B2B) 전용 파트 진입 배너 */}
      <Link
        to="/business"
        className="mt-4 flex flex-col items-start justify-between gap-4 rounded-3xl border border-brand-light bg-brand-light/30 p-8 transition hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center"
      >
        <div>
          <span className="text-3xl">🏛️</span>
          <h3 className="mt-2 text-xl font-bold text-gray-900">
            기업·관공서 이사
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            사무실·관공서·공장 대량 이전. 무중단 작업과 세금계산서까지 한 번에.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-brand px-6 py-3 font-semibold text-white">
          전용 서비스 보기 →
        </span>
      </Link>
    </section>
  )
}

export default BentoServices
