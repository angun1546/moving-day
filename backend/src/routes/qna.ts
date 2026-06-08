import { Router } from 'express'
import { prisma } from '../db.ts'
import { requireAdmin } from '../auth.ts'

const router = Router()

// scope(user|partner)별 Q&A 목록 (최신순)
router.get('/:scope', async (req, res) => {
  try {
    const list = await prisma.qna.findMany({
      where: { scope: req.params.scope },
      orderBy: { createdAt: 'desc' },
    })
    res.json(list)
  } catch (err) {
    console.error('Q&A 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 질문 작성
router.post('/', async (req, res) => {
  const { scope, name, q, authorEmail } = req.body ?? {}
  if (!scope || !name || !q) {
    return res.status(400).json({ message: '필수 항목을 입력해 주세요.' })
  }
  if (scope !== 'user' && scope !== 'partner') {
    return res.status(400).json({ message: '잘못된 요청입니다.' })
  }
  try {
    const qna = await prisma.qna.create({
      data: { scope, name, q, authorEmail: authorEmail || null },
    })
    res.status(201).json(qna)
  } catch (err) {
    console.error('Q&A 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// 수정 (관리자 답변 a, 숨김 hidden) — 보낸 필드만 변경
router.patch('/:id', requireAdmin, async (req, res) => {
  const { a, hidden } = req.body ?? {}
  try {
    const qna = await prisma.qna.update({
      where: { id: req.params.id },
      data: { a, hidden },
    })
    res.json(qna)
  } catch (err) {
    console.error('Q&A 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// 질문 삭제
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.qna.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('Q&A 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
