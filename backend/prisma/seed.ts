import { prisma } from '../src/db.ts'

// 데모용 더미 리뷰 — 일부에 이용 업체명을 넣어 입찰 비교 평점이 보이게 함
const SEED = [
  { name: '김민지', rating: 5, moveType: '원룸이사', company: '한솔이사', text: '견적 비교가 정말 편했어요. 가격도 투명하고 기사님도 친절하셨습니다.', createdAt: new Date('2026-05-20') },
  { name: '이도현', rating: 5, moveType: '프리미엄이사', company: '으뜸이사', text: '고가 가구를 흠집 하나 없이 옮겨 주셨어요. 다음에도 무조건 여기서 신청합니다.', createdAt: new Date('2026-05-18') },
  { name: '박지은', rating: 4, moveType: '사무실이사', company: '스마트무빙', text: '주말 사이에 사무실 이전을 끝냈어요. 업무 공백이 거의 없었습니다.', createdAt: new Date('2026-05-15') },
  { name: '최우진', rating: 5, moveType: '포장이사', company: '한솔이사', text: '짐 정리까지 깔끔하게 마무리해 주셔서 그날 바로 살 수 있었어요.', createdAt: new Date('2026-05-10') },
  { name: '정세아', rating: 5, moveType: '원룸이사', company: '으뜸이사', text: '비대면 사진 견적인데도 정확했어요. 추가금 없이 약속한 금액 그대로.', createdAt: new Date('2026-05-05') },
  { name: '한지민', rating: 4, moveType: '반포장이사', company: null, text: '필요한 짐만 포장해 주셔서 비용을 많이 아꼈어요. 추천합니다.', createdAt: new Date('2026-04-28') },
]

const count = await prisma.review.count()
if (count > 0) {
  console.log(`이미 리뷰 ${count}건 존재 — 시드 생략`)
  process.exit(0)
}
for (const r of SEED) {
  await prisma.review.create({ data: r })
}
console.log(`리뷰 ${SEED.length}건 시드 완료`)
process.exit(0)
