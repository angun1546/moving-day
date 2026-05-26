import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 설정 파일
// - datasource.url: 마이그레이션/CLI가 사용하는 DB 연결 정보
// - 런타임 클라이언트는 app/db.server.ts에서 드라이버 어댑터로 연결
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
