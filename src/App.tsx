import { useState, useMemo } from 'react'

const AVATAR = `${import.meta.env.BASE_URL}CGai.jpeg`

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Ngoctrang.0512',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    bg: 'from-blue-600 to-blue-700',
    label: 'FB',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/hoaa.zzang?stkn=ZW5iNGx4ZmxsYXl2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    bg: 'from-pink-500 via-red-500 to-yellow-500',
    label: 'IG',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
    bg: 'from-red-600 to-red-700',
    label: 'YT',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    bg: 'from-gray-900 to-gray-800',
    label: 'TT',
  },
]

const CATEGORIES = ['Tất cả', 'Skincare', 'Thời trang', 'Đồ gia dụng', 'Phụ kiện']

const PRODUCTS = [
  {
    id: 1,
    name: 'Kem dưỡng ẩm Vitamin C',
    category: 'Skincare',
    price: '185.000đ',
    originalPrice: '250.000đ',
    discount: '-26%',
    sold: '1.2k đã bán',
    rating: 4.8,
    shopeeUrl: 'https://shopee.vn',
    img: 'https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=400&h=400&fit=crop&auto=format',
    hot: true,
  },
  {
    id: 2,
    name: 'Serum dưỡng da ban đêm',
    category: 'Skincare',
    price: '320.000đ',
    originalPrice: '420.000đ',
    discount: '-24%',
    sold: '856 đã bán',
    rating: 4.9,
    shopeeUrl: 'https://shopee.vn',
    img: 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886?w=400&h=400&fit=crop&auto=format',
    hot: false,
  },
  {
    id: 3,
    name: 'Son môi lì lâu trôi',
    category: 'Thời trang',
    price: '95.000đ',
    originalPrice: '150.000đ',
    discount: '-37%',
    sold: '3.4k đã bán',
    rating: 4.7,
    shopeeUrl: 'https://shopee.vn',
    img: 'https://images.unsplash.com/photo-1600428853876-fb5a850b444f?w=400&h=400&fit=crop&auto=format',
    hot: true,
  },
  {
    id: 4,
    name: 'Tẩy tế bào chết body',
    category: 'Skincare',
    price: '145.000đ',
    originalPrice: '190.000đ',
    discount: '-24%',
    sold: '620 đã bán',
    rating: 4.6,
    shopeeUrl: 'https://shopee.vn',
    img: 'https://images.unsplash.com/photo-1748543668751-902d6461890d?w=400&h=400&fit=crop&auto=format',
    hot: false,
  },
  {
    id: 5,
    name: 'Bình giữ nhiệt 500ml',
    category: 'Đồ gia dụng',
    price: '210.000đ',
    originalPrice: '280.000đ',
    discount: '-25%',
    sold: '2.1k đã bán',
    rating: 4.8,
    shopeeUrl: 'https://shopee.vn',
    img: 'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=400&h=400&fit=crop&auto=format',
    hot: false,
  },
  {
    id: 6,
    name: 'Túi đeo chéo da PU',
    category: 'Phụ kiện',
    price: '275.000đ',
    originalPrice: '380.000đ',
    discount: '-28%',
    sold: '947 đã bán',
    rating: 4.7,
    shopeeUrl: 'https://shopee.vn',
    img: 'https://images.unsplash.com/photo-1748543668646-e81cda0890f3?w=400&h=400&fit=crop&auto=format',
    hot: true,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 12 12" className="w-3 h-3" fill={s <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 7.82l-2.78 1.73.53-3.09L1.5 4.27l3.11-.45z"/>
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">{rating}</span>
    </div>
  )
}

export default function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [showSearch, setShowSearch] = useState(false)

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === 'Tất cả' || p.category === activeCategory
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  return (
    <div className="min-h-screen max-w-sm mx-auto relative overflow-x-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff8fc 0%, #fef0f7 30%, #f5f0ff 70%, #fdfaff 100%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 pt-3 pb-2 backdrop-blur-md" style={{ background: 'rgba(255,248,252,0.88)' }}>
        <div className="flex items-center justify-between">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", backgroundImage: 'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Hoa Hay Ho
          </span>
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: showSearch ? 'rgb(156, 112, 91)' : '#f3e8ff', color: showSearch ? '#fff' : 'rgb(156, 112, 91)' }}
            aria-label="Tìm kiếm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        {showSearch && (
          <div className="mt-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              autoFocus
              className="block w-full rounded-2xl px-4 py-2.5 text-sm outline-none border-2 transition-colors pr-10"
              style={{ borderColor: 'rgb(156, 112, 91)', background: '#fff', color: '#1f2937' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Profile section */}
      <section className="px-4 pt-4 pb-2">
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{ backgroundImage: 'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))' }}
        >
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.3)' }} />

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative shrink-0">
              <img
                src={AVATAR}
                alt="Linh Beauty avatar"
                className="w-20 h-20 rounded-2xl object-cover border-3 border-white"
                style={{ borderWidth: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: 'rgb(221, 207, 199)', border: '2px solid white' }}
              >
                ✓
              </div>
            </div>

            <div className="text-white flex-1 min-w-0">
              <h1 className="font-bold text-xl leading-tight" style={{ fontFamily: "'Platypi', serif" }}>
                Th Hoa Đây Rồi
              </h1>
              <p className="text-pink-200 text-xs mt-0.5">@thhoadayrui · Affiliate</p>
              <p className="text-white/80 text-xs mt-1.5 leading-relaxed">
                Chia sẻ sản phẩm yêu thích · Mã giảm giá mỗi ngày 🌸
              </p>
              <div className="flex gap-3 mt-2 text-center">
                <div>
                  <div className="text-white font-bold text-sm">260k</div>
                  <div className="text-pink-200 text-xs">Followers</div>
                </div>
                <div className="w-px bg-white/30" />
                <div>
                  <div className="text-white font-bold text-sm">4.9★</div>
                  <div className="text-pink-200 text-xs">Đánh giá</div>
                </div>
                <div className="w-px bg-white/30" />
                <div>
                  <div className="text-white font-bold text-sm">30+</div>
                  <div className="text-pink-200 text-xs">Sản phẩm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex flex-row items-center justify-center gap-2.5 mt-4 relative z-10">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-medium transition-transform active:scale-95 shadow-md"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                {s.icon}
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Welcome banner */}
        <div
          className="mt-3 rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg,#fdf2fb,#ede9fe)', border: '1px solid rgb(230, 200, 183)' }}
        >
          <span className="text-3xl select-none">🌸</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'rgb(156, 112, 91)' }}>Chào mừng bạn đến với trang của Hoa!</div>
            <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgb(205, 179, 166)' }}>
              Mình review thật — mua thật — dùng thật. Nhấn vào sản phẩm để xem và đặt hàng ngay nhé 🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95"
              style={
                activeCategory === cat
                  ? { background: 'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))', color: '#fff', boxShadow: '0 4px 12px rgba(219,39,119,0.15)' }
                  : { background: '#fff', color: '#6b7280', border: '1.5px solid #E6C8B7' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="px-4 mt-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17 }}>
            {activeCategory === 'Tất cả' ? 'Sản phẩm nổi bật' : activeCategory}
          </h2>
          <span className="text-xs" style={{ color: 'rgb(187, 150, 125)' }}>{filtered.length} sản phẩm</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <div className="text-gray-500 text-sm">Không tìm thấy sản phẩm</div>
            <button
              onClick={() => { setSearch(''); setActiveCategory('Tất cả') }}
              className="mt-3 text-sm font-medium px-4 py-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#f0a8c8,#b08ee8)', color: '#fff' }}
            >
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <a
                key={p.id}
                href={p.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden shadow-sm transition-transform active:scale-95"
                style={{ background: '#fff', border: '1px solid #f3e8ff' }}
              >
                <div className="relative aspect-square bg-gray-50">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {p.hot && (
                    <div
                      className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg,#f87171,#fb923c)' }}
                    >
                      HOT
                    </div>
                  )}
                  <div
                    className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgb(200, 170, 164)' }}
                  >
                    {p.discount}
                  </div>
                  {/* Shopee badge */}
                  <div
                    className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(238,77,45,0.92)', backdropFilter: 'blur(4px)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                    </svg>
                    <span className="text-white text-xs font-bold">Shopee</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-gray-800 text-xs font-medium leading-tight line-clamp-2 mb-1.5">{p.name}</div>
                  <StarRating rating={p.rating} />
                  <div
                    className="mt-2 w-full py-1.5 rounded-xl text-center text-xs font-semibold text-white"
                    style={{ backgroundImage: 'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))' }}
                  >
                    Mua ngay →
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Floating scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-4 w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white transition-transform active:scale-90 z-50"
        style={{ backgroundImage: 'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))' }}
        aria-label="Lên đầu trang"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </div>
  )
}
