import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from './db.ts'

// JWT_SECRET은 index.ts에서 시작 시점에 검증 — 여기서는 그대로 사용
const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'

// 인증된 사용자 정보를 req에 실어 핸들러에서 사용
export interface AuthedRequest extends Request {
  authUser?: { id: string; email: string; role: string }
}
const EXPIRES_IN = 60 * 60 * 24 * 7 // 7일(초)

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: EXPIRES_IN })
}

// Authorization: Bearer <token> 검증 미들웨어
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' })
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string }
    ;(req as Request & { userId?: string }).userId = payload.userId
    next()
  } catch {
    res.status(401).json({ message: '인증이 만료되었거나 올바르지 않습니다.' })
  }
}

// 토큰에서 userId 추출 (없거나 무효면 null)
function userIdFromReq(req: Request): string | null {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return null
  try {
    return (jwt.verify(token, SECRET) as { userId: string }).userId
  } catch {
    return null
  }
}

// 로그인 필수 — 사용자(id·email·role)를 req.authUser에 적재
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const userId = userIdFromReq(req)
  if (!userId) {
    return res.status(401).json({ message: '로그인이 필요합니다.' })
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  })
  if (!user) {
    return res.status(401).json({ message: '인증이 만료되었거나 올바르지 않습니다.' })
  }
  req.authUser = user
  next()
}

// 관리자 전용 — requireAuth + role 검사
export async function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  await requireAuth(req, res, () => {
    if (req.authUser?.role !== 'admin') {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' })
    }
    next()
  })
}
