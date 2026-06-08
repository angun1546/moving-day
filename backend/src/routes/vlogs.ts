import { Router } from 'express'
import { prisma } from '../db.ts'
import { requireAdmin } from '../auth.ts'

// 무빙 브이로그 — 유튜브 영상 임베드(썸네일은 프론트가 URL에서 추출)
const router = Router()

// GET /api/vlogs — 목록(최신순)
router.get('/', async (_req, res) => {
  try {
    const vlogs = await prisma.vlog.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(vlogs)
  } catch (err) {
    console.error('브이로그 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// POST /api/vlogs — 영상 등록
router.post('/', requireAdmin, async (req, res) => {
  const { title, videoUrl } = req.body ?? {}
  if (!title || !videoUrl) {
    return res.status(400).json({ message: '제목과 영상 링크를 입력해 주세요.' })
  }
  try {
    const vlog = await prisma.vlog.create({ data: { title, videoUrl } })
    res.status(201).json(vlog)
  } catch (err) {
    console.error('브이로그 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// PATCH /api/vlogs/:id — 수정
router.patch('/:id', requireAdmin, async (req, res) => {
  const { title, videoUrl } = req.body ?? {}
  try {
    const vlog = await prisma.vlog.update({
      where: { id: req.params.id },
      data: { title, videoUrl },
    })
    res.json(vlog)
  } catch (err) {
    console.error('브이로그 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// DELETE /api/vlogs/:id — 삭제
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.vlog.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('브이로그 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
