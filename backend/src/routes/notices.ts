import { Router } from 'express'
import { prisma } from '../db.ts'

const router = Router()

// 공지 목록 (최신순)
router.get('/', async (_req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(notices)
  } catch (err) {
    console.error('공지 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 공지 작성
router.post('/', async (req, res) => {
  const { title, body } = req.body ?? {}
  if (!title || !body) {
    return res.status(400).json({ message: '제목과 내용을 입력해 주세요.' })
  }
  try {
    const notice = await prisma.notice.create({ data: { title, body } })
    res.status(201).json(notice)
  } catch (err) {
    console.error('공지 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// 공지 수정
router.patch('/:id', async (req, res) => {
  const { title, body } = req.body ?? {}
  try {
    const notice = await prisma.notice.update({
      where: { id: req.params.id },
      data: { title, body },
    })
    res.json(notice)
  } catch (err) {
    console.error('공지 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// 공지 삭제
router.delete('/:id', async (req, res) => {
  try {
    await prisma.notice.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('공지 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
