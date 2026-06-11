import { sendMessage } from '../src/messaging.ts'

// ──────────────────────────────────────────────
// 테스트용 알림톡 발송 점검 스크립트 — '본인 번호'로만, 템플릿 1종만 보낸다
// 사용법:
//   node --env-file-if-exists=.env scripts/test-alimtalk.ts 01012345678 quote
//   (또는) npm run test:alimtalk -- 01012345678 bid
// 템플릿 키(2번째 인자, 생략 시 quote):
//   quote | bid | award | reject | stage | reply_complaint | reply_qna
// 안전장치: 번호 인자가 없으면 절대 발송하지 않고 종료한다.
// 주의: 알림톡 변수는 솔라피에 등록한 템플릿과 글자까지 일치해야 발송된다.
// ──────────────────────────────────────────────

const to = process.argv[2]
const key = (process.argv[3] ?? 'quote').toLowerCase()

if (!to) {
  console.error('❌ 받는 번호(본인)를 인자로 넣어주세요. 임의 발송 방지를 위해 기본값이 없습니다.')
  console.error('   예) node --env-file-if-exists=.env scripts/test-alimtalk.ts 01012345678 quote')
  process.exit(1)
}

const digits = to.replace(/\D/g, '')
if (digits.length < 10) {
  console.error(`❌ 번호 형식이 이상해요: "${to}" (휴대폰 번호를 정확히 입력)`)
  process.exit(1)
}

// 템플릿 정의 — env 변수명 + 샘플 변수(routes 코드와 동일한 키) + 알림톡 실패 시 SMS 폴백 문구
const TEMPLATES: Record<
  string,
  { env: string; label: string; vars: Record<string, string>; sms: string }
> = {
  quote: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_QUOTE',
    label: '견적요청(→파트너)',
    vars: {
      '#{이사종류}': '가정이사',
      '#{출발지}': '서울 강남구',
      '#{도착지}': '경기 성남시',
      '#{이사예정일}': '2026-07-01',
      '#{이사규모}': '24평',
      '#{견적방식}': '방문견적',
    },
    sms: '[이삿날] 새 견적요청이 도착했어요. 파트너센터에서 확인해 주세요. (테스트)',
  },
  bid: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_BID',
    label: '입찰도착(→고객)',
    vars: {
      '#{업체명}': '믿음이사',
      '#{금액}': '450,000',
      '#{출발지}': '서울 강남구',
      '#{도착지}': '경기 성남시',
      '#{이사예정일}': '2026-07-01',
      '#{예상일정}': '오전 시작',
    },
    sms: '[이삿날] 새 입찰이 도착했어요. 마이페이지에서 비교해 보세요. (테스트)',
  },
  award: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_AWARD',
    label: '낙찰(→낙찰 파트너)',
    vars: {
      '#{금액}': '450,000',
      '#{고객명}': '홍길동',
      '#{연락처}': '010-1234-5678',
      '#{출발지}': '서울 강남구',
      '#{도착지}': '경기 성남시',
      '#{이사예정일}': '2026-07-01',
    },
    sms: '[이삿날] 축하합니다! 낙찰되었어요. 고객 연락처를 확인해 주세요. (테스트)',
  },
  reject: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_REJECT',
    label: '거절(→떨어진 파트너)',
    vars: {},
    sms: '[이삿날] 아쉽게도 이번 건은 다른 업체로 확정되었어요. (테스트)',
  },
  stage: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_STAGE',
    label: '진행단계(→고객)',
    vars: { '#{진행단계}': '포장 준비중' },
    sms: '[이삿날] 신청·계약하신 이사 건의 진행 단계가 변경되었어요. (테스트)',
  },
  reply_complaint: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_REPLY_COMPLAINT',
    label: '불편사항 답변(→작성자)',
    vars: {},
    sms: '[이삿날] 접수하신 불편사항에 답변이 등록되었어요. (테스트)',
  },
  reply_qna: {
    env: 'SOLAPI_ALIMTALK_TEMPLATE_REPLY_QNA',
    label: 'FAQ 답변(→질문자)',
    vars: {},
    sms: '[이삿날] 남기신 질문에 답변이 등록되었어요. (테스트)',
  },
}

const tpl = TEMPLATES[key]
if (!tpl) {
  console.error(`❌ 알 수 없는 템플릿 키: "${key}"`)
  console.error(`   사용 가능: ${Object.keys(TEMPLATES).join(' | ')}`)
  process.exit(1)
}

const templateId = process.env[tpl.env]
const pfId = process.env.SOLAPI_KAKAO_PF_ID
const live = Boolean(
  process.env.SOLAPI_API_KEY &&
    process.env.SOLAPI_API_SECRET &&
    process.env.SOLAPI_SENDER,
)

console.log('─'.repeat(48))
console.log(`발송 모드   : ${live ? '🔴 실제 발송(LIVE)' : '🟡 mock(콘솔 로그만)'}`)
console.log(`채널 PF ID  : ${pfId ? 'OK' : '❌ 없음(SOLAPI_KAKAO_PF_ID)'}`)
console.log(`템플릿      : ${key} — ${tpl.label}`)
console.log(`템플릿 ID   : ${templateId ? 'OK' : `❌ 없음(${tpl.env})`}`)
console.log(`받는 번호   : ${digits}  (이 번호 한 곳만 발송)`)
console.log('─'.repeat(48))

if (live && (!pfId || !templateId)) {
  console.error('❌ PF ID 또는 템플릿 ID가 없어 알림톡을 보낼 수 없어요. .env를 확인하세요.')
  process.exit(1)
}

await sendMessage({
  to: digits,
  text: tpl.sms, // 알림톡 실패 시 자동 대체될 SMS 폴백 문구
  kakao: templateId ? { templateId, variables: tpl.vars } : undefined,
})

console.log('완료 — 위 [메시지 발송] 로그와 카카오톡 도착 여부를 확인하세요.')
console.log('(LIVE인데 안 오면: 솔라피 콘솔 발송내역의 실패 사유 / 변수 불일치 / 채널 친구추가 여부 확인)')
