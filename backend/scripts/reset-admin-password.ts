import { prisma } from '../src/db.ts'
import { hashPassword } from '../src/auth.ts'

// ──────────────────────────────────────────────
// 관리자 비밀번호 재설정 — admin@movingday.com 계정의 비번을 바꾼다
// DATABASE_URL 기준으로 동작 → 로컬은 dev.db, 서버는 prod.db
// 사용법:
//   node --env-file-if-exists=.env scripts/reset-admin-password.ts '새비밀번호!123'
//   (또는) npm run reset:admin -- '새비밀번호!123'
// 안전장치: 비번 인자가 없으면 아무것도 바꾸지 않고 종료한다.
// ──────────────────────────────────────────────

const ADMIN_EMAIL = 'admin@movingday.com'
const newPw = process.argv[2]

if (!newPw) {
  console.error('❌ 새 비밀번호를 인자로 넣어주세요.')
  console.error("   예) npm run reset:admin -- 'Movingday!2026#'")
  process.exit(1)
}

// 회원가입과 동일한 규칙 — 영문·숫자·특수문자 8자 이상
const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
if (!pwRule.test(newPw)) {
  console.error('❌ 비번 규칙 위반: 영문·숫자·특수문자를 포함해 8자 이상이어야 합니다.')
  process.exit(1)
}

const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
console.log('─'.repeat(48))
console.log(`대상 DB   : ${dbUrl}`)
console.log(`대상 계정 : ${ADMIN_EMAIL}`)
console.log('─'.repeat(48))

const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })

if (!user) {
  console.error(`❌ 이 DB에 ${ADMIN_EMAIL} 계정이 없습니다.`)
  console.error('   → 이 계정은 다른 DB(로컬 vs 운영)에 있거나, 아직 가입 전입니다.')
  process.exit(1)
}

await prisma.user.update({
  where: { email: ADMIN_EMAIL },
  data: { password: await hashPassword(newPw), role: 'admin' },
})

console.log(`✅ 비밀번호 재설정 완료 (role: admin 보장)`)
console.log('   이제 이 비번으로 로그인 후 /admin 접속 가능합니다.')
