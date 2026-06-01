import { Router } from 'express'
import { prisma } from '../db.ts'

const router = Router()

// 업체별 평점 집계 (숨김 제외) — 입찰 비교에서 사용
//  /:id 라우트보다 위에 둬야 'ratings'가 id로 안 잡힘
router.get('/ratings', async (_req, res) => {
  try {
    const grouped = await prisma.review.groupBy({
      by: ['company'],
      where: { hidden: false, company: { not: null }, rating: { gt: 0 } },
      _avg: { rating: true },
      _count: { rating: true },
    })
    const ratings = grouped
      .filter((g) => g.company)
      .map((g) => ({
        company: g.company,
        avg: g._avg.rating ?? 0,
        count: g._count.rating,
      }))
    res.json(ratings)
  } catch (err) {
    console.error('평점 집계 실패:', err)
    res.status(500).json({ message: '서버 오류로 평점 조회에 실패했습니다.' })
  }
})

// 리뷰 목록 (최신순) — 숨김 포함(프론트가 화면별로 필터)
router.get('/', async (_req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(reviews)
  } catch (err) {
    console.error('리뷰 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 리뷰 작성
router.post('/', async (req, res) => {
  const { name, text, rating, moveType, company, authorEmail } = req.body ?? {}
  if (!name || !text || !rating) {
    return res.status(400).json({ message: '이름·내용·별점을 입력해 주세요.' })
  }
  const r = Number(rating)
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ message: '별점은 1~5 사이여야 합니다.' })
  }
  try {
    const review = await prisma.review.create({
      data: {
        name,
        text,
        rating: r,
        moveType: moveType || null,
        company: company || null,
        authorEmail: authorEmail || null,
      },
    })
    res.status(201).json(review)
  } catch (err) {
    console.error('리뷰 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// 리뷰 수정 (관리자 수정·숨김 토글·답변) — 보낸 필드만 변경
router.patch('/:id', async (req, res) => {
  const { name, text, rating, moveType, company, hidden, reply } = req.body ?? {}
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        name,
        text,
        rating: rating == null ? undefined : Number(rating),
        moveType,
        company,
        hidden,
        reply,
      },
    })
    res.json(review)
  } catch (err) {
    console.error('리뷰 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// 리뷰 삭제
router.delete('/:id', async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('리뷰 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
