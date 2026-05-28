import { useState } from 'react'
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useParams,
} from 'react-router-dom'
import { findMethod, findType } from '../data/quoteOptions'
import { usePostcode } from '../hooks/usePostcode'
import QuoteSteps from '../components/QuoteSteps'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

function Field({ label, required, children }) {
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

// 출발지/도착지 주소 입력 (검색 주소 + 상세주소를 한 필드로 합쳐 전송)
function AddressField({ label, name, value, detail, onSearch, onDetail }) {
  const full = detail ? `${value} ${detail}` : value
  return (
    <Field label={label} required>
      <div className="mt-1 flex gap-2">
        <input
          value={value}
          readOnly
          required
          placeholder="주소 검색을 눌러주세요"
          onClick={onSearch}
          className={`${inputClass} mt-0 cursor-pointer`}
        />
        <button
          type="button"
          onClick={onSearch}
          className="shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          주소 검색
        </button>
      </div>
      <input
        value={detail}
        onChange={(e) => onDetail(e.target.value)}
        placeholder="상세주소 (동·호수, 층 등)"
        className={`${inputClass} mt-2`}
      />
      {/* 실제 전송 값: 검색 주소 + 상세주소 */}
      <input type="hidden" name={name} value={full} />
    </Field>
  )
}

function QuoteFormPage() {
  const { method, type } = useParams()
  const m = findMethod(method)
  const t = findType(type)
  const actionData = useActionData()
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'
  const openPostcode = usePostcode()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [fromDetail, setFromDetail] = useState('')
  const [toDetail, setToDetail] = useState('')
  const [photos, setPhotos] = useState([])

  if (!m || !t) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">잘못된 접근이에요</h1>
        <Link
          to="/quote"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          견적 방식 다시 선택
        </Link>
      </section>
    )
  }

  // 선택한 사진 미리보기 (최대 5장)
  function onPhotos(e) {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setPhotos(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })))
  }

  const photoRequired = m.slug === 'photo'

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <QuoteSteps current={3} />
      <Link
        to={`/quote/${m.slug}`}
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 이사 종류
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">견적 신청</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand">
          {m.icon} {m.title}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
          {t.label}
        </span>
      </div>

      {actionData?.error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionData.error}
        </div>
      )}

      <Form method="post" encType="multipart/form-data" className="mt-8 space-y-6">
        {/* 견적 방식 / 이사 종류 (한글 라벨로 전송) */}
        <input type="hidden" name="method" value={m.label} />
        <input type="hidden" name="moveType" value={t.label} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="이름" required>
            <input
              type="text"
              name="name"
              required
              placeholder="홍길동"
              className={inputClass}
            />
          </Field>
          <Field label="연락처" required>
            <input
              type="tel"
              name="phone"
              required
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </Field>
        </div>

        <AddressField
          label="출발지"
          name="fromRegion"
          value={from}
          detail={fromDetail}
          onSearch={() => openPostcode(setFrom)}
          onDetail={setFromDetail}
        />
        <AddressField
          label="도착지"
          name="toRegion"
          value={to}
          detail={toDetail}
          onSearch={() => openPostcode(setTo)}
          onDetail={setToDetail}
        />

        {/* 방문견적: 방문 희망 일시 */}
        {m.slug === 'visit' && (
          <Field label="방문 희망 일시" required>
            <input
              type="text"
              name="visitDate"
              required
              placeholder="예: 6월 20일 오후 2시"
              className={inputClass}
            />
          </Field>
        )}

        {/* 전화상담: 통화 희망 시간대 */}
        {m.slug === 'call' && (
          <Field label="통화 희망 시간대" required>
            <select name="callTime" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                선택해 주세요
              </option>
              <option>가능한 빨리</option>
              <option>오전 (09 - 12시)</option>
              <option>오후 (12 - 18시)</option>
              <option>저녁 (18 - 21시)</option>
            </select>
          </Field>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="이사 예정일">
            <input type="date" name="moveDate" className={inputClass} />
          </Field>
          <Field label="주거 형태 / 평형">
            <input
              type="text"
              name="homeSize"
              placeholder="예: 원룸, 25평대"
              className={inputClass}
            />
          </Field>
        </div>

        {/* 사진: 사진견적은 필수, 방문견적은 선택, 전화상담은 숨김 */}
        {m.slug !== 'call' && (
          <Field label={photoRequired ? '사진 첨부' : '사진 첨부 (선택)'} required={photoRequired}>
            <input
              type="file"
              name="photos"
              accept="image/*"
              multiple
              required={photoRequired}
              onChange={onPhotos}
              className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-light/70"
            />
            {photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {photos.map((p) => (
                  <img
                    key={p.url}
                    src={p.url}
                    alt={p.name}
                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                  />
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {photoRequired
                ? '짐 사진을 올려주시면 추가금 없이 정확한 견적을 드려요. (최대 5장)'
                : '사진을 올리면 더 정확한 견적을 받을 수 있어요. (선택, 최대 5장)'}
            </p>
          </Field>
        )}

        <Field label="추가 요청사항">
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

export default QuoteFormPage
