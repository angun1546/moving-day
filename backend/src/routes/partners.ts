import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../db.ts'
import { uploadBuffer } from '../cloudinary.ts'

const router = Router()

// 사진(이미지)·자격증(이미지+PDF) 메모리 업로드
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 14 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'certs') {
      // 자격증은 이미지 또는 PDF
      cb(null, file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')
    } else {
      // 프로필·업체 사진은 이미지만
      cb(null, file.mimetype.startsWith('image/'))
    }
  },
})

// 안전 JSON 파싱 (잘못된 입력은 기본값)
function parseJson(raw: unknown, fallback: unknown) {
  if (typeof raw !== 'string' || !raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

// 내 업체 프로필 조회 (없으면 null)
router.get('/:email', async (req, res) => {
  try {
    const profile = await prisma.partnerProfile.findUnique({
      where: { email: req.params.email },
    })
    res.json(profile)
  } catch (err) {
    console.error('프로필 조회 실패:', err)
    res.status(500).json({ message: '서버 오류로 조회에 실패했습니다.' })
  }
})

// 업체 프로필 저장(생성/수정) — multipart, 사진/자격증 Cloudinary 업로드
//  파일을 새로 올리면 교체, 안 올리면 existing* 로 기존 유지
router.put(
  '/',
  upload.fields([
    { name: 'profileImg', maxCount: 1 },
    { name: 'workPhotos', maxCount: 8 },
    { name: 'certs', maxCount: 5 },
  ]),
  async (req, res) => {
    const {
      email,
      company,
      bizNo,
      ceo,
      phone,
      trucks,
      intro,
      regions,
      existingProfileImg,
      existingWorkPhotos,
      existingCerts,
    } = req.body ?? {}

    if (!email || !company || !bizNo || !ceo || !phone) {
      return res.status(400).json({ message: '필수 항목을 모두 입력해 주세요.' })
    }

    const files = (req.files ?? {}) as Record<string, Express.Multer.File[]>

    try {
      // 프로필 사진(1장)
      let profileImg: string | null = existingProfileImg || null
      if (files.profileImg?.[0]) {
        profileImg = await uploadBuffer(
          files.profileImg[0].buffer,
          'movingday/partners',
          'image',
        )
      }

      // 업체·이사 사진 — 새로 올리면 전체 교체
      let workPhotos: string[] = parseJson(existingWorkPhotos, []) as string[]
      if (files.workPhotos?.length) {
        workPhotos = await Promise.all(
          files.workPhotos.map((f) =>
            uploadBuffer(f.buffer, 'movingday/partners', 'image'),
          ),
        )
      }

      // 자격증·서류(이미지+PDF) — 새로 올리면 전체 교체
      let certs = parseJson(existingCerts, []) as Array<{
        url: string
        name: string
        isImage: boolean
      }>
      if (files.certs?.length) {
        certs = await Promise.all(
          files.certs.map(async (f) => {
            const isImage = f.mimetype.startsWith('image/')
            const url = await uploadBuffer(
              f.buffer,
              'movingday/partners/certs',
              isImage ? 'image' : 'raw',
            )
            return { url, name: f.originalname, isImage }
          }),
        )
      }

      const data = {
        company,
        bizNo,
        ceo,
        phone,
        trucks: trucks || null,
        intro: intro || null,
        regions: regions || '[]',
        profileImg,
        workPhotos: JSON.stringify(workPhotos),
        certs: JSON.stringify(certs),
      }

      const saved = await prisma.partnerProfile.upsert({
        where: { email },
        create: { email, ...data },
        update: data,
      })
      res.json(saved)
    } catch (err) {
      console.error('프로필 저장 실패:', err)
      res.status(500).json({ message: '서버 오류로 저장에 실패했습니다.' })
    }
  },
)

export default router
