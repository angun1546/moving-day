import { Link } from 'react-router-dom'

// 무빙 프로젝트 메인 — 프로젝트 실적 소개(데이터 없음·공란) + 갤러리/포트폴리오/브이로그 진입

const SECTIONS = [
  { to: '/projects/gallery', icon: '🖼️', title: '프로젝트 갤러리', desc: '사진과 글로 기록한 이사 현장 이야기.' },
  { to: '/projects/portfolio', icon: '📁', title: '포트폴리오', desc: '대표 이사·서비스 사례 모음.' },
  { to: '/projects/vlog', icon: '🎬', title: '무빙 브이로그', desc: '영상으로 보는 이사 현장.' },
]

function ProjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-inter text-xs font-bold tracking-wider text-brand-dark uppercase">
              Project
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              무빙 프로젝트
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              이삿날이 함께한 이사 현장의 기록과 실적을 모았어요.
            </p>
          </div>
        </div>
      </section>

      {/* 둘러보기 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{s.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-brand">
                {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 프로젝트 실적 — 데이터 없음(공란) */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
          Records
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">프로젝트 실적</h2>
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <p className="text-4xl">📊</p>
          <p className="mt-4 font-semibold text-gray-700">아직 등록된 실적이 없어요</p>
          <p className="mt-1 text-sm text-gray-500">
            진행한 프로젝트가 쌓이면 이곳에 표시됩니다.
          </p>
        </div>
      </section>
    </>
  )
}

export default ProjectsPage
