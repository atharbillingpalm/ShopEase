import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, Share2,
  Truck, RotateCcw, Shield, Bot,
  Star, ChevronLeft
} from 'lucide-react'
import { useProduct } from '../../features/products/productQueries'
import { useCartStore } from '../../features/cart/cartStore'

const colours = ['Walnut Brown', 'Natural', 'Matte Black']

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedColour, setSelectedColour] = useState(0)
  const [quantity, setQuantity]             = useState(1)
  const [activeTab, setActiveTab]           = useState('description')
  const [wishlist, setWishlist]             = useState(false)
  const [addedToCart, setAddedToCart]       = useState(false)
  const addItem = useCartStore(s => s.addItem)

  // ── Fetch real product from API ─────────────
  const { data: product, isLoading, isError } = useProduct(id)

  // ── Loading state ───────────────────────────
  if (isLoading) return (
    <div className="bg-gray-100 min-h-screen flex items-center 
                    justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#f0c040] 
                        border-t-transparent rounded-full 
                        animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading product...</p>
      </div>
    </div>
  )

  // ── Error state ─────────────────────────────
  if (isError || !product) return (
    <div className="bg-gray-100 min-h-screen flex items-center 
                    justify-center">
      <div className="text-center bg-white rounded-xl p-10 
                      border border-gray-200">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Product not found
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          This product may have been removed or is unavailable
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#f0c040] text-[#1a1a2e] font-bold 
                     px-6 py-2.5 rounded-lg hover:bg-[#d4a832]"
        >
          Back to Products
        </button>
      </div>
    </div>
  )

  const discount = product.mrp > 0
    ? Math.round((product.mrp - product.price) / product.mrp * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      id:              String(product.id),
      name:            product.name,
      description:     product.description,
      shortDescription:product.shortDescription,
      price:           product.price,
      mrp:             product.mrp,
      discountPercent: product.discountPercent,
      stock:           product.stock,
      rating:          product.rating,
      reviewCount:     product.reviewCount,
      imageUrls:       product.imageUrls,
      categoryId:      String(product.categoryId),
      categoryName:    product.categoryName,
      isActive:        product.status === 'Active',
      isFeatured:      product.isFeatured,
    }, colours[selectedColour])
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="bg-gray-100 min-h-screen p-3">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs 
                      text-gray-500 mb-3">
        <button onClick={() => navigate(-1)}
          className="hover:text-blue-600 flex items-center gap-1">
          <ChevronLeft size={14} /> Back
        </button>
        <span>›</span>
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-blue-600">
          {product.categoryName}
        </Link>
        <span>›</span>
        <span className="text-gray-700 line-clamp-1">
          {product.name}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* Left — Images */}
        <div className="col-span-4">

          {/* Main Image */}
          <div className="bg-white rounded-lg p-4 mb-3 
                          flex items-center justify-center 
                          h-72 border border-gray-200">
            {product.imageUrls?.length > 0 ? (
              <img src={product.imageUrls[0]}
                alt={product.name}
                className="h-full object-contain" />
            ) : (
              <div className="text-8xl">📦</div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[0,1,2,3].map(i => (
              <div key={i}
                className="bg-white border rounded-lg h-16 
                           flex items-center justify-center 
                           cursor-pointer text-2xl 
                           border-gray-200 hover:border-gray-400">
                📦
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="bg-blue-50 border border-blue-200 
                          rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-700">
                AI Recommendation
              </span>
            </div>
            <div className="text-xs text-gray-600 leading-relaxed mb-2">
              Customers who viewed this also bought:
            </div>
            <div className="flex flex-col gap-1">
              {['Matching Dining Table (₹12,500)',
                'Chair Cushion Set (₹899)',
                '4-Chair Bundle (₹12,999)'].map(item => (
                <Link key={item} to="/products"
                  className="text-xs text-blue-600 hover:underline">
                  → {item}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right — Product Info */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg p-5 
                          border border-gray-200">

            {/* Badge */}
            {discount > 0 && (
              <span className="bg-green-100 text-green-700 text-xs 
                               font-bold px-2 py-1 rounded mb-3 
                               inline-block">
                {discount}% OFF LIMITED TIME DEAL
              </span>
            )}

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              {product.name}
            </h1>
            <div className="text-xs text-gray-400 mb-3">
              Brand: {product.brand || 'ShopEase'} &nbsp;|&nbsp;
              SKU: {product.sku || `SE-${String(product.id).padStart(3,'0')}`}
              &nbsp;|&nbsp;
              Category: {product.categoryName}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14}
                    className={s <= Math.round(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 fill-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} &nbsp;|&nbsp;
                {product.reviewCount} verified reviews
                &nbsp;|&nbsp;
                <span className={`font-medium ${
                  product.stock > 0
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}>
                  {product.stock > 0
                    ? `In Stock (${product.stock} left)`
                    : 'Out of Stock'}
                </span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-[#c8a84b]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span className="text-green-600 font-bold text-sm">
                    Save ₹{(product.mrp - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-400 mb-4">
              Inclusive of all taxes &nbsp;|&nbsp;
              GST: {product.brand || '18%'}
            </div>

            {/* Colour */}
            <div className="mb-4">
              <div className="text-sm font-bold text-gray-700 mb-2">
                Select Colour:
                <span className="font-normal text-gray-500 ml-2">
                  {colours[selectedColour]}
                </span>
              </div>
              <div className="flex gap-2">
                {[
                  { color:'#8B4513', label:'Walnut' },
                  { color:'#D2B48C', label:'Natural' },
                  { color:'#2c2c2a', label:'Black' },
                ].map((c, i) => (
                  <button key={c.label}
                    onClick={() => setSelectedColour(i)}
                    title={c.label}
                    className={`w-8 h-8 rounded-full border-2 
                               transition-all ${
                      selectedColour === i
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <div className="text-sm font-bold text-gray-700 mb-2">
                Quantity:
              </div>
              <div className="flex items-center gap-3">
                <div className="flex border border-gray-300 
                                rounded overflow-hidden">
                  <button
                    onClick={() =>
                      setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 bg-gray-50 
                               hover:bg-gray-100 text-gray-700 
                               font-bold text-lg">
                    −
                  </button>
                  <span className="px-5 py-2 font-bold text-gray-800 
                                   border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(q =>
                        Math.min(product.stock, q + 1))}
                    className="px-3 py-2 bg-gray-50 
                               hover:bg-gray-100 text-gray-700 
                               font-bold text-lg">
                    +
                  </button>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-red-500 text-xs font-medium">
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 font-bold py-3 rounded-lg 
                           flex items-center justify-center gap-2 
                           transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#f0c040] text-[#1a1a2e] hover:bg-[#d4a832]'
                }`}
              >
                <ShoppingCart size={18} />
                {addedToCart ? '✓ Added to Cart!'
                  : product.stock === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
              </button>
              <button className="flex-1 bg-[#1a1a2e] text-[#f0c040] 
                                 font-bold py-3 rounded-lg 
                                 hover:bg-[#2a2a4e] flex items-center 
                                 justify-center gap-2">
                ⚡ Buy Now
              </button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`px-4 py-3 border rounded-lg 
                           transition-all ${
                  wishlist
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-gray-400 text-gray-500'
                }`}
              >
                <Heart size={18}
                  fill={wishlist ? 'currentColor' : 'none'} />
              </button>
              <button className="px-4 py-3 border border-gray-300 
                                 rounded-lg hover:border-gray-400 
                                 text-gray-500">
                <Share2 size={18} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 border border-green-200 
                            rounded-lg p-3 mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Truck size={14} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">
                  {product.freeDelivery
                    ? 'Free delivery available'
                    : 'Standard delivery charges apply'}
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-5">
                {product.deliveryType || 'Standard (3-5 days)'}
                &nbsp;|&nbsp;
                {product.returnPolicy || '30-day easy return'}
                &nbsp;|&nbsp;
                GST invoice included
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <div className="flex gap-0">
                {['description','details','warranty'].map(tab => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium 
                               capitalize border-b-2 transition-all ${
                      activeTab === tab
                        ? 'border-[#f0c040] text-[#1a1a2e]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'description' && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Material',    product.material    || 'Not specified'],
                  ['Dimensions',  product.dimensions  || 'Not specified'],
                  ['Colours',     product.colours     || 'Not specified'],
                  ['Weight',      product.weight
                    ? `${product.weight} kg` : 'Not specified'],
                  ['SKU',         product.sku         || 'Not specified'],
                  ['Brand',       product.brand       || 'ShopEase'],
                  ['Category',    product.categoryName],
                  ['Status',      product.status],
                ].map(([key, val]) => (
                  <div key={key}
                    className="flex justify-between py-1.5 
                               border-b border-gray-100">
                    <span className="text-gray-500">{key}</span>
                    <span className="font-medium text-gray-700">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="flex flex-col gap-3">
                {([
                  [Shield,    product.warranty || '1 Year manufacturer warranty',
                   'Covers manufacturing defects'],
                  [RotateCcw, product.returnPolicy || '30-day easy return',
                   'No questions asked return policy'],
                  [Truck,     product.freeDelivery ? 'Free delivery' : 'Paid delivery',
                   product.deliveryType || 'Standard 3-5 days'],
                ] as [any, string, string][]).map(([Icon, title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Icon size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {title}
                      </div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}