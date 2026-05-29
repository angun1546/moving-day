import { MOVE_STAGES } from '../data/stages'

// 낙찰 후 진행 현황 — 택배식 세로 타임라인
function StageProgress({ stage }) {
  const idx = MOVE_STAGES.indexOf(stage)
  return (
    <ol className="mt-3 space-y-2 rounded-2xl bg-brand-bg p-4">
      {MOVE_STAGES.map((s, i) => {
        const done = idx >= 0 && i <= idx
        const current = i === idx
        return (
          <li key={s} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? 'bg-brand text-white'
                  : 'bg-white text-gray-300 ring-1 ring-gray-200'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={`text-sm ${
                current
                  ? 'font-bold text-brand'
                  : done
                    ? 'font-medium text-gray-700'
                    : 'text-gray-400'
              }`}
            >
              {s}
              {current && ' (진행 중)'}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default StageProgress
