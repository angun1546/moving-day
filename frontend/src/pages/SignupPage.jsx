import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  checkEmail,
  sendPhoneCode,
  verifyPhoneCode,
  sendEmailCode,
  verifyEmailCode,
} from '../services/auth'
import DatePicker from '../components/DatePicker'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  // 이메일 중복 상태: idle | checking | available | taken
  const [emailStatus, setEmailStatus] = useState('idle')

  const emailDomain = isCustomDomain ? customDomain.trim() : domainChoice
  const fullEmail = emailId.trim() && emailDomain ? `${emailId.trim()}@${emailDomain}` : ''

  // 이메일이 형식에 맞으면 0.5초 디바운스 후 중복 확인
  useEffect(() => {
    if (!fullEmail || !EMAIL_RE.test(fullEmail)) {
      setEmailStatus('idle')
      return
    }
    setEmailStatus('checking')
    const t = setTimeout(async () => {
      const ok = await checkEmail(fullEmail)
      setEmailStatus(ok ? 'available' : 'taken')
    }, 500)
    return () => clearTimeout(t)
  }, [fullEmail])

  // 휴대폰 본인인증 (SMS 인증번호)
  const [phone, setPhone] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneMsg, setPhoneMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [remain, setRemain] = useState(0) // 인증번호 남은 시간(초)

  // 인증번호 3분 카운트다운
  useEffect(() => {
    if (remain <= 0) return
    const id = setInterval(() => setRemain((r) => (r <= 1 ? 0 : r - 1)), 1000)
    return () => clearInterval(id)
  }, [remain])

  async function onSendCode() {
    setPhoneMsg('')
    if (phone.replace(/\D/g, '').length < 10) {
      setPhoneMsg('올바른 휴대폰 번호를 입력해 주세요.')
      return
    }
    setSending(true)
    try {
      const r = await sendPhoneCode(phone)
      setCodeSent(true)
      setRemain(180) // 3분 카운트다운 시작
      if (r?.devCode) {
        // 개발 모드(SMS 키 미설정): 인증번호를 자동 입력 + 안내
        setPhoneCode(r.devCode)
        setPhoneMsg(`개발 모드 인증번호: ${r.devCode} (SMS 발송 미설정 상태)`)
      } else {
        setPhoneMsg('인증번호를 발송했어요. 시간 안에 입력해 주세요.')
      }
    } catch (err) {
      setPhoneMsg(err.message)
    } finally {
      setSending(false)
    }
  }

  async function onVerifyCode() {
    setPhoneMsg('')
    try {
      await verifyPhoneCode(phone, phoneCode)
      setPhoneVerified(true)
      setRemain(0) // 인증 완료 — 타이머 중지
    } catch (err) {
      setPhoneMsg(err.message)
    }
  }

  // 이메일 본인인증 (인증번호)
  const [emailCode, setEmailCode] = useState('')
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerifyMsg, setEmailVerifyMsg] = useState('')
  const [emailRemain, setEmailRemain] = useState(0)
  const [emailSending, setEmailSending] = useState(false)

  // 이메일 인증번호 3분 카운트다운
  useEffect(() => {
    if (emailRemain <= 0) return
    const id = setInterval(() => setEmailRemain((r) => (r <= 1 ? 0 : r - 1)), 1000)
    return () => clearInterval(id)
  }, [emailRemain])

  // 이메일이 바뀌면 인증 상태 초기화(다른 이메일은 재인증)
  useEffect(() => {
    setEmailVerified(false)
    setEmailCodeSent(false)
  }, [fullEmail])

  async function onSendEmailCode() {
    setEmailVerifyMsg('')
    if (!EMAIL_RE.test(fullEmail)) {
      setEmailVerifyMsg('이메일을 정확히 입력해 주세요.')
      return
    }
    if (emailStatus === 'taken') {
      setEmailVerifyMsg('이미 가입된 이메일입니다.')
      return
    }
    setEmailSending(true)
    try {
      const r = await sendEmailCode(fullEmail)
      setEmailCodeSent(true)
      setEmailRemain(180)
      if (r?.devCode) {
        setEmailCode(r.devCode)
        setEmailVerifyMsg(`개발 모드 인증번호: ${r.devCode} (메일 발송 미설정 상태)`)
      } else {
        setEmailVerifyMsg('인증번호를 메일로 보냈어요. 메일함을 확인해 주세요.')
      }
    } catch (err) {
      setEmailVerifyMsg(err.message)
    } finally {
      setEmailSending(false)
    }
  }

  async function onVerifyEmailCode() {
    setEmailVerifyMsg('')
    try {
      await verifyEmailCode(fullEmail, emailCode)
      setEmailVerified(true)
      setEmailRemain(0)
    } catch (err) {
      setEmailVerifyMsg(err.message)
    }
  }

  // 비밀번호 확인 실시간 일치 여부
  const [pw, setPw] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const pwMatch = pwConfirm.length > 0 && pw === pwConfirm

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

    // 이미 가입된 이메일이면 막기 (서버 409가 최종 방어선이지만 UX로 미리 차단)
    if (emailStatus === 'taken') {
      setError('이미 가입된 이메일입니다. 다른 이메일을 사용해 주세요.')
      return
    }

    // 휴대폰 본인인증 필수
    if (!phoneVerified) {
      setError('휴대폰 본인인증을 완료해 주세요.')
      return
    }

    // 이메일 본인인증 필수
    if (!emailVerified) {
      setError('이메일 인증을 완료해 주세요.')
      return
    }

    // 리뷰·FAQ 표시 방식 저장 (닉네임 그대로 / 실명 일부 가림)
    setDisplayMode(fd.get('displayMode') || 'nickname')

    setLoading(true)
    try {
      // 진입 경로로 역할 결정 (admin 이메일은 서버가 admin으로 보정)
      const u = await signup({
        name: fd.get('name'),
        nickname: fd.get('nickname'),
        birthDate: fd.get('birthDate'),
        gender: fd.get('gender'),
        phone,
        email,
        password,
        role: isPartner ? 'partner' : 'customer',
      })
      // 역할 기준 이동
      if (u?.role === 'admin') navigate('/admin')
      else navigate(u?.role === 'partner' ? '/partner' : '/')
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
      <p className="mt-2 text-sm text-gray-400">
        <span className="text-red-500">*</span> 표시는 반드시 입력해야 하는 항목입니다.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-gray-500">
            이름 <span className="text-red-500">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            placeholder="이름"
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">
            닉네임 <span className="text-red-500">*</span>
          </span>
          <input
            name="nickname"
            type="text"
            required
            maxLength={15}
            placeholder="닉네임 (15자 이내)"
            className={`${inputClass} mt-1`}
          />
        </label>

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
            <span className="text-xs font-medium text-gray-500">
              생년월일 <span className="text-red-500">*</span>
            </span>
            <DatePicker
              name="birthDate"
              maxYear={new Date().getFullYear()}
              placeholder="생년월일 선택"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-500">
              성별 <span className="text-red-500">*</span>
            </span>
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

        <div>
          <span className="text-xs font-medium text-gray-500">
            전화번호 <span className="text-red-500">*</span>
          </span>
          <div className="mt-1 flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              readOnly={phoneVerified}
              placeholder="전화번호 (010-1234-5678)"
              className={`${inputClass} min-w-0 flex-1 ${phoneVerified ? 'bg-gray-50' : ''}`}
            />
            <button
              type="button"
              onClick={onSendCode}
              disabled={sending || phoneVerified}
              className="shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {phoneVerified ? '인증완료' : codeSent ? '재발송' : '인증번호 받기'}
            </button>
          </div>

          {codeSent && !phoneVerified && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                placeholder="인증번호 6자리"
                className={`${inputClass} min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={onVerifyCode}
                className="shrink-0 rounded-xl bg-gray-800 px-4 text-sm font-semibold text-white transition hover:bg-black"
              >
                확인
              </button>
            </div>
          )}

          {codeSent && !phoneVerified && (
            <p className="mt-1 text-xs text-red-500">
              {remain > 0
                ? `남은 시간 ${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, '0')}`
                : '인증 시간이 만료되었어요. 다시 받아 주세요.'}
            </p>
          )}

          {phoneVerified ? (
            <p className="mt-1 text-xs text-green-600">휴대폰 인증이 완료되었어요.</p>
          ) : (
            phoneMsg && <p className="mt-1 text-xs text-gray-500">{phoneMsg}</p>
          )}
        </div>

        {/* 이메일: 아이디 + 도메인 선택/직접 입력 */}
        <div>
          <span className="text-xs font-medium text-gray-500">
            이메일 <span className="text-red-500">*</span>
          </span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              placeholder="아이디"
              className={`${inputClass} min-w-0 flex-1`}
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
          {emailStatus === 'checking' && (
            <p className="mt-1 text-xs text-gray-400">이메일 확인 중...</p>
          )}
          {emailStatus === 'taken' && (
            <p className="mt-1 text-xs text-red-500">
              이미 가입된 이메일입니다. 다른 이메일을 사용해 주세요.
            </p>
          )}
          {emailStatus === 'available' && !emailVerified && (
            <p className="mt-1 text-xs text-green-600">사용 가능한 이메일입니다.</p>
          )}

          {/* 이메일 인증 */}
          {emailVerified ? (
            <p className="mt-2 text-xs text-green-600">이메일 인증이 완료되었어요.</p>
          ) : (
            <>
              <button
                type="button"
                onClick={onSendEmailCode}
                disabled={emailSending || emailStatus !== 'available'}
                className="mt-2 w-full rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {emailSending
                  ? '발송 중...'
                  : emailCodeSent
                    ? '인증번호 재발송'
                    : '이메일 인증하기'}
              </button>
              {emailCodeSent && (
                <>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="인증번호 6자리"
                      className={`${inputClass} min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      onClick={onVerifyEmailCode}
                      className="shrink-0 rounded-xl bg-gray-800 px-4 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      확인
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-red-500">
                    {emailRemain > 0
                      ? `남은 시간 ${Math.floor(emailRemain / 60)}:${String(emailRemain % 60).padStart(2, '0')}`
                      : '인증 시간이 만료되었어요. 다시 받아 주세요.'}
                  </p>
                </>
              )}
              {emailVerifyMsg && (
                <p className="mt-1 text-xs text-gray-500">{emailVerifyMsg}</p>
              )}
            </>
          )}
        </div>

        <label className="block">
          <span className="text-xs font-medium text-gray-500">
            비밀번호 <span className="text-red-500">*</span>
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호 (영문·숫자·특수문자 8자 이상)"
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">
            비밀번호 확인 <span className="text-red-500">*</span>
          </span>
          <input
            name="passwordConfirm"
            type="password"
            required
            minLength={8}
            value={pwConfirm}
            onChange={(e) => setPwConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            className={`${inputClass} mt-1`}
          />
          {pwConfirm.length > 0 && (
            <p className={`mt-1 text-xs ${pwMatch ? 'text-green-600' : 'text-red-500'}`}>
              {pwMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={loading || emailStatus === 'taken'}
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
