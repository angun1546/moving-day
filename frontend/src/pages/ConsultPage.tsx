import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { formatDate } from '../utils/date'
import { createConsult, getMyConsults } from '../services/consults'
import type { Consult } from '../data/apiTypes'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 이사 종류 — 견적 폼과 동일 항목
const MOVE_TYPES = ['포장이사', '반포장이사', '일반이사', '사무실이사']

const statusStyle: Record<string, string> = {
  접수: 'bg-gray-100 text-gray-600',
  상담중: 'bg-amber-100 text-amber-700',
  완료: 'bg-brand-light text-brand-dark',
}

// 상담 신청 — 누구나 제출, 회원은 본인 신청 내역 확인. 관리자 처리는 대시보드에서.
function ConsultPage() {
  const { user, isAdmin } = useAuth()
  const confirm = useConfirm()
  const [done, setDone] = useState(false)
  const [mine, setMine] = useState<Consult[]>([])

  // 로그인 사용자(비관리자)는 본인 신청 내역 조회
  function loadMine() {
    if (!user?.username || isAdmin) return
    getMyConsults()
      .then((d) => setMine(Array.isArray(d) ? d : []))
      .catch(() => setMine([]))
  }
  useEffect(loadMine, [user?.username, isAdmin])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = fd.get('name')?.toString().trim()
    const contact = fd.get('contact')?.toString().trim()
    const moveType = fd.get('moveType')?.toString().trim()
    const content = fd.get('content')?.toString().trim()
    if (!name || !contact || !moveType || !content) return
    try {
      await createConsult({
        name,
        contact,
        moveType,
        content,
        authorEmail: user?.username || undefined,
      })
      form.reset()
      setDone(true)
      loadMine()
    } catch (err) {
      await confirm({
        title: '접수 실패',
        message: err instanceof Error ? err.message : '접수에 실패했습니다.',
        alertOnly: true,
      })
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Consulting
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">맞춤 상담신청</h1>
      <p className="mt-3 text-gray-600">
        연락처를 남겨주시면 전문 상담원이 빠르게 연락드려 이사를 도와드릴게요.
      </p>

      {done ? (
        <div className="mt-8 rounded-3xl border border-brand-light bg-brand-light/30 p-8 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-3 font-semibold text-gray-800">상담신청이 접수되었습니다</p>
          <p className="mt-1 text-sm text-gray-500">
            남겨주신 연락처로 곧 연락드릴게요.
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-6 rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
          >
            추가 신청하기
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="mt-8 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">이름</span>
            <input type="text" name="name" required placeholder="홍길동" className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">연락처</span>
            <input
              type="text"
              name="contact"
              required
              placeholder="010-0000-0000 또는 이메일"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">이사 종류</span>
            <select name="moveType" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                이사 종류를 선택해 주세요
              </option>
              {MOVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">상담 내용</span>
            <textarea
              name="content"
              rows={5}
              required
              placeholder="이사 예정일, 출발·도착지, 궁금한 점 등을 자유롭게 적어주세요."
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            상담 신청하기
          </button>
        </form>
      )}

      {/* 로그인 사용자: 내 신청 내역 (읽기 전용) */}
      {user && !isAdmin && mine.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">
            내 상담신청 내역 <span className="text-brand">{mine.length}</span>
          </h2>
          <div className="mt-4 space-y-3">
            {mine.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyle[c.status] || statusStyle['접수']}`}
                  >
                    {c.status}
                  </span>
                  {c.moveType && (
                    <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
                      {c.moveType}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                {c.content && (
                  <p className="mt-2 leading-relaxed whitespace-pre-line text-gray-700">
                    {c.content}
                  </p>
                )}
                {c.reply && (
                  <div className="mt-3 rounded-xl bg-brand-bg p-3">
                    <p className="text-xs font-semibold text-brand">답변</p>
                    <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-gray-700">
                      {c.reply}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default ConsultPage
