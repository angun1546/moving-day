import { Router } from 'express'
import { prisma } from '../db.ts'

const router = Router()

// 파트너 스토리 목록 (최신순) — 숨김 포함(프론트가 화면별 필터)
router.get('/', async (_req, res) => {
  try {
    const list = await prisma.partnerStory.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(list)
  } catch (err) {
    console.error('파트너 스토리 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 작성
router.post('/', async (req, res) => {
  const { company, text, rating, authorEmail } = req.body ?? {}
  if (!company || !text || !rating) {
    return res.status(400).json({ message: '업체명·후기·별점을 입력해 주세요.' })
  }
  const r = Number(rating)
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ message: '별점은 1~5 사이여야 합니다.' })
  }
  try {
    const story = await prisma.partnerStory.create({
      data: { company, text, rating: r, authorEmail: authorEmail || null },
    })
    res.status(201).json(story)
  } catch (err) {
    console.error('파트너 스토리 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// 수정 (관리자 수정·숨김 토글·답변) — 보낸 필드만
router.patch('/:id', async (req, res) => {
  const { company, text, rating, hidden, reply } = req.body ?? {}
  try {
    const story = await prisma.partnerStory.update({
      where: { id: req.params.id },
      data: {
        company,
        text,
        rating: rating == null ? undefined : Number(rating),
        hidden,
        reply,
      },
    })
    res.json(story)
  } catch (err) {
    console.error('파트너 스토리 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    await prisma.partnerStory.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('파트너 스토리 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
