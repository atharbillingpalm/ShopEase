import { useQuery } from '@tanstack/react-query'
import api from '../../shared/utils/api'

export type OrderItem = {
  id: number
  productId: number
  productName: string
  selectedColour: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type ApiOrder = {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerMobile: string
  deliveryAddress: string
  city: string
  state: string
  pinCode: string
  subTotal: number
  discount: number
  gst: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: string
  trackingId: string
  couponCode: string
  createdAt: string
  items: OrderItem[]
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get<ApiOrder[]>('/orders')
      return res.data
    },
  })
}

export function useOrder(id: number | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get<ApiOrder>(`/orders/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}