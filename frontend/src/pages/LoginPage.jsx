import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await login(fd.get('email'), fd.get('password'))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
      <p className="mt-3 text-gray-600">이삿날 계정으로 로그인하세요.</p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input name="email" type="email" required placeholder="이메일" className={inputClass} />
        <input
          name="password"
          type="password"
          required
          placeholder="비밀번호"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand px-7 py-4 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        아직 회원이 아니신가요?{' '}
        <Link to="/signup" className="font-semibold text-brand hover:underline">
          회원가입
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

export default LoginPage
