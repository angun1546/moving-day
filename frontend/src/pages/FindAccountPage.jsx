import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findEmail, resetPassword } from '../services/auth'

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'
const btnClass =
  'w-full rounded-full bg-brand px-7 py-4 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60'

function FindAccountPage() {
  const [tab, setTab] = useState('id') // id | pw
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [foundEmail, setFoundEmail] = useState('') // 아이디 찾기 결과
  const [done, setDone] = useState(false) // 비번 재설정 완료

  // 탭 전환 시 상태 초기화
  function switchTab(t) {
    setTab(t)
    setError('')
    setFoundEmail('')
    setDone(false)
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

  async function onResetPw(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const newPassword = fd.get('newPassword')
    const confirm = fd.get('newPasswordConfirm')
    const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
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
      await resetPassword({
        email: fd.get('email'),
        name: fd.get('name'),
        phone: fd.get('phone'),
        newPassword,
      })
      setDone(true)
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

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 아이디 찾기 */}
      {tab === 'id' &&
        (foundEmail ? (
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
        ))}

      {/* 비밀번호 찾기(재설정) */}
      {tab === 'pw' &&
        (done ? (
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
        ) : (
          <form onSubmit={onResetPw} className="mt-6 space-y-4">
            <input
              name="email"
              type="email"
              required
              placeholder="가입 이메일"
              className={inputClass}
            />
            <input name="name" type="text" required placeholder="이름" className={inputClass} />
            <input
              name="phone"
              type="tel"
              required
              placeholder="전화번호 (010-1234-5678)"
              className={inputClass}
            />
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
              {loading ? '변경 중...' : '비밀번호 재설정'}
            </button>
          </form>
        ))}

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="font-semibold text-brand hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </section>
  )
}

export default FindAccountPage
