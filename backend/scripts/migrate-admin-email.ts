import { prisma } from '../src/db.ts'

// ──────────────────────────────────────────────
// 관리자 이메일을 .env의 ADMIN_EMAIL 하나로 수렴시킨다.
// ADMIN_EMAIL 계정만 admin으로 두고, 나머지 admin은 customer로 강등(비번·데이터 유지).
// 어느 상태에서 실행해도 결과가 같다(재실행 안전).
// DATABASE_URL 기준(로컬 dev.db / 서버 prod.db) · 사용법: npm run migrate:admin-email
// ──────────────────────────────────────────────

const target = process.env.ADMIN_EMAIL ?? ''

if (!target) {
  console.error('❌ ADMIN_EMAIL 환경변수가 없습니다(.env에 새 관리자 이메일 설정).')
  process.exit(1)
}

console.log(`대상 DB    : ${process.env.DATABASE_URL ?? 'file:./prisma/dev.db'}`)
console.log(`목표 admin : ${target}`)

const targetUser = await prisma.user.findUnique({ where: { email: target } })

if (targetUser) {
  // target 계정이 이미 있으면 admin 보장
  if (targetUser.role !== 'admin') {
    await prisma.user.update({ where: { id: targetUser.id }, data: { role: 'admin' } })
    console.log('✅ target 계정을 role=admin으로 승격')
  } else {
    console.log('ℹ️ target 계정이 이미 admin')
  }
} else {
  // target 계정이 없으면 현재 admin 계정의 이메일을 target으로 변경(비번 유지)
  const admins = await prisma.user.findMany({ where: { role: 'admin' } })
  if (admins.length === 0) {
    console.error('❌ 이 DB에 admin 계정이 없어 옮길 대상이 없습니다.')
    console.error('   → target 이메일로 직접 가입하면 관리자가 됩니다(env 적용 후).')
    process.exit(1)
  }
  // 첫 admin을 target으로 이전, 나머지는 강등
  const [primary, ...rest] = admins
  await prisma.user.update({ where: { id: primary.id }, data: { email: target } })
  console.log(`✅ ${primary.email} → ${target} 이전(role=admin, 비번 유지)`)
  for (const r of rest) {
    await prisma.user.update({ where: { id: r.id }, data: { role: 'customer' } })
    console.log(`✅ 추가 admin ${r.email} 강등(role=customer)`)
  }
}

// target 외에 admin이 남아있으면 모두 강등(보안 — admin 단일화)
const others = await prisma.user.findMany({ where: { role: 'admin', NOT: { email: target } } })
for (const o of others) {
  await prisma.user.update({ where: { id: o.id }, data: { role: 'customer' } })
  console.log(`✅ 다른 admin ${o.email} 강등(role=customer)`)
}

console.log('✔ 완료 — admin은 ADMIN_EMAIL 하나로 수렴')
