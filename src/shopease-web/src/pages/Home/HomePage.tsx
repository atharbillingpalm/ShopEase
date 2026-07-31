import { useCategories } from '../../features/products/categoryQueries'
import { useDealsProducts } from '../../features/products/productQueries'
import { Link } from 'react-router-dom'
import { Zap, Star, Bot, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const { data: apiCategories = [] } = useCategories()
  const { data: dealsProducts = [] } = useDealsProducts()
  const sidebarCategories = apiCategories
  .filter(c => c.showInNav)
  .slice(0, 10)
  .map(c => ({ name: c.name, count: c.productCount, icon: c.icon }))
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Hero Section */}
      <div className="grid grid-cols-12 gap-2 p-2">

        {/* Category Sidebar */}
        <div className="col-span-2 bg-white rounded shadow-sm">
          <div className="bg-[#1a1a2e] text-[#f0c040] text-sm 
                          font-bold px-3 py-2 rounded-t">
            All Categories
          </div>
          {sidebarCategories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className={`flex justify-between items-center px-3 py-2 
                         text-sm border-b border-gray-100 
                         hover:bg-blue-50 hover:text-blue-700
                         ${i === 0 ? 'bg-blue-50 text-blue-700 font-medium' 
                                   : 'text-gray-700'}`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </Link>
          ))}
        </div>

        {/* Hero Banner */}
        <div className="col-span-8 bg-gradient-to-r from-[#1a1a2e] 
                        to-[#0f3460] rounded p-6 flex flex-col 
                        justify-center">
          <h1 className="text-[#f0c040] text-2xl font-bold mb-2">
            Your One-Stop Marketplace
          </h1>
          <p className="text-gray-300 text-sm mb-4 max-w-md">
            Furniture, electronics, kitchen, clothes and more — 
            all at the best prices. Free delivery above ₹499.
          </p>
          <div className="flex gap-3 mb-6">
            <Link to="/products"
              className="bg-[#f0c040] text-[#1a1a2e] px-5 py-2 
                         rounded font-bold text-sm 
                         hover:bg-[#d4a832]">
              Shop Now
            </Link>
            <Link to="/products?filter=deals"
              className="border border-[#f0c040] text-[#f0c040] 
                         px-5 py-2 rounded text-sm 
                         hover:bg-[#f0c040] hover:text-[#1a1a2e]">
              Today's Deals
            </Link>
          </div>
          <div className="flex gap-6">
            {[['500+','Products'],['Free','Delivery ₹499+'],
              ['Easy','30-Day Returns'],['Secure','Payments']].map(
              ([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-[#f0c040] font-bold text-lg">
                    {val}
                  </div>
                  <div className="text-gray-400 text-xs">{label}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Mini Cards */}
        <div className="col-span-2 flex flex-col gap-2">
          <Link to="/products?filter=flash"
            className="bg-green-50 border border-green-200 rounded 
                       p-3 hover:bg-green-100 cursor-pointer">
            <Zap size={20} className="text-green-600 mb-1" />
            <div className="font-bold text-sm text-gray-800">
              Flash Sale
            </div>
            <div className="text-xs text-gray-500">Ends in 2h 14m</div>
          </Link>
          <Link to="/products?filter=new"
            className="bg-white border border-gray-200 rounded p-3 
                       hover:bg-gray-50 cursor-pointer">
            <Star size={20} className="text-yellow-500 mb-1" />
            <div className="font-bold text-sm text-gray-800">
              New Arrivals
            </div>
            <div className="text-xs text-gray-500">Added today</div>
          </Link>
          <Link to="/ai"
            className="bg-blue-50 border border-blue-200 rounded p-3 
                       hover:bg-blue-100 cursor-pointer">
            <Bot size={20} className="text-blue-600 mb-1" />
            <div className="font-bold text-sm text-blue-700">
              AI Assistant
            </div>
            <div className="text-xs text-gray-500">Find by description</div>
          </Link>
        </div>

      </div>

      {/* Today's Deals Strip */}
      <div className="mx-2 mb-2 bg-white rounded shadow-sm">
        <div className="flex justify-between items-center px-4 
                        pt-3 pb-2 border-b-2 border-[#f0c040]">
          <h2 className="font-bold text-gray-800 text-base">
            🔥 Today's Top Deals
          </h2>
          <Link to="/products?filter=deals"
            className="text-blue-600 text-sm flex items-center gap-1 
                       hover:underline">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-3 p-3">
          {dealsProducts.length > 0
  ? dealsProducts.slice(0, 5).map(p => (
      <Link key={p.id} to={`/products/${p.id}`}
        className="flex-shrink-0 bg-white rounded-lg p-3 
                   w-44 border border-gray-200 
                   hover:border-blue-300 transition-all">
        <div className="text-3xl mb-2 text-center">📦</div>
        <div className="text-xs font-medium text-gray-700 
                        line-clamp-2 mb-1">
          {p.name}
        </div>
        <div className="text-sm font-bold text-[#c8a84b]">
          ₹{p.price.toLocaleString()}
        </div>
        <div className="text-xs text-green-600">
          {p.discountPercent}% off
        </div>
      </Link>
    ))
  : <div className="text-sm text-gray-400 py-2">
      Loading deals...
    </div>
}
        </div>
      </div>

    </div>
  )
}