export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Packed' 
  | 'InTransit' 
  | 'Delivered' 
  | 'Cancelled'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  deliveryAddress: string
}