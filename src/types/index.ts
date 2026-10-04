import { ReactNode } from 'react'

export type PlatformType = 'shopee' | 'lazada' | 'tiktok' | 'taobao' | 'other'

export interface SocialLink {
  name: string
  url: string
  icon: ReactNode
  bg: string
  label: string
}

export interface Category {
  id: string
  name: string
  sort_order: number
}

export interface Product {
  id: string
  name: string
  category_id?: string | null
  category_name: string
  image_url: string
  platform: PlatformType
  discount?: string
  affiliate_url: string
  rating: number
  is_hot: boolean
  is_active: boolean
  click_count: number
  created_at?: string
  updated_at?: string
}

export interface ProfileInfo {
  id?: string
  displayName: string
  handle: string
  role: string
  followers: string
  rating: string
  productCount: string
  avatarUrl: string
  welcomeTitle: string
  welcomeDesc: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
}