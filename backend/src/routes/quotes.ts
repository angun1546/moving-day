import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { prisma } from '../db.ts'

const router = Router()

// 업로드 폴더 준비
const UPLOAD_DIR = 'uploads'
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// 파일 저장 설정 (충돌 방지용 고유 파일명)
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${ext}`)
  },
})

// 이미지 파일만, 장당 최대 10MB, 최대 5장
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'))
  },
})

// 허용 값
const MOVE_TYPES = ['포장이사', '반포장이사', '일반이사', '사무실이사']
const METHODS = ['방문견적', '사진견적', '전화상담']

// 견적 신청 등록 (사진 첨부 가능)
router.post('/', upload.array('photos', 5), async (req, res) => {
  const {
    name,
    phone,
    moveType,
    fromRegion,
    toRegion,
    moveDate,
    homeSize,
    memo,
    method,
    visitDate,
    callTime,
  } = req.body ?? {}

  // 필수값 검증
  if (!name || !phone || !moveType || !fromRegion || !toRegion || !method) {
    return res.status(400).json({ message: '필수 항목을 모두 입력해 주세요.' })
  }
  if (!MOVE_TYPES.includes(moveType)) {
    return res.status(400).json({ message: '이사 종류가 올바르지 않습니다.' })
  }
  if (!METHODS.includes(method)) {
    return res.status(400).json({ message: '견적 방식이 올바르지 않습니다.' })
  }

  // 업로드된 사진 경로
  const files = (req.files as Express.Multer.File[]) ?? []
  // 사진 견적은 사진 1장 이상 필수
  if (method === '사진견적' && files.length === 0) {
    return res.status(400).json({ message: '사진 견적은 사진을 1장 이상 첨부해 주세요.' })
  }
  const photos = files.length
    ? JSON.stringify(files.map((f) => `/uploads/${f.filename}`))
    : null

  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        name,
        phone,
        moveType,
        fromRegion,
        toRegion,
        moveDate,
        homeSize,
        memo,
        photos,
        method,
        visitDate,
        callTime,
      },
    })
    res.status(201).json(quote)
  } catch (err) {
    console.error('견적 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 신청에 실패했습니다.' })
  }
})

// 견적 신청 목록 (관리용, 최신순)
router.get('/', async (_req, res) => {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(quotes)
  } catch (err) {
    console.error('견적 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

export default router
