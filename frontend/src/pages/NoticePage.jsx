import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocalState } from '../hooks/useLocalState'
import { todayString } from '../utils/date'
import { addNotification } from '../utils/notifications'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 공지사항 — 관리자만 작성/수정/삭제, 모든 사용자는 읽기 (유저/파트너 사이트 공유)
function NoticePage() {
  const { isAdmin } = useAuth()
  const [notices, setNotices] = useLocalState('movingday_notices', [])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const editing = editingId ? notices.find((n) => n.id === editingId) : null

  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const title = fd.get('title')?.toString().trim()
    const body = fd.get('body')?.toString().trim()
    if (!title || !body) return
    if (editingId) {
      setNotices((prev) =>
        prev.map((n) => (n.id === editingId ? { ...n, title, body } : n)),
      )
      setEditingId(null)
      addNotification({
        type: 'notice',
        message: `공지가 수정되었어요: ${title}`,
        link: '/notice',
      })
    } else {
      setNotices((prev) => [
        { id: Date.now(), title, body, date: todayString() },
        ...prev,
      ])
      addNotification({
        type: 'notice',
        message: `새 공지: ${title}`,
        link: '/notice',
      })
    }
    e.currentTarget.reset()
    setOpen(false)
  }

  function remove(id) {
    if (!window.confirm('이 공지를 삭제할까요?')) return
    setNotices((prev) => prev.filter((n) => n.id !== id))
  }

  function startEdit(notice) {
    setEditingId(notice.id)
    setOpen(true)
  }

  function cancel() {
    setOpen(false)
    setEditingId(null)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
      <p className="mt-3 text-gray-600">
        이삿날의 최신 소식과 업데이트를 확인하세요.
      </p>

      {/* 관리자 작성/수정 폼 (토글) */}
      {isAdmin && open && (
        <form
          onSubmit={submit}
          className="mt-6 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? '공지 수정' : '공지 작성'}
            </h2>
            <button
              type="button"
              onClick={cancel}
              className="text-sm text-gray-500 hover:text-brand"
            >
              닫기
            </button>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">제목</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={editing?.title || ''}
              placeholder="공지 제목"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">내용</span>
            <textarea
              name="body"
              rows={5}
              required
              defaultValue={editing?.body || ''}
              placeholder="공지 내용을 입력하세요."
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            {editingId ? '수정 저장' : '공지 등록'}
          </button>
        </form>
      )}

      {/* 목록 */}
      <div className="mt-8 space-y-3">
        {notices.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">📢</p>
            <p className="mt-3 font-semibold text-gray-700">
              등록된 공지가 없어요
            </p>
            {isAdmin && (
              <p className="mt-1 text-sm text-gray-500">
                아래 “+ 공지 작성”으로 첫 공지를 등록해 주세요.
              </p>
            )}
          </div>
        ) : (
          notices.map((n) => (
            <article
              key={n.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{n.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">{n.date}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => startEdit(n)}
                      className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(n.id)}
                      className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-gray-700">
                {n.body}
              </p>
            </article>
          ))
        )}
      </div>

      {/* 작성 토글 버튼 (관리자만) */}
      {isAdmin && !open && (
        <button
          type="button"
          onClick={() => {
            setEditingId(null)
            setOpen(true)
          }}
          className="mt-8 w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          + 공지 작성
        </button>
      )}
    </section>
  )
}

export default NoticePage
