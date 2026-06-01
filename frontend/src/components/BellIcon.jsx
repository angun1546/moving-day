import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import {
  NOTIFICATIONS_KEY,
  NOTIFICATIONS_EVENT,
} from '../utils/notifications'
import {
  getNotifications,
  markAllRead,
  clearNotifications,
} from '../services/notifications'

const TYPE_ICONS = {
  quote: '📋',
  bid: '💰',
  award: '🎉',
  reject: '😢',
  stage: '🚚',
  reply: '💬',
  payment: '💳',
  notice: '📢',
}

// 알림 시각(MM/DD HH:mm)
function formatTime(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${m}/${day} ${hh}:${mm}`
  } catch {
    return ''
  }
}

// 알림 벨 — 클릭 시 좌우 흔들기 + 드롭다운 (UserMenu와 같은 GSAP 패턴)
function BellIcon({ size = 22 }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([]) // 로컬(공지·FAQ답변 등)
  const [serverItems, setServerItems] = useState([]) // 서버 거래 알림(폴링)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const bellRef = useRef(null)
  const dropdownRef = useRef(null)

  // 로컬(수신자 필터 적용)과 서버 알림을 합쳐 최신순 정렬
  //  - id는 출처 접두사로 충돌 방지(l-: 로컬, s-: 서버)
  const visible = useMemo(() => {
    const local = notifications
      .filter((n) => !n.to || n.to === user?.email)
      .map((n) => ({ ...n, id: `l-${n.id}` }))
    const server = serverItems.map((n) => ({
      id: `s-${n.id}`,
      type: n.type,
      message: n.message,
      link: n.link,
      read: n.read,
      date: n.createdAt,
    }))
    return [...server, ...local].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )
  }, [notifications, serverItems, user?.email])

  // 초기 로드 + 외부 addNotification 호출 시 자동 갱신
  useEffect(() => {
    function refresh() {
      try {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY)
        setNotifications(raw ? JSON.parse(raw) : [])
      } catch {
        setNotifications([])
      }
    }
    refresh()
    window.addEventListener(NOTIFICATIONS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  // 로그인 사용자면 서버 알림을 20초마다 폴링 (비로그인은 비움)
  useEffect(() => {
    const email = user?.email
    if (!email) {
      setServerItems([])
      return
    }
    let alive = true
    async function poll() {
      const list = await getNotifications(email)
      if (alive) setServerItems(list)
    }
    poll()
    const t = setInterval(poll, 20000)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [user?.email])

  const unreadCount = visible.filter((n) => !n.read).length

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  // 드롭다운 페이드+슬라이드
  useEffect(() => {
    const el = dropdownRef.current
    if (!el) return
    if (open) {
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        y: -8,
        duration: 0.2,
        ease: 'power2.in',
      })
    }
  }, [open])

  function shake() {
    if (!bellRef.current) return
    gsap.fromTo(
      bellRef.current,
      { rotate: 0 },
      {
        keyframes: {
          rotate: [-15, 15, -12, 12, -8, 8, -4, 4, 0],
        },
        duration: 0.7,
        ease: 'power2.inOut',
        transformOrigin: '50% 0%',
      },
    )
  }

  function toggle() {
    shake()
    setOpen((v) => {
      const next = !v
      // 열 때 모두 읽음 처리 (잠시 후 — 사용자가 본 뒤)
      if (next && unreadCount > 0) {
        setTimeout(() => {
          // 서버 알림 읽음 (낙관적 갱신 + API)
          if (user?.email) {
            markAllRead(user.email)
            setServerItems((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          // 로컬 알림 읽음
          setNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }))
            try {
              localStorage.setItem(
                NOTIFICATIONS_KEY,
                JSON.stringify(updated),
              )
            } catch {
              // 무시
            }
            return updated
          })
        }, 1500)
      }
      return next
    })
  }

  const confirm = useConfirm()
  async function clearAll() {
    if (!(await confirm({ title: '알림 삭제', message: '모든 알림을 삭제할까요?', danger: true })))
      return
    // 서버 알림 비우기
    if (user?.email) {
      await clearNotifications(user.email)
      setServerItems([])
    }
    // 로컬 알림 비우기
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]))
    } catch {
      // 무시
    }
    setNotifications([])
  }

  function goTo(notice) {
    if (!notice.link) return
    setOpen(false)
    navigate(notice.link)
  }

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={toggle}
        aria-label={
          unreadCount > 0 ? `알림 ${unreadCount}건` : '알림'
        }
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-brand transition hover:bg-brand-bg"
      >
        <svg
          ref={bellRef}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
            aria-hidden="true"
          />
        )}
      </button>

      <div
        ref={dropdownRef}
        className="invisible absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-gray-100 bg-white py-2 opacity-0 shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-sm font-bold text-gray-900">알림</p>
          {visible.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-500 transition hover:text-brand"
            >
              모두 비우기
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {visible.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              새 알림이 없어요.
            </p>
          ) : (
            visible.map((n) =>
              n.link ? (
                <button
                  type="button"
                  key={n.id}
                  onClick={() => goTo(n)}
                  className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-brand-bg/70 ${
                    !n.read ? 'bg-brand-bg' : ''
                  }`}
                >
                  <span className="text-lg">{TYPE_ICONS[n.type] || '🔔'}</span>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-gray-800">
                      {n.message}
                    </p>
                    <p className="mt-1 font-inter text-xs text-gray-400">
                      {formatTime(n.date)}
                    </p>
                  </div>
                </button>
              ) : (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 transition ${
                    !n.read ? 'bg-brand-bg' : ''
                  }`}
                >
                  <span className="text-lg">{TYPE_ICONS[n.type] || '🔔'}</span>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-gray-800">
                      {n.message}
                    </p>
                    <p className="mt-1 font-inter text-xs text-gray-400">
                      {formatTime(n.date)}
                    </p>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default BellIcon
