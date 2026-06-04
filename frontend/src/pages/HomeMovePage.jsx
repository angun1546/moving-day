import { Link } from 'react-router-dom'
import { homeTypes } from '../data/quoteOptions'

// 가정이사 전용 랜딩 — 개인 고객(원룸~대형 평수) 대상
// 이사종류는 견적 종류 중 가정 그룹(homeTypes)을 단일 출처로 재사용

// 강점(왜 이삿날)
const STRENGTHS = [
  { icon: '🔍', title: '투명한 비교견적', desc: '검증된 업체들의 견적을 한 번에 비교하고 고를 수 있어요.' },
  { icon: '🛡️', title: '파손 보상', desc: '만일의 사고도 투명한 보상 절차로 끝까지 안심하세요.' },
  { icon: '🧹', title: '정리정돈까지', desc: '짐 싸기부터 운반·배치·정리까지 깔끔하게 마무리해요.' },
  { icon: '💳', title: '합리적인 가격', desc: '불필요한 추가금 없이 명확한 비용으로 안내해 드려요.' },
]

// 진행 절차 — 이삿날 매칭(여러 업체 비교견적) 방식에 맞춘 6단계
const STEPS = [
  { no: '01', icon: '📝', title: '견적 신청', desc: '이사 방식·종류를 고르고 간단히 정보를 입력해요.' },
  { no: '02', icon: '🔎', title: '견적 산정', desc: '방문·사진·전화 중 택한 방식으로 짐 물량을 확인해요.' },
  { no: '03', icon: '⚖️', title: '업체 입찰·비교', desc: '검증된 여러 업체의 견적을 한눈에 비교해요.' },
  { no: '04', icon: '🤝', title: '업체 선정', desc: '후기와 가격을 보고 마음에 드는 업체를 선택해요.' },
  { no: '05', icon: '🚚', title: '이사 진행', desc: '약속한 날짜에 안전하게 진행하고 상태를 실시간 확인해요.' },
  { no: '06', icon: '✅', title: '마무리·정산', desc: '정리 상태를 확인하고 간편하게 결제·후기를 남겨요.' },
]

function HomeMovePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              For Home
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              우리 집 이사,
              <br />
              <span className="text-brand">걱정 없이 시작하세요.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              원룸부터 대형 평수까지. 검증된 이사 업체의 견적을 무료로 비교하고,
              합리적인 가격에 안심하고 맡기세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/quote?scope=home"
                className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                무료 견적 신청
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-brand">
              ✓ 무료 견적 비교 · ✓ 파손 보상 · ✓ 검증된 업체
            </p>
          </div>
        </div>
      </section>

      {/* 이사 종류 */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Service
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          이런 이사를 도와드려요
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {homeTypes.map((t) => (
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

      {/* 강점 */}
      <section className="bg-brand-light/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            Why
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            이사, 이삿날이 더 쉽습니다
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
          신청부터 정산까지 6단계
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
            우리 집 이사, 견적부터 받아보세요
          </h2>
          <p className="mt-3 text-brand-light">
            출발지·도착지와 일정만 알려주시면 업체들이 바로 견적을 보내드려요.
          </p>
          <Link
            to="/quote?scope=home"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand transition hover:-translate-y-0.5"
          >
            무료 견적 신청하기
          </Link>
        </div>
      </section>
    </>
  )
}

export default HomeMovePage
