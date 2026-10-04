import { supabase } from './supabase'
import { Category, Product, ProfileInfo } from '../types'

// ==========================================
// 1. SERVICES CHO PROFILE CÁ NHÂN
// ==========================================

export async function getProfile(): Promise<ProfileInfo | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Lỗi khi lấy profile:', error.message)
    return null
  }

  return {
    id: data.id,
    displayName: data.display_name,
    handle: data.handle,
    role: data.role,
    followers: data.followers,
    rating: data.rating,
    productCount: data.product_count,
    avatarUrl: data.avatar_url,
    welcomeTitle: data.welcome_title,
    welcomeDesc: data.welcome_desc,
    facebookUrl: data.facebook_url,
    instagramUrl: data.instagram_url,
    youtubeUrl: data.youtube_url,
    tiktokUrl: data.tiktok_url,
  }
}

export async function updateProfile(profile: Partial<ProfileInfo>, id: string): Promise<boolean> {
  const updateData: Record<string, any> = {}

  if (profile.displayName !== undefined) updateData.display_name = profile.displayName
  if (profile.handle !== undefined) updateData.handle = profile.handle
  if (profile.role !== undefined) updateData.role = profile.role
  if (profile.followers !== undefined) updateData.followers = profile.followers
  if (profile.rating !== undefined) updateData.rating = profile.rating
  if (profile.productCount !== undefined) updateData.product_count = profile.productCount
  if (profile.avatarUrl !== undefined) updateData.avatar_url = profile.avatarUrl
  if (profile.welcomeTitle !== undefined) updateData.welcome_title = profile.welcomeTitle
  if (profile.welcomeDesc !== undefined) updateData.welcome_desc = profile.welcomeDesc
  if (profile.facebookUrl !== undefined) updateData.facebook_url = profile.facebookUrl
  if (profile.instagramUrl !== undefined) updateData.instagram_url = profile.instagramUrl
  if (profile.youtubeUrl !== undefined) updateData.youtube_url = profile.youtubeUrl
  if (profile.tiktokUrl !== undefined) updateData.tiktok_url = profile.tiktokUrl
  updateData.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Lỗi khi cập nhật profile:', error.message)
    return false
  }
  return true
}

// ==========================================
// 2. SERVICES CHO DANH MỤC (CATEGORIES)
// ==========================================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Lỗi khi lấy danh mục:', error.message)
    return []
  }

  return data as Category[]
}

export async function createCategory(name: string, sortOrder?: number): Promise<Category | null> {
  let finalOrder = sortOrder

  // Nếu người dùng không nhập thứ tự, tự tính toán để đưa về cuối danh sách
  if (finalOrder === undefined || isNaN(finalOrder)) {
    const { data: lastCategory } = await supabase
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)

    finalOrder = lastCategory && lastCategory.length > 0 ? lastCategory[0].sort_order + 1 : 1
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name.trim(), sort_order: finalOrder }])
    .select()
    .single()

  if (error) {
    console.error('Lỗi khi tạo danh mục:', error.message)
    return null
  }

  return data as Category
}

export async function updateCategory(id: string, name: string, sortOrder: number): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .update({ name: name.trim(), sort_order: sortOrder })
    .eq('id', id)

  if (error) {
    console.error('Lỗi khi cập nhật danh mục:', error.message)
    return false
  }
  return true
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Lỗi khi xóa danh mục:', error.message)
    return false
  }
  return true
}

// ==========================================
// 3. SERVICES CHO SẢN PHẨM (PRODUCTS)
// ==========================================

export async function getProducts(options?: { onlyActive?: boolean; sortByClicks?: boolean }): Promise<Product[]> {
  let query = supabase.from('products').select('*')

  if (options?.onlyActive) {
    query = query.eq('is_active', true)
  }

  if (options?.sortByClicks) {
    query = query.order('click_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error.message)
    return []
  }

  return data as Product[]
}

export async function createProduct(product: Omit<Product, 'id' | 'click_count' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()

  if (error) {
    console.error('Lỗi khi tạo sản phẩm:', error.message)
    return null
  }

  return data as Product
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error.message)
    return false
  }

  return true
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Lỗi khi xóa sản phẩm:', error.message)
    return false
  }

  return true
}

// ==========================================
// 4. HÀM TĂNG CLICK NGẦM (OPTIMIZED RPC)
// ==========================================

export async function recordProductClick(productId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_click', {
      target_product_id: productId,
    })
    if (error) {
      console.warn('Lỗi ghi nhận click ngầm:', error.message)
    }
  } catch (err) {
    console.warn('Không thể gửi click count:', err)
  }
}

// ==========================================
// 5. STORAGE: TẢI ẢNH LÊN SUPABASE
// ==========================================

export async function uploadImage(file: File, bucket: 'avatars' | 'product-images'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      console.error('Lỗi khi tải ảnh lên:', uploadError.message)
      return null
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return data.publicUrl
  } catch (err) {
    console.error('Lỗi ngoại lệ khi upload ảnh:', err)
    return null
  }
}