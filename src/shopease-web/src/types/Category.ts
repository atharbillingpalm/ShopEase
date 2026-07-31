export interface Category {
  id: string
  name: string
  slug: string
  description: string
  iconUrl: string
  parentId: string | null
  sortOrder: number
  isActive: boolean
  productCount: number
}