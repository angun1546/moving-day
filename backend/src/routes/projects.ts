import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../db.ts'
import { uploadBuffer } from '../cloudinary.ts'
import { requireAdmin } from '../auth.ts'

// 무빙 프로젝트 — 갤러리·포트폴리오 글(kind로 구분). 대표 사진 1장(Cloudinary)
const router = Router()

// 사진 1장만, 이미지 타입만
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'))
  },
})

// GET /api/projects?kind=gallery|portfolio — 목록(최신순). kind 없으면 전체
router.get('/', async (req, res) => {
  const kind = typeof req.query.kind === 'string' ? req.query.kind : undefined
  try {
    const posts = await prisma.projectPost.findMany({
      where: kind ? { kind } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    res.json(posts)
  } catch (err) {
    console.error('프로젝트 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// POST /api/projects — 글 작성(사진 선택)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  const { kind, title, excerpt } = req.body ?? {}
  if (!kind || !title || !excerpt) {
    return res.status(400).json({ message: '종류·제목·내용을 입력해 주세요.' })
  }
  try {
    let image: string | null = null
    if (req.file) {
      image = await uploadBuffer(req.file.buffer, 'movingday/projects', 'image')
    }
    const post = await prisma.projectPost.create({
      data: { kind, title, excerpt, image },
    })
    res.status(201).json(post)
  } catch (err) {
    console.error('프로젝트 저장 실패:', err)
    res.status(500).json({ message: '서버 오류로 등록에 실패했습니다.' })
  }
})

// PATCH /api/projects/:id — 수정(새 사진 올리면 교체, 아니면 기존 유지)
router.patch('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { kind, title, excerpt } = req.body ?? {}
  try {
    let image: string | undefined // undefined면 기존 값 유지
    if (req.file) {
      image = await uploadBuffer(req.file.buffer, 'movingday/projects', 'image')
    }
    const post = await prisma.projectPost.update({
      where: { id: req.params.id },
      data: { kind, title, excerpt, ...(image !== undefined ? { image } : {}) },
    })
    res.json(post)
  } catch (err) {
    console.error('프로젝트 수정 실패:', err)
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' })
  }
})

// DELETE /api/projects/:id — 삭제
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.projectPost.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    console.error('프로젝트 삭제 실패:', err)
    res.status(500).json({ message: '서버 오류로 삭제에 실패했습니다.' })
  }
})

export default router
