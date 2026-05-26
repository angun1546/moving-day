const STEPS = [
  { no: '01', title: '견적 신청', desc: '간단한 정보만 입력하면 1분 만에 신청 완료' },
  { no: '02', title: '업체 비교', desc: '검증된 업체들의 견적을 한눈에 비교' },
  { no: '03', title: '이사 완료', desc: '마음에 드는 업체와 안심하고 이사' },
]

function ProcessSteps() {
  return (
    <section id="steps" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900">3단계면 충분합니다</h2>
        <p className="mt-3 text-gray-600">복잡한 과정 없이, 견적 신청부터 이사까지.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.no}
              className="rounded-3xl bg-brand-bg p-8 transition hover:-translate-y-1"
            >
              <span className="font-inter text-4xl font-bold text-brand">
                {step.no}
              </span>
              <h3 className="mt-4 text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSteps
