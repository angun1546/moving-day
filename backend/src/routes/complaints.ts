import { Router } from 'express'
import { prisma } from '../db.ts'
import { requireAdmin, requireAuth, type AuthedRequest } from '../auth.ts'
import { notify } from '../notify.ts'
import { sendMessage } from '../messaging.ts'

const onlyDigits = (v: unknown) => String(v ?? '').replace(/\D/g, '')

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

// 내 접수 목록 (본인 — 토큰의 이메일 기준, 최신순)
router.get('/mine', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const list = await prisma.complaint.findMany({
      where: { authorEmail: req.authUser!.username, hidden: false },
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

// 처리 (관리자 — 상태·답변·숨김) — 보낸 필드만 변경
router.patch('/:id', requireAdmin, async (req, res) => {
  const { status, reply, hidden } = req.body ?? {}
  try {
    // 답변이 '새로' 달렸는지 판단하려 직전 상태를 먼저 조회
    const before = await prisma.complaint.findUnique({ where: { id: req.params.id } })
    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status, reply, hidden },
    })
    // 답변이 비어있다가 새로 작성된 경우에만 작성자에게 알림 (상태·숨김만 바꿀 땐 생략)
    const replyAdded =
      String(reply ?? '').trim() && !String(before?.reply ?? '').trim()
    if (replyAdded) {
      void notifyComplaintReply(complaint)
    }
    res.json(complaint)
  } catch (err) {
    console.error('불편사항 처리 실패:', err)
    res.status(500).json({ message: '서버 오류로 처리에 실패했습니다.' })
  }
})

// 불편사항 답변 알림 — 인앱 + 카톡/SMS (작성자 본인에게)
//  회원이면 아이디(authorEmail=username)로 전화번호 조회, 비회원이면 contact가 번호면 사용
async function notifyComplaintReply(c: {
  authorEmail: string | null
  contact: string
  name: string
}) {
  try {
    let phone: string | null = null
    if (c.authorEmail) {
      // 인앱 알림 (회원만 — 마이페이지 종 아이콘)
      await notify(c.authorEmail, 'reply', '불편사항에 관리자 답변이 등록됐어요.', '/complaint')
      const user = await prisma.user.findUnique({ where: { username: c.authorEmail } })
      phone = user?.phone ?? null
    }
    // 회원 전화 없으면 접수 시 적은 연락처가 번호면 그쪽으로
    if (!phone && onlyDigits(c.contact).length >= 10) phone = c.contact
    const replyTemplate = process.env.SOLAPI_ALIMTALK_TEMPLATE_REPLY
    void sendMessage({
      to: phone,
      text: `[이삿날] 접수하신 불편사항에 관리자 답변이 등록되었습니다.\n홈페이지에서 확인해 주세요.`,
      kakao: replyTemplate
        ? { templateId: replyTemplate, variables: { '#{종류}': '불편사항' } }
        : undefined,
    })
  } catch (err) {
    console.error('불편사항 답변 알림 실패:', err)
  }
}

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
