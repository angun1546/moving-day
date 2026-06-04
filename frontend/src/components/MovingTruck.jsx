// 로고 왼쪽 이사트럭 — 울퉁불퉁한 노면 위를 귀엽게 덜컹거리며 달리는 인터랙션 아이콘
// 노면(animate-road)은 좌측으로 굴러가고, 트럭(animate-truck)만 그 위에서 불규칙하게 튐
function MovingTruck() {
  return (
    <span
      aria-hidden="true"
      className="group inline-flex shrink-0 items-center transition-transform duration-300 hover:translate-x-1"
    >
      <svg viewBox="0 0 48 38" className="h-9 w-9 sm:h-10 sm:w-10" fill="none">
        {/* 노면 — 0~96 폭의 험프를 좌측으로 스크롤(주기 6) */}
        <g className="animate-road">
          <path
            d="M0 34 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 q3 -3 6 0 L96 38 L0 38 Z"
            className="fill-gray-300"
          />
          {/* 노면 위 작은 돌·자국 */}
          <circle cx="9" cy="36" r="0.7" className="fill-gray-400" />
          <circle cx="21" cy="35.5" r="0.7" className="fill-gray-400" />
          <circle cx="34" cy="36" r="0.7" className="fill-gray-400" />
          <circle cx="45" cy="35.5" r="0.7" className="fill-gray-400" />
        </g>

        {/* 트럭 — 바닥 기준으로 불규칙하게 덜컹 */}
        <g className="origin-bottom animate-truck">
          {/* 짐칸 */}
          <rect x="2" y="6" width="25" height="17" rx="2.5" className="fill-brand" />
          {/* 짐칸 띠 */}
          <rect x="2" y="12" width="25" height="2.5" className="fill-white/40" />
          {/* 운전석 */}
          <path d="M27 10h7l8 7v6H27z" className="fill-brand-dark" />
          {/* 창문 */}
          <rect x="30" y="12.5" width="7" height="5" rx="1.2" className="fill-white" />
          {/* 바퀴 */}
          <circle cx="12" cy="25" r="4.5" className="fill-gray-800" />
          <circle cx="12" cy="25" r="1.8" className="fill-gray-300" />
          <circle cx="35" cy="25" r="4.5" className="fill-gray-800" />
          <circle cx="35" cy="25" r="1.8" className="fill-gray-300" />
        </g>
      </svg>
    </span>
  )
}

export default MovingTruck
