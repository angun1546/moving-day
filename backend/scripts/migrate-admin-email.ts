import { prisma } from '../src/db.ts'

// ──────────────────────────────────────────────
// 관리자 이메일 이전 — 기존 admin@movingday.com 계정을 .env의 ADMIN_EMAIL로 변경
// role·비번 유지. DATABASE_URL 기준(로컬 dev.db / 서버 prod.db)
// 사용법: npm run migrate:admin-email
// ──────────────────────────────────────────────

const OLD = 'admin@movingday.com'
const target = process.env.ADMIN_EMAIL ?? ''

if (!target) {
  console.error('❌ ADMIN_EMAIL 환경변수가 없습니다(.env에 새 관리자 이메일 설정).')
  process.exit(1)
}

console.log(`대상 DB : ${process.env.DATABASE_URL ?? 'file:./prisma/dev.db'}`)
console.log(`이전    : ${OLD} → ${target}`)

const targetUser = await prisma.user.findUnique({ where: { email: target } })

if (targetUser) {
  // 이미 target 이메일 계정이 있으면 그 계정을 관리자로 보장
  if (targetUser.role !== 'admin') {
    await prisma.user.update({ where: { email: target }, data: { role: 'admin' } })
    console.log('✅ 기존 target 계정을 role=admin으로 승격')
  } else {
    console.log('ℹ️ target 계정이 이미 admin — 변경 없음')
  }
  // 옛 공개 이메일 계정이 admin으로 남아있으면 권한 해제(보안)
  if (OLD !== target) {
    const old = await prisma.user.findUnique({ where: { email: OLD } })
    if (old && old.role === 'admin') {
      await prisma.user.update({ where: { email: OLD }, data: { role: 'customer' } })
      console.log(`✅ 옛 ${OLD} 계정 admin 권한 해제(role=customer)`)
    }
  }
} else {
  const old = await prisma.user.findUnique({ where: { email: OLD } })
  if (!old) {
    console.error(`❌ 이 DB에 ${OLD} 계정이 없어 이전할 대상이 없습니다.`)
    console.error('   → target 이메일로 직접 가입하면 관리자가 됩니다(env 적용 후).')
    process.exit(1)
  }
  await prisma.user.update({
    where: { email: OLD },
    data: { email: target, role: 'admin' },
  })
  console.log('✅ 관리자 이메일 이전 완료 (role·비번 그대로)')
}
