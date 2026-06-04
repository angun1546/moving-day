import { Link } from 'react-router-dom'

// 무빙 브이로그 — 영상 썸네일 그리드(영상 업로드 시 썸네일 노출). 현재 데이터 없음(공란)
interface Vlog {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  date: string
}

const vlogs: Vlog[] = []

function VlogPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <Link
        to="/projects"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 무빙 프로젝트
      </Link>
      <p className="mt-4 font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Vlog
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
        무빙 브이로그
      </h1>
      <p className="mt-3 text-gray-600">영상으로 보는 이사 현장.</p>

      {vlogs.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <p className="text-4xl">🎬</p>
          <p className="mt-4 font-semibold text-gray-700">아직 등록된 영상이 없어요</p>
          <p className="mt-1 text-sm text-gray-500">
            영상이 업로드되면 썸네일이 이곳에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vlogs.map((v) => (
            <a
              key={v.id}
              href={v.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="h-48 w-full object-cover"
                />
                {/* 재생 버튼 오버레이 */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition group-hover:bg-brand">
                    ▶
                  </span>
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400">{v.date}</p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  {v.title}
                </h2>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}

export default VlogPage
