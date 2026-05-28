import { useState } from 'react'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

const fileClass =
  'block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-light/70'

// 필수 표시 (*)
function Req() {
  return <span className="text-brand"> *</span>
}

// 선택 표시
function Opt() {
  return <span className="font-normal text-gray-400"> (선택)</span>
}

// 서비스 가능 지역 후보
const REGIONS = [
  '서울',
  '경기',
  '인천',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

function PartnerProfilePage() {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('') // 서비스 지역 미선택 안내
  const [profileImg, setProfileImg] = useState(null) // 프로필 사진 1장
  const [workPhotos, setWorkPhotos] = useState([]) // 업체·이사 사진
  const [certs, setCerts] = useState([]) // 자격증·서류 (이미지/PDF)

  // 프로필 사진 (단일)
  function onProfile(e) {
    const f = e.target.files?.[0]
    if (f) setProfileImg({ name: f.name, url: URL.createObjectURL(f) })
  }

  // 업체·이사 사진 (최대 8장)
  function onWork(e) {
    const files = Array.from(e.target.files ?? []).slice(0, 8)
    setWorkPhotos(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })))
  }

  // 자격증·서류 (이미지 또는 PDF, 최대 5개)
  function onCerts(e) {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setCerts(
      files.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
        isImage: f.type.startsWith('image/'),
      })),
    )
  }

  // 저장 (목업): 서비스 지역은 최소 1곳 선택해야 함
  function submit(e) {
    e.preventDefault()
    const regions = new FormData(e.currentTarget).getAll('regions')
    if (regions.length === 0) {
      setSaved(false)
      setError('서비스 가능 지역을 1곳 이상 선택해 주세요.')
      return
    }
    setError('')
    setSaved(true)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">업체 정보 관리</h1>
      <p className="mt-2 text-gray-600">
        고객에게 노출되는 정보입니다. 정확히 입력할수록 낙찰에 유리해요.
      </p>

      {saved && (
        <div className="mt-6 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-semibold text-brand-dark">
          ✓ 업체 정보가 저장되었습니다.
        </div>
      )}

      <form onSubmit={submit} className="mt-8 space-y-5">
        {/* 프로필 사진 (선택) */}
        <div>
          <span className="text-sm font-semibold text-gray-800">
            프로필 사진
            <Opt />
          </span>
          <div className="mt-2 flex items-center gap-4">
            {profileImg ? (
              <img
                src={profileImg.url}
                alt="프로필 미리보기"
                className="h-20 w-20 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-300">
                🏢
              </div>
            )}
            <input
              type="file"
              name="profileImg"
              accept="image/*"
              onChange={onProfile}
              className={fileClass}
            />
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            업체명
            <Req />
          </span>
          <input
            type="text"
            name="company"
            required
            placeholder="예: 한솔이사"
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">
              사업자등록번호
              <Req />
            </span>
            <input
              type="text"
              name="bizNo"
              required
              placeholder="예: 123-45-67890"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">
              대표자명
              <Req />
            </span>
            <input
              type="text"
              name="ceo"
              required
              placeholder="예: 김한솔"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">
              연락처
              <Req />
            </span>
            <input
              type="tel"
              name="phone"
              required
              placeholder="예: 02-1234-5678"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">
              탑차 보유 대수
              <Opt />
            </span>
            <input
              type="number"
              name="trucks"
              min="0"
              placeholder="예: 4"
              className={inputClass}
            />
          </label>
        </div>

        {/* 서비스 가능 지역 (필수, 모바일 퍼스트 칩) */}
        <div>
          <span className="text-sm font-semibold text-gray-800">
            서비스 가능 지역
            <Req />
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {REGIONS.map((rg) => (
              <label
                key={rg}
                className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition has-[:checked]:bg-brand has-[:checked]:text-white"
              >
                <input
                  type="checkbox"
                  name="regions"
                  value={rg}
                  className="sr-only"
                />
                {rg}
              </label>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            한 줄 소개
            <Opt />
          </span>
          <textarea
            name="intro"
            rows={3}
            placeholder="예: 20년 경력 베테랑 팀이 포장부터 정리까지 직접 책임집니다."
            className={inputClass}
          />
        </label>

        {/* 업체·이사 사진 (선택) */}
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            업체·이사 사진
            <span className="font-normal text-gray-400"> (선택, 최대 8장)</span>
          </span>
          <input
            type="file"
            name="workPhotos"
            accept="image/*"
            multiple
            onChange={onWork}
            className={`${fileClass} mt-1`}
          />
          {workPhotos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {workPhotos.map((p) => (
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
            실제 작업 사진을 올리면 고객 신뢰도가 올라가요.
          </p>
        </label>

        {/* 자격증·서류 (선택, 이미지 또는 PDF) */}
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">
            자격증·서류
            <span className="font-normal text-gray-400"> (선택, 최대 5개)</span>
          </span>
          <input
            type="file"
            name="certs"
            accept="image/*,.pdf"
            multiple
            onChange={onCerts}
            className={`${fileClass} mt-1`}
          />
          {certs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {certs.map((c) =>
                c.isImage ? (
                  <img
                    key={c.url}
                    src={c.url}
                    alt={c.name}
                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <span
                    key={c.url}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600"
                  >
                    📄 {c.name}
                  </span>
                ),
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">
            사업자등록증·자격증 등 (이미지 또는 PDF)
          </p>
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-brand px-7 py-4 font-semibold text-white transition hover:bg-brand-dark"
        >
          저장하기
        </button>
      </form>
    </section>
  )
}

export default PartnerProfilePage
