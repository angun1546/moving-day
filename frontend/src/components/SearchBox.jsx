// 검색창 (목업: 제출 동작은 추후 연결) — 유저/파트너 헤더 공용
function SearchBox({ placeholder = '검색', className = '' }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex items-center rounded-full border border-gray-300 bg-white px-3 ${className}`}
    >
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        aria-label="검색"
        className="text-brand transition hover:text-brand-dark"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  )
}

export default SearchBox
