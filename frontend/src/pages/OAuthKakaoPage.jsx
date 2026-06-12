import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 카카오 로그인 콜백 처리 페이지
// 백엔드(/api/auth/kakao/callback)가 토큰을 붙여 이 경로로 리다이렉트한다.
//   성공: ?token=<JWT>  /  실패: ?error=<코드>
const ERRORS = {
  config: '카카오 로그인이 아직 설정되지 않았습니다.',
  cancel: '카카오 로그인이 취소되었습니다.',
  token: '카카오 인증에 실패했습니다. 다시 시도해 주세요.',
  profile: '카카오 프로필을 불러오지 못했습니다.',
  server: '서버 오류로 로그인에 실패했습니다.',
}

function OAuthKakaoPage() {
  const { socialLogin } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [error, setError] = useState('')
  const done = useRef(false) // StrictMode 중복 실행 방지

  useEffect(() => {
    if (done.current) return
    done.current = true

    const token = params.get('token')
    const err = params.get('error')
    if (err || !token) {
      setError(ERRORS[err] ?? '카카오 로그인에 실패했습니다.')
      return
    }
    socialLogin(token)
      .then((u) => {
        if (u?.role === 'admin') navigate('/admin', { replace: true })
        else if (u?.role === 'partner') navigate('/partner', { replace: true })
        else navigate('/', { replace: true })
      })
      .catch(() => setError('로그인 처리 중 오류가 발생했습니다.'))
  }, [params, socialLogin, navigate])

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      {error ? (
        <>
          <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-6 rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            로그인으로 돌아가기
          </button>
        </>
      ) : (
        <p className="text-gray-600">카카오 로그인 처리 중...</p>
      )}
    </section>
  )
}

export default OAuthKakaoPage
