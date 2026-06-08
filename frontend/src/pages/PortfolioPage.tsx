import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProjectPost } from '../data/apiTypes'
import { getProjects } from '../services/projects'

// 포트폴리오 — 사진 + 글(서버 연동, kind='portfolio')
function PortfolioPage() {
  const [posts, setPosts] = useState<ProjectPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects('portfolio')
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <Link
        to="/projects"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 무빙 프로젝트
      </Link>
      <p className="mt-4 font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Portfolio
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
        포트폴리오
      </h1>
      <p className="mt-3 text-gray-600">대표 이사·서비스 사례를 사진과 글로 소개해요.</p>

      {loading ? (
        <p className="mt-10 text-center text-gray-400">불러오는 중…</p>
      ) : posts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <p className="text-4xl">📁</p>
          <p className="mt-4 font-semibold text-gray-700">아직 등록된 사례가 없어요</p>
          <p className="mt-1 text-sm text-gray-500">
            대표 사례가 정리되면 이곳에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-5">
                <p className="text-xs text-gray-400">{p.createdAt.slice(0, 10)}</p>
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

export default PortfolioPage
