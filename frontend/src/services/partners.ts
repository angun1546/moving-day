// 파트너 업체 프로필 API 클라이언트
import type { PartnerProfile } from '../data/apiTypes'

const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/partners`

// 내 업체 프로필 조회 (없으면 null)
export async function getPartnerProfile(
  email: string,
): Promise<PartnerProfile | null> {
  if (!email) return null
  try {
    const res = await fetch(`${API}/${encodeURIComponent(email)}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// 업체 프로필 저장 — FormData(텍스트 + 사진/자격증 파일 + existing* 기존 유지값)
export async function savePartnerProfile(
  formData: FormData,
): Promise<PartnerProfile> {
  const res = await fetch(API, { method: 'PUT', body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '업체 정보 저장에 실패했습니다.')
  }
  return res.json()
}
