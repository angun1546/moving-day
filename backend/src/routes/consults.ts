import { Router } from 'express'
import { prisma } from '../db.ts'
import { requireAdmin, requireAuth, type AuthedRequest } from '../auth.ts'
import { sendMessage } from '../messaging.ts'
import { sendMail } from '../mailer.ts'
import { notify } from '../notify.ts'

const onlyDigits = (v: unknown) => String(v ?? '').replace(/\D/g, '')
// 연락처가 이메일 형식인지(@ 포함·점 포함) 간단 판별
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

// 상담 신청 — 제출은 공개(상담 도크), 목록·처리·삭제는 관리자
const router = Router()

// 접수 확인 발송 — 연락처가 이메일이면 메일, 전화번호면 SMS (실패해도 접수는 성공)
async function notifyConsultReceived(c: {
  name: string
  contact: string
  moveType: string | null
  content: string | null
}) {
  try {
    const lines = [
      `${c.name}님, 상담신청이 정상 접수되었습니다.`,
      '',
      `이사 종류: ${c.moveType || '미정'}`,
      `상담 내용: ${c.content || '-'}`,
      '',
      '담당 상담원이 빠르게 연락드리겠습니다. 감사합니다.',
    ].join('\n')

    if (isEmail(c.contact)) {
      await sendMail(c.contact.trim(), '[이삿날] 상담신청이 접수되었습니다', lines)
    } else if (onlyDigits(c.contact).length >= 9) {
      await sendMessage({
        to: c.contact,
        text: `[이삿날] ${c.name}님, 상담신청이 접수되었습니다.\n곧 담당 상담원이 연락드릴게요. 감사합니다.`,
      })
    }
  } catch (err) {
    console.error('상담신청 접수 알림 실패:', err)
  }
}

// 목록 (관리자 — 최신순)
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const list = await prisma.consult.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(list)
  } catch (err) {
    console.error('상담신청 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 내 신청 목록 (본인 — 토큰의 아이디 기준, 최신순)
router.get('/mine', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const list = await prisma.consult.findMany({
      where: { authorEmail: req.authUser!.username, hidden: false },
      orderBy: { createdAt: 'desc' },
    })
    res.json(list)
  } catch (err) {
    console.error('내 상담신청 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 신청 (공개 — 회원·비회원 모두)
router.post('/', async (req, res) => {
  const { name, contact, moveType, content, authorEmail } = req.body ?? {}
  if (!name || !contact || !moveType || !content) {
    return res
      .status(400)
      .json({ message: '이름·연락처·이사 종류·상담 내용을 모두 입력해 주세요.' })
  }
  try {
    const consult = await prisma.consult.create({
      data: {
        name,
        contact,
        moveType,
        content,
        authorEmail: authorEmail || null,
      },
    })
    // 접수 확인 발송(이메일/SMS) — 비동기, 실패해도 접수 응답엔 영향 없음
    void notifyConsultReceived(consult)
    res.status(201).json(consult)
  } catch (err) {
    console.error('상담신청 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 접수에 실패했습니다.' })
  }
})

// 처리 (관리자 — 상태·메모·답변·숨김) — 보낸 필드만 변경
router.patch('/:id', requireAdmin, async (req, res) => {
  const { status, memo, reply, hidden } = req.body ?? {}
  try {
    // 답변이 '새로' 달렸는지 판단하려 직전 상태를 먼저 조회
    const before = await prisma.consult.findUnique({ where: { id: req.params.id } })
    const consult = await prisma.consult.update({
      where: { id: req.params.id },
      data: { status, memo, reply, hidden },
    })
    // 답변이 비어있다가 새로 작성된 경우에만 발송 (상태·메모·숨김만 바꿀 땐 생략)
    const replyAdded =
      String(reply ?? '').trim() && !String(before?.reply ?? '').trim()
    if (replyAdded) {
      void notifyConsultReply(consult)
    }
    res.json(consult)
  } catch (err) {
    console.error('상담신청 처리 실패:', err)
    res.status(500).json({ message: '서버 오류로 처리에 실패했습니다.' })
  }
})

// 답변 전달 — 이메일 신청이면 그 메일로 답변 발송(전화 신청은 상담원이 직접 통화)
//  회원이면 인앱 알림(마이페이지 종)도 함께
async function notifyConsultReply(c: {
  name: string
  contact: string
  reply: string | null
  authorEmail: string | null
}) {
  try {
    if (c.authorEmail) {
      await notify(c.authorEmail, 'reply', '상담신청에 관리자 답변이 등록됐어요.', '/consult')
    }
    // 이메일로 신청한 경우에만 답변 메일 발송
    if (isEmail(c.contact)) {
      const body = [
        `${c.name}님, 남겨주신 상담신청에 답변드립니다.`,
        '',
        c.reply || '',
        '',
        '추가 문의는 언제든 회신해 주세요. 감사합니다. — 이삿날',
      ].join('\n')
      await sendMail(c.contact.trim(), '[이삿날] 상담신청 답변이 도착했습니다', body)
    }
  } catch (err) {
    console.error('상담신청 답변 발송 실패:', err)
  }
}

// 삭제 (관리자)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.consult.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('상담신청 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
