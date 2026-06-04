import { Link } from 'react-router-dom'

// 프로젝트 갤러리 — 블로그 형식(사진 + 글). 현재 데이터 없음(공란)
interface Post {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
}

const posts: Post[] = []

function GalleryPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <Link
        to="/projects"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 무빙 프로젝트
      </Link>
      <p className="mt-4 font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Gallery
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
        프로젝트 갤러리
      </h1>
      <p className="mt-3 text-gray-600">사진과 글로 기록한 이사 현장 이야기.</p>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <p className="text-4xl">🖼️</p>
          <p className="mt-4 font-semibold text-gray-700">아직 등록된 글이 없어요</p>
          <p className="mt-1 text-sm text-gray-500">
            사진과 이야기가 올라오면 이곳에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs text-gray-400">{p.date}</p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  {p.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {p.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default GalleryPage
