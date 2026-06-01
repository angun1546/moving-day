import { Link } from 'react-router-dom'

// 기업·관공서(B2B) 이사 전용 랜딩 — 개인 이사와 분리된 독립 파트
// 대량·무중단 이전, 보안 자산, 세금계산서 등 법인 고객 니즈를 강조

// 이전 대상
const TARGETS = [
  { icon: '🏢', title: '사무실·오피스', desc: '집기·OA기기·서버까지 업무 공백 없이 이전' },
  { icon: '🏛️', title: '관공서·공공기관', desc: '문서·비품 보안 관리와 입찰·계약 절차 지원' },
  { icon: '🏭', title: '공장·물류센터', desc: '대형 설비·재고 대량 운반과 라인 재배치' },
  { icon: '🏬', title: '매장·지점', desc: '다점포 동시 이전과 인테리어 일정 연계' },
]

// 차별점(왜 이삿날) — 내용 미정(회사 방침 확정 후 채움). 박스 4개만 유지
const STRENGTHS = [
  { icon: '', title: '', desc: '' },
  { icon: '', title: '', desc: '' },
  { icon: '', title: '', desc: '' },
  { icon: '', title: '', desc: '' },
]

// 진행 절차 — 내용 미정(회사 방침 확정 후 채움). 박스 5개만 유지
const STEPS = [
  { no: '', title: '', desc: '' },
  { no: '', title: '', desc: '' },
  { no: '', title: '', desc: '' },
  { no: '', title: '', desc: '' },
  { no: '', title: '', desc: '' },
]

function BusinessMovePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              For Business
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              기업·관공서 이사,
              <br />
              <span className="text-brand">멈춤 없이 옮깁니다.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              사무실부터 관공서·공장까지. 대량 물량과 보안 자산을 업무 중단 없이
              안전하게 이전하고, 세금계산서까지 정식으로 처리해 드립니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/quote"
                className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                무료 상담 신청
              </Link>
              <a
                href="tel:1600-0000"
                className="rounded-full border border-gray-300 bg-white px-7 py-3 text-center font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
              >
                전화 상담 1600-0000
              </a>
            </div>
            <p className="mt-3 text-sm font-medium text-brand">
              ✓ 무료 현장 실사 · ✓ 세금계산서 발행 · ✓ 전담 매니저 배정
            </p>
          </div>
        </div>
      </section>

      {/* 이전 대상 */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Who
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          이런 이전을 맡고 있어요
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {TARGETS.map((t) => (
            <div
              key={t.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{t.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 차별점 */}
      <section className="bg-brand-light/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            Why
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            법인 이사는 기준이 다릅니다
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STRENGTHS.map((s) => (
              <div
                key={s.title}
                className="flex min-h-28 gap-4 rounded-3xl bg-white p-6 shadow-sm"
              >
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진행 절차 */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Process
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          상담부터 정산까지 5단계
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <div
              key={s.no}
              className="min-h-28 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="font-inter text-2xl font-bold text-brand">
                {s.no}
              </span>
              <h3 className="mt-3 font-bold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            기업 이사, 견적부터 받아보세요
          </h2>
          <p className="mt-3 text-brand-light">
            규모와 일정만 알려주시면 전담 매니저가 바로 연락드립니다.
          </p>
          <Link
            to="/quote"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand transition hover:-translate-y-0.5"
          >
            무료 상담 신청하기
          </Link>
        </div>
      </section>
    </>
  )
}

export default BusinessMovePage
