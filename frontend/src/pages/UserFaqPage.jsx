import { useState } from 'react'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 자주 묻는 질문 (정적)
const FAQS = [
  {
    q: '견적은 무료인가요?',
    a: '네, 견적 신청과 비교는 모두 무료입니다. 실제 이사 진행 시에만 업체와 직접 거래합니다.',
  },
  {
    q: '신청 후 얼마나 기다려야 하나요?',
    a: '보통 1영업일 이내에 여러 업체의 입찰이 들어옵니다.',
  },
  {
    q: '비회원도 견적 신청이 가능한가요?',
    a: '네, 회원가입 없이도 견적 신청이 가능합니다.',
  },
  {
    q: '취소나 환불은 어떻게 하나요?',
    a: '낙찰 전에는 언제든 취소할 수 있고, 낙찰 후엔 선택한 업체와 직접 협의해 주세요.',
  },
]

// 질문 카드 (답변 토글 — 목업: 누구나 관리자 답변 입력 가능)
function QaCard({ qa, onAnswer }) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)

  function save() {
    if (!draft.trim()) return
    onAnswer(qa.id, draft.trim())
    setDraft('')
    setOpen(false)
  }

  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="font-inter text-lg font-bold text-brand">Q</span>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{qa.q}</p>
          <p className="mt-1 text-xs text-gray-400">{qa.name}</p>
        </div>
      </div>

      {qa.a ? (
        <div className="mt-4 rounded-2xl bg-brand-bg p-4">
          <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
            관리자 답변
          </span>
          <p className="mt-2 leading-relaxed text-gray-700">{qa.a}</p>
        </div>
      ) : open ? (
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
      )}
    </article>
  )
}

function UserFaqPage() {
  const [questions, setQuestions] = useState([]) // 유저 Q&A (목업: 세션 내)

  function ask(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.toString().trim()
    const text = fd.get('q')?.toString().trim()
    if (!name || !text) return
    setQuestions((prev) => [
      { id: Date.now(), name, q: text, a: '' },
      ...prev,
    ])
    e.currentTarget.reset()
  }

  function answer(id, text) {
    setQuestions((prev) =>
      prev.map((qa) => (qa.id === id ? { ...qa, a: text } : qa)),
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">자주 묻는 질문</h1>
      <p className="mt-3 text-gray-600">
        궁금한 점을 먼저 찾아보고, 없으면 아래에서 직접 질문해 주세요.
      </p>

      {/* 자주 묻는 질문 (아코디언) */}
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

      {/* 직접 질문하기 */}
      <h2 className="mt-12 text-xl font-bold text-gray-900">직접 질문하기</h2>
      <p className="mt-2 text-sm text-gray-500">
        자주 묻는 질문에 없으면 직접 남겨주세요. 관리자가 답변해 드립니다.
      </p>

      <form
        onSubmit={ask}
        className="mt-4 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            이름 또는 닉네임
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder="예: 김O영"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">질문 내용</span>
          <textarea
            name="q"
            rows={3}
            required
            placeholder="궁금한 점을 자유롭게 적어주세요."
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
            <QaCard key={qa.id} qa={qa} onAnswer={answer} />
          ))
        )}
      </div>
    </section>
  )
}

export default UserFaqPage
