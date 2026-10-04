import { useState, useMemo, useEffect } from 'react'
import Header from '../components/header/Header'
import ProfileCard from '../components/profile/ProfileCard'
import CategoryFilter from '../components/products/CategoryFilter'
import ProductGrid from '../components/products/ProductGrid'
import ScrollToTop from '../components/common/ScrollToTop'
import { PROFILE_INFO, CATEGORIES, PRODUCTS } from '../constants/mockData'
import { getProfile, getCategories, getProducts } from '../services/api'
import { ProfileInfo, Product } from '../types'

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileInfo>(PROFILE_INFO)
  const [categories, setCategories] = useState<string[]>(CATEGORIES)
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [showSearch, setShowSearch] = useState(false)

  // Tải dữ liệu thật từ Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, catsRes, prodsRes] = await Promise.all([
          getProfile(),
          getCategories(),
          getProducts({ onlyActive: true }),
        ])

        if (profileRes) setProfile(profileRes)
        if (catsRes && catsRes.length > 0) {
          setCategories(['Tất cả', ...catsRes.map((c) => c.name)])
        }
        if (prodsRes && prodsRes.length > 0) {
          setProducts(prodsRes)
        }
      } catch (err) {
        console.warn('Lỗi tải dữ liệu Supabase, dùng dữ liệu dự phòng:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Chuẩn hóa tiếng Việt (tìm cả có dấu lẫn không dấu)
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === 'Tất cả' || p.category_name === activeCategory

      const searchNorm = normalizeText(search.trim())
      const matchSearch =
        !searchNorm ||
        normalizeText(p.name).includes(searchNorm) ||
        normalizeText(p.category_name).includes(searchNorm)

      return matchCat && matchSearch
    })
  }, [products, search, activeCategory])

  const handleResetFilter = () => {
    setSearch('')
    setActiveCategory('Tất cả')
  }

  return (
    <div
      className="min-h-screen w-full sm:max-w-sm mx-auto relative"
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

      {/* Profile Card */}
      <ProfileCard profile={profile} />

      {/* Bộ lọc danh mục */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="py-12 text-center text-sm text-stone-500 animate-pulse">
          Đang tải danh sách sản phẩm...
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          activeCategory={activeCategory}
          onResetFilter={handleResetFilter}
        />
      )}

      {/* Nút cuộn lên đầu */}
      <ScrollToTop />
    </div>
  )
}