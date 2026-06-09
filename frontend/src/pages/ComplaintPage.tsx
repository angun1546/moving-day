import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { formatDate } from '../utils/date'
import {
  getComplaints,
  getMyComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../services/complaints'
import type { Complaint } from '../data/apiTypes'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

const STATUS = ['접수', '처리중', '완료']
const statusStyle: Record<string, string> = {
  접수: 'bg-gray-100 text-gray-600',
  처리중: 'bg-amber-100 text-amber-700',
  완료: 'bg-brand-light text-brand-dark',
}

// 불편사항 접수 — 누구나 제출, 관리자는 아래에서 상태·답변 처리
function ComplaintPage() {
  const { user, isAdmin } = useAuth()
  const confirm = useConfirm()
  const [done, setDone] = useState(false)
  const [items, setItems] = useState<Complaint[]>([])
  const [mine, setMine] = useState<Complaint[]>([])

  // 관리자만 접수 목록 조회
  useEffect(() => {
    if (!isAdmin) return
    getComplaints()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
  }, [isAdmin])

  // 로그인 사용자(비관리자)는 본인 접수 내역 조회
  function loadMine() {
    if (!user?.email || isAdmin) return
    getMyComplaints()
      .then((d) => setMine(Array.isArray(d) ? d : []))
      .catch(() => setMine([]))
  }
  useEffect(loadMine, [user?.email, isAdmin])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = fd.get('name')?.toString().trim()
    const contact = fd.get('contact')?.toString().trim()
    const content = fd.get('content')?.toString().trim()
    if (!name || !contact || !content) return
    try {
      await createComplaint({
        name,
        contact,
        content,
        authorEmail: user?.email || undefined,
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

  async function setStatus(id: string, status: string) {
    try {
      const updated = await updateComplaint(id, { status })
      setItems((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch {
      // 무시
    }
  }

  async function saveReply(id: string, reply: string) {
    try {
      const updated = await updateComplaint(id, { reply })
      setItems((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch {
      // 무시
    }
  }

  async function remove(id: string) {
    if (!(await confirm({ title: '삭제', message: '이 접수를 삭제할까요?', danger: true })))
      return
    try {
      await deleteComplaint(id)
      setItems((prev) => prev.filter((c) => c.id !== id))
    } catch {
      // 무시
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        Support
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">불편사항 접수</h1>
      <p className="mt-3 text-gray-600">
        이용 중 불편한 점을 남겨주시면 빠르게 확인하고 개선하겠습니다.
      </p>

      {done ? (
        <div className="mt-8 rounded-3xl border border-brand-light bg-brand-light/30 p-8 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-3 font-semibold text-gray-800">접수되었습니다</p>
          <p className="mt-1 text-sm text-gray-500">
            확인 후 남겨주신 연락처로 안내드릴게요.
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-6 rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
          >
            추가 접수하기
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
            <span className="text-sm font-semibold text-gray-800">내용</span>
            <textarea
              name="content"
              rows={5}
              required
              placeholder="불편하셨던 점을 자세히 적어주세요."
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            접수하기
          </button>
        </form>
      )}

      {/* 로그인 사용자: 내 접수 내역 (읽기 전용) */}
      {user && !isAdmin && mine.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">
            내 접수 내역 <span className="text-brand">{mine.length}</span>
          </h2>
          <div className="mt-4 space-y-3">
            {mine.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyle[c.status] || statusStyle['접수']}`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="mt-2 leading-relaxed whitespace-pre-line text-gray-700">
                  {c.content}
                </p>
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

      {/* 관리자: 접수 목록 처리 */}
      {isAdmin && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">
            접수 목록 <span className="text-brand">{items.length}</span>
          </h2>
          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
                접수된 불편사항이 없습니다.
              </p>
            ) : (
              items.map((c) => (
                <article
                  key={c.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyle[c.status] || statusStyle['접수']}`}
                        >
                          {c.status}
                        </span>
                        <span className="font-semibold text-gray-900">{c.name}</span>
                        <span className="text-xs text-gray-400">{c.contact}</span>
                      </div>
                      <p className="mt-2 leading-relaxed whitespace-pre-line text-gray-700">
                        {c.content}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="shrink-0 rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">상태</span>
                    {STATUS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(c.id, s)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          c.status === s
                            ? 'bg-brand text-white'
                            : 'border border-gray-300 text-gray-600 hover:border-brand hover:text-brand'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <textarea
                    defaultValue={c.reply || ''}
                    rows={2}
                    placeholder="답변을 입력하고 저장하세요."
                    className={inputClass}
                    onBlur={(e) => {
                      if (e.target.value !== (c.reply || '')) saveReply(c.id, e.target.value)
                    }}
                  />
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default ComplaintPage
