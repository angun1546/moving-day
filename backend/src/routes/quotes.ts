import { Router } from 'express'
import { prisma } from '../db.ts'

const router = Router()

// 허용하는 이사 종류
const MOVE_TYPES = ['포장이사', '반포장이사', '일반이사', '사무실이사']

// 견적 신청 등록
router.post('/', async (req, res) => {
  const { name, phone, moveType, fromRegion, toRegion, moveDate, homeSize, memo } =
    req.body ?? {}

  // 필수값 검증
  if (!name || !phone || !moveType || !fromRegion || !toRegion) {
    return res.status(400).json({ message: '필수 항목을 모두 입력해 주세요.' })
  }
  if (!MOVE_TYPES.includes(moveType)) {
    return res.status(400).json({ message: '이사 종류가 올바르지 않습니다.' })
  }

  try {
    const quote = await prisma.quoteRequest.create({
      data: { name, phone, moveType, fromRegion, toRegion, moveDate, homeSize, memo },
    })
    res.status(201).json(quote)
  } catch (err) {
    console.error('견적 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 신청에 실패했습니다.' })
  }
})

// 견적 신청 목록 (관리용, 최신순)
router.get('/', async (_req, res) => {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(quotes)
  } catch (err) {
    console.error('견적 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

export default router
