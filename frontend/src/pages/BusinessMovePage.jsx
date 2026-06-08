import { Link } from 'react-router-dom'
import { businessTypes } from '../data/quoteOptions'

// 기업·관공서(B2B) 이사 전용 랜딩 — 개인 이사와 분리된 독립 파트
// 대량·무중단 이전, 보안 자산, 세금계산서 등 법인 고객 니즈를 강조
// 이전 대상(이사종류)은 견적 종류 중 기업·관공서 그룹(businessTypes)을 단일 출처로 재사용

// 차별점(왜 이삿날) — Hero 카피(무중단·보안·세금계산서)와 일관, 이삿날 핵심인 비교견적 매칭 강조
// 회사 방침 확정 문구 나오면 교체
const STRENGTHS = [
  {
    icon: '🌙',
    title: '업무 무중단 이전',
    desc: '야간·주말·연휴를 활용한 분할 이전으로 영업·민원 공백 없이 옮겨요.',
  },
  {
    icon: '🔒',
    title: '보안 자산 전담 관리',
    desc: '서버·기밀문서·고가 자산을 별도 분류·밀봉·실명 인계로 안전하게 이전해요.',
  },
  {
    icon: '⚖️',
    title: '검증 업체 비교견적',
    desc: '한 번 신청으로 검증된 전문 업체들의 입찰을 받아 조건을 투명하게 비교해요.',
  },
  {
    icon: '🧾',
    title: '세금계산서·표준계약',
    desc: '법인 회계에 맞춘 세금계산서 발행과 표준 계약서로 정산까지 깔끔하게 처리해요.',
  },
]

// 진행 절차 — 이삿날 매칭(여러 업체 비교견적) 방식에 맞춘 6단계
const STEPS = [
  { no: '01', icon: '📝', title: '견적 문의·신청', desc: '홈페이지·전화로 접수하면 담당 매니저가 빠르게 연락드려요.' },
  { no: '02', icon: '📍', title: '현장 실사', desc: '무료 현장 실사로 물량·동선·특이사항을 정확히 확인해요.' },
  { no: '03', icon: '⚖️', title: '업체 입찰·비교', desc: '검증된 전문 업체들이 견적을 제출하고 한눈에 비교해요.' },
  { no: '04', icon: '📄', title: '업체 선정·계약', desc: '조건을 보고 업체를 선택하면 표준 계약서로 확정해요.' },
  { no: '05', icon: '🚚', title: '이전 진행', desc: '계획대로 무중단 이전을 수행하며 현장 변동도 즉시 반영해요.' },
  { no: '06', icon: '✅', title: '검수·정산', desc: '검수와 요청사항 반영 후 세금계산서 발행으로 마무리해요.' },
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
                to="/quote?scope=business"
                className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                무료 상담 신청
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-brand">
              ✓ 무료 현장 실사 · ✓ 세금계산서 발행
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
          {businessTypes.map((t) => (
            <div
              key={t.slug}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl">{t.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{t.label}</h3>
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
          문의부터 정산까지 6단계
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.no}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-2xl">
                {s.icon}
              </div>
              <p className="mt-4 font-inter text-xs font-bold tracking-wider text-brand uppercase">
                Step {s.no}
              </p>
              <h3 className="mt-1 text-lg font-bold text-gray-900">{s.title}</h3>
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
            to="/quote?scope=business"
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
