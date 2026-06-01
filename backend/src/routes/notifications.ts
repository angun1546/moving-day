import { Router } from 'express'
import { prisma } from '../db.ts'

const router = Router()

// 내 알림 목록 (수신자별, 최신순 최근 50건)
router.get('/:email', async (req, res) => {
  try {
    const list = await prisma.notification.findMany({
      where: { toEmail: req.params.email },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    res.json(list)
  } catch (err) {
    console.error('알림 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 내 알림 모두 읽음 처리
router.patch('/:email/read', async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { toEmail: req.params.email, read: false },
      data: { read: true },
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('알림 읽음 처리 실패:', err)
    res.status(500).json({ message: '서버 오류로 처리에 실패했습니다.' })
  }
})

// 내 알림 모두 비우기
router.delete('/:email', async (req, res) => {
  try {
    await prisma.notification.deleteMany({ where: { toEmail: req.params.email } })
    res.json({ ok: true })
  } catch (err) {
    console.error('알림 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
