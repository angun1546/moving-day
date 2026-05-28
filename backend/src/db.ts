import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from './generated/prisma/client.ts'

// 환경에 따라 어댑터 분기
//  - 로컬: DATABASE_URL 미지정 또는 file:... → better-sqlite3 (기존 동작)
//  - 배포: DATABASE_URL=libsql://... + DATABASE_AUTH_TOKEN → Turso(libSQL)
const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

const isRemote =
  url.startsWith('libsql://') ||
  url.startsWith('https://') ||
  url.startsWith('wss://')

const adapter = isRemote
  ? new PrismaLibSQL({ url, authToken })
  : new PrismaBetterSqlite3({ url })

export const prisma = new PrismaClient({ adapter })
