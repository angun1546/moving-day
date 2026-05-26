import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import quotesRouter from './routes/quotes.ts'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(cors())
app.use(express.json())

// 업로드된 사진 정적 제공
app.use('/uploads', express.static('uploads'))

// 상태 확인용
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// 견적 신청 API
app.use('/api/quotes', quotesRouter)

// 에러 처리 (사진 업로드 용량/개수 초과 등)
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('요청 처리 오류:', err)
  res.status(400).json({ message: err?.message ?? '요청 처리 중 오류가 발생했습니다.' })
}
app.use(errorHandler)

app.listen(port, () => {
  console.log(`이삿날 API 서버 실행 중: http://localhost:${port}`)
})
