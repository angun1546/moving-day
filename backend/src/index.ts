import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import quotesRouter from './routes/quotes.ts'
import authRouter from './routes/auth.ts'
import bidsRouter from './routes/bids.ts'

// 배포 환경에서는 JWT_SECRET이 반드시 필요 — 누락 시 시작 거부
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

const app = express()
const port = Number(process.env.PORT ?? 4000)

// CORS — FRONTEND_URL 환경변수 화이트리스트 (콤마로 다중 도메인 허용)
//  예) FRONTEND_URL="https://moving-day.vercel.app,http://localhost:5173"
const allowed = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
app.use(
  cors({
    origin: (origin, cb) => {
      // 서버-서버 호출(origin 없음)이나 화이트리스트는 허용
      if (!origin || allowed.includes(origin)) return cb(null, true)
      cb(new Error(`CORS 차단: ${origin}`))
    },
  }),
)
app.use(express.json())

// 업로드된 사진 정적 제공 (Cloudinary 전환 후 사실상 미사용, 로컬 호환만 유지)
app.use('/uploads', express.static('uploads'))

// 상태 확인용
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// 인증 API
app.use('/api/auth', authRouter)

// 견적 신청 API
app.use('/api/quotes', quotesRouter)

// 입찰 API
app.use('/api/bids', bidsRouter)

// 에러 처리 (사진 업로드 용량/개수 초과 등)
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('요청 처리 오류:', err)
  res.status(400).json({ message: err?.message ?? '요청 처리 중 오류가 발생했습니다.' })
}
app.use(errorHandler)

app.listen(port, () => {
  console.log(`이삿날 API 서버 실행 중: http://localhost:${port}`)
})
