import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'
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
