export type ProductStatus = "active" | "coming_soon"

export interface Product {
  id: number
  name: string
  slug: string
  category: string
  series: string
  flavor: string
  price: number
  stock: number
  model3d: string
  themeColor: string
  glowColor: string
  tagline: string
  description: string
  status: ProductStatus
  isFlagship?: boolean
}

export interface FlavorWorld {
  id: string
  name: string
  emoji: string
  theme: string
  color: string
  description: string
  status: ProductStatus
  launchDate?: string
}
