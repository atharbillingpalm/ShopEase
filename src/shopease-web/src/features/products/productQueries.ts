import { useQuery } from '@tanstack/react-query'
import api from '../../shared/utils/api'

// ── Type returned from API ──────────────────
export type ApiProduct = {
  id: number
  name: string
  description: string
  shortDescription: string
  seoTags: string
  price: number
  mrp: number
  discountPercent: number
  stock: number
  sku: string
  brand: string
  colours: string
  dimensions: string
  material: string
  weight: number
  deliveryType: string
  freeDelivery: boolean
  returnPolicy: string
  warranty: string
  imageUrls: string[]
  status: string
  isFeatured: boolean
  showInFlashSale: boolean
  includeInAiSearch: boolean
  showInDealsStrip: boolean
  rating: number
  reviewCount: number
  categoryId: number
  categoryName: string
  createdAt: string
}

// ── Filter options ──────────────────────────
export type ProductFilters = {
  category?: string
  search?: string
  sort?: string
  maxPrice?: number
  featured?: boolean
  dealsOnly?: boolean
}

// ── GET all products with filters ───────────
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters.category)
        params.append('category', filters.category)
      if (filters.search)
        params.append('search', filters.search)
      if (filters.sort)
        params.append('sort', filters.sort)
      if (filters.maxPrice)
        params.append('maxPrice', filters.maxPrice.toString())
      if (filters.featured)
        params.append('featured', 'true')
      if (filters.dealsOnly)
        params.append('dealsOnly', 'true')

      const url = `/products${
        params.toString() ? '?' + params.toString() : ''
      }`
      const res = await api.get<ApiProduct[]>(url)
      return res.data
    },
  })
}

// ── GET single product by ID ─────────────────
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get<ApiProduct>(`/products/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

// ── GET deals strip products ─────────────────
export function useDealsProducts() {
  return useQuery({
    queryKey: ['products', 'deals'],
    queryFn: async () => {
      const res = await api.get<ApiProduct[]>(
        '/products?dealsOnly=true'
      )
      return res.data
    },
  })
}

// ── GET featured products ────────────────────
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await api.get<ApiProduct[]>(
        '/products?featured=true'
      )
      return res.data
    },
  })
}