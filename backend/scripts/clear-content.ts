import { prisma } from '../src/db.ts'

// ──────────────────────────────────────────────
// 콘텐츠(활동 데이터) 전체 삭제 — 계정(User)·파트너 프로필은 보존
// 견적·입찰·진행로그·리뷰·Q&A·공지·스토리·프로젝트·브이로그·불편사항·팁·알림 삭제
// 사용법: npm run clear:content -- yes   (yes 없으면 미삭제 안전장치)
// ──────────────────────────────────────────────

if (process.argv[2] !== 'yes') {
  console.error("❌ 안전장치: 실제 삭제하려면 'yes'를 붙이세요.")
  console.error('   예) npm run clear:content -- yes')
  process.exit(1)
}

const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
console.log(`대상 DB : ${dbUrl}`)

// 자식(FK) → 부모 순서로 삭제
const steps: [string, () => Promise<{ count: number }>][] = [
  ['StageLog', () => prisma.stageLog.deleteMany()],
  ['Bid', () => prisma.bid.deleteMany()],
  ['QuoteRequest', () => prisma.quoteRequest.deleteMany()],
  ['Review', () => prisma.review.deleteMany()],
  ['Qna', () => prisma.qna.deleteMany()],
  ['Notice', () => prisma.notice.deleteMany()],
  ['PartnerStory', () => prisma.partnerStory.deleteMany()],
  ['ProjectPost', () => prisma.projectPost.deleteMany()],
  ['Vlog', () => prisma.vlog.deleteMany()],
  ['Complaint', () => prisma.complaint.deleteMany()],
  ['Tip', () => prisma.tip.deleteMany()],
  ['Notification', () => prisma.notification.deleteMany()],
]

for (const [name, run] of steps) {
  const { count } = await run()
  console.log(`  ${name.padEnd(14)} 삭제 ${count}건`)
}

const users = await prisma.user.count()
const profiles = await prisma.partnerProfile.count()
console.log('─'.repeat(40))
console.log(`✅ 콘텐츠 삭제 완료 — 보존: User ${users}명, PartnerProfile ${profiles}개`)
