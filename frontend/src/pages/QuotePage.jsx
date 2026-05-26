import { Form, useActionData, useNavigation } from 'react-router-dom'

const MOVE_TYPES = ['포장이사', '반포장이사', '일반이사', '사무실이사']

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

function Field({ label, name, children, required }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
    </label>
  )
}

function QuotePage() {
  const actionData = useActionData()
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">이사 견적 신청</h1>
      <p className="mt-3 text-gray-600">
        아래 정보를 입력해 주시면, 검증된 업체의 견적을 비교해 보내드립니다.
      </p>

      {actionData?.error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="mt-8 space-y-6">
        <Field label="이사 종류" name="moveType" required>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOVE_TYPES.map((type, i) => (
              <label
                key={type}
                className="cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="moveType"
                  value={type}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                {type}
              </label>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="이름" name="name" required>
            <input
              type="text"
              name="name"
              required
              placeholder="홍길동"
              className={inputClass}
            />
          </Field>
          <Field label="연락처" name="phone" required>
            <input
              type="tel"
              name="phone"
              required
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="출발지" name="fromRegion" required>
            <input
              type="text"
              name="fromRegion"
              required
              placeholder="서울 마포구"
              className={inputClass}
            />
          </Field>
          <Field label="도착지" name="toRegion" required>
            <input
              type="text"
              name="toRegion"
              required
              placeholder="서울 송파구"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="이사 예정일" name="moveDate">
            <input type="date" name="moveDate" className={inputClass} />
          </Field>
          <Field label="주거 형태 / 평형" name="homeSize">
            <input
              type="text"
              name="homeSize"
              placeholder="예: 원룸, 25평대"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="추가 요청사항" name="memo">
          <textarea
            name="memo"
            rows={4}
            placeholder="엘리베이터 유무, 사다리차 필요 여부 등 자유롭게 적어주세요."
            className={inputClass}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand px-7 py-4 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? '신청 중...' : '무료 견적 신청하기'}
        </button>
      </Form>
    </section>
  )
}

export default QuotePage
