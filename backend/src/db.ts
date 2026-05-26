import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './generated/prisma/client.ts'

// SQLite 연결 문자열 (예: file:./prisma/dev.db)
const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'

// Prisma 7 드라이버 어댑터(better-sqlite3)로 연결
const adapter = new PrismaBetterSqlite3({ url })

export const prisma = new PrismaClient({ adapter })
