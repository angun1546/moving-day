import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await signup({
        name: fd.get('name'),
        birthDate: fd.get('birthDate'),
        gender: fd.get('gender'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        password: fd.get('password'),
      })
      navigate('/')
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
        <input name="name" type="text" required placeholder="이름" className={inputClass} />

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500">생년월일</span>
            <input name="birthDate" type="date" required className={`${inputClass} mt-1`} />
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

        <input name="phone" type="tel" required placeholder="전화번호 (010-1234-5678)" className={inputClass} />
        <input name="email" type="email" required placeholder="이메일" className={inputClass} />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="비밀번호 (6자 이상)"
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
        <Link to="/login" className="font-semibold text-brand hover:underline">
          로그인
        </Link>
      </p>

      <div className="mt-8 border-t border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-500">로그인 없이도 견적을 받을 수 있어요.</p>
        <Link
          to="/quote"
          className="mt-3 inline-block rounded-full border border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          비회원으로 견적 신청
        </Link>
      </div>
    </section>
  )
}

export default SignupPage
