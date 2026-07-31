import { create } from 'zustand'
import type { Product } from '../../types/Product'

export type CartItem = {
  product: Product
  quantity: number
  selectedColour: string
}

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, colour?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, colour = 'Default') => {
    set(state => {
      const existing = state.items.find(
        i => i.product.id === product.id
      )
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }
      return {
        items: [...state.items, {
          product, quantity: 1, selectedColour: colour
        }]
      }
    })
  },

  removeItem: (productId) => {
    set(state => ({
      items: state.items.filter(i => i.product.id !== productId)
    }))
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return
    set(state => ({
      items: state.items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    }))
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0)
  },

  totalPrice: () => {
    return get().items.reduce(
      (sum, i) => sum + i.product.price * i.quantity, 0
    )
  },
}))