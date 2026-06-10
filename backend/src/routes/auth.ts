import { Router } from 'express'
import { prisma } from '../db.ts'
import {
  hashPassword,
  comparePassword,
  signToken,
  authMiddleware,
} from '../auth.ts'
import { sendMessage, isSmsLive } from '../messaging.ts'
import { sendMail, isMailLive } from '../mailer.ts'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GENDERS = ['남', '여']

// 휴대폰 인증번호 — 메모리 보관(서버 단일 PM2 프로세스). 재시작 시 초기화되어도 무방.
const phoneCodes = new Map<string, { code: string; expires: number }>() // 발송한 코드
const verifiedPhones = new Map<string, number>() // 인증 완료된 번호 → 만료시각
const emailCodes = new Map<string, { code: string; expires: number }>() // 이메일 발송 코드
const verifiedEmails = new Map<string, number>() // 인증 완료된 이메일 → 만료시각
const verifiedResetPhones = new Map<string, number>() // 비번재설정 인증 완료 번호
const verifiedResetEmails = new Map<string, number>() // 비번재설정 인증 완료 이메일
const CODE_TTL = 3 * 60 * 1000 // 인증번호 유효 3분
const VERIFIED_TTL = 30 * 60 * 1000 // 인증 후 30분 내 가입 유효

// 하이픈·공백 제거한 숫자만
const onlyDigits = (v: unknown) => String(v ?? '').replace(/\D/g, '')

// 관리자 이메일 — 코드에 두지 않고 환경변수(.env)로. 이 이메일로 가입 시 role=admin 자동 부여
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

// 외부에 노출할 사용자 정보 (비밀번호 제외)
function publicUser(u: {
  id: string
  username: string
  email: string
  name: string
  role: string
  birthDate: string | null
  gender: string | null
  phone: string | null
  verified: boolean
}) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    birthDate: u.birthDate,
    gender: u.gender,
    phone: u.phone,
    verified: u.verified,
  }
}

// 아이디(username) 형식 — 영문 소문자/숫자/_ 4~20자, 영문으로 시작
const USERNAME_RE = /^[a-z][a-z0-9_]{3,19}$/

// 회원가입
router.post('/signup', async (req, res) => {
  const { name, username, email, password, birthDate, gender, phone, role } =
    req.body ?? {}

  if (!name || !username || !email || !password || !birthDate || !gender || !phone) {
    return res.status(400).json({ message: '모든 항목을 입력해 주세요.' })
  }
  const normUsername = String(username).trim().toLowerCase()
  if (!USERNAME_RE.test(normUsername)) {
    return res
      .status(400)
      .json({ message: '아이디는 영문으로 시작하는 영문·숫자·_ 4~20자여야 합니다.' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: '올바른 이메일 형식이 아닙니다.' })
  }
  // 영문·숫자·특수문자 조합 8자 이상
  const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  if (!pwRule.test(String(password))) {
    return res
      .status(400)
      .json({ message: '비밀번호는 영문·숫자·특수문자를 포함해 8자 이상이어야 합니다.' })
  }
  if (!GENDERS.includes(gender)) {
    return res.status(400).json({ message: '성별을 선택해 주세요.' })
  }
  // 휴대폰 본인인증 필수 — verify-code 통과한 번호만 가입 허용
  const normPhone = onlyDigits(phone)
  const vexp = verifiedPhones.get(normPhone)
  if (!vexp || vexp < Date.now()) {
    return res.status(400).json({ message: '휴대폰 본인인증을 완료해 주세요.' })
  }
  // 이메일 본인인증 필수 — verify-email-code 통과한 이메일만 가입 허용
  const normEmail = String(email).trim()
  const vemail = verifiedEmails.get(normEmail)
  if (!vemail || vemail < Date.now()) {
    return res.status(400).json({ message: '이메일 인증을 완료해 주세요.' })
  }

  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' })
    }
    const idExists = await prisma.user.findUnique({ where: { username: normUsername } })
    if (idExists) {
      return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' })
    }
    // 역할 결정 — admin은 이메일로만(클라 입력 무시), 그 외엔 진입 경로(partner) 신뢰
    const resolvedRole =
      email === ADMIN_EMAIL
        ? 'admin'
        : role === 'partner'
          ? 'partner'
          : 'customer'

    const user = await prisma.user.create({
      data: {
        name,
        username: normUsername,
        email,
        password: await hashPassword(password),
        role: resolvedRole,
        birthDate,
        gender,
        phone,
        verified: true, // 휴대폰 인증을 통과한 가입
      },
    })
    verifiedPhones.delete(normPhone) // 1회용 — 가입 완료 후 인증 상태 소진
    verifiedEmails.delete(normEmail)
    res.status(201).json({ token: signToken(user.id), user: publicUser(user) })
  } catch (err) {
    console.error('회원가입 실패:', err)
    res.status(500).json({ message: '서버 오류로 가입에 실패했습니다.' })
  }
})

// 아이디 중복 확인 (회원가입 실시간 체크) — available=true면 사용 가능
router.get('/check-username', async (req, res) => {
  const username = String(req.query.username ?? '').trim().toLowerCase()
  if (!USERNAME_RE.test(username)) {
    return res.json({ available: false, reason: 'invalid' })
  }
  try {
    const exists = await prisma.user.findUnique({ where: { username } })
    res.json({ available: !exists })
  } catch (err) {
    console.error('아이디 확인 실패:', err)
    res.status(500).json({ message: '서버 오류로 확인에 실패했습니다.' })
  }
})

// 이메일 중복 확인 (회원가입 실시간 체크) — available=true면 사용 가능
router.get('/check-email', async (req, res) => {
  const email = String(req.query.email ?? '').trim()
  if (!EMAIL_RE.test(email)) {
    return res.json({ available: false, reason: 'invalid' })
  }
  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    res.json({ available: !exists })
  } catch (err) {
    console.error('이메일 확인 실패:', err)
    res.status(500).json({ message: '서버 오류로 확인에 실패했습니다.' })
  }
})

// 휴대폰 인증번호 발송 (6자리, 3분 유효) — SMS로 전송(서버 솔라피 키 없으면 콘솔 mock)
router.post('/send-code', async (req, res) => {
  const phone = onlyDigits(req.body?.phone)
  if (phone.length < 10) {
    return res.status(400).json({ message: '올바른 휴대폰 번호를 입력해 주세요.' })
  }
  const code = String(Math.floor(100000 + Math.random() * 900000))
  phoneCodes.set(phone, { code, expires: Date.now() + CODE_TTL })
  await sendMessage({
    to: phone,
    text: `[이삿날] 인증번호 ${code}\n3분 안에 입력해 주세요.`,
  })
  // SMS 키가 없으면(mock) 개발 편의로 인증번호를 응답에 포함 — 키 설정 시 자동 제거
  res.json(isSmsLive() ? { ok: true } : { ok: true, devCode: code })
})

// 휴대폰 인증번호 확인 — 일치하면 가입 가능 상태로 등록
router.post('/verify-code', (req, res) => {
  const phone = onlyDigits(req.body?.phone)
  const code = String(req.body?.code ?? '').trim()
  const rec = phoneCodes.get(phone)
  if (!rec || rec.expires < Date.now()) {
    return res.status(400).json({ message: '인증번호가 만료되었습니다. 다시 받아 주세요.' })
  }
  if (rec.code !== code) {
    return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' })
  }
  phoneCodes.delete(phone)
  verifiedPhones.set(phone, Date.now() + VERIFIED_TTL)
  res.json({ ok: true })
})

// 이메일 인증번호 발송 (6자리, 3분 유효) — Gmail SMTP(키 없으면 콘솔 mock)
router.post('/send-email-code', async (req, res) => {
  const email = String(req.body?.email ?? '').trim()
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: '올바른 이메일을 입력해 주세요.' })
  }
  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' })
    }
    const code = String(Math.floor(100000 + Math.random() * 900000))
    emailCodes.set(email, { code, expires: Date.now() + CODE_TTL })
    await sendMail(
      email,
      '[이삿날] 이메일 인증번호',
      `이삿날 회원가입 인증번호는 ${code} 입니다.\n3분 안에 입력해 주세요.`,
    )
    // 메일 키가 없으면(mock) 개발 편의로 인증번호를 응답에 포함 — 키 설정 시 자동 제거
    res.json(isMailLive() ? { ok: true } : { ok: true, devCode: code })
  } catch (err) {
    console.error('이메일 인증 발송 실패:', err)
    res.status(500).json({ message: '서버 오류로 발송에 실패했습니다.' })
  }
})

// 이메일 인증번호 확인 — 일치하면 가입 가능 상태로 등록
router.post('/verify-email-code', (req, res) => {
  const email = String(req.body?.email ?? '').trim()
  const code = String(req.body?.code ?? '').trim()
  const rec = emailCodes.get(email)
  if (!rec || rec.expires < Date.now()) {
    return res.status(400).json({ message: '인증번호가 만료되었습니다. 다시 받아 주세요.' })
  }
  if (rec.code !== code) {
    return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' })
  }
  emailCodes.delete(email)
  verifiedEmails.set(email, Date.now() + VERIFIED_TTL)
  res.json({ ok: true })
})

// 로그인 — 아이디(username) + 비밀번호
router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {}

  if (!username || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력해 주세요.' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: String(username).trim().toLowerCase() },
    })
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' })
    }
    res.json({ token: signToken(user.id), user: publicUser(user) })
  } catch (err) {
    console.error('로그인 실패:', err)
    res.status(500).json({ message: '서버 오류로 로그인에 실패했습니다.' })
  }
})

// 아이디 찾기 — 이름+전화 일치 회원 조회 헬퍼 (동명이인은 전화로 대조)
async function findUserByNamePhone(name: unknown, phone: unknown) {
  const users = await prisma.user.findMany({ where: { name: String(name ?? '').trim() } })
  return users.find((u) => onlyDigits(u.phone) === onlyDigits(phone)) ?? null
}

// 아이디 찾기 ① 인증번호 발송 — 이름+전화가 일치하는 가입자에게만 SMS 발송
router.post('/find-id/send-code', async (req, res) => {
  const { name, phone } = req.body ?? {}
  if (!name || onlyDigits(phone).length < 10) {
    return res.status(400).json({ message: '이름과 휴대폰 번호를 정확히 입력해 주세요.' })
  }
  try {
    const target = await findUserByNamePhone(name, phone)
    if (!target) {
      return res.status(404).json({ message: '일치하는 가입 정보가 없습니다.' })
    }
    const digits = onlyDigits(phone)
    const code = String(Math.floor(100000 + Math.random() * 900000))
    phoneCodes.set('findid:' + digits, { code, expires: Date.now() + CODE_TTL })
    await sendMessage({
      to: digits,
      text: `[이삿날] 아이디 찾기 인증번호 ${code}\n3분 안에 입력해 주세요.`,
    })
    res.json(isSmsLive() ? { ok: true } : { ok: true, devCode: code })
  } catch (err) {
    console.error('아이디 찾기 인증 발송 실패:', err)
    res.status(500).json({ message: '서버 오류로 발송에 실패했습니다.' })
  }
})

// 아이디 찾기 ② 인증번호 확인 — 통과 시에만 아이디(username) 전체 반환
router.post('/find-id/confirm', async (req, res) => {
  const { name, phone, code } = req.body ?? {}
  const digits = onlyDigits(phone)
  const rec = phoneCodes.get('findid:' + digits)
  if (!rec || rec.expires < Date.now()) {
    return res.status(400).json({ message: '인증번호가 만료되었습니다. 다시 받아 주세요.' })
  }
  if (rec.code !== String(code ?? '').trim()) {
    return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' })
  }
  try {
    const target = await findUserByNamePhone(name, phone)
    if (!target) {
      return res.status(404).json({ message: '일치하는 가입 정보가 없습니다.' })
    }
    phoneCodes.delete('findid:' + digits) // 1회용 — 확인 후 소진
    res.json({ username: target.username })
  } catch (err) {
    console.error('아이디 찾기 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// ── 비밀번호 재설정 — SMS/이메일 인증 방식(둘 중 선택) ──────────────
// 전화 인증번호 발송 (가입된 번호만)
router.post('/reset/send-phone-code', async (req, res) => {
  const phone = onlyDigits(req.body?.phone)
  if (phone.length < 10) {
    return res.status(400).json({ message: '올바른 휴대폰 번호를 입력해 주세요.' })
  }
  try {
    const users = await prisma.user.findMany({ select: { phone: true } })
    if (!users.some((u) => onlyDigits(u.phone) === phone)) {
      return res.status(404).json({ message: '가입되지 않은 휴대폰 번호입니다.' })
    }
    const code = String(Math.floor(100000 + Math.random() * 900000))
    phoneCodes.set('reset:' + phone, { code, expires: Date.now() + CODE_TTL })
    await sendMessage({
      to: phone,
      text: `[이삿날] 비밀번호 재설정 인증번호 ${code}\n3분 안에 입력해 주세요.`,
    })
    res.json(isSmsLive() ? { ok: true } : { ok: true, devCode: code })
  } catch (err) {
    console.error('재설정 전화 인증 발송 실패:', err)
    res.status(500).json({ message: '서버 오류로 발송에 실패했습니다.' })
  }
})

// 전화 인증번호 확인
router.post('/reset/verify-phone-code', (req, res) => {
  const phone = onlyDigits(req.body?.phone)
  const code = String(req.body?.code ?? '').trim()
  const rec = phoneCodes.get('reset:' + phone)
  if (!rec || rec.expires < Date.now()) {
    return res.status(400).json({ message: '인증번호가 만료되었습니다. 다시 받아 주세요.' })
  }
  if (rec.code !== code) {
    return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' })
  }
  phoneCodes.delete('reset:' + phone)
  verifiedResetPhones.set(phone, Date.now() + VERIFIED_TTL)
  res.json({ ok: true })
})

// 이메일 인증번호 발송 (가입된 이메일만)
router.post('/reset/send-email-code', async (req, res) => {
  const email = String(req.body?.email ?? '').trim()
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: '올바른 이메일을 입력해 주세요.' })
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: '가입되지 않은 이메일입니다.' })
    }
    const code = String(Math.floor(100000 + Math.random() * 900000))
    emailCodes.set('reset:' + email, { code, expires: Date.now() + CODE_TTL })
    await sendMail(
      email,
      '[이삿날] 비밀번호 재설정 인증번호',
      `비밀번호 재설정 인증번호는 ${code} 입니다.\n3분 안에 입력해 주세요.`,
    )
    res.json(isMailLive() ? { ok: true } : { ok: true, devCode: code })
  } catch (err) {
    console.error('재설정 이메일 인증 발송 실패:', err)
    res.status(500).json({ message: '서버 오류로 발송에 실패했습니다.' })
  }
})

// 이메일 인증번호 확인
router.post('/reset/verify-email-code', (req, res) => {
  const email = String(req.body?.email ?? '').trim()
  const code = String(req.body?.code ?? '').trim()
  const rec = emailCodes.get('reset:' + email)
  if (!rec || rec.expires < Date.now()) {
    return res.status(400).json({ message: '인증번호가 만료되었습니다. 다시 받아 주세요.' })
  }
  if (rec.code !== code) {
    return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' })
  }
  emailCodes.delete('reset:' + email)
  verifiedResetEmails.set(email, Date.now() + VERIFIED_TTL)
  res.json({ ok: true })
})

// 인증 완료 후 새 비밀번호로 변경 (method: phone | email)
router.post('/reset/password', async (req, res) => {
  const { method, phone, email, newPassword } = req.body ?? {}
  const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  if (!pwRule.test(String(newPassword ?? ''))) {
    return res
      .status(400)
      .json({ message: '비밀번호는 영문·숫자·특수문자를 포함해 8자 이상이어야 합니다.' })
  }
  try {
    let user = null
    if (method === 'phone') {
      const p = onlyDigits(phone)
      const v = verifiedResetPhones.get(p)
      if (!v || v < Date.now()) {
        return res.status(400).json({ message: '휴대폰 인증을 완료해 주세요.' })
      }
      const users = await prisma.user.findMany()
      user = users.find((u) => onlyDigits(u.phone) === p) ?? null
    } else if (method === 'email') {
      const e = String(email ?? '').trim()
      const v = verifiedResetEmails.get(e)
      if (!v || v < Date.now()) {
        return res.status(400).json({ message: '이메일 인증을 완료해 주세요.' })
      }
      user = await prisma.user.findUnique({ where: { email: e } })
    } else {
      return res.status(400).json({ message: '잘못된 요청입니다.' })
    }
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(newPassword) },
    })
    if (method === 'phone') verifiedResetPhones.delete(onlyDigits(phone))
    else verifiedResetEmails.delete(String(email ?? '').trim())
    res.json({ ok: true })
  } catch (err) {
    console.error('비밀번호 재설정 실패:', err)
    res.status(500).json({ message: '서버 오류로 재설정에 실패했습니다.' })
  }
})

// 내 정보 (토큰으로 로그인 상태 복원)
router.get('/me', authMiddleware, async (req, res) => {
  const userId = (req as typeof req & { userId?: string }).userId
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
  }
  res.json({ user: publicUser(user) })
})

export default router
