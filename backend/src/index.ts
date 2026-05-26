import cors from 'cors'
import express from 'express'
import quotesRouter from './routes/quotes.ts'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(cors())
app.use(express.json())

// 상태 확인용
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// 견적 신청 API
app.use('/api/quotes', quotesRouter)

app.listen(port, () => {
  console.log(`이삿날 API 서버 실행 중: http://localhost:${port}`)
})
