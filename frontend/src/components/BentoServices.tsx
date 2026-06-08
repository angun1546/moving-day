import { Link } from 'react-router-dom'

// 모든 서비스 박스는 동일한 표준 배너(기업·관공서 이사 박스 기준)로 통일
// to: 연결 페이지 / soon: 준비중(페이지 없음, 비활성)
const SERVICES = [
  {
    icon: '🏠',
    title: '가정이사',
    desc: '원룸부터 대형 평수까지, 집 이사는 여기서 한 번에 비교하세요.',
    to: '/home',
    cta: '전용 서비스 보기 →',
  },
  {
    icon: '🏛️',
    title: '기업·관공서 이사',
    desc: '사무실·관공서·공장 대량 이전. 무중단 작업과 세금계산서까지 한 번에.',
    to: '/business',
    cta: '전용 서비스 보기 →',
  },
  {
    icon: '🗂️',
    title: '문서보관·파쇄',
    desc: '보안 파쇄부터 디지털 매체 파기, 장기 보관·인덱싱까지.',
    to: '/document',
    cta: '전용 서비스 보기 →',
  },
  {
    icon: '📦',
    title: '창고보관',
    desc: '컨테이너·창고·모듈형·무빙박스까지 짐을 안전하게 보관해요.',
    to: '/storage',
    cta: '전용 서비스 보기 →',
  },
  {
    icon: '🧹',
    title: '청소',
    desc: '입주·사무실 청소부터 의자 딥클린까지 깔끔하게 마무리해요.',
    to: '/cleaning',
    cta: '전용 서비스 보기 →',
  },
]

// 표준 서비스 박스 — 좌측 아이콘·제목·설명, 우측 CTA(또는 준비중)
const boxClass =
  'flex flex-col items-start justify-between gap-4 rounded-3xl border border-brand-light bg-brand-light/30 p-8 transition sm:flex-row sm:items-center'

function ServiceBox({
  icon,
  title,
  desc,
  to,
  cta,
  soon,
}: {
  icon: string
  title: string
  desc: string
  to: string
  cta: string
  soon?: boolean
}) {
  const body = (
    <>
      <div>
        <span className="text-3xl">{icon}</span>
        <h3 className="mt-2 text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
      </div>
      {soon ? (
        <span className="shrink-0 rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-400">
          준비중
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-brand px-6 py-3 font-semibold text-white">
          {cta}
        </span>
      )}
    </>
  )

  if (soon) {
    return <div className={`${boxClass} opacity-70`}>{body}</div>
  }
  return (
    <Link to={to} className={`${boxClass} hover:-translate-y-1 hover:shadow-md`}>
      {body}
    </Link>
  )
}

function BentoServices() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Service
      </p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">필요한 서비스만, 골라서</h2>
      <p className="mt-3 text-gray-600">
        상황에 맞는 서비스를 선택하면 그에 맞는 업체 견적을 받아볼 수 있어요.
      </p>

      <div className="mt-10 space-y-4">
        {SERVICES.map((s) => (
          <ServiceBox key={s.title} {...s} />
        ))}
      </div>
    </section>
  )
}

export default BentoServices
