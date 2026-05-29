import { Router } from 'express'
import { prisma } from '../db.ts'

const router = Router()

// 입찰 생성 (파트너가 견적 요청에 입찰)
router.post('/', async (req, res) => {
  const { quoteRequestId, bidderEmail, company, price, message, eta } =
    req.body ?? {}

  if (!quoteRequestId || !bidderEmail || !company || price == null) {
    return res.status(400).json({ message: '필수 항목을 입력해 주세요.' })
  }

  try {
    const bid = await prisma.bid.create({
      data: {
        quoteRequestId,
        bidderEmail,
        company,
        price: Number(price),
        message: message || null,
        eta: eta || null,
      },
    })
    res.status(201).json(bid)
  } catch (err) {
    console.error('입찰 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 입찰에 실패했습니다.' })
  }
})

// 견적별 입찰 목록 (고객 비교 — 가격 오름차순)
router.get('/quote/:quoteId', async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { quoteRequestId: req.params.quoteId },
      orderBy: { price: 'asc' },
    })
    res.json(bids)
  } catch (err) {
    console.error('입찰 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 파트너 본인 입찰 목록 (견적 정보 포함)
router.get('/mine/:email', async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { bidderEmail: req.params.email },
      orderBy: { createdAt: 'desc' },
      include: { quoteRequest: true },
    })
    res.json(bids)
  } catch (err) {
    console.error('내 입찰 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

export default router
