import { Router } from 'express'
import { prisma } from '../db.ts'
import { requireAdmin } from '../auth.ts'

// 불편사항 접수 — 제출은 공개, 목록·처리·삭제는 관리자
const router = Router()

// 목록 (관리자 — 최신순)
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const list = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(list)
  } catch (err) {
    console.error('불편사항 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 내 접수 목록 (본인 — authorEmail 기준, 최신순)
router.get('/mine/:email', async (req, res) => {
  try {
    const list = await prisma.complaint.findMany({
      where: { authorEmail: req.params.email },
      orderBy: { createdAt: 'desc' },
    })
    res.json(list)
  } catch (err) {
    console.error('내 불편사항 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 접수 (공개 — 회원·비회원 모두)
router.post('/', async (req, res) => {
  const { name, contact, content, authorEmail } = req.body ?? {}
  if (!name || !contact || !content) {
    return res.status(400).json({ message: '이름·연락처·내용을 입력해 주세요.' })
  }
  try {
    const complaint = await prisma.complaint.create({
      data: { name, contact, content, authorEmail: authorEmail || null },
    })
    res.status(201).json(complaint)
  } catch (err) {
    console.error('불편사항 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 접수에 실패했습니다.' })
  }
})

// 처리 (관리자 — 상태·답변) — 보낸 필드만 변경
router.patch('/:id', requireAdmin, async (req, res) => {
  const { status, reply } = req.body ?? {}
  try {
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status, reply },
    })
    res.json(complaint)
  } catch (err) {
    console.error('불편사항 처리 실패:', err)
    res.status(500).json({ message: '서버 오류로 처리에 실패했습니다.' })
  }
})

// 삭제 (관리자)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.complaint.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('불편사항 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
