import { Link } from 'react-router-dom'

// 메인 FAQ 미리보기 (전체보기 → /faq)
const FAQS = [
  {
    q: '견적은 무료인가요?',
    a: '네, 견적 신청과 비교는 모두 무료입니다.',
  },
  {
    q: '신청 후 얼마나 기다려야 하나요?',
    a: '보통 1영업일 이내에 여러 업체의 입찰이 들어옵니다.',
  },
  {
    q: '비회원도 견적 신청이 가능한가요?',
    a: '네, 회원가입 없이도 가능합니다.',
  },
]

function Faq() {
  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="flex items-center justify-between">
          <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
            FAQ
          </p>
          <Link
            to="/faq"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition hover:underline"
            aria-label="전체 FAQ 보기"
          >
            전체 보기 →
          </Link>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          자주 묻는 질문
        </h2>

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
      </div>
    </section>
  )
}

export default Faq
