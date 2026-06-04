/// <reference types="vite/client" />

// 커스텀 환경변수 타입 (import.meta.env.VITE_API_BASE)
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
