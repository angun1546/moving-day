import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ActivityCard from '../components/ActivityCard'
import { useLocalState } from '../hooks/useLocalState'

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  )
}

// 저장된 업체 정보 로드 (PartnerProfilePage와 동일 키)
function loadStoredProfile() {
  try {
    const raw = localStorage.getItem('movingday_partner_profile')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function PartnerMyPage() {
  const { user, logout } = useAuth()
  // 실제 활동 카운트
  const [stories] = useLocalState('movingday_partner_stories', [])
  const [questions] = useLocalState('movingday_partner_qa', [])
  const [bidCount] = useLocalState('movingday_partner_bid_count', 0)
  // 업체 정보 (페이지 마운트 시점 스냅샷)
  const profile = loadStoredProfile()
  const profileSaved =
    typeof window !== 'undefined' &&
    localStorage.getItem('partnerProfileSaved') === 'true' &&
    profile

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-gray-600">로그인이 필요한 페이지입니다.</p>
        <Link
          to="/login?role=partner"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          로그인
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-inter text-sm font-semibold tracking-wider text-brand uppercase">
        My Page
      </p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900">
        {user.nickname || user.name}님, 환영합니다
      </h1>
      <p className="mt-2 text-gray-600">파트너 활동 현황을 확인하세요.</p>

      {/* 내 정보 */}
      <h2 className="mt-10 text-lg font-bold text-gray-900">내 정보</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Info label="이름" value={user.name} />
        <Info label="닉네임" value={user.nickname || '-'} />
        <Info label="이메일" value={user.email} />
        <Info label="전화번호" value={user.phone || '-'} />
      </div>

      {/* 내 업체 정보 */}
      <h2 className="mt-10 text-lg font-bold text-gray-900">내 업체 정보</h2>
      {profileSaved ? (
        <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Info label="업체명" value={profile.company || '-'} />
            <Info label="사업자등록번호" value={profile.bizNo || '-'} />
            <Info label="대표자" value={profile.ceo || '-'} />
            <Info label="연락처" value={profile.phone || '-'} />
            <Info
              label="탑차 보유"
              value={profile.trucks ? `${profile.trucks}대` : '-'}
            />
          </div>
          {profile.regions && profile.regions.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500">
                서비스 가능 지역
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.regions.slice(0, 12).map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand"
                  >
                    {r}
                  </span>
                ))}
                {profile.regions.length > 12 && (
                  <span className="self-center text-xs text-gray-400">
                    외 {profile.regions.length - 12}곳
                  </span>
                )}
              </div>
            </div>
          )}
          {profile.intro && (
            <p className="mt-4 rounded-2xl bg-brand-bg px-4 py-3 text-sm leading-relaxed text-gray-700">
              “{profile.intro}”
            </p>
          )}
          <div className="mt-4 text-right">
            <Link
              to="/partner/profile"
              className="text-sm font-semibold text-brand transition hover:underline"
            >
              업체정보 수정 →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-3xl">🏢</p>
          <p className="mt-3 font-semibold text-gray-700">
            업체 정보를 아직 등록하지 않았어요
          </p>
          <p className="mt-1 text-sm text-gray-500">
            업체 정보를 등록해야 입찰을 시작할 수 있어요.
          </p>
          <Link
            to="/partner/profile"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            업체정보 등록하기
          </Link>
        </div>
      )}

      {/* 활동 내역 — 클릭 시 해당 페이지로 이동 */}
      <h2 className="mt-10 text-lg font-bold text-gray-900">활동 내역</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ActivityCard
          to="/partner/dashboard"
          label="받은 입찰"
          count={bidCount}
        />
        <ActivityCard
          to="/partner/story"
          label="작성 파트너 스토리"
          count={stories.length}
        />
        <ActivityCard
          to="/partner/faq"
          label="내 질문"
          count={questions.length}
        />
      </div>

      {/* 액션 */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/account?role=partner"
          className="rounded-full bg-brand px-7 py-3 text-center font-semibold text-white transition hover:bg-brand-dark"
        >
          회원정보 수정
        </Link>
        <Link
          to="/partner/profile"
          className="rounded-full border border-brand bg-white px-7 py-3 text-center font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          업체정보 수정
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-gray-300 bg-white px-7 py-3 text-center font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
        >
          로그아웃
        </button>
      </div>
    </section>
  )
}

export default PartnerMyPage
