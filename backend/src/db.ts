import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './generated/prisma/client.ts'

// SQLite 파일 단일 어댑터 (better-sqlite3)
//  - 로컬: DATABASE_URL 미지정 또는 file:./prisma/dev.db
//  - 배포: DATABASE_URL=file:/var/www/moving-day/backend/prisma/prod.db
const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'

const adapter = new PrismaBetterSqlite3({ url })

export const prisma = new PrismaClient({ adapter })
