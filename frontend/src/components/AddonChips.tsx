import type { QuoteAddons } from '../data/apiTypes'

// addons JSON 문자열 → 객체 (형식 오류 시 빈 객체)
export function parseAddons(raw?: string | null): QuoteAddons {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as QuoteAddons
  } catch {
    return {}
  }
}

// 부가 서비스 칩 — 견적 카드에서 청소·창고보관·문서 선택을 한눈에
function AddonChips({ addons }: { addons?: string | null }) {
  const { cleaning, storage, document } = parseAddons(addons)
  const items: string[] = []
  if (cleaning) items.push(`🧹 ${cleaning}`)
  storage?.forEach((s) => items.push(`📦 ${s}`))
  document?.forEach((d) => items.push(`🗂️ ${d}`))
  if (!items.length) return null

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((label) => (
        <span
          key={label}
          className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand"
        >
          {label}
        </span>
      ))}
    </div>
  )
}

export default AddonChips
