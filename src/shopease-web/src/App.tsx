import AdminOrders  from "./pages/Admin/AdminOrders";
import AdminUsers   from "./pages/Admin/AdminUsers";
import ComingSoon   from "./pages/Admin/ComingSoon";
import AdminRoute from "./shared/components/AdminRoute";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './shared/components/Navbar'
import HomePage from './pages/Home/HomePage'
import ProductListPage from './pages/Products/ProductListPage'
import ProductDetailPage from './pages/Products/ProductDetailPage'
import CartPage from './pages/Cart/CartPage'
import OrdersPage from './pages/Orders/OrdersPage'
import AIAssistantPage from './pages/AI/AIAssistantPage'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import CategoryManagement from './pages/Admin/CategoryManagement'
import AddProductPage from './pages/Admin/AddProductPage'
import LoginPage    from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {children}
    </div>
  )
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          {/* User facing pages — with Navbar */}
          <Route element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products"
                  element={<ProductListPage />} />
                <Route path="/products/:id"
                  element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/ai" element={<AIAssistantPage />} />
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </div>
          } path="/*" />

          {/* Admin pages — protected, with sidebar, NO Navbar */}
<Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
  <Route index           element={<AdminDashboard />} />
  <Route path="categories" element={<CategoryManagement />} />
  <Route path="products"   element={<AddProductPage />} />
  <Route path="orders"     element={<AdminOrders />} />
  <Route path="users"      element={<AdminUsers />} />
  <Route path="ai"         element={<ComingSoon title="AI Analytics" />} />
  <Route path="reports"    element={<ComingSoon title="Reports" />} />
  <Route path="settings"   element={<ComingSoon title="Settings" />} />
</Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App