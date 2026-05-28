import { useState } from 'react'
import { REGION_TREE } from '../data/regions'

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

// 저장된 업체 정보 로드 (마운트 시점) — 마이페이지에서도 동일 키로 읽음
function loadStoredProfile() {
  try {
    const raw = localStorage.getItem('movingday_partner_profile')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function PartnerProfilePage() {
  const stored = loadStoredProfile()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('') // 서비스 지역 미선택 안내
  const [profileImg, setProfileImg] = useState(null) // 프로필 사진 1장
  const [workPhotos, setWorkPhotos] = useState([]) // 업체·이사 사진
  const [certs, setCerts] = useState([]) // 자격증·서류 (이미지/PDF)
  // 서비스 지역 — controlled (권역별 전체 선택 토글을 위해)
  const [selectedRegions, setSelectedRegions] = useState(
    () => new Set(stored.regions || []),
  )

  function toggleRegion(value) {
    setSelectedRegions((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function toggleGroup(sidoMap) {
    // 그룹 안 모든 '시도 시군구' 키 집계
    const all = []
    Object.entries(sidoMap).forEach(([sido, sgs]) => {
      sgs.forEach((sg) => all.push(`${sido} ${sg}`))
    })
    const allOn = all.every((r) => selectedRegions.has(r))
    setSelectedRegions((prev) => {
      const next = new Set(prev)
      if (allOn) all.forEach((r) => next.delete(r))
      else all.forEach((r) => next.add(r))
      return next
    })
  }

  // 시·도 단위 일괄 토글 (예: 서울 25구 한 번에)
  function toggleSido(sido, sgs) {
    const all = sgs.map((sg) => `${sido} ${sg}`)
    const allOn = all.every((r) => selectedRegions.has(r))
    setSelectedRegions((prev) => {
      const next = new Set(prev)
      if (allOn) all.forEach((r) => next.delete(r))
      else all.forEach((r) => next.add(r))
      return next
    })
  }

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
    if (selectedRegions.size === 0) {
      setSaved(false)
      setError('서비스 가능 지역을 1곳 이상 선택해 주세요.')
      return
    }
    const fd = new FormData(e.currentTarget)
    // 업체 정보 영속화 — 파트너 마이페이지에서 같은 키로 읽음
    const profile = {
      company: fd.get('company')?.toString().trim() || '',
      bizNo: fd.get('bizNo')?.toString().trim() || '',
      ceo: fd.get('ceo')?.toString().trim() || '',
      phone: fd.get('phone')?.toString().trim() || '',
      trucks: fd.get('trucks')?.toString().trim() || '',
      intro: fd.get('intro')?.toString().trim() || '',
      regions: Array.from(selectedRegions),
    }
    try {
      localStorage.setItem('movingday_partner_profile', JSON.stringify(profile))
    } catch {
      // 저장 실패 무시
    }
    setError('')
    setSaved(true)
    // 파트너 홈에서 "입찰 시작하기" 게이트 해제용 플래그
    localStorage.setItem('partnerProfileSaved', 'true')
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
            defaultValue={stored.company || ''}
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
              defaultValue={stored.bizNo || ''}
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
              defaultValue={stored.ceo || ''}
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
              defaultValue={stored.phone || ''}
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
              defaultValue={stored.trucks || ''}
              placeholder="예: 4"
              className={inputClass}
            />
          </label>
        </div>

        {/* 서비스 가능 지역 (필수, 권역 클릭 → 시·도 → 시·군·구 펼침) */}
        <div>
          <span className="text-sm font-semibold text-gray-800">
            서비스 가능 지역
            <Req />
          </span>
          <p className="mt-1 text-xs text-gray-400">
            권역을 펼쳐 세부 시·군·구를 선택하세요.
          </p>
          <div className="mt-3 space-y-2">
            {Object.entries(REGION_TREE).map(([group, sidoMap]) => {
              const allRegions = Object.entries(sidoMap).flatMap(
                ([sido, sgs]) => sgs.map((sg) => `${sido} ${sg}`),
              )
              const allOn = allRegions.every((r) => selectedRegions.has(r))
              const partial =
                !allOn && allRegions.some((r) => selectedRegions.has(r))
              return (
                <details
                  key={group}
                  className="group rounded-2xl border border-gray-100 bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-semibold text-gray-800 transition hover:text-brand">
                    <span className="flex items-center gap-2">
                      {group}
                      {partial && (
                        <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-bold text-brand">
                          일부 선택
                        </span>
                      )}
                      {allOn && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">
                          전체 선택
                        </span>
                      )}
                    </span>
                    <span className="text-brand transition group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <div className="space-y-4 border-t border-gray-100 px-4 py-4">
                    {/* 권역 전체 선택 토글 */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(sidoMap)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        allOn
                          ? 'bg-brand text-white hover:bg-brand-dark'
                          : 'border border-brand text-brand hover:bg-brand hover:text-white'
                      }`}
                    >
                      {allOn ? '권역 전체 해제' : `${group} 전체 선택`}
                    </button>

                    {Object.entries(sidoMap).map(([sido, sgs]) => {
                      const sidoAll = sgs.map((sg) => `${sido} ${sg}`)
                      const sidoAllOn = sidoAll.every((r) =>
                        selectedRegions.has(r),
                      )
                      return (
                        <div key={sido}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-gray-500">
                              {sido}
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleSido(sido, sgs)}
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                                sidoAllOn
                                  ? 'bg-brand text-white hover:bg-brand-dark'
                                  : 'border border-gray-300 text-gray-500 hover:border-brand hover:text-brand'
                              }`}
                            >
                              {sidoAllOn ? `${sido} 전체 해제` : `${sido} 전체 선택`}
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {sgs.map((sg) => {
                              const value = `${sido} ${sg}`
                              return (
                                <label
                                  key={`${sido}-${sg}`}
                                  className="cursor-pointer rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition has-[:checked]:bg-brand has-[:checked]:text-white"
                                >
                                  <input
                                    type="checkbox"
                                    name="regions"
                                    value={value}
                                    checked={selectedRegions.has(value)}
                                    onChange={() => toggleRegion(value)}
                                    className="sr-only"
                                  />
                                  {sg}
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </details>
              )
            })}
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
            defaultValue={stored.intro || ''}
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
