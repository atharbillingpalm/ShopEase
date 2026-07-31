import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Tag, Package,
  ShoppingBag, Users, Bot,
  BarChart3, Settings, LogOut
} from 'lucide-react'

const navItems = [
  { path: '/admin',            icon: LayoutDashboard, label: 'Dashboard'    },
  { path: '/admin/categories', icon: Tag,             label: 'Categories'   },
  { path: '/admin/products',   icon: Package,         label: 'Products'     },
  { path: '/admin/orders',     icon: ShoppingBag,     label: 'Orders'       },
  { path: '/admin/users',      icon: Users,           label: 'Users'        },
  { path: '/admin/ai',         icon: Bot,             label: 'AI Analytics' },
  { path: '/admin/reports',    icon: BarChart3,       label: 'Reports'      },
  { path: '/admin/settings',   icon: Settings,        label: 'Settings'     },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-48 bg-[#1a1a2e] flex-shrink-0 
                      flex flex-col">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-700">
          <div className="text-[#f0c040] font-bold text-base 
                          tracking-widest">
            SHOPEASE
          </div>
          <div className="text-gray-500 text-xs mt-0.5">
            Admin Panel
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 
                           text-sm transition-all ${
                  isActive
                    ? 'bg-[#2a2a4e] text-[#f0c040] font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 text-sm 
                       text-gray-400 hover:text-red-400"
          >
            <LogOut size={16} />
            Exit Admin
          </Link>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 
                        px-6 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Welcome, Admin &nbsp;|&nbsp;
            <span className="text-gray-800 font-medium">
              ShopEase Admin Panel
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year:    'numeric',
              month:   'long',
              day:     'numeric'
            })}
          </div>
        </div>

        {/* Page content renders here */}
        <div className="p-5">
          <Outlet />
        </div>

      </div>
    </div>
  )
}