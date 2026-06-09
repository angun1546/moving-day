#!/usr/bin/env bash
# 이삿날 배포 스크립트 — 서버(가비아 g클라우드)에서 실행
# 코드 받기 → 백엔드(의존성·DB·재시작) → 프론트(빌드)
set -e

# 비대화형 SSH에서도 node/npm/pm2를 찾도록 PATH 보강
export PATH="$PATH:/usr/local/bin:/usr/bin"

cd /var/www/moving-day
echo "▶ 코드 받기"
git pull

echo "▶ 백엔드 갱신"
cd backend
npm install
npx prisma migrate deploy
pm2 restart movingday-api

echo "▶ 프론트 빌드"
cd ../frontend
npm install
npm run build

echo "✅ 배포 완료"
