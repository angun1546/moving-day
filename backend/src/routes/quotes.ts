import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '../db.ts'

const router = Router()

// Cloudinary 설정 — 환경변수만 참조 (코드/저장소에 키 절대 금지)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 메모리 저장 (디스크 X) — 받은 버퍼를 Cloudinary로 바로 스트리밍 업로드
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'))
  },
})

// 허용 값
const MOVE_TYPES = ['포장이사', '반포장이사', '일반이사', '사무실이사']
const METHODS = ['방문견적', '사진견적', '전화상담']

// 버퍼 1장을 Cloudinary에 올리고 secure_url 반환
function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'movingday/quotes', resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary 업로드 실패'))
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}

// 견적 신청 등록 (사진 첨부 가능 — Cloudinary에 업로드 후 URL을 DB에 저장)
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
    userEmail,
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

  const files = (req.files as Express.Multer.File[]) ?? []
  // 사진 견적은 사진 1장 이상 필수
  if (method === '사진견적' && files.length === 0) {
    return res.status(400).json({ message: '사진 견적은 사진을 1장 이상 첨부해 주세요.' })
  }

  // Cloudinary 업로드 (사진이 있을 때만)
  let photos: string | null = null
  try {
    if (files.length > 0) {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f.buffer)))
      photos = JSON.stringify(urls)
    }
  } catch (err) {
    console.error('Cloudinary 업로드 실패:', err)
    return res.status(500).json({ message: '사진 업로드 중 오류가 발생했습니다.' })
  }

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
        userEmail: userEmail || null,
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
      include: { bids: true },
    })
    res.json(quotes)
  } catch (err) {
    console.error('견적 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 내 견적 목록 (회원 — 입찰 포함, 최신순)
router.get('/mine/:email', async (req, res) => {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      where: { userEmail: req.params.email },
      orderBy: { createdAt: 'desc' },
      include: { bids: true },
    })
    res.json(quotes)
  } catch (err) {
    console.error('내 견적 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 낙찰 후 진행 단계 변경 (파트너/관리자)
router.patch('/:id/stage', async (req, res) => {
  const { stage } = req.body ?? {}
  try {
    const quote = await prisma.quoteRequest.update({
      where: { id: req.params.id },
      data: { stage },
    })
    res.json(quote)
  } catch (err) {
    console.error('단계 변경 실패:', err)
    res.status(500).json({ message: '서버 오류로 단계 변경에 실패했습니다.' })
  }
})

// 견적 수정 (제출된 값만 변경)
router.patch('/:id', async (req, res) => {
  const { moveType, fromRegion, toRegion, moveDate, homeSize, memo } =
    req.body ?? {}
  try {
    const quote = await prisma.quoteRequest.update({
      where: { id: req.params.id },
      data: { moveType, fromRegion, toRegion, moveDate, homeSize, memo },
    })
    res.json(quote)
  } catch (err) {
    console.error('견적 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// 견적 취소(삭제) — 연결된 입찰도 Cascade로 함께 삭제
router.delete('/:id', async (req, res) => {
  try {
    await prisma.quoteRequest.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('견적 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
