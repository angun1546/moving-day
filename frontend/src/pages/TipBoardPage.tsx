import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { formatDate } from '../utils/date'
import { getTips, createTip, updateTip, deleteTip } from '../services/tips'
import type { Tip } from '../data/apiTypes'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 팁 게시판 — 누구나 열람, 관리자는 작성·수정·삭제
function TipBoardPage() {
  const { isAdmin } = useAuth()
  const confirm = useConfirm()
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    getTips()
      .then((d) => setTips(Array.isArray(d) ? d : []))
      .catch(() => setTips([]))
      .finally(() => setLoading(false))
  }, [])

  const editing = editId ? tips.find((t) => t.id === editId) : null

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const title = fd.get('title')?.toString().trim()
    const content = fd.get('content')?.toString().trim()
    const category = fd.get('category')?.toString().trim() || undefined
    if (!title || !content) return
    try {
      if (editId) {
        const updated = await updateTip(editId, { title, content, category })
        setTips((prev) => prev.map((t) => (t.id === editId ? updated : t)))
        setEditId(null)
      } else {
        const created = await createTip({ title, content, category })
        setTips((prev) => [created, ...prev])
      }
      form.reset()
      setOpen(false)
    } catch (err) {
      await confirm({
        title: '저장 실패',
        message: err instanceof Error ? err.message : '저장에 실패했습니다.',
        alertOnly: true,
      })
    }
  }

  async function remove(id: string) {
    if (!(await confirm({ title: '팁 삭제', message: '이 글을 삭제할까요?', danger: true })))
      return
    try {
      await deleteTip(id)
      setTips((prev) => prev.filter((t) => t.id !== id))
    } catch {
      // 무시
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            Tips
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">팁 게시판</h1>
          <p className="mt-3 text-gray-600">
            이사를 똑똑하게 준비하는 데 도움이 되는 팁을 모았어요.
          </p>
        </div>
        {isAdmin && !open && (
          <button
            type="button"
            onClick={() => {
              setEditId(null)
              setOpen(true)
            }}
            className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            + 팁 작성
          </button>
        )}
      </div>

      {isAdmin && open && (
        <form
          onSubmit={submit}
          className="mt-6 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {editId ? '팁 수정' : '팁 작성'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setEditId(null)
              }}
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
              placeholder="팁 제목"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">분류 (선택)</span>
            <input
              type="text"
              name="category"
              defaultValue={editing?.category || ''}
              placeholder="예: 포장, 일정, 비용"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">내용</span>
            <textarea
              name="content"
              rows={5}
              required
              defaultValue={editing?.content || ''}
              placeholder="팁 내용을 입력하세요."
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            {editId ? '수정 저장' : '팁 등록'}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-center text-gray-400">불러오는 중…</p>
        ) : tips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center">
            <p className="text-4xl">💡</p>
            <p className="mt-4 font-semibold text-gray-700">아직 등록된 팁이 없어요</p>
            <p className="mt-1 text-sm text-gray-500">
              유용한 이사 팁이 올라오면 이곳에 표시됩니다.
            </p>
          </div>
        ) : (
          tips.map((t) => (
            <article
              key={t.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {t.category && (
                    <span className="inline-block rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
                      {t.category}
                    </span>
                  )}
                  <h2 className="mt-1 text-lg font-bold text-gray-900">{t.title}</h2>
                  <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(t.id)
                        setOpen(true)
                      }}
                      className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(t.id)}
                      className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-gray-700">
                {t.content}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default TipBoardPage
