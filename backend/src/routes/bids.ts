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
      include: {
        quoteRequest: {
          include: { stageLogs: { orderBy: { createdAt: 'asc' } } },
        },
      },
    })
    res.json(bids)
  } catch (err) {
    console.error('내 입찰 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 낙찰 처리 (고객이 입찰 선택) — 선택 입찰 낙찰·나머지 거절·견적 완료
router.patch('/:id/accept', async (req, res) => {
  try {
    const bid = await prisma.bid.findUnique({ where: { id: req.params.id } })
    if (!bid) {
      return res.status(404).json({ message: '입찰을 찾을 수 없습니다.' })
    }
    await prisma.bid.update({
      where: { id: bid.id },
      data: { status: '낙찰' },
    })
    await prisma.bid.updateMany({
      where: { quoteRequestId: bid.quoteRequestId, id: { not: bid.id } },
      data: { status: '거절' },
    })
    await prisma.quoteRequest.update({
      where: { id: bid.quoteRequestId },
      data: { status: '완료', stage: '낙찰완료' },
    })
    await prisma.stageLog.create({
      data: { quoteRequestId: bid.quoteRequestId, stage: '낙찰완료' },
    })
    res.json({ ok: true, bid: { ...bid, status: '낙찰' } })
  } catch (err) {
    console.error('낙찰 처리 실패:', err)
    res.status(500).json({ message: '서버 오류로 낙찰 처리에 실패했습니다.' })
  }
})

// 낙찰 취소 (계약 전까지) — 같은 견적 입찰 전부 '입찰' 복원·견적 '상담중'
router.patch('/:id/cancel', async (req, res) => {
  try {
    const bid = await prisma.bid.findUnique({ where: { id: req.params.id } })
    if (!bid) {
      return res.status(404).json({ message: '입찰을 찾을 수 없습니다.' })
    }
    await prisma.bid.updateMany({
      where: { quoteRequestId: bid.quoteRequestId },
      data: { status: '입찰' },
    })
    await prisma.quoteRequest.update({
      where: { id: bid.quoteRequestId },
      data: { status: '상담중', stage: null },
    })
    // 낙찰 취소 시 진행 이력 초기화
    await prisma.stageLog.deleteMany({
      where: { quoteRequestId: bid.quoteRequestId },
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('낙찰 취소 실패:', err)
    res.status(500).json({ message: '서버 오류로 낙찰 취소에 실패했습니다.' })
  }
})

export default router
