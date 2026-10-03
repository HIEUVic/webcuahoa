import { ReactNode } from 'react'

export interface SocialLink {
  name: string
  url: string
  icon: ReactNode
  bg: string
  label: string
}

export interface Product {
  id: number | string
  name: string
  category: string
  price: string // Tạm thời giữ nguyên kiểu string để khớp với App.tsx hiện tại
  originalPrice?: string
  discount?: string
  sold?: string
  rating: number
  shopeeUrl: string
  img: string
  hot?: boolean
}

export interface ProfileInfo {
  displayName: string
  handle: string
  role: string
  followers: string
  rating: string
  productCount: string
  avatarUrl: string
  welcomeTitle: string
  welcomeDesc: string
}