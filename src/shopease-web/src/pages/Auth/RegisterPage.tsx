import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShoppingBag,
         Mail, Lock, User, Phone } from 'lucide-react'
import api from '../../shared/utils/api'
import { useAuthStore } from '../../features/auth/authStore'

export default function RegisterPage() {
  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [mobile,    setMobile]    = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const navigate = useNavigate()
  const login    = useAuthStore(s => s.login)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password || !mobile) {
      setError('Please fill all required fields')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        fullName, email, password, mobile
      })
      login(res.data)
      navigate('/')
    } catch (err: any) {
      setError(
        err.response?.data ||
        'Registration failed. Please try again.'
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
            Create your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 
                          rounded-lg px-4 py-3 mb-5 text-sm 
                          text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister}
          className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold 
                               text-gray-600 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User size={16}
                className="absolute left-3 top-1/2 
                           -translate-y-1/2 text-gray-400" />
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Mohd Athar"
                className="w-full border border-gray-300 
                           rounded-lg pl-9 pr-4 py-2.5 text-sm 
                           outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold 
                               text-gray-600 mb-1">
              Email Address *
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

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold 
                               text-gray-600 mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone size={16}
                className="absolute left-3 top-1/2 
                           -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="+91 9876543210"
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
              Password *
            </label>
            <div className="relative">
              <Lock size={16}
                className="absolute left-3 top-1/2 
                           -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-gray-300 
                           rounded-lg pl-9 pr-10 py-2.5 text-sm 
                           outline-none focus:border-blue-400"
              />
              <button type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 
                           -translate-y-1/2 text-gray-400">
                {showPass
                  ? <EyeOff size={16} />
                  : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold 
                               text-gray-600 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock size={16}
                className="absolute left-3 top-1/2 
                           -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className={`w-full border rounded-lg pl-9 pr-4 
                           py-2.5 text-sm outline-none 
                           focus:border-blue-400 ${
                  confirm && password !== confirm
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
            </div>
            {confirm && password !== confirm && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0c040] text-[#1a1a2e] 
                       font-bold py-3 rounded-lg 
                       hover:bg-[#d4a832] transition-all 
                       disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login"
            className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}