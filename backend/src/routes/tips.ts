import { Router } from 'express'
import { prisma } from '../db.ts'
import { requireAdmin } from '../auth.ts'

// 팁 게시판 — 조회는 공개, 작성·수정·삭제는 관리자
const router = Router()

// 목록 (최신순)
router.get('/', async (_req, res) => {
  try {
    const tips = await prisma.tip.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(tips)
  } catch (err) {
    console.error('팁 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 작성 (관리자)
router.post('/', requireAdmin, async (req, res) => {
  const { title, content, category } = req.body ?? {}
  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 입력해 주세요.' })
  }
  try {
    const tip = await prisma.tip.create({
      data: { title, content, category: category || null },
    })
    res.status(201).json(tip)
  } catch (err) {
    console.error('팁 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// 수정 (관리자)
router.patch('/:id', requireAdmin, async (req, res) => {
  const { title, content, category } = req.body ?? {}
  try {
    const tip = await prisma.tip.update({
      where: { id: req.params.id },
      data: { title, content, category },
    })
    res.json(tip)
  } catch (err) {
    console.error('팁 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// 삭제 (관리자)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.tip.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('팁 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
