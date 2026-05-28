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
        className="text-gray-400 transition hover:text-brand"
      >
        🔍
      </button>
    </form>
  )
}

export default SearchBox
