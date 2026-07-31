type Props = {
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  sortBy: string
  setSortBy: (s: string) => void
  maxPrice: number
  setMaxPrice: (p: number) => void
  minRating: number
  setMinRating: (r: number) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
  onSaleOnly: boolean
  setOnSaleOnly: (v: boolean) => void
  freeDelivery: boolean
  setFreeDelivery: (v: boolean) => void
  onClear: () => void
}

const categories = [
  'All','Furniture','Electronics','Kitchen',
  'Clothes','Hardware','Sports','Books','Grocery'
]

const sortOptions = [
  { value: 'relevance',  label: 'Relevance' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'latest',     label: 'Latest Arrivals' },
  { value: 'rating',     label: 'Best Rated' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'discount',   label: 'Biggest Discount' },
]

export default function FilterPanel({
  selectedCategory, setSelectedCategory,
  sortBy, setSortBy,
  maxPrice, setMaxPrice,
  minRating, setMinRating,
  inStockOnly, setInStockOnly,
  onSaleOnly, setOnSaleOnly,
  freeDelivery, setFreeDelivery,
  onClear
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-32">

      <div className="flex justify-between items-center mb-4 
                      pb-3 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 text-sm">
          Filters
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-4">
        <div className="text-xs font-bold text-gray-500 
                        uppercase tracking-wide mb-2">
          Category
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs border 
                         transition-all ${
                selectedCategory === cat
                  ? 'bg-[#f0c040] text-[#1a1a2e] border-[#f0c040] font-bold'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-4">
        <div className="text-xs font-bold text-gray-500 
                        uppercase tracking-wide mb-2">
          Sort By
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 
                     py-1.5 text-sm text-gray-700 outline-none 
                     focus:border-blue-400"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <div className="text-xs font-bold text-gray-500 
                        uppercase tracking-wide mb-2">
          Max Price
        </div>
        <input
          type="range"
          min={0}
          max={100000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#f0c040]"
        />
        <div className="flex justify-between text-xs 
                        text-gray-400 mt-1">
          <span>₹0</span>
          <span className="font-medium text-gray-700">
            ₹{maxPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <div className="text-xs font-bold text-gray-500 
                        uppercase tracking-wide mb-2">
          Min Rating
        </div>
        {[5,4,3,2].map(r => (
          <label key={r}
            className="flex items-center gap-2 text-sm 
                       text-gray-600 mb-1.5 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === r}
              onChange={() => setMinRating(r)}
              className="accent-[#f0c040]"
            />
            <span>
              {'★'.repeat(r)}{'☆'.repeat(5-r)} & above
            </span>
          </label>
        ))}
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className="text-xs font-bold text-gray-500 
                        uppercase tracking-wide mb-2">
          Availability
        </div>
        <label className="flex items-center gap-2 text-sm 
                          text-gray-600 mb-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[#f0c040]"
          />
          In Stock Only
        </label>
        <label className="flex items-center gap-2 text-sm 
                          text-gray-600 mb-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="accent-[#f0c040]"
          />
          On Sale
        </label>
        <label className="flex items-center gap-2 text-sm 
                          text-gray-600 mb-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={(e) => setFreeDelivery(e.target.checked)}
            className="accent-[#f0c040]"
          />
          Free Delivery
        </label>
      </div>

    </div>
  )
}