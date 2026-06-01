import { prisma } from './db.ts'

// 알림 생성 헬퍼
//  - toEmail이 없으면(비회원 견적 등) 조용히 생략
//  - 알림 저장 실패가 본 거래(입찰·낙찰)를 막지 않도록 오류는 삼킨다
export async function notify(
  toEmail: string | null | undefined,
  type: string, // bid | award | reject | stage
  message: string,
  link?: string,
) {
  if (!toEmail) return
  try {
    await prisma.notification.create({
      data: { toEmail, type, message, link: link || null },
    })
  } catch (err) {
    console.error('알림 생성 실패:', err)
  }
}
