import type { ProjectPost } from '../data/apiTypes'

// 무빙 프로젝트(갤러리·포트폴리오) API — 사진은 FormData로 전송
const BASE = import.meta.env.VITE_API_BASE ?? ''
const API = `${BASE}/api/projects`

// kind 미지정 시 전체, 지정 시 해당 종류만
export async function getProjects(kind?: string): Promise<ProjectPost[]> {
  const url = kind ? `${API}?kind=${encodeURIComponent(kind)}` : API
  const res = await fetch(url)
  if (!res.ok) throw new Error('프로젝트 조회에 실패했습니다.')
  return res.json()
}

// FormData — kind·title·excerpt + image(선택)
export async function createProject(form: FormData): Promise<ProjectPost> {
  const res = await fetch(API, { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? '등록에 실패했습니다.')
  }
  return res.json()
}

export async function updateProject(
  id: string,
  form: FormData,
): Promise<ProjectPost> {
  const res = await fetch(`${API}/${id}`, { method: 'PATCH', body: form })
  if (!res.ok) throw new Error('수정에 실패했습니다.')
  return res.json()
}

export async function deleteProject(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('삭제에 실패했습니다.')
  return res.json()
}
