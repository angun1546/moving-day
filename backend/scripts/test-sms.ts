import { sendMessage } from '../src/messaging.ts'

// ──────────────────────────────────────────────
// 솔라피 발송 점검 스크립트 — '본인 번호'로만 보낸다
// 사용법:
//   node --env-file-if-exists=.env scripts/test-sms.ts 01012345678
//   (또는) npm run test:sms -- 01012345678
// 안전장치: 번호 인자가 없으면 절대 발송하지 않고 종료한다.
// ──────────────────────────────────────────────

const to = process.argv[2]

if (!to) {
  console.error('❌ 받는 번호(본인)를 인자로 넣어주세요. 임의 발송 방지를 위해 기본값이 없습니다.')
  console.error('   예) node --env-file-if-exists=.env scripts/test-sms.ts 01042060415')
  process.exit(1)
}

const digits = to.replace(/\D/g, '')
if (digits.length < 10) {
  console.error(`❌ 번호 형식이 이상해요: "${to}" (휴대폰 번호를 정확히 입력)`)
  process.exit(1)
}

const live = Boolean(
  process.env.SOLAPI_API_KEY &&
    process.env.SOLAPI_API_SECRET &&
    process.env.SOLAPI_SENDER,
)

console.log('─'.repeat(40))
console.log(`발송 모드 : ${live ? '🔴 실제 발송(LIVE) — 진짜 문자가 갑니다' : '🟡 mock(콘솔 로그만)'}`)
console.log(`받는 번호 : ${digits}  (이 번호 한 곳만 발송)`)
console.log('─'.repeat(40))

await sendMessage({
  to: digits,
  text: '[이삿날] 발송 테스트입니다. 이 문자가 도착하면 SMS 연동 정상 ✅',
})

console.log('완료 — 위 [메시지 발송] 로그와 휴대폰 도착 여부를 확인하세요.')
console.log('(LIVE인데 안 오면: 발신번호 등록 여부 / 잔액 / 솔라피 콘솔 발송내역 확인)')
