// 알림 시스템 — 단일 사용자 가정(목업), 풀스택 단계에서 user별 큐로 분리 예정

const KEY = 'movingday_notifications'
const EVENT = 'notifications-changed'

function readAll() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    // 같은 탭의 BellIcon에 변경 알림 (storage 이벤트는 다른 탭만 발생)
    window.dispatchEvent(new Event(EVENT))
  } catch {
    // 저장 실패 무시
  }
}

// 알림 추가 — type: 'quote'|'bid'|'reply'|'payment'|'notice'
// link: BellIcon 드롭다운에서 클릭 시 이동할 경로
// to: 수신자 이메일 (지정 시 그 사용자에게만 노출, 없으면 모두에게)
/**
 * @param {{ type?: string, message: string, link?: string, to?: string | null }} n
 */
export function addNotification({ type, message, link, to }) {
  if (!message) return
  // 수신자 지정인데 이메일이 비어있으면(비로그인 등) 알림 자체를 보내지 않음
  if (to === '') return
  const list = readAll()
  const next = [
    {
      id: Date.now(),
      type,
      message,
      link: link || '',
      to: to || null,
      read: false,
      date: new Date().toISOString(),
    },
    ...list,
  ].slice(0, 50) // 최대 50건만 유지
  writeAll(next)
}

export const NOTIFICATIONS_KEY = KEY
export const NOTIFICATIONS_EVENT = EVENT
