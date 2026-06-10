import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  findEmail,
  resetSendPhoneCode,
  resetVerifyPhoneCode,
  resetSendEmailCode,
  resetVerifyEmailCode,
  resetPasswordAuth,
} from '../services/auth'

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'
const btnClass =
  'w-full rounded-full bg-brand px-7 py-4 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60'
const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

// 비밀번호 재설정 — 휴대폰/이메일 인증(둘 중 선택) 후 새 비밀번호 설정
function PwReset() {
  const [method, setMethod] = useState('phone') // phone | email
  const [identifier, setIdentifier] = useState('') // 전화 또는 이메일
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [remain, setRemain] = useState(0)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // 인증번호 3분 카운트다운
  useEffect(() => {
    if (remain <= 0) return
    const id = setInterval(() => setRemain((r) => (r <= 1 ? 0 : r - 1)), 1000)
    return () => clearInterval(id)
  }, [remain])

  // 인증 방식 전환 시 초기화
  function switchMethod(m) {
    setMethod(m)
    setIdentifier('')
    setCode('')
    setSent(false)
    setVerified(false)
    setRemain(0)
    setMsg('')
    setError('')
  }

  async function onSend() {
    setError('')
    setMsg('')
    setLoading(true)
    try {
      const r =
        method === 'phone'
          ? await resetSendPhoneCode(identifier)
          : await resetSendEmailCode(identifier)
      setSent(true)
      setRemain(180)
      if (r?.devCode) {
        setCode(r.devCode)
        setMsg(`개발 모드 인증번호: ${r.devCode}`)
      } else {
        setMsg(
          method === 'phone'
            ? '인증번호를 문자로 보냈어요.'
            : '인증번호를 메일로 보냈어요.',
        )
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onVerify() {
    setError('')
    try {
      if (method === 'phone') await resetVerifyPhoneCode(identifier, code)
      else await resetVerifyEmailCode(identifier, code)
      setVerified(true)
      setRemain(0)
    } catch (err) {
      setError(err.message)
    }
  }

  async function onReset(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const newPassword = fd.get('newPassword')
    const confirm = fd.get('newPasswordConfirm')
    if (!pwRule.test(String(newPassword))) {
      setError('비밀번호는 영문·숫자·특수문자를 포함해 8자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    try {
      await resetPasswordAuth({
        method,
        ...(method === 'phone' ? { phone: identifier } : { email: identifier }),
        newPassword,
      })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-center">
        <p className="text-lg font-bold text-gray-900">비밀번호가 변경되었습니다.</p>
        <p className="mt-1 text-sm text-gray-600">새 비밀번호로 로그인하세요.</p>
        <Link
          to="/login"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          로그인하러 가기
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* 인증 방식 선택 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchMethod('phone')}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            method === 'phone'
              ? 'border-brand bg-brand-light text-brand'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          휴대폰 인증
        </button>
        <button
          type="button"
          onClick={() => switchMethod('email')}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            method === 'email'
              ? 'border-brand bg-brand-light text-brand'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          이메일 인증
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!verified ? (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <input
              type={method === 'phone' ? 'tel' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              readOnly={sent}
              placeholder={method === 'phone' ? '가입한 전화번호' : '가입한 이메일'}
              className={`${inputClass} min-w-0 flex-1 ${sent ? 'bg-gray-50' : ''}`}
            />
            <button
              type="button"
              onClick={onSend}
              disabled={loading || !identifier}
              className="shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sent ? '재발송' : '인증번호 받기'}
            </button>
          </div>
          {sent && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="인증번호 6자리"
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={onVerify}
                  className="shrink-0 rounded-xl bg-gray-800 px-4 text-sm font-semibold text-white transition hover:bg-black"
                >
                  확인
                </button>
              </div>
              <p className="text-xs text-red-500">
                {remain > 0
                  ? `남은 시간 ${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, '0')}`
                  : '인증 시간이 만료되었어요. 다시 받아 주세요.'}
              </p>
            </>
          )}
          {msg && <p className="text-xs text-gray-500">{msg}</p>}
        </div>
      ) : (
        <form onSubmit={onReset} className="mt-4 space-y-3">
          <p className="text-xs text-green-600">
            인증이 완료되었어요. 새 비밀번호를 설정하세요.
          </p>
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            placeholder="새 비밀번호 (영문·숫자·특수문자 8자 이상)"
            className={inputClass}
          />
          <input
            name="newPasswordConfirm"
            type="password"
            required
            minLength={8}
            placeholder="새 비밀번호 확인"
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      )}
    </div>
  )
}

function FindAccountPage() {
  const [tab, setTab] = useState('id') // id | pw
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [foundEmail, setFoundEmail] = useState('') // 아이디 찾기 결과

  function switchTab(t) {
    setTab(t)
    setError('')
    setFoundEmail('')
  }

  async function onFindId(e) {
    e.preventDefault()
    setError('')
    setFoundEmail('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const email = await findEmail(fd.get('name'), fd.get('phone'))
      setFoundEmail(email)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">계정 찾기</h1>
      <p className="mt-3 text-gray-600">가입 정보로 아이디·비밀번호를 찾으세요.</p>

      {/* 탭 */}
      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={() => switchTab('id')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            tab === 'id' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          아이디 찾기
        </button>
        <button
          type="button"
          onClick={() => switchTab('pw')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            tab === 'pw' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* 아이디 찾기 */}
      {tab === 'id' && (
        <>
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {foundEmail ? (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-center">
              <p className="text-sm text-gray-600">회원님의 가입 이메일</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{foundEmail}</p>
              <Link
                to="/login"
                className="mt-4 inline-block rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                로그인하러 가기
              </Link>
            </div>
          ) : (
            <form onSubmit={onFindId} className="mt-6 space-y-4">
              <input name="name" type="text" required placeholder="이름" className={inputClass} />
              <input
                name="phone"
                type="tel"
                required
                placeholder="전화번호 (010-1234-5678)"
                className={inputClass}
              />
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? '찾는 중...' : '아이디 찾기'}
              </button>
            </form>
          )}
        </>
      )}

      {/* 비밀번호 찾기 — 휴대폰/이메일 인증 후 재설정 */}
      {tab === 'pw' && <PwReset />}

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="font-semibold text-brand hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </section>
  )
}

export default FindAccountPage
