import { Router } from 'express'
import { prisma } from '../db.ts'
import { notify } from '../notify.ts'
import { sendMessage } from '../messaging.ts'

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

    // 견적 주인에게 새 입찰 알림 (비회원 견적이면 notify가 알아서 생략)
    const quote = await prisma.quoteRequest.findUnique({
      where: { id: quoteRequestId },
      select: { userEmail: true },
    })
    await notify(
      quote?.userEmail,
      'bid',
      `${company}님이 입찰했어요. ${Number(price).toLocaleString()}원`,
      '/mypage',
    )

    // 견적 주인 휴대폰으로 SMS/알림톡 (회원 + 번호 있을 때만, 실패해도 입찰엔 영향 없음)
    // 알림톡 템플릿(SOLAPI_ALIMTALK_TEMPLATE_BID)이 설정돼 있으면 알림톡 우선, 아니면 SMS
    if (quote?.userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: quote.userEmail },
        select: { phone: true },
      })
      const bidTemplate = process.env.SOLAPI_ALIMTALK_TEMPLATE_BID
      const won = Number(price).toLocaleString()
      void sendMessage({
        to: user?.phone,
        text: `[이삿날] ${company}님이 견적을 보냈어요. ${won}원\n앱에서 비교하고 선택하세요.`,
        kakao: bidTemplate
          ? { templateId: bidTemplate, variables: { 업체명: company, 금액: won } }
          : undefined,
      })
    }

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
    // 거절될 다른 입찰 파트너 목록 (updateMany 전에 미리 확보)
    const losers = await prisma.bid.findMany({
      where: { quoteRequestId: bid.quoteRequestId, id: { not: bid.id } },
      select: { bidderEmail: true },
    })

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

    // 낙찰 파트너에게 축하, 나머지 파트너에게 거절 알림
    await notify(
      bid.bidderEmail,
      'award',
      '축하해요! 고객이 회원님의 입찰을 선택했어요.',
      '/partner/bids',
    )
    for (const l of losers) {
      await notify(
        l.bidderEmail,
        'reject',
        '아쉽게도 이번 견적은 다른 업체로 결정되었어요.',
        '/partner/bids',
      )
    }

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

    // 낙찰됐던 파트너에게 취소 알림
    await notify(
      bid.bidderEmail,
      'reject',
      '낙찰이 취소되어 다시 검토 단계로 돌아갔어요.',
      '/partner/bids',
    )

    res.json({ ok: true })
  } catch (err) {
    console.error('낙찰 취소 실패:', err)
    res.status(500).json({ message: '서버 오류로 낙찰 취소에 실패했습니다.' })
  }
})

export default router
