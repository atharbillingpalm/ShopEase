import { useAuthStore } from '../../features/auth/authStore'
import { useCartStore } from '../../features/cart/cartStore'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, Bot } from 'lucide-react'

const categories = [
  'Electronics', 'Furniture', 'Kitchen', 
  'Clothes', 'Hardware', 'Sports', 'Books', 'Grocery'
]

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const totalItems = useCartStore(s => s.totalItems())
  const { user, isLoggedIn, logout } = useAuthStore()

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}&category=${selectedCategory}`)
    }
  }

  return (
    <div className="sticky top-0 z-50">

      {/* Main topbar */}
      <div className="bg-[#1a1a2e] px-4 py-2 flex items-center gap-3">
        
        {/* Logo */}
        <Link to="/" className="text-[#f0c040] font-bold text-xl 
                                 tracking-widest whitespace-nowrap">
          SHOPEASE
        </Link>

        {/* Search bar */}
        <div className="flex flex-1 h-9 rounded overflow-hidden border border-gray-300 bg-white">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-100 text-gray-700 text-sm px-2 
                       border-none outline-none w-28"
          >
            <option>All</option>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products, brands and more..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 text-sm outline-none text-gray-800 bg-white"
          />
          <button
            onClick={handleSearch}
            className="bg-[#f0c040] px-4 text-[#1a1a2e] 
                       font-bold text-sm hover:bg-[#d4a832]"
          >
            Search
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 ml-2">
          <Link to="/ai" className="text-center cursor-pointer 
                                     hover:text-[#f0c040]">
            <Bot size={18} className="text-[#f0c040] mx-auto" />
            <span className="text-white text-xs block">AI</span>
          </Link>
          {isLoggedIn ? (
  <div className="relative group text-center cursor-pointer">
    <div className="w-8 h-8 bg-[#f0c040] rounded-full 
                    flex items-center justify-center 
                    text-[#1a1a2e] font-bold text-sm mx-auto">
      {user?.fullName?.charAt(0).toUpperCase()}
    </div>
    <span className="text-gray-300 text-xs block mt-0.5">
      {user?.fullName?.split(' ')[0]}
    </span>
    {/* Dropdown */}
    <div className="absolute right-0 top-12 bg-white 
                    border border-gray-200 rounded-xl 
                    shadow-lg w-48 hidden 
                    group-hover:block z-50 text-left">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-800 truncate">
          {user?.fullName}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {user?.email}
        </p>
      </div>
      <Link to="/orders"
        className="block px-4 py-2.5 text-sm 
                   text-gray-700 hover:bg-gray-50">
        My Orders
      </Link>
      {/* Add this after the My Orders link */}
{user?.role === "Admin" && (
  <Link
    to="/admin"
    className="block px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50"
  >
    🛠️ Admin Panel
  </Link>
)}
      <Link to="/ai"
        className="block px-4 py-2.5 text-sm 
                   text-gray-700 hover:bg-gray-50">
        AI Assistant
      </Link>
      <button
        onClick={() => { logout(); navigate('/') }}
        className="w-full text-left px-4 py-2.5 
                   text-sm text-red-500 hover:bg-red-50 
                   rounded-b-xl">
        Sign Out
      </button>
    </div>
  </div>
) : (
  <Link to="/login"
    className="text-center cursor-pointer hover:text-[#f0c040]">
    <User size={18} className="text-gray-300 mx-auto" />
    <span className="text-gray-300 text-xs block">
      Sign In
    </span>
  </Link>
)}
          <Link to="/orders" className="text-center cursor-pointer 
                                         hover:text-[#f0c040]">
            <span className="text-gray-300 text-xs block">Returns</span>
            <span className="text-white text-xs font-bold block">& Orders</span>
          </Link>
          <Link to="/cart" className="text-center cursor-pointer 
                                       hover:text-[#f0c040] relative">
            <ShoppingCart size={18} className="text-gray-300 mx-auto" />
            <span className="absolute -top-1 -right-1 bg-[#f0c040] 
                             text-[#1a1a2e] text-xs rounded-full 
                             w-4 h-4 flex items-center justify-center 
                             font-bold">{totalItems}</span>
          </Link>
        </div>
      </div>

      {/* Sub navigation */}
      <div className="bg-[#232f3e] px-4 flex items-center gap-1 
                      overflow-x-auto">
        {["Today's Deals","Electronics","Furniture","Kitchen",
          "Clothes","Hardware","Sports","Books","Grocery",
          "Sell With Us"].map((item) => (
          <Link
            key={item}
            to={`/products?category=${item}`}
            className="text-gray-300 text-xs px-3 py-2 whitespace-nowrap 
                       hover:text-[#f0c040] hover:border-b-2 
                       hover:border-[#f0c040]"
          >
            {item}
          </Link>
        ))}
      </div>

    </div>
  )
}