import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

// 이메일 도메인 후보 (마지막 'custom'은 직접 입력 모드)
const DOMAINS = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'kakao.com',
  'hanmail.net',
  'hotmail.com',
  'custom',
]

function SignupPage() {
  const { signup, setDisplayMode } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isPartner = params.get('role') === 'partner' // 파트너 헤더에서 진입
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 이메일 분리 입력 (아이디 + 도메인)
  const [emailId, setEmailId] = useState('')
  const [domainChoice, setDomainChoice] = useState('gmail.com')
  const [customDomain, setCustomDomain] = useState('')
  const isCustomDomain = domainChoice === 'custom'

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const fd = new FormData(e.currentTarget)
    const password = fd.get('password')
    const passwordConfirm = fd.get('passwordConfirm')
    // 영문·숫자·특수문자 조합 8자 이상
    const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    if (!pwRule.test(String(password))) {
      setError('비밀번호는 영문·숫자·특수문자를 포함해 8자 이상이어야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    // 이메일 합치기
    const domain = isCustomDomain ? customDomain.trim() : domainChoice
    if (!emailId.trim() || !domain) {
      setError('이메일을 정확히 입력해 주세요.')
      return
    }
    const email = `${emailId.trim()}@${domain}`

    // 리뷰·FAQ 표시 방식 저장 (닉네임 그대로 / 실명 일부 가림)
    setDisplayMode(fd.get('displayMode') || 'nickname')

    setLoading(true)
    try {
      await signup({
        name: fd.get('name'),
        nickname: fd.get('nickname'),
        birthDate: fd.get('birthDate'),
        gender: fd.get('gender'),
        phone: fd.get('phone'),
        email,
        password,
      })
      // 파트너 컨텍스트에서 가입했으면 파트너 메인으로
      navigate(isPartner ? '/partner' : '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
      <p className="mt-3 text-gray-600">이삿날과 함께 더 편하게 이사하세요.</p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          name="name"
          type="text"
          required
          placeholder="이름"
          className={inputClass}
        />
        <input
          name="nickname"
          type="text"
          required
          maxLength={15}
          placeholder="닉네임 (15자 이내)"
          className={inputClass}
        />

        {/* 리뷰·FAQ 표시 방식 (닉네임 / 실명 일부 가림) */}
        <div>
          <span className="text-xs font-medium text-gray-500">
            리뷰·FAQ 표시 방식
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition has-[:checked]:bg-brand has-[:checked]:text-white">
              <input
                type="radio"
                name="displayMode"
                value="nickname"
                defaultChecked
                className="sr-only"
              />
              닉네임 그대로
            </label>
            <label className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition has-[:checked]:bg-brand has-[:checked]:text-white">
              <input
                type="radio"
                name="displayMode"
                value="real"
                className="sr-only"
              />
              실명 일부 가림
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            예: 실명 “김민지” → “김O지”로 리뷰·FAQ에 표시됩니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500">생년월일</span>
            <input
              name="birthDate"
              type="date"
              required
              className={`${inputClass} mt-1`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-500">성별</span>
            <select
              name="gender"
              required
              defaultValue=""
              className={`${inputClass} mt-1`}
            >
              <option value="" disabled>
                선택
              </option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </label>
        </div>

        <input
          name="phone"
          type="tel"
          required
          placeholder="전화번호 (010-1234-5678)"
          className={inputClass}
        />

        {/* 이메일: 아이디 + 도메인 선택/직접 입력 */}
        <div>
          <span className="text-xs font-medium text-gray-500">이메일</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              placeholder="아이디"
              className={`${inputClass} flex-1`}
            />
            <span className="text-gray-500">@</span>
            {isCustomDomain ? (
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                required
                placeholder="예: example.com"
                className={`${inputClass} flex-1`}
              />
            ) : (
              <input
                type="text"
                value={domainChoice}
                readOnly
                className={`${inputClass} flex-1 cursor-default bg-gray-50`}
              />
            )}
          </div>
          <select
            value={domainChoice}
            onChange={(e) => setDomainChoice(e.target.value)}
            className={`${inputClass} mt-2`}
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d === 'custom' ? '직접 입력' : d}
              </option>
            ))}
          </select>
        </div>

        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="비밀번호 (영문·숫자·특수문자 8자 이상)"
          className={inputClass}
        />
        <input
          name="passwordConfirm"
          type="password"
          required
          minLength={8}
          placeholder="비밀번호 확인"
          className={inputClass}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand px-7 py-4 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-gray-400">
        휴대폰 본인인증은 추후 제공될 예정입니다.
      </p>

      <p className="mt-4 text-center text-sm text-gray-500">
        이미 회원이신가요?{' '}
        <Link
          to={isPartner ? '/login?role=partner' : '/login'}
          className="font-semibold text-brand hover:underline"
        >
          로그인
        </Link>
      </p>

      {!isPartner && (
        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            로그인 없이도 견적을 받을 수 있어요.
          </p>
          <Link
            to="/quote"
            className="mt-3 inline-block rounded-full border border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            비회원으로 견적 신청
          </Link>
        </div>
      )}
    </section>
  )
}

export default SignupPage
