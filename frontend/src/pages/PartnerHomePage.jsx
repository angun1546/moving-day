import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReviewCarousel from '../components/ReviewCarousel'
import { useLocalState } from '../hooks/useLocalState'

const STATS = [
  { value: '320+', label: '일 평균 견적 요청' },
  { value: '4,800+', label: '활동 중인 파트너' },
  { value: '12,000+', label: '누적 매칭' },
  { value: '4.8', label: '파트너 평균 평점' },
]

// 대표 혜택(고객 유입)은 넓게 강조, 나머지는 벤토 카드
const BENEFITS = [
  {
    icon: '🙋',
    title: '고객이 먼저 찾아옵니다',
    desc: '광고비 들여 영업하지 마세요. 이사 예정 고객이 매일 견적을 요청합니다.',
    featured: true,
  },
  {
    icon: '🎯',
    title: '원하는 건만 입찰',
    desc: '지역·이사 종류·날짜를 보고 마음에 드는 건만 골라 입찰하세요.',
  },
  {
    icon: '📱',
    title: '비대면으로 간편하게',
    desc: '현장 방문 없이 사진과 정보만으로 견적을 보낼 수 있어요.',
  },
  {
    icon: '🛡️',
    title: '안전한 거래',
    desc: '검증된 고객과 투명한 매칭 내역으로 안심하고 일하세요.',
  },
]

const STEPS = [
  { no: '01', title: '파트너 가입', desc: '사업자 정보로 1분이면 가입 완료' },
  { no: '02', title: '업체 정보 등록', desc: '서비스 지역과 강점을 입력하세요' },
  { no: '03', title: '견적 요청에 입찰', desc: '들어온 요청에 가격과 메시지 제출' },
  { no: '04', title: '고객과 매칭', desc: '낙찰되면 고객과 바로 연결됩니다' },
]

const FAQS = [
  {
    q: '가입 비용이나 광고비가 있나요?',
    a: '가입은 무료입니다. 입찰에 참여하고 낙찰될 때만 합리적인 수수료가 발생합니다.',
  },
  {
    q: '아무 업체나 가입할 수 있나요?',
    a: '사업자등록을 마친 이사업체라면 누구나 가입할 수 있습니다. 일부 정보는 검증 절차를 거칩니다.',
  },
  {
    q: '입찰은 어떻게 하나요?',
    a: '대시보드에서 들어온 견적 요청을 확인하고, 가격과 한 줄 소개를 적어 제출하면 됩니다.',
  },
]

function PartnerHomePage() {
  // 업체 정보 등록 여부 (목업: localStorage 플래그)
  const [profileSaved, setProfileSaved] = useState(false)
  useEffect(() => {
    setProfileSaved(localStorage.getItem('partnerProfileSaved') === 'true')
  }, [])

  // 작성된 파트너 스토리 (영속화)
  const [stories] = useLocalState('movingday_partner_stories', [])
  const storyDisplay = stories.map((s) => ({
    id: s.id,
    name: s.company,
    rating: s.rating,
    tag: '파트너 후기',
    text: s.text,
    date: s.date || '',
  }))

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              For Partners
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              일감을 찾아 헤매지 마세요,
              <br />
              <span className="text-brand">고객이 먼저 찾아옵니다.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              매일 수백 건의 이사 견적 요청이 들어옵니다. 원하는 건만 골라
              입찰하고, 광고비 없이 새로운 고객을 만나보세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {profileSaved ? (
                <Link
                  to="/partner/dashboard"
                  className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
                >
                  입찰 시작하기
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  title="업체 정보를 먼저 등록해 주세요"
                  className="cursor-not-allowed rounded-full bg-gray-200 px-7 py-3 text-center font-semibold text-gray-400"
                >
                  입찰 시작하기
                </button>
              )}
              <Link
                to="/partner/profile"
                className={
                  profileSaved
                    ? 'rounded-full border border-gray-300 bg-white px-7 py-3 text-center font-semibold text-gray-700 transition hover:border-brand hover:text-brand'
                    : 'rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark'
                }
              >
                {profileSaved ? '업체 정보 등록' : '업체 정보 등록하기'}
              </Link>
            </div>
            {!profileSaved && (
              <p className="mt-3 text-sm font-medium text-amber-700">
                ⚠️ 업체 정보를 먼저 등록해야 입찰을 시작할 수 있어요.
              </p>
            )}
          </div>

          {/* 신뢰 지표 */}
          <dl className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
              >
                <dt className="font-inter text-2xl font-bold text-brand md:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-gray-500 md:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 혜택 (벤토) */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Why Partner
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          무브 마스터 파트너가 되면
        </h2>
        <p className="mt-3 text-gray-600">
          영업 대신 실력으로 승부하세요. 좋은 조건일수록 더 많이 낙찰됩니다.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {BENEFITS.map((b) =>
            b.featured ? (
              <div
                key={b.title}
                className="rounded-3xl bg-brand p-8 text-white transition hover:-translate-y-1 hover:shadow-lg md:col-span-2"
              >
                <span className="text-4xl">{b.icon}</span>
                <h3 className="mt-4 text-2xl font-bold">{b.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-brand-light">
                  {b.desc}
                </p>
              </div>
            ) : (
              <div
                key={b.title}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{b.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {b.desc}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* 시작 단계 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            How to Start
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            시작은 4단계면 충분해요
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.no}
                className="rounded-3xl bg-brand-bg p-6 transition hover:-translate-y-1"
              >
                <span className="font-inter text-3xl font-bold text-brand">
                  {s.no}
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 파트너 스토리 — 작성된 게 있으면 캐러셀, 없으면 빈 상태 */}
      {storyDisplay.length > 0 ? (
        <>
          <ReviewCarousel
            label="Partner Story"
            title="먼저 시작한 파트너들의 이야기"
            description="실제 활동 중인 파트너들의 솔직한 후기예요."
            reviews={storyDisplay}
          />
          <div className="mx-auto -mt-10 max-w-6xl px-4 pb-12 text-right">
            <Link
              to="/partner/story"
              className="text-sm font-semibold text-brand transition hover:underline"
            >
              내 후기 남기기 →
            </Link>
          </div>
        </>
      ) : (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            Partner Story
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            파트너들의 생생한 후기
          </h2>
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-4xl">✍️</p>
            <p className="mt-4 font-semibold text-gray-700">
              아직 등록된 후기가 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              무브 마스터 파트너의 첫 후기를 남겨주세요.
            </p>
            <Link
              to="/partner/story"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              후기 작성하기
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <div className="flex items-center justify-between">
            <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
              FAQ
            </p>
            <Link
              to="/partner/faq"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition hover:underline"
              aria-label="전체 FAQ 보기"
            >
              전체 보기 →
            </Link>
          </div>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            자주 묻는 질문
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-100 bg-brand-bg p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  {f.q}
                  <span className="text-xl text-brand transition group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bg-brand-dark">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            오늘부터, 새로운 고객을 만나보세요
          </h2>
          <p className="mt-3 text-brand-light">
            가입은 무료입니다. 1분이면 시작할 수 있어요.
          </p>
          <Link
            to={profileSaved ? '/partner/dashboard' : '/partner/profile'}
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand transition hover:-translate-y-0.5"
          >
            {profileSaved ? '무료로 파트너 시작하기' : '업체 정보 등록하기'}
          </Link>
        </div>
      </section>
    </>
  )
}

export default PartnerHomePage
