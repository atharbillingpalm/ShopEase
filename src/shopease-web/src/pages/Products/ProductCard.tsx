import { Link } from 'react-router-dom'
import type { Product } from '../../types/Product'
import { useCartStore } from '../../features/cart/cartStore'
import { ShoppingCart } from 'lucide-react'


type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  )

  return (
    <div className="bg-white border border-gray-200 rounded-lg 
                overflow-hidden hover:border-blue-400 
                hover:shadow-md transition-all
                flex flex-col">

      {/* Image */}
      <div className="h-48 bg-gray-100 flex items-center 
                      justify-center relative">
        {product.imageUrls?.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-5xl">📦</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-100 
                           text-green-700 text-xs font-bold 
                           px-2 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Details */}
      {/* Details — flex column so button always at bottom */}
<div className="p-3 flex flex-col flex-1">
  <div className="font-medium text-sm text-gray-800 
                  mb-0.5 line-clamp-2">
    {product.name}
  </div>
  <div className="text-xs text-gray-400 mb-2">
    {product.categoryName}
  </div>
  <div className="text-base font-bold text-[#c8a84b]">
    ₹{product.price.toLocaleString()}
  </div>
  {product.mrp > product.price && (
    <div className="flex gap-2 items-center mt-1">
      <span className="text-xs text-gray-400 line-through">
        ₹{product.mrp.toLocaleString()}
      </span>
      <span className="text-xs text-green-600 font-medium">
        {discount}% off
      </span>
    </div>
  )}
  <div className="text-xs text-gray-400 mt-1">
    ⭐ {product.rating} ({product.reviewCount})
  </div>

  {/* mt-auto pushes button to bottom always */}
  <button
    onClick={(e) => {
      e.preventDefault()
      addItem(product)
    }}
    className="w-full mt-auto pt-3 bg-[#f0c040] 
               text-[#1a1a2e] text-sm font-bold 
               py-2 rounded hover:bg-[#d4a832] 
               flex items-center justify-center gap-1"
  >
    <ShoppingCart size={13} />
    Add to Cart
  </button>
</div>

    </div>
  )
}