import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocalState } from '../hooks/useLocalState'
import { maskKoreanNamesInText } from '../utils/userDisplay'
import { addNotification } from '../utils/notifications'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 파트너 자주 묻는 질문 초기값 — 관리자가 추가·수정·삭제하면 localStorage에 반영
const DEFAULT_FAQS = [
  {
    id: 1,
    q: '가입 비용이나 광고비가 있나요?',
    a: '가입은 무료입니다. 입찰에 참여하고 낙찰될 때만 합리적인 수수료가 발생합니다.',
  },
  {
    id: 2,
    q: '아무 업체나 가입할 수 있나요?',
    a: '사업자등록을 마친 이사업체라면 누구나 가입할 수 있습니다. 일부 정보는 검증 절차를 거칩니다.',
  },
  {
    id: 3,
    q: '입찰은 어떻게 하나요?',
    a: '대시보드에서 들어온 견적 요청을 확인하고, 가격과 한 줄 소개를 적어 제출하면 됩니다.',
  },
  {
    id: 4,
    q: '수수료는 얼마인가요?',
    a: '낙찰 시 합리적인 수수료가 발생합니다. 자세한 비율은 가입 후 안내드립니다.',
  },
]

// 질문 카드 (답변/수정/삭제는 관리자만)
function QaCard({ qa, onAnswer, onDeleteAnswer, onDeleteQuestion, isAdmin }) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState('')

  function save() {
    if (!draft.trim()) return
    onAnswer(qa.id, draft.trim())
    setDraft('')
    setOpen(false)
  }
  function startEdit() {
    setEditDraft(qa.a)
    setEditing(true)
  }
  function saveEdit() {
    if (!editDraft.trim()) return
    onAnswer(qa.id, editDraft.trim())
    setEditing(false)
  }

  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="font-inter text-lg font-bold text-brand">Q</span>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{qa.q}</p>
          <p className="mt-1 text-xs text-gray-400">{qa.name}</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDeleteQuestion(qa.id)}
            className="text-xs font-semibold text-red-500 hover:text-red-700"
          >
            질문 삭제
          </button>
        )}
      </div>

      {qa.a && !editing ? (
        <div className="mt-4 rounded-2xl bg-brand-bg p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
              관리자 답변
            </span>
            {isAdmin && (
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={startEdit}
                  className="font-semibold text-gray-600 hover:text-brand"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteAnswer(qa.id)}
                  className="font-semibold text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 leading-relaxed text-gray-700">
            {maskKoreanNamesInText(qa.a)}
          </p>
        </div>
      ) : editing ? (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <textarea
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            rows={3}
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : isAdmin ? (
        open ? (
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="관리자 답변을 입력하세요."
              className={inputClass}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={save}
                className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                답변 등록
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 text-sm font-semibold text-brand hover:underline"
          >
            + 답변 작성 (관리자)
          </button>
        )
      ) : (
        <p className="mt-3 text-sm text-gray-400">
          관리자 답변을 기다리는 중입니다.
        </p>
      )}
    </article>
  )
}

function PartnerFaqPage() {
  const { user, isAdmin } = useAuth()
  const [questions, setQuestions] = useLocalState('movingday_partner_qa', [])
  // 파트너 FAQ — 관리자 작성·수정·삭제
  const [faqs, setFaqs] = useLocalState('movingday_partner_faqs', DEFAULT_FAQS)
  const [faqOpen, setFaqOpen] = useState(false)
  const [editingFaqId, setEditingFaqId] = useState(null)
  const editingFaq = editingFaqId ? faqs.find((f) => f.id === editingFaqId) : null
  // 전체보기 화살표/메뉴 진입 시 글만 노출 — 작성은 토글로
  const [showAsk, setShowAsk] = useState(false)

  function submitFaq(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const q = fd.get('q')?.toString().trim()
    const a = fd.get('a')?.toString().trim()
    if (!q || !a) return
    if (editingFaqId) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFaqId ? { ...f, q, a } : f)),
      )
      setEditingFaqId(null)
    } else {
      setFaqs((prev) => [...prev, { id: Date.now(), q, a }])
    }
    e.currentTarget.reset()
    setFaqOpen(false)
  }
  function removeFaq(id) {
    if (!window.confirm('이 FAQ를 삭제할까요?')) return
    setFaqs((prev) => prev.filter((f) => f.id !== id))
  }
  function startEditFaq(f) {
    setEditingFaqId(f.id)
    setFaqOpen(true)
  }
  function cancelFaq() {
    setFaqOpen(false)
    setEditingFaqId(null)
  }

  function ask(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.toString().trim()
    const text = fd.get('q')?.toString().trim()
    if (!name || !text) return
    setQuestions((prev) => [
      {
        id: Date.now(),
        name,
        q: text,
        a: '',
        authorEmail: user?.email || '',
      },
      ...prev,
    ])
    e.currentTarget.reset()
    setShowAsk(false)
  }

  function answer(id, text) {
    setQuestions((prev) =>
      prev.map((qa) => (qa.id === id ? { ...qa, a: text } : qa)),
    )
    const target = questions.find((qa) => qa.id === id)
    addNotification({
      type: 'reply',
      message: target
        ? `${target.name}님의 질문에 관리자 답변이 달렸어요.`
        : '관리자 답변이 등록되었어요.',
      link: '/partner/faq',
      to: target?.authorEmail || '',
    })
  }
  function deleteAnswer(id) {
    setQuestions((prev) =>
      prev.map((qa) => (qa.id === id ? { ...qa, a: '' } : qa)),
    )
  }
  function deleteQuestion(id) {
    if (!window.confirm('이 질문을 삭제할까요?')) return
    setQuestions((prev) => prev.filter((qa) => qa.id !== id))
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h1>
      <p className="mt-2 text-gray-600">
        파트너 활동에 대한 궁금증을 먼저 확인하고, 없으면 직접 질문해 주세요.
      </p>

      {/* 관리자 FAQ 작성 토글 버튼 */}
      {isAdmin && !faqOpen && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setEditingFaqId(null)
              setFaqOpen(true)
            }}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            + FAQ 작성
          </button>
        </div>
      )}

      {/* 관리자 FAQ 작성/수정 폼 */}
      {isAdmin && faqOpen && (
        <form
          onSubmit={submitFaq}
          className="mt-6 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {editingFaqId ? 'FAQ 수정' : 'FAQ 작성'}
            </h3>
            <button
              type="button"
              onClick={cancelFaq}
              className="text-sm text-gray-500 hover:text-brand"
            >
              닫기
            </button>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">질문</span>
            <input
              type="text"
              name="q"
              required
              defaultValue={editingFaq?.q || ''}
              placeholder="자주 묻는 질문"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">답변</span>
            <textarea
              name="a"
              rows={4}
              required
              defaultValue={editingFaq?.a || ''}
              placeholder="답변 내용"
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            {editingFaqId ? '수정 저장' : 'FAQ 등록'}
          </button>
        </form>
      )}

      {/* 자주 묻는 질문 (아코디언) */}
      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.id}
            className="group rounded-2xl border border-gray-100 bg-white p-5"
          >
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
              {f.q}
              <span className="text-xl text-brand transition group-open:rotate-45">
                ＋
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-gray-600">{f.a}</p>
            {isAdmin && (
              <div className="mt-3 flex gap-2 border-t border-gray-200 pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => startEditFaq(f)}
                  className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-600 transition hover:border-brand hover:text-brand"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => removeFaq(f.id)}
                  className="rounded-full border border-red-300 px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            )}
          </details>
        ))}
      </div>

      {/* 직접 질문하기 (토글) */}
      <div className="mt-12 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">직접 질문하기</h2>
          <p className="mt-2 text-sm text-gray-500">
            자주 묻는 질문에 없으면 직접 남겨주세요. 관리자가 답변해 드립니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAsk((v) => !v)}
          className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {showAsk ? '폼 닫기' : '+ 질문하기'}
        </button>
      </div>

      {showAsk && (
      <form
        onSubmit={ask}
        className="mt-4 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">업체명</span>
          <input
            type="text"
            name="name"
            required
            placeholder="예: 한솔이사"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">질문 내용</span>
          <textarea
            name="q"
            rows={3}
            required
            placeholder="파트너 활동 관련 궁금한 점을 적어주세요."
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          질문 등록
        </button>
      </form>
      )}

      {/* 질문 목록 */}
      <div className="mt-8 space-y-4">
        {questions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl">💬</p>
            <p className="mt-3 font-semibold text-gray-700">
              아직 등록된 질문이 없어요
            </p>
            <p className="mt-1 text-sm text-gray-500">
              위에서 첫 질문을 남겨보세요.
            </p>
          </div>
        ) : (
          questions.map((qa) => (
            <QaCard
              key={qa.id}
              qa={qa}
              onAnswer={answer}
              onDeleteAnswer={deleteAnswer}
              onDeleteQuestion={deleteQuestion}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default PartnerFaqPage
