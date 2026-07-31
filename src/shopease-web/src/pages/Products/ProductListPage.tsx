import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import FilterPanel from './FilterPanel'
import ProductCard from './ProductCard'
import { useProducts } from '../../features/products/productQueries'

const ITEMS_PER_PAGE = 8

export default function ProductListPage() {
  const [searchParams] = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  )
  const [sortBy, setSortBy]             = useState('relevance')
  const [maxPrice, setMaxPrice]         = useState(100000)
  const [minRating, setMinRating]       = useState(0)
  const [inStockOnly, setInStockOnly]   = useState(false)
  const [onSaleOnly, setOnSaleOnly]     = useState(false)
  const [freeDelivery, setFreeDelivery] = useState(false)
  const [viewMode, setViewMode]         = useState<'grid'|'list'>('grid')
  const [page, setPage]                 = useState(1)

  const searchTerm = searchParams.get('search') || ''

  // ── Fetch from real API ──────────────────────
  const { data: apiProducts = [], isLoading, isError } = useProducts({
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    search:   searchTerm || undefined,
    sort:     sortBy !== 'relevance' ? sortBy : undefined,
    maxPrice: maxPrice < 100000 ? maxPrice : undefined,
  })

  // ── Client side filters ──────────────────────
  const filtered = apiProducts.filter(p => {
    if (inStockOnly && p.stock === 0)          return false
    if (onSaleOnly && p.discountPercent === 0) return false
    if (p.rating < minRating)                  return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleClearFilters = () => {
    setSelectedCategory('All')
    setSortBy('relevance')
    setMaxPrice(100000)
    setMinRating(0)
    setInStockOnly(false)
    setOnSaleOnly(false)
    setFreeDelivery(false)
    setPage(1)
  }

  return (
    <div className="bg-gray-100 min-h-screen p-3">

      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-3">
        Home &gt; {selectedCategory} &gt;
        <span className="font-medium text-gray-700">
          {isLoading ? ' Loading...' : ` ${filtered.length} results`}
        </span>
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      <div className="flex gap-3">

        {/* Filter Panel */}
        <div className="w-52 flex-shrink-0">
          <FilterPanel
            selectedCategory={selectedCategory}
            setSelectedCategory={(val) => {
              setSelectedCategory(val)
              setPage(1)
            }}
            sortBy={sortBy}
            setSortBy={(val) => {
              setSortBy(val)
              setPage(1)
            }}
            maxPrice={maxPrice}
            setMaxPrice={(val) => {
              setMaxPrice(val)
              setPage(1)
            }}
            minRating={minRating}
            setMinRating={(val) => {
              setMinRating(val)
              setPage(1)
            }}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onSaleOnly={onSaleOnly}
            setOnSaleOnly={setOnSaleOnly}
            freeDelivery={freeDelivery}
            setFreeDelivery={setFreeDelivery}
            onClear={handleClearFilters}
          />
        </div>

        {/* Product Area */}
        <div className="flex-1">

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm px-4 
                          py-2.5 flex justify-between 
                          items-center mb-3">
            <span className="text-sm text-gray-600">
              {isLoading
                ? 'Loading products...'
                : <>Showing <strong>{filtered.length} products</strong>
                    {selectedCategory !== 'All' &&
                      ` in ${selectedCategory}`}</>
              }
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-10 h-10 border-4 
                                border-[#f0c040] 
                                border-t-transparent 
                                rounded-full animate-spin 
                                mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Loading products from database...
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="bg-red-50 border border-red-200 
                            rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-red-600 font-medium mb-2">
                Could not load products
              </p>
              <p className="text-red-400 text-sm mb-4">
                Make sure the API is running at localhost:7158
              </p>
              <div className="bg-red-100 rounded-lg p-3 
                              text-xs text-red-600 text-left 
                              max-w-sm mx-auto">
                <p className="font-bold mb-1">Checklist:</p>
                <p>1. VS 2026 → F5 → API running</p>
                <p>2. Docker Desktop → Engine running</p>
                <p>3. docker-compose up -d</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-gray-500 font-medium mb-1">
                No products found
              </div>
              <div className="text-gray-400 text-sm mb-4">
                Try adjusting your filters or search term
              </div>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className={`grid gap-3 ${
              viewMode === 'grid'
                ? 'grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {paginated.map(product => (
                <ProductCard
                  key={product.id}
                  product={{
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
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 
                           rounded text-sm disabled:opacity-40 
                           hover:bg-gray-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded text-sm ${
                      page === p
                        ? 'bg-[#f0c040] text-[#1a1a2e] font-bold'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))
              }

              <button
                onClick={() =>
                  setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-300 
                           rounded text-sm disabled:opacity-40 
                           hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}