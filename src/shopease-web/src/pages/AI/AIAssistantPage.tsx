import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Send, ShoppingCart, X, Sparkles } from 'lucide-react'
import { useCartStore } from '../../features/cart/cartStore'
import type { Product } from '../../types/Product'

type Message = {
  id: string
  role: 'ai' | 'user'
  text: string
  products?: Product[]
  timestamp: Date
}

const dummyProducts: Product[] = [
  { id:'1', name:'Oak Dining Chair — Premium Solid Wood',
    categoryId:'1', categoryName:'Furniture',
    price:3599, mrp:5999, discountPercent:40,
    stock:14, rating:4.2, reviewCount:128,
    description:'Solid oak wood chair',
    shortDescription:'Oak dining chair',
    imageUrls:[], isActive:true, isFeatured:true },
  { id:'2', name:'Sheesham Wood Dining Table (4-seater)',
    categoryId:'1', categoryName:'Furniture',
    price:12500, mrp:18000, discountPercent:31,
    stock:8, rating:4.5, reviewCount:67,
    description:'Natural grain sheesham wood',
    shortDescription:'Sheesham dining table',
    imageUrls:[], isActive:true, isFeatured:true },
  { id:'3', name:'3-Seater Sofa — Grey Fabric',
    categoryId:'1', categoryName:'Furniture',
    price:16999, mrp:22000, discountPercent:23,
    stock:3, rating:4.8, reviewCount:54,
    description:'Comfortable 3 seater sofa',
    shortDescription:'Grey sofa',
    imageUrls:[], isActive:true, isFeatured:false },
  { id:'4', name:'Smart Speaker — 360 Sound',
    categoryId:'2', categoryName:'Electronics',
    price:1299, mrp:2499, discountPercent:48,
    stock:25, rating:4.6, reviewCount:342,
    description:'360 degree sound smart speaker',
    shortDescription:'Smart speaker',
    imageUrls:[], isActive:true, isFeatured:true },
  { id:'5', name:'Non-stick Pan Set — 3 Piece',
    categoryId:'3', categoryName:'Kitchen',
    price:799, mrp:1499, discountPercent:47,
    stock:30, rating:4.3, reviewCount:211,
    description:'3 piece non stick pan set',
    shortDescription:'Non stick pans',
    imageUrls:[], isActive:true, isFeatured:false },
  { id:'6', name:'Study Table — Walnut Finish',
    categoryId:'1', categoryName:'Furniture',
    price:6800, mrp:9999, discountPercent:32,
    stock:12, rating:4.7, reviewCount:91,
    description:'Walnut finish study table',
    shortDescription:'Study table',
    imageUrls:[], isActive:true, isFeatured:false },
  { id:'7', name:'Bookshelf 5-tier — Solid Wood',
    categoryId:'1', categoryName:'Furniture',
    price:5200, mrp:7500, discountPercent:31,
    stock:20, rating:4.4, reviewCount:76,
    description:'5 tier solid wood bookshelf',
    shortDescription:'Wooden bookshelf',
    imageUrls:[], isActive:true, isFeatured:false },
  { id:'8', name:'Cotton Kurta — Premium',
    categoryId:'4', categoryName:'Clothes',
    price:499, mrp:999, discountPercent:50,
    stock:50, rating:4.1, reviewCount:87,
    description:'Premium cotton kurta',
    shortDescription:'Cotton kurta',
    imageUrls:[], isActive:true, isFeatured:false },
]

const suggestions = [
  'Show me wooden dining tables under ₹15,000',
  'What sofas do you have under ₹20,000?',
  'Best rated electronics today',
  'Compare top 3 dining chairs',
  'What is on sale right now?',
  'I need kitchen items under ₹1,000',
]

// Simple AI search logic
const STOP_WORDS = [
  'what','do','you','have','show','me','find','i','need',
  'want','best','rated','today','under','below','above',
  'the','a','an','some','are','is','in','for','of','and',
  'or','tell','give','suggest','recommend','looking','get',
  'please','can','could','would','like','any','all','how',
  'much','many','which','where','when','there','here','now'
]

function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()

  // Extract price limit from query
  const priceRegex = q.match(
    /(?:under|below|less than|within|upto|up to)\s*[₹rs\.]?\s*([\d,]+)/i
  )
  const priceLimit = priceRegex
    ? parseInt(priceRegex[1].replace(/,/g, ''))
    : Infinity

  // Extract meaningful keywords
  const keywords = q
    .replace(/[₹,\.]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 2 && !STOP_WORDS.includes(w))

  // Also add singular/plural variants
  const expandedKeywords = [
    ...keywords,
    ...keywords.map(k => k.endsWith('s') ? k.slice(0,-1) : k + 's'),
    ...keywords.map(k => k.endsWith('ing') ? k.slice(0,-3) : k),
  ]

  if (expandedKeywords.length === 0) {
    return dummyProducts.slice(0, 3)
  }

  const results = dummyProducts.filter(p => {
    const nameL      = p.name.toLowerCase()
    const catL       = p.categoryName.toLowerCase()
    const descL      = p.description.toLowerCase()
    const shortDescL = p.shortDescription.toLowerCase()

    // Check if any keyword matches product fields
    const keywordMatch = expandedKeywords.some(kw =>
      nameL.includes(kw) ||
      catL.includes(kw) ||
      descL.includes(kw) ||
      shortDescL.includes(kw)
    )

    // Check price limit
    const withinPrice = p.price <= priceLimit

    return keywordMatch && withinPrice
  })

  // Sort by rating descending
  return results
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
}

function generateAIResponse(
  query: string,
  products: Product[]
): string {
  const q = query.toLowerCase()

  if (products.length === 0) {
    return `I searched our catalogue for "${query}" but did not find exact matches.\n\nTry these instead:\n• "dining table under ₹15,000"\n• "sofa under ₹20,000"\n• "electronics"\n• "kitchen items"\n• "wooden furniture"`
  }

  if (q.includes('compare')) {
    return `Here is a comparison of top ${products.length} result(s) for your search:`
  }

  if (q.includes('under') || q.includes('below') ||
      q.includes('budget') || q.includes('less than')) {
    return `Great news! I found ${products.length} option(s) within your budget. Here are my top picks sorted by rating:`
  }

  if (q.includes('best') || q.includes('top') ||
      q.includes('rated') || q.includes('popular')) {
    return `Based on customer ratings and reviews, here are the best matches for your search:`
  }

  if (q.includes('sale') || q.includes('discount') ||
      q.includes('offer') || q.includes('deal')) {
    return `Here are the items currently on sale that match your search:`
  }

  if (q.includes('sofa') || q.includes('chair') ||
      q.includes('table') || q.includes('furniture')) {
    return `I found ${products.length} furniture item(s) matching your search. Here are my recommendations:`
  }

  return `I found ${products.length} product(s) matching your search in our catalogue:`
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      timestamp: new Date(),
      text: `Hello! I am your AI shopping assistant powered by 
Semantic Kernel and Azure OpenAI. 

I have access to our complete catalogue of 500+ products 
and can help you find exactly what you need using natural language.

Try asking me:
- "Show me wooden dining tables under ₹15,000"  
- "I need a sofa for a small living room"
- "What is the best rated kitchen item?"
- "Compare the top 3 dining chairs"`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const query = text || input.trim()
    if (!query || loading) return

    setInput('')

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 1200))

    // Search products
    const found = searchProducts(query)
    const responseText = generateAIResponse(query, found)

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: responseText,
      products: found,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      text: `✅ "${product.name}" has been added to your cart! 
Want me to find matching accessories or similar products?`,
      timestamp: new Date(),
    }])
  }

  const clearChat = () => {
    setMessages([{
      id: '0',
      role: 'ai',
      timestamp: new Date(),
      text: 'Chat cleared. How can I help you find the perfect product today?',
    }])
  }

  return (
    <div className="bg-gray-100 min-h-screen p-3">

      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-3">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <span className="text-gray-700">AI Shopping Assistant</span>
      </div>

      <div className="grid grid-cols-12 gap-4 
                      h-[calc(100vh-120px)]">

        {/* Left — Info Panel */}
        <div className="col-span-3 flex flex-col gap-3">

          {/* AI Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bot size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-800">
                  AI Assistant
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 
                                  rounded-full"></div>
                  <span className="text-xs text-green-600">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Powered by{' '}
              <span className="font-medium text-blue-600">
                Semantic Kernel
              </span>{' '}
              +{' '}
              <span className="font-medium text-blue-600">
                Azure OpenAI GPT-4o
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {[
                '500+ products in catalogue',
                'Natural language search',
                'Multi-turn memory',
                'Real-time recommendations',
              ].map(feature => (
                <div key={feature}
                  className="flex items-center gap-1.5 
                             text-xs text-gray-600">
                  <Sparkles size={10} 
                    className="text-yellow-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="font-bold text-sm text-gray-700 mb-3">
              Try asking...
            </div>
            <div className="flex flex-col gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs text-blue-600 
                             bg-blue-50 border border-blue-100 
                             rounded-lg p-2 hover:bg-blue-100 
                             transition-all leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="font-bold text-sm text-gray-700 mb-2">
              Quick Actions
            </div>
            <Link to="/cart"
              className="flex items-center gap-2 text-sm 
                         text-gray-600 bg-gray-50 rounded-lg 
                         p-2.5 hover:bg-gray-100 mb-2">
              <ShoppingCart size={14} className="text-[#c8a84b]" />
              View Cart
            </Link>
            <Link to="/products"
              className="flex items-center gap-2 text-sm 
                         text-gray-600 bg-gray-50 rounded-lg 
                         p-2.5 hover:bg-gray-100">
              <Bot size={14} className="text-blue-500" />
              Browse Products
            </Link>
          </div>

        </div>

        {/* Right — Chat Area */}
        <div className="col-span-9 flex flex-col bg-white 
                        rounded-lg shadow-sm overflow-hidden">

          {/* Chat Header */}
          <div className="bg-[#1a1a2e] px-4 py-3 flex 
                          justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">
                  AI Shopping Assistant
                </div>
                <div className="text-xs text-gray-400">
                  Searches live catalogue in real-time
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs 
                         text-gray-400 hover:text-white 
                         bg-white/10 px-3 py-1.5 rounded-lg">
              <X size={12} />
              New Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 
                          flex flex-col gap-4 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id}
                className={`flex ${
                  msg.role === 'user' 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}>
                <div className={`max-w-[80%] ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                } flex flex-col gap-2`}>

                  {/* Sender Label */}
                  <div className={`text-xs font-bold ${
                    msg.role === 'ai' 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                  }`}>
                    {msg.role === 'ai' ? '🤖 AI Assistant' : 'You'}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm 
                                  leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#1a1a2e] text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                      {msg.products.map(product => (
                        <div key={product.id}
                          className="bg-white border border-blue-200 
                                     rounded-xl p-3 flex items-center 
                                     gap-3 shadow-sm">

                          {/* Product Image */}
                          <div className="w-14 h-14 bg-gray-100 
                                          rounded-lg flex items-center 
                                          justify-center text-2xl 
                                          flex-shrink-0">
                            📦
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${product.id}`}
                              className="font-medium text-sm 
                                         text-gray-800 hover:text-blue-600 
                                         line-clamp-1">
                              {product.name}
                            </Link>
                            <div className="text-xs text-gray-400">
                              {product.categoryName} &nbsp;|&nbsp;
                              ⭐ {product.rating} 
                              ({product.reviewCount})
                            </div>
                            <div className="flex items-baseline 
                                            gap-2 mt-0.5">
                              <span className="font-bold text-sm 
                                               text-[#c8a84b]">
                                ₹{product.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400 
                                               line-through">
                                ₹{product.mrp.toLocaleString()}
                              </span>
                              <span className="text-xs text-green-600 
                                               font-medium">
                                {product.discountPercent}% off
                              </span>
                            </div>
                          </div>

                          {/* Add to Cart */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-[#f0c040] text-[#1a1a2e] 
                                       text-xs font-bold px-3 py-2 
                                       rounded-lg hover:bg-[#d4a832] 
                                       flex items-center gap-1 
                                       flex-shrink-0">
                            <ShoppingCart size={12} />
                            Add
                          </button>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs text-gray-400">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 
                                rounded-2xl rounded-tl-sm px-4 py-3 
                                shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full 
                                     animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      AI is searching catalogue...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested chips above input */}
          <div className="px-4 pt-2 flex gap-2 overflow-x-auto 
                          bg-white border-t border-gray-100">
            {suggestions.slice(0,4).map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap text-xs text-blue-600 
                           bg-blue-50 border border-blue-200 
                           rounded-full px-3 py-1 
                           hover:bg-blue-100 mb-2"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 bg-white border-t 
                          border-gray-200 flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Type your product question in natural language... (Press Enter to send)"
                rows={2}
                className="w-full border border-gray-300 rounded-xl 
                           px-4 py-2.5 text-sm outline-none 
                           focus:border-blue-400 resize-none"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="bg-[#f0c040] text-[#1a1a2e] p-3 
                         rounded-xl font-bold hover:bg-[#d4a832] 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}