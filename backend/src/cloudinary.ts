import { v2 as cloudinary } from 'cloudinary'

// Cloudinary 설정 — 환경변수만 참조 (코드/저장소에 키 절대 금지)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 버퍼 1개를 Cloudinary에 올리고 secure_url 반환
//  resourceType: 'image'(사진) | 'raw'(PDF 등) | 'auto'
export function uploadBuffer(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' | 'auto' = 'image',
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary 업로드 실패'))
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}
