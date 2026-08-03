import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShoppingBag, Mail, Lock } from 'lucide-react'
import api from '../../shared/utils/api'
import { useAuthStore } from '../../features/auth/authStore'

export default function LoginPage() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const navigate  = useNavigate()
  const login     = useAuthStore(s => s.login)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data)
      navigate('/')
    } catch (err: any) {
      setError(
        err.response?.data ||
        'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center 
                    justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border 
                      border-gray-200 w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center 
                          gap-2 mb-2">
            <ShoppingBag size={28} className="text-[#f0c040]" />
            <span className="text-2xl font-bold text-[#1a1a2e] 
                             tracking-widest">
              SHOPEASE
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 
                          rounded-lg px-4 py-3 mb-5 text-sm 
                          text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-xs font-bold 
                               text-gray-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16}
                className="absolute left-3 top-1/2 
                           -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 
                           rounded-lg pl-9 pr-4 py-2.5 text-sm 
                           outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold 
                               text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16}
                className="absolute left-3 top-1/2 
                           -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 
                           rounded-lg pl-9 pr-10 py-2.5 text-sm 
                           outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 
                           -translate-y-1/2 text-gray-400 
                           hover:text-gray-600"
              >
                {showPass
                  ? <EyeOff size={16} />
                  : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button type="button"
              className="text-xs text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0c040] text-[#1a1a2e] 
                       font-bold py-3 rounded-lg 
                       hover:bg-[#d4a832] transition-all 
                       disabled:opacity-50 
                       disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Guest browse */}
        <button
          onClick={() => navigate('/')}
          className="w-full border border-gray-300 text-gray-600 
                     py-2.5 rounded-lg text-sm 
                     hover:bg-gray-50 mb-5"
        >
          Continue as Guest
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          New to ShopEase?{' '}
          <Link to="/register"
            className="text-blue-600 font-medium hover:underline">
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}