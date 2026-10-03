interface HeaderProps {
  search: string
  setSearch: (value: string) => void
  showSearch: boolean
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({
  search,
  setSearch,
  showSearch,
  setShowSearch,
}: HeaderProps) {
  // Khi có từ khóa tìm kiếm thì bắt buộc phải mở ô tìm kiếm
  const isSearchActive = search.trim().length > 0
  const isInputVisible = showSearch || isSearchActive

  const handleToggleSearch = () => {
    // Nếu đang có từ khóa tìm kiếm thì khóa nút kính lúp (không cho đóng)
    if (isSearchActive) return
    setShowSearch((prev) => !prev)
  }

  const handleCloseAndClear = () => {
    setSearch('')
    setShowSearch(false)
  }

  return (
    <header
      className="sticky top-0 z-40 px-4 pt-3 pb-3 backdrop-blur-md shadow-sm transition-all"
      style={{
        background: 'rgba(255, 248, 252, 0.92)',
        borderBottom: isInputVisible ? '1px solid rgba(230, 200, 183, 0.4)' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-lg font-bold tracking-tight select-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            backgroundImage:
              'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hoa Hay Ho
        </span>

        <button
          onClick={handleToggleSearch}
          disabled={isSearchActive}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isSearchActive ? 'cursor-default opacity-90' : 'cursor-pointer active:scale-95'
          }`}
          style={{
            background: isInputVisible ? 'rgb(156, 112, 91)' : '#f3e8ff',
            color: isInputVisible ? '#fff' : 'rgb(156, 112, 91)',
          }}
          aria-label="Tìm kiếm"
          title={isSearchActive ? 'Đang tìm kiếm' : 'Bật/tắt tìm kiếm'}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4.5 h-4.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* Ô tìm kiếm luôn dính theo Header khi mở */}
      {isInputVisible && (
        <div className="mt-2.5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, danh mục..."
            autoFocus
            className="block w-full rounded-2xl px-4 py-2.5 text-sm outline-none border-2 transition-all pr-10 shadow-sm"
            style={{
              borderColor: 'rgb(156, 112, 91)',
              background: '#fff',
              color: '#1f2937',
            }}
          />
          {/* Nút X: bấm vào sẽ xóa text và đóng luôn ô tìm kiếm */}
          <button
            onClick={handleCloseAndClear}
            className="absolute right-2.5 inset-y-0 flex items-center justify-center p-1 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Đóng và xóa tìm kiếm"
            title="Đóng tìm kiếm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="w-4.5 h-4.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </header>
  )
}