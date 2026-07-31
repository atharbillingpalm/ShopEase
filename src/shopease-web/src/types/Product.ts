export type Product = {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  mrp: number
  discountPercent: number
  stock: number
  rating: number
  reviewCount: number
  imageUrls: string[]
  categoryId: string
  categoryName: string
  isActive: boolean
  isFeatured: boolean
}