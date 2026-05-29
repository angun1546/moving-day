import { useEffect, useRef, useState } from 'react'

// 스크롤에 닫히지 않는 커스텀 날짜 선택 (네이티브 input[type=date] 대체)
// 폼 전송은 hidden input(name)으로, 외부 클릭 시에만 닫힘
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const pad = (n) => String(n).padStart(2, '0')
const fmt = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

const triggerClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

function DatePicker({
  name,
  defaultValue = '',
  placeholder = '날짜를 선택하세요',
  minYear,
  maxYear,
}) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const base = value ? new Date(value) : new Date()
  const [view, setView] = useState({
    y: base.getFullYear(),
    m: base.getMonth(),
  })

  // 외부 클릭 시에만 닫기 (스크롤·휠에는 영향 없음)
  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const nowY = new Date().getFullYear()
  const fromY = minYear ?? nowY - 100
  const toY = maxYear ?? nowY + 5
  const years = []
  for (let y = toY; y >= fromY; y -= 1) years.push(y)

  const firstDay = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)

  function move(delta) {
    let m = view.m + delta
    let y = view.y
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    setView({ y, m })
  }

  function pick(d) {
    setValue(fmt(view.y, view.m, d))
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative mt-1">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
          {/* 헤더: 이전/다음 + 년·월 빠른 선택 */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="이전 달"
              className="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-brand-bg hover:text-brand"
            >
              ◀
            </button>
            <div className="flex gap-1">
              <select
                value={view.y}
                onChange={(e) =>
                  setView((s) => ({ ...s, y: Number(e.target.value) }))
                }
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-brand"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <select
                value={view.m}
                onChange={(e) =>
                  setView((s) => ({ ...s, m: Number(e.target.value) }))
                }
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-brand"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}월
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="다음 달"
              className="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-brand-bg hover:text-brand"
            >
              ▶
            </button>
          </div>

          {/* 요일 */}
          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(d)}
                  className={`rounded-lg py-1.5 text-sm transition ${
                    value === fmt(view.y, view.m, d)
                      ? 'bg-brand font-semibold text-white'
                      : 'text-gray-700 hover:bg-brand-bg'
                  }`}
                >
                  {d}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
