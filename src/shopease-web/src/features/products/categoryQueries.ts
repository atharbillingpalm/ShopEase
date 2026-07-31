import { useQuery } from '@tanstack/react-query'
import api from '../../shared/utils/api'

export type ApiCategory = {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  parentId: number | null
  sortOrder: number
  isActive: boolean
  showInNav: boolean
  productCount: number
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiCategory[]>('/categories')
      return res.data
    },
  })
}