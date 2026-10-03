import { useState, useMemo } from 'react'
import Header from './components/header/Header'
import ProfileCard from './components/profile/ProfileCard'
import CategoryFilter from './components/products/CategoryFilter'
import ProductGrid from './components/products/ProductGrid'
import ScrollToTop from './components/common/ScrollToTop'
import { PROFILE_INFO, CATEGORIES, PRODUCTS } from './constants/mockData'

export default function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [showSearch, setShowSearch] = useState(false)

  // Hàm chuẩn hóa chuỗi tiếng Việt (hỗ trợ tìm kiếm cả có dấu lẫn không dấu)
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat =
        activeCategory === 'Tất cả' || p.category === activeCategory

      const searchNorm = normalizeText(search.trim())
      const matchSearch =
        !searchNorm ||
        normalizeText(p.name).includes(searchNorm) ||
        normalizeText(p.category).includes(searchNorm)

      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  const handleResetFilter = () => {
    setSearch('')
    setActiveCategory('Tất cả')
  }

  return (
      <div
        className="min-h-screen max-w-sm mx-auto relative"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #fff8fc 0%, #fef0f7 30%, #f5f0ff 70%, #fdfaff 100%)',
        }}
      />

      {/* Header & Thanh tìm kiếm */}
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
      />

      {/* Thông tin cá nhân & Banner */}
      <ProfileCard profile={PROFILE_INFO} />

      {/* Bộ lọc danh mục */}
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Lưới sản phẩm */}
      <ProductGrid
        products={filteredProducts}
        activeCategory={activeCategory}
        onResetFilter={handleResetFilter}
      />

      {/* Nút cuộn lên đầu trang */}
      <ScrollToTop />
    </div>
  )
}