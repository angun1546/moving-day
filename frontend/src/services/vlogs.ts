import type { Vlog } from '../data/apiTypes'
import { authHeaders } from './auth'

// 무빙 브이로그 API — 유튜브 URL만 다룸(파일 업로드 없음)
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/vlogs`

export async function getVlogs(): Promise<Vlog[]> {
  const res = await fetch(API)
  if (!res.ok) throw new Error('브이로그 조회에 실패했습니다.')
  return res.json()
}

export async function createVlog(data: Partial<Vlog>): Promise<Vlog> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '등록에 실패했습니다.')
  }
  return res.json()
}

export async function updateVlog(id: string, data: Partial<Vlog>): Promise<Vlog> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('수정에 실패했습니다.')
  return res.json()
}

export async function deleteVlog(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('삭제에 실패했습니다.')
  return res.json()
}

// 유튜브 URL → 영상 ID 추출(watch?v=, youtu.be/, embed/ 형태 지원)
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  )
  return m ? m[1] : null
}

// 유튜브 URL → 썸네일 이미지 URL(추출 실패 시 null)
export function youtubeThumb(url: string): string | null {
  const id = youtubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
