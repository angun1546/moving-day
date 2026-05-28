// 견적 신청 진행 단계 표시 (방식 → 종류 → 정보 입력)
const STEPS = ['견적 방식', '이사 종류', '정보 입력']

function QuoteSteps({ current }) {
  return (
    <ol className="mx-auto mb-10 flex max-w-lg items-center">
      {STEPS.map((label, idx) => {
        const step = idx + 1
        const done = step < current
        const active = step === current
        const on = done || active
        const last = step === STEPS.length
        return (
          <li
            key={label}
            className={`flex items-center ${last ? 'flex-none' : 'flex-1'}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                  on ? 'bg-brand text-white' : 'bg-gray-200 text-gray-400'
                } ${active ? 'ring-4 ring-brand-light' : ''}`}
              >
                {done ? '✓' : step}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  active
                    ? 'font-bold text-brand'
                    : done
                      ? 'font-semibold text-gray-700'
                      : 'font-medium text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {!last && (
              <span
                className={`mx-3 h-0.5 flex-1 rounded ${done ? 'bg-brand' : 'bg-gray-200'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default QuoteSteps
