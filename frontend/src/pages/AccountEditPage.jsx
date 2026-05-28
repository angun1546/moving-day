import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDisplayMode, setDisplayMode } from '../utils/userDisplay'

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20'

function AccountEditPage() {
  const { user, updateUser } = useAuth()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const currentMode = getDisplayMode()

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-gray-600">로그인이 필요한 페이지입니다.</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          로그인
        </Link>
      </section>
    )
  }

  // 저장 — 마이페이지에 즉시 반영 (AuthContext updateUser)
  function submit(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const pw = fd.get('password')?.toString() ?? ''
    const pwc = fd.get('passwordConfirm')?.toString() ?? ''
    if (pw || pwc) {
      if (pw !== pwc) {
        setError('새 비밀번호가 일치하지 않습니다.')
        return
      }
      if (pw.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.')
        return
      }
    }
    updateUser({
      nickname: fd.get('nickname')?.toString().trim() || user.nickname,
      phone: fd.get('phone')?.toString().trim() || user.phone,
    })
    setDisplayMode(fd.get('displayMode') || 'nickname')
    setSaved(true)
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <Link
        to="/mypage"
        className="text-sm text-gray-500 transition hover:text-brand"
      >
        ← 마이페이지
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">회원정보 수정</h1>
      <p className="mt-3 text-gray-600">변경할 항목만 입력 후 저장하세요.</p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="mt-6 rounded-xl border border-brand-light bg-brand-bg px-4 py-3 text-sm font-semibold text-brand-dark">
          ✓ 회원정보가 저장되었습니다. (마이페이지에 즉시 반영)
        </div>
      )}

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">닉네임</span>
          <input
            type="text"
            name="nickname"
            required
            defaultValue={user.nickname || ''}
            placeholder="닉네임"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-800">전화번호</span>
          <input
            type="tel"
            name="phone"
            defaultValue={user.phone || ''}
            placeholder="010-1234-5678"
            className={inputClass}
          />
        </label>

        {/* 리뷰·FAQ 표시 방식 */}
        <div>
          <span className="text-sm font-semibold text-gray-800">
            리뷰·FAQ 표시 방식
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition has-[:checked]:bg-brand has-[:checked]:text-white">
              <input
                type="radio"
                name="displayMode"
                value="nickname"
                defaultChecked={currentMode !== 'real'}
                className="sr-only"
              />
              닉네임 그대로
            </label>
            <label className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition has-[:checked]:bg-brand has-[:checked]:text-white">
              <input
                type="radio"
                name="displayMode"
                value="real"
                defaultChecked={currentMode === 'real'}
                className="sr-only"
              />
              실명 일부 가림
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            예: 실명 “김민지” → “김O지”로 리뷰·FAQ에 표시됩니다.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-800">비밀번호 변경</p>
          <p className="mt-1 text-xs text-gray-400">
            변경하지 않으려면 비워두세요.
          </p>
          <input
            type="password"
            name="password"
            minLength={6}
            placeholder="새 비밀번호 (6자 이상)"
            className={`${inputClass} mt-3`}
          />
          <input
            type="password"
            name="passwordConfirm"
            minLength={6}
            placeholder="새 비밀번호 확인"
            className={`${inputClass} mt-2`}
          />
        </div>

        <p className="text-xs text-gray-400">
          이름·이메일은 본인인증이 필요하여 변경할 수 없습니다.
        </p>

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

export default AccountEditPage
