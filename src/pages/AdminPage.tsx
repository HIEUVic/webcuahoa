import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import ImageCropModal from '../components/admin/ImageCropModal'
import {
  getProfile,
  updateProfile,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../services/api'
import { ProfileInfo, Category, Product, PlatformType } from '../types'

type AdminTab = 'products' | 'stats' | 'categories' | 'profile'

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('products')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // 1. State Profile
  const [profile, setProfile] = useState<ProfileInfo | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // 2. State Categories
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [categoryOrder, setCategoryOrder] = useState<string>('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // 3. State Products
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productImageFile, setProductImageFile] = useState<File | null>(null)
  const [rawCropImageSrc, setRawCropImageSrc] = useState<string | null>(null)
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null)

  // Form Sản phẩm
  const [productForm, setProductForm] = useState({
    name: '',
    category_name: '',
    category_id: '',
    image_url: '',
    platform: 'shopee' as PlatformType,
    discount: '',
    affiliate_url: '',
    rating: 5.0,
    is_hot: false,
    is_active: true,
  })

  // Hiển thị thông báo tạm thời
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // Tải dữ liệu ban đầu
  const loadInitialData = async () => {
    setLoading(true)
    const [pData, cData, prData] = await Promise.all([
      getProfile(),
      getCategories(),
      getProducts(),
    ])
    if (pData) setProfile(pData)
    if (cData) setCategories(cData)
    if (prData) setProducts(prData)
    setLoading(false)
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  // Đăng xuất
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  // Mở modal Crop từ ảnh đang có
  const handleOpenCropper = () => {
    const currentSrc = cropPreviewUrl || (productImageFile ? URL.createObjectURL(productImageFile) : productForm.image_url)
    if (currentSrc) {
      setRawCropImageSrc(currentSrc)
    } else {
      showToast('Vui lòng chọn hoặc dán link ảnh trước khi cắt', 'error')
    }
  }

  // ==========================================
  // XỬ LÝ PROFILE
  // ==========================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !profile.id) return

    setLoading(true)
    let updatedAvatarUrl = profile.avatarUrl

    if (avatarFile) {
      const uploadedUrl = await uploadImage(avatarFile, 'avatars')
      if (uploadedUrl) {
        updatedAvatarUrl = uploadedUrl
      } else {
        showToast('Upload ảnh đại diện thất bại', 'error')
      }
    }

    const success = await updateProfile(
      {
        ...profile,
        avatarUrl: updatedAvatarUrl,
      },
      profile.id
    )

    if (success) {
      setProfile((prev) => (prev ? { ...prev, avatarUrl: updatedAvatarUrl } : null))
      setAvatarFile(null)
      showToast('Cập nhật Profile thành công!')
    } else {
      showToast('Cập nhật Profile thất bại', 'error')
    }
    setLoading(false)
  }

  // ==========================================
  // XỬ LÝ DANH MỤC (CATEGORIES)
  // ==========================================
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    setLoading(true)
    const parsedOrder = categoryOrder.trim() ? parseInt(categoryOrder, 10) : undefined

    if (editingCategory) {
      const success = await updateCategory(
        editingCategory.id,
        categoryName,
        parsedOrder ?? editingCategory.sort_order
      )
      if (success) {
        showToast('Cập nhật danh mục thành công!')
        setEditingCategory(null)
      } else {
        showToast('Không thể cập nhật danh mục', 'error')
      }
    } else {
      const newCat = await createCategory(categoryName, parsedOrder)
      if (newCat) {
        showToast('Thêm danh mục mới thành công!')
      } else {
        showToast('Không thể thêm danh mục (có thể bị trùng tên)', 'error')
      }
    }

    setCategoryName('')
    setCategoryOrder('')
    const refreshed = await getCategories()
    setCategories(refreshed)
    setLoading(false)
  }

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return
    setLoading(true)
    const success = await deleteCategory(id)
    if (success) {
      showToast('Đã xóa danh mục')
      const refreshed = await getCategories()
      setCategories(refreshed)
    } else {
      showToast('Lỗi khi xóa danh mục', 'error')
    }
    setLoading(false)
  }

  // ==========================================
  // XỬ LÝ SẢN PHẨM (PRODUCTS)
  // ==========================================
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        category_name: product.category_name,
        category_id: product.category_id || '',
        image_url: product.image_url,
        platform: product.platform,
        discount: product.discount || '',
        affiliate_url: product.affiliate_url,
        rating: product.rating,
        is_hot: product.is_hot,
        is_active: product.is_active,
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        category_name: categories.length > 0 ? categories[0].name : '',
        category_id: categories.length > 0 ? categories[0].id : '',
        image_url: '',
        platform: 'shopee',
        discount: '',
        affiliate_url: '',
        rating: 5.0,
        is_hot: false,
        is_active: true,
      })
    }
    setProductImageFile(null)
    setCropPreviewUrl(null)
    setRawCropImageSrc(null)
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name.trim() || !productForm.affiliate_url.trim()) {
      showToast('Vui lòng điền đủ Tên và Link tiếp thị', 'error')
      return
    }

    setLoading(true)
    let finalImageUrl = productForm.image_url

    if (productImageFile) {
      const uploaded = await uploadImage(productImageFile, 'product-images')
      if (uploaded) {
        finalImageUrl = uploaded
      } else {
        showToast('Upload ảnh sản phẩm thất bại', 'error')
      }
    }

    if (!finalImageUrl) {
      showToast('Sản phẩm cần có ảnh (tải lên hoặc dán link)', 'error')
      setLoading(false)
      return
    }

    const payload = {
      name: productForm.name.trim(),
      category_name: productForm.category_name,
      category_id: productForm.category_id || null,
      image_url: finalImageUrl,
      platform: productForm.platform,
      discount: productForm.discount ? productForm.discount.trim() : '',
      affiliate_url: productForm.affiliate_url.trim(),
      rating: Number(productForm.rating) || 5.0,
      is_hot: productForm.is_hot,
      is_active: productForm.is_active,
    }

    if (editingProduct) {
      const success = await updateProduct(editingProduct.id, payload)
      if (success) {
        showToast('Đã cập nhật sản phẩm!')
        setIsProductModalOpen(false)
      } else {
        showToast('Lỗi cập nhật sản phẩm', 'error')
      }
    } else {
      const created = await createProduct(payload)
      if (created) {
        showToast('Thêm sản phẩm thành công!')
        setIsProductModalOpen(false)
      } else {
        showToast('Lỗi khi thêm sản phẩm', 'error')
      }
    }

    const refreshed = await getProducts()
    setProducts(refreshed)
    setLoading(false)
  }

  const handleToggleProductActive = async (product: Product) => {
    const updated = await updateProduct(product.id, { is_active: !product.is_active })
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      )
      showToast(`Đã ${!product.is_active ? 'bật bán' : 'tắt (hết hàng)'}`)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    setLoading(true)
    const success = await deleteProduct(id)
    if (success) {
      showToast('Đã xóa sản phẩm')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } else {
      showToast('Lỗi khi xóa sản phẩm', 'error')
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full sm:max-w-md mx-auto bg-stone-50 pb-20 relative text-stone-800"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h1
            className="text-lg font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              backgroundImage:
                'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quản Trị KOC
          </h1>
          <p className="text-[11px] text-stone-500">Hệ thống quản lý Bio Link</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            Xem web
          </button>
          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Thông báo Toast */}
      {message && (
        <div
          className={`fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
            message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Thẻ Tab chọn nhanh */}
      <div className="px-4 pt-3 pb-2 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: 'products', label: '🛍️ Sản phẩm' },
          { key: 'stats', label: '📊 Thống kê' },
          { key: 'categories', label: '🏷️ Danh mục' },
          { key: 'profile', label: '👤 Hồ sơ' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as AdminTab)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-stone-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NỘI DUNG TỪNG TAB */}
      <main className="p-4">
        {/* ================= TAB 1: SẢN PHẨM ================= */}
        {activeTab === 'products' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {products.length} Sản phẩm
              </span>
              <button
                onClick={() => openProductModal()}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
                }}
              >
                + Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 bg-white rounded-2xl border transition-all ${
                    p.is_active ? 'border-stone-200' : 'border-stone-200 opacity-60 bg-stone-100/60'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.is_hot && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white">
                            HOT
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-600 uppercase">
                          {p.platform}
                        </span>
                        <span className="text-[11px] text-amber-600 font-semibold">
                          ★ {p.rating}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-stone-800 line-clamp-1 mt-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-stone-500">{p.category_name}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleProductActive(p)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        p.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {p.is_active ? '● Đang bán' : '○ Tạm hết hàng'}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductModal(p)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= TAB 2: THỐNG KÊ LƯỢT CLICK ================= */}
        {activeTab === 'stats' && (
          <section className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800">
              💡 Danh sách sắp xếp theo lượt click tiếp thị từ cao xuống thấp giúp bạn tối ưu vị trí sản phẩm nổi bật.
            </div>

            <div className="space-y-2">
              {[...products]
                .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          idx === 0
                            ? 'bg-amber-400 text-white'
                            : idx === 1
                            ? 'bg-stone-300 text-stone-700'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <img
                        src={p.image_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-stone-800 truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase">{p.platform}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-sm font-bold text-stone-800">
                        {p.click_count || 0}
                      </div>
                      <div className="text-[10px] text-stone-400">lượt click</div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ================= TAB 3: DANH MỤC (CATEGORIES) ================= */}
        {activeTab === 'categories' && (
          <section className="space-y-4">
            <form
              onSubmit={handleSaveCategory}
              className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-3"
            >
              <h2 className="text-xs font-bold text-stone-700 uppercase">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] text-stone-500 mb-1">Tên danh mục</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Skincare"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Thứ tự</label>
                  <input
                    type="number"
                    placeholder="Tự động"
                    value={categoryOrder}
                    onChange={(e) => setCategoryOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null)
                      setCategoryName('')
                      setCategoryOrder('')
                    }}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-600 cursor-pointer"
                  >
                    Hủy
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-semibold shadow-sm active:scale-95 cursor-pointer"
                >
                  {editingCategory ? 'Lưu thay đổi' : '+ Thêm mới'}
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-stone-800">{c.name}</div>
                    <div className="text-[10px] text-stone-400">Thứ tự hiển thị: {c.sort_order}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c)
                        setCategoryName(c.name)
                        setCategoryOrder(c.sort_order.toString())
                      }}
                      className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs text-stone-600 cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= TAB 4: HỒ SƠ & MẠNG XÃ HỘI ================= */}
        {activeTab === 'profile' && profile && (
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
              <h2 className="text-xs font-bold text-stone-700 uppercase">Thông tin hiển thị</h2>

              <div className="flex items-center gap-3">
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : profile.avatarUrl || 'avt.jpg'
                  }
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-300"
                />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Đổi ảnh đại diện
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0])
                      }
                    }}
                    className="block w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-stone-100 hover:file:bg-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Bio / Handle</label>
                <input
                  type="text"
                  value={profile.handle}
                  onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Followers</label>
                  <input
                    type="text"
                    value={profile.followers}
                    onChange={(e) => setProfile({ ...profile, followers: e.target.value })}
                    placeholder="260k"
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Đánh giá</label>
                  <input
                    type="text"
                    value={profile.rating}
                    onChange={(e) => setProfile({ ...profile, rating: e.target.value })}
                    placeholder="4.9*"
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Sản phẩm</label>
                  <input
                    type="text"
                    value={profile.productCount}
                    onChange={(e) => setProfile({ ...profile, productCount: e.target.value })}
                    placeholder="30+"
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none text-center"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2.5">
              <h2 className="text-xs font-bold text-stone-700 uppercase">Liên kết Mạng Xã Hội</h2>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={profile.facebookUrl || ''}
                  onChange={(e) => setProfile({ ...profile, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={profile.instagramUrl || ''}
                  onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={profile.youtubeUrl || ''}
                  onChange={(e) => setProfile({ ...profile, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">TikTok URL</label>
                <input
                  type="url"
                  value={profile.tiktokUrl || ''}
                  onChange={(e) => setProfile({ ...profile, tiktokUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
              }}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi Profile'}
            </button>
          </form>
        )}
      </main>

      {/* ================= MODAL THÊM / SỬA SẢN PHẨM ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-3">
              <h2 className="text-sm font-bold text-stone-800">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên sản phẩm..."
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none"
                />
              </div>

              {/* Danh mục & Nền tảng */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Danh mục</label>
                  <select
                    value={productForm.category_name}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.name === e.target.value)
                      setProductForm({
                        ...productForm,
                        category_name: e.target.value,
                        category_id: selected ? selected.id : '',
                      })
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Nền tảng</label>
                  <select
                    value={productForm.platform}
                    onChange={(e) =>
                      setProductForm({ ...productForm, platform: e.target.value as PlatformType })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none bg-white uppercase"
                  >
                    <option value="shopee">Shopee</option>
                    <option value="lazada">Lazada</option>
                    <option value="tiktok">TikTok</option>
                    <option value="taobao">Taobao</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* Upload ảnh trực tiếp hoặc dán Link URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-stone-600 font-medium">Ảnh sản phẩm</label>
                  {(cropPreviewUrl || productImageFile || productForm.image_url) && (
                    <button
                      type="button"
                      onClick={handleOpenCropper}
                      className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 cursor-pointer"
                    >
                      ✂️ Cắt / Chỉnh vùng ảnh
                    </button>
                  )}
                </div>
                <div className="flex gap-2 items-center mb-1.5">
                  {(cropPreviewUrl || productImageFile || productForm.image_url) && (
                    <div
                      className="relative group cursor-pointer"
                      onClick={handleOpenCropper}
                      title="Bấm để chỉnh lại vùng cắt"
                    >
                      <img
                        src={
                          cropPreviewUrl ||
                          (productImageFile
                            ? URL.createObjectURL(productImageFile)
                            : productForm.image_url)
                        }
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                        ✂️
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        setRawCropImageSrc(URL.createObjectURL(file))
                        e.target.value = ''
                      }
                    }}
                    className="block w-full text-[11px] text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:bg-stone-100 hover:file:bg-stone-200"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Hoặc dán link ảnh trực tiếp tại đây..."
                  value={productForm.image_url}
                  onChange={(e) => {
                    setProductForm({ ...productForm, image_url: e.target.value })
                    setCropPreviewUrl(null)
                    setProductImageFile(null)
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-[11px] focus:outline-none"
                />
              </div>

              {/* Link Affiliate */}
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Link tiếp thị liên kết (Shopee/Lazada...) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={productForm.affiliate_url}
                  onChange={(e) =>
                    setProductForm({ ...productForm, affiliate_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none"
                />
              </div>

              {/* Nhãn giảm giá & Đánh giá sao */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Nhãn giảm giá</label>
                  <input
                    type="text"
                    placeholder="VD: -20%"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Số sao (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={productForm.rating}
                    onChange={(e) =>
                      setProductForm({ ...productForm, rating: parseFloat(e.target.value) || 5.0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Công tắc: Nhãn HOT & Trạng thái bán */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_hot}
                    onChange={(e) =>
                      setProductForm({ ...productForm, is_hot: e.target.checked })
                    }
                    className="rounded text-rose-500 w-4 h-4"
                  />
                  <span className="font-semibold text-rose-600">Gắn nhãn HOT 🔥</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_active}
                    onChange={(e) =>
                      setProductForm({ ...productForm, is_active: e.target.checked })
                    }
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-semibold text-stone-700">Đang bán</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-600 font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl text-white font-semibold shadow-md cursor-pointer"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
                  }}
                >
                  {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cắt chỉnh ảnh */}
      {rawCropImageSrc && (
        <ImageCropModal
          imageSrc={rawCropImageSrc}
          onCropComplete={(croppedFile, previewUrl) => {
            setProductImageFile(croppedFile)
            setCropPreviewUrl(previewUrl)
            setRawCropImageSrc(null)
          }}
          onCancel={() => setRawCropImageSrc(null)}
        />
      )}
    </div>
  )
}