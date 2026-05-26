import { Router } from 'express'
import { prisma } from '../db.ts'
import {
  hashPassword,
  comparePassword,
  signToken,
  authMiddleware,
} from '../auth.ts'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GENDERS = ['남', '여']

// 외부에 노출할 사용자 정보 (비밀번호 제외)
function publicUser(u: {
  id: string
  email: string
  name: string
  birthDate: string | null
  gender: string | null
  phone: string | null
  verified: boolean
}) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    birthDate: u.birthDate,
    gender: u.gender,
    phone: u.phone,
    verified: u.verified,
  }
}

// 회원가입
router.post('/signup', async (req, res) => {
  const { name, email, password, birthDate, gender, phone } = req.body ?? {}

  if (!name || !email || !password || !birthDate || !gender || !phone) {
    return res.status(400).json({ message: '모든 항목을 입력해 주세요.' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: '올바른 이메일 형식이 아닙니다.' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: '비밀번호는 6자 이상이어야 합니다.' })
  }
  if (!GENDERS.includes(gender)) {
    return res.status(400).json({ message: '성별을 선택해 주세요.' })
  }

  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' })
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        birthDate,
        gender,
        phone,
      },
    })
    res.status(201).json({ token: signToken(user.id), user: publicUser(user) })
  } catch (err) {
    console.error('회원가입 실패:', err)
    res.status(500).json({ message: '서버 오류로 가입에 실패했습니다.' })
  }
})

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }
    res.json({ token: signToken(user.id), user: publicUser(user) })
  } catch (err) {
    console.error('로그인 실패:', err)
    res.status(500).json({ message: '서버 오류로 로그인에 실패했습니다.' })
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
