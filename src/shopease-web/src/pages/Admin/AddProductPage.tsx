import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Save, Eye, Upload, X,
  Plus, Package, ChevronLeft, Check
} from 'lucide-react'

// ─────────────────────────────────────────────
// ALL CONSTANTS — outside component
// ─────────────────────────────────────────────
const categoryMap: Record<string, string[]> = {
  'Furniture':   ['Dining Chairs','Sofas','Bed Frames',
                  'Wardrobes','Tables','Shelves'],
  'Electronics': ['Smart Speakers','Phones','Laptops',
                  'Tablets','Accessories'],
  'Kitchen':     ['Cookware','Appliances','Storage','Dinnerware'],
  'Clothes':     ['Men','Women','Kids','Accessories'],
  'Hardware':    ['Tools','Fasteners','Electrical'],
  'Sports':      ['Fitness','Outdoor','Team Sports'],
  'Books':       ['Fiction','Non-fiction','Academic'],
  'Grocery':     ['Dry Foods','Beverages','Snacks'],
}

const GST_RATES    = ['0','5','12','18','28']
const DELIVERY     = ['Standard (3-5 days)','Express (1-2 days)',
                      'Same Day','Free Standard']
const RETURN_OPTS  = ['30-day easy return','15-day return',
                      '7-day return','No return accepted']
const STATUS_OPTS  = [
  { value:'Active',      label:'Active — visible to all users' },
  { value:'Draft',       label:'Draft — hidden from users'     },
  { value:'OutOfStock',  label:'Out of Stock'                  },
  { value:'Discontinued',label:'Discontinued'                  },
]
const TABS = [
  { id:'basic',    label:'Basic Info'  },
  { id:'pricing',  label:'Pricing'     },
  { id:'shipping', label:'Shipping'    },
  { id:'images',   label:'Images'      },
  { id:'settings', label:'Settings'    },
]
const CHECKLIST = [
  { label:'Product name',   field:'name'        },
  { label:'Category',       field:'category'    },
  { label:'Description',    field:'description' },
  { label:'Selling price',  field:'price'       },
  { label:'MRP set',        field:'mrp'         },
  { label:'Stock quantity', field:'stock'       },
  { label:'SEO tags',       field:'seoTags'     },
]

// ─────────────────────────────────────────────
// FIELD COMPONENT — outside, never recreated
// ─────────────────────────────────────────────
type FieldProps = {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// INPUT STYLES — outside, never recreated
// ─────────────────────────────────────────────
const cls = {
  input: (err?: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none 
     focus:border-blue-400 bg-white transition-colors ${
      err ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`,
  select:
    'w-full border border-gray-300 rounded-lg px-3 py-2 ' +
    'text-sm outline-none focus:border-blue-400 bg-white',
  textarea:
    'w-full border border-gray-300 rounded-lg px-3 py-2 ' +
    'text-sm outline-none focus:border-blue-400 bg-white resize-none',
}

// ─────────────────────────────────────────────
// INITIAL FORM STATE
// ─────────────────────────────────────────────
const EMPTY_FORM = {
  name:'', category:'', subCategory:'', brand:'',
  description:'', shortDescription:'', seoTags:'',
  price:'', mrp:'', gstRate:'18',
  stock:'', lowStockAlert:'5', sku:'', hsnCode:'',
  colours:'', dimensions:'', material:'', weight:'',
  deliveryType:'Standard (3-5 days)', freeDelivery:true,
  returnPolicy:'30-day easy return', warranty:'',
  status:'Active',
  isFeatured:false, showInFlashSale:false,
  includeInAISearch:true, showInDealsStrip:false,
  images:[] as string[],
}

type FormState = typeof EMPTY_FORM

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AddProductPage() {
  const [form, setForm]       = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors]   = useState<Record<string,string>>({})
  const [activeTab, setActiveTab] = useState('basic')
  const [saved, setSaved]     = useState(false)
  const navigate              = useNavigate()

  // helper — update one field without recreating handlers
  const set = (field: keyof FormState, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  // auto-generate SKU from name
  const onNameChange = (val: string) => {
    const sku = val.split(' ')
      .filter(Boolean)
      .map(w => w[0].toUpperCase())
      .join('')
      .slice(0, 6) + '-001'
    setForm(prev => ({ ...prev, name: val, sku }))
  }

  // auto-calculate discount
  const discount = form.price && form.mrp
    ? Math.max(0, Math.round(
        (( Number(form.mrp) - Number(form.price))
          / Number(form.mrp)) * 100
      ))
    : 0

  // validation
  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.name.trim())  e.name     = 'Product name is required'
    if (!form.category)     e.category = 'Category is required'
    if (!form.price)        e.price    = 'Selling price is required'
    if (!form.mrp)          e.mrp      = 'MRP is required'
    if (!form.stock)        e.stock    = 'Stock quantity is required'
    if (form.price && form.mrp &&
        Number(form.price) > Number(form.mrp))
      e.price = 'Selling price cannot exceed MRP'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePublish = () => {
    if (!validate()) { setActiveTab('basic'); return }
    setSaved(true)
    setTimeout(() => navigate('/admin'), 1800)
  }

  const addImage = () => {
    if (form.images.length >= 8) return
    const icons = ['📦','🪑','🛋','📱','🍳','👕','🔧','⚽']
    set('images', [...form.images,
      icons[form.images.length] || '📦'])
  }

  const removeImage = (i: number) =>
    set('images', form.images.filter((_, idx) => idx !== i))

  const doneCount = CHECKLIST.filter(
    c => !!(form as Record<string,unknown>)[c.field]
  ).length

  // ── Success screen ──────────────────────────
  if (saved) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center bg-white rounded-2xl 
                      border border-gray-200 p-12 shadow-sm">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Product Published!
        </h2>
        <p className="text-sm text-gray-500">
          Redirecting to admin dashboard...
        </p>
      </div>
    </div>
  )

  // ── Main render ─────────────────────────────
  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Fill in details and publish to catalogue
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 
                             border border-gray-300 text-gray-600 
                             rounded-lg text-sm hover:bg-gray-50">
            <Save size={14} /> Save as Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 
                             border border-gray-300 text-gray-600 
                             rounded-lg text-sm hover:bg-gray-50">
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2 
                       bg-[#f0c040] text-[#1a1a2e] font-bold 
                       rounded-lg text-sm hover:bg-[#d4a832]">
            <Package size={14} /> Publish Product
          </button>
        </div>
      </div>

      {/* Error banner */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl 
                        px-5 py-3 mb-5 flex items-center gap-3">
          <X size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>
              Fix {Object.keys(errors).length} error(s):
            </strong>{' '}
            {Object.values(errors).join(' · ')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">

        {/* ── Left — Tabbed form ── */}
        <div className="col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 
                          shadow-sm overflow-hidden">

            {/* Tab bar */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-sm font-medium 
                             border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-[#f0c040] text-[#1a1a2e] bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">

              {/* ── TAB: BASIC INFO ── */}
              {activeTab === 'basic' && (
                <div className="flex flex-col gap-4">

                  <Field label="Product Name"
                         required error={errors.name}>
                    <input
                      value={form.name}
                      onChange={e => onNameChange(e.target.value)}
                      placeholder="e.g. Oak Dining Chair — Premium Solid Wood"
                      className={cls.input(errors.name)}
                    />
                  </Field>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Category"
                           required error={errors.category}>
                      <select
                        value={form.category}
                        onChange={e => setForm(p => ({
                          ...p,
                          category: e.target.value,
                          subCategory: ''
                        }))}
                        className={cls.select}
                      >
                        <option value="">Select Category</option>
                        {Object.keys(categoryMap).map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Sub-Category">
                      <select
                        value={form.subCategory}
                        onChange={e => set('subCategory', e.target.value)}
                        className={cls.select}
                        disabled={!form.category}
                      >
                        <option value="">Select Sub-Category</option>
                        {(categoryMap[form.category] ?? []).map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Brand / Manufacturer">
                      <input
                        value={form.brand}
                        onChange={e => set('brand', e.target.value)}
                        placeholder="e.g. WoodCraft India"
                        className={cls.input()}
                      />
                    </Field>
                  </div>

                  <Field label="Full Product Description">
                    <textarea
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="Material, dimensions, features, assembly, warranty..."
                      rows={4}
                      className={cls.textarea}
                    />
                  </Field>

                  <Field label="Short Description (listing cards)">
                    <input
                      value={form.shortDescription}
                      onChange={e => set('shortDescription', e.target.value)}
                      placeholder="One-line summary for product cards"
                      className={cls.input()}
                    />
                  </Field>

                  <Field
                    label="SEO Tags / Keywords"
                    hint="Separate with commas. Used by AI search to find this product."
                  >
                    <input
                      value={form.seoTags}
                      onChange={e => set('seoTags', e.target.value)}
                      placeholder="dining chair, wooden chair, oak, solid wood"
                      className={cls.input()}
                    />
                  </Field>

                </div>
              )}

              {/* ── TAB: PRICING ── */}
              {activeTab === 'pricing' && (
                <div className="flex flex-col gap-4">

                  <div className="grid grid-cols-4 gap-4">
                    <Field label="Selling Price (Rs.)"
                           required error={errors.price}>
                      <input
                        type="number"
                        value={form.price}
                        onChange={e => set('price', e.target.value)}
                        placeholder="3599"
                        className={cls.input(errors.price)}
                      />
                    </Field>

                    <Field label="MRP / Original Price"
                           required error={errors.mrp}>
                      <input
                        type="number"
                        value={form.mrp}
                        onChange={e => set('mrp', e.target.value)}
                        placeholder="5999"
                        className={cls.input(errors.mrp)}
                      />
                    </Field>

                    <Field label="Discount % (auto)">
                      <div className="w-full border border-gray-200 
                                      rounded-lg px-3 py-2 text-sm 
                                      bg-gray-50 font-bold 
                                      text-green-600 min-h-[38px]
                                      flex items-center">
                        {discount > 0
                          ? `${discount}% off`
                          : <span className="text-gray-400 font-normal 
                                             text-xs">
                              Enter price + MRP
                            </span>
                        }
                      </div>
                    </Field>

                    <Field label="GST Rate">
                      <select
                        value={form.gstRate}
                        onChange={e => set('gstRate', e.target.value)}
                        className={cls.select}
                      >
                        {GST_RATES.map(r => (
                          <option key={r} value={r}>{r}%</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Price summary */}
                  {form.price && form.mrp && discount >= 0 && (
                    <div className="bg-green-50 border border-green-200 
                                    rounded-xl p-4">
                      <p className="text-sm font-bold text-green-700 mb-3">
                        Pricing Summary
                      </p>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        {[
                          ['Selling Price',
                           `Rs.${Number(form.price).toLocaleString()}`],
                          ['MRP',
                           `Rs.${Number(form.mrp).toLocaleString()}`],
                          ['Customer Saves',
                           `Rs.${(Number(form.mrp) - Number(form.price))
                             .toLocaleString()}`],
                          ['Discount', `${discount}%`],
                        ].map(([lbl, val]) => (
                          <div key={lbl}
                            className="bg-white rounded-lg p-3 
                                       border border-green-100">
                            <div className="text-base font-bold 
                                            text-green-700">{val}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {lbl}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-4">
                    <Field label="Stock Quantity"
                           required error={errors.stock}>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={e => set('stock', e.target.value)}
                        placeholder="14"
                        className={cls.input(errors.stock)}
                      />
                    </Field>

                    <Field label="Low Stock Alert At">
                      <input
                        type="number"
                        value={form.lowStockAlert}
                        onChange={e => set('lowStockAlert', e.target.value)}
                        placeholder="5"
                        className={cls.input()}
                      />
                    </Field>

                    <Field label="SKU / Product Code">
                      <input
                        value={form.sku}
                        onChange={e => set('sku', e.target.value)}
                        placeholder="WC-CH-001"
                        className={`${cls.input()} font-mono`}
                      />
                    </Field>

                    <Field label="HSN Code (GST)">
                      <input
                        value={form.hsnCode}
                        onChange={e => set('hsnCode', e.target.value)}
                        placeholder="HSN code"
                        className={cls.input()}
                      />
                    </Field>
                  </div>

                </div>
              )}

              {/* ── TAB: SHIPPING ── */}
              {activeTab === 'shipping' && (
                <div className="flex flex-col gap-4">

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Available Colours">
                      <input
                        value={form.colours}
                        onChange={e => set('colours', e.target.value)}
                        placeholder="Walnut Brown, Natural, Black"
                        className={cls.input()}
                      />
                    </Field>
                    <Field label="Dimensions (W x D x H cm)">
                      <input
                        value={form.dimensions}
                        onChange={e => set('dimensions', e.target.value)}
                        placeholder="45 x 50 x 90 cm"
                        className={cls.input()}
                      />
                    </Field>
                    <Field label="Material">
                      <input
                        value={form.material}
                        onChange={e => set('material', e.target.value)}
                        placeholder="Solid Oak Wood, 100%"
                        className={cls.input()}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <Field label="Weight (kg)">
                      <input
                        type="number"
                        value={form.weight}
                        onChange={e => set('weight', e.target.value)}
                        placeholder="8.5"
                        className={cls.input()}
                      />
                    </Field>
                    <Field label="Delivery Type">
                      <select
                        value={form.deliveryType}
                        onChange={e => set('deliveryType', e.target.value)}
                        className={cls.select}
                      >
                        {DELIVERY.map(d => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Free Delivery?">
                      <select
                        value={form.freeDelivery ? 'Yes' : 'No'}
                        onChange={e => set('freeDelivery',
                          e.target.value === 'Yes')}
                        className={cls.select}
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </Field>
                    <Field label="Return Policy">
                      <select
                        value={form.returnPolicy}
                        onChange={e => set('returnPolicy', e.target.value)}
                        className={cls.select}
                      >
                        {RETURN_OPTS.map(r => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Warranty">
                    <input
                      value={form.warranty}
                      onChange={e => set('warranty', e.target.value)}
                      placeholder="e.g. 1 year manufacturer warranty"
                      className={cls.input()}
                    />
                  </Field>

                </div>
              )}

              {/* ── TAB: IMAGES ── */}
              {activeTab === 'images' && (
                <div>
                  <div
                    onClick={addImage}
                    className="border-2 border-dashed border-gray-300 
                               rounded-xl p-10 text-center cursor-pointer 
                               hover:border-blue-400 hover:bg-blue-50 
                               transition-all mb-5"
                  >
                    <Upload size={32}
                      className="text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload product images
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 5MB &nbsp;·&nbsp;
                      Max 8 images &nbsp;·&nbsp;
                      First image = main photo
                    </p>
                    <p className="text-xs text-blue-500 mt-2">
                      Stored in Azure Blob Storage
                    </p>
                  </div>

                  {form.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {form.images.map((img, i) => (
                        <div key={i}
                          className="relative border-2 border-blue-200 
                                     bg-blue-50 rounded-xl h-28 
                                     flex items-center justify-center">
                          <span className="text-4xl">{img}</span>
                          {i === 0 && (
                            <span className="absolute top-2 left-2 
                                             bg-[#f0c040] text-[#1a1a2e] 
                                             text-xs font-bold px-2 
                                             py-0.5 rounded">
                              Main
                            </span>
                          )}
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 
                                       bg-red-500 text-white rounded-full 
                                       w-5 h-5 flex items-center 
                                       justify-center hover:bg-red-600"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      {form.images.length < 8 && (
                        <div
                          onClick={addImage}
                          className="border-2 border-dashed 
                                     border-gray-300 rounded-xl h-28 
                                     flex flex-col items-center 
                                     justify-center cursor-pointer 
                                     hover:border-blue-400 
                                     hover:bg-blue-50"
                        >
                          <Plus size={20}
                            className="text-gray-400 mb-1" />
                          <span className="text-xs text-gray-400">
                            Add more
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    {form.images.length}/8 images uploaded
                  </p>
                </div>
              )}

              {/* ── TAB: SETTINGS ── */}
              {activeTab === 'settings' && (
                <div className="flex flex-col gap-5">

                  <Field label="Product Status">
                    <select
                      value={form.status}
                      onChange={e => set('status', e.target.value)}
                      className={cls.select}
                    >
                      {STATUS_OPTS.map(s => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-3">
                      Visibility Flags
                    </p>
                    <div className="flex flex-col gap-3">
                      {([
                        ['isFeatured',
                         'Mark as Featured Product',
                         'Shown in featured sections and homepage'],
                        ['showInFlashSale',
                         'Show in Flash Sale / Deals',
                         "Shown in Today's Deals and Flash Sale"],
                        ['includeInAISearch',
                         'Include in AI Search Index',
                         'AI assistant can find and recommend this product'],
                        ['showInDealsStrip',
                         'Show in Homepage Deals Strip',
                         'Shown in the deals row on the homepage'],
                      ] as [keyof FormState, string, string][]).map(
                        ([field, label, desc]) => (
                          <label
                            key={field}
                            className={`flex items-start gap-3 p-3 
                                       border rounded-xl cursor-pointer 
                                       transition-all ${
                              form[field]
                                ? 'border-[#f0c040] bg-yellow-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={form[field] as boolean}
                              onChange={e =>
                                set(field, e.target.checked)}
                              className="accent-[#f0c040] mt-0.5 
                                         flex-shrink-0"
                            />
                            <div>
                              <p className="text-sm font-medium 
                                            text-gray-800">
                                {label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {desc}
                              </p>
                            </div>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── Right — Summary panel ── */}
        <div className="col-span-4 flex flex-col gap-4">

          {/* Live Preview */}
          <div className="bg-white rounded-xl border border-gray-200 
                          shadow-sm p-4">
            <p className="text-xs font-bold text-gray-500 uppercase 
                          tracking-wide mb-3">
              Live Preview
            </p>
            <div className="border border-gray-200 rounded-xl 
                            overflow-hidden">
              <div className="h-28 bg-gray-100 flex items-center 
                              justify-center text-5xl">
                {form.images[0] ?? '📦'}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-gray-800 
                               mb-0.5 line-clamp-2">
                  {form.name || 'Product Name'}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {form.category || 'Category'}
                  {form.subCategory && ` › ${form.subCategory}`}
                </p>
                {form.price && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-base font-bold text-[#c8a84b]">
                      Rs.{Number(form.price).toLocaleString()}
                    </span>
                    {form.mrp && (
                      <span className="text-xs text-gray-400 
                                       line-through">
                        Rs.{Number(form.mrp).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
                {discount > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    {discount}% off — Save Rs.
                    {(Number(form.mrp) - Number(form.price))
                      .toLocaleString()}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.isFeatured && (
                    <span className="text-xs bg-yellow-100 
                                     text-yellow-700 px-2 py-0.5 
                                     rounded-full">
                      Featured
                    </span>
                  )}
                  {form.freeDelivery && (
                    <span className="text-xs bg-green-100 
                                     text-green-700 px-2 py-0.5 
                                     rounded-full">
                      Free Delivery
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completion checklist */}
          <div className="bg-white rounded-xl border border-gray-200 
                          shadow-sm p-4">
            <p className="text-xs font-bold text-gray-500 uppercase 
                          tracking-wide mb-3">
              Completion Checklist
            </p>
            <div className="flex flex-col gap-2 mb-3">
              {CHECKLIST.map(item => {
                const done = !!(form as Record<string,unknown>)[item.field]
                return (
                  <div key={item.field}
                    className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center 
                                     justify-center flex-shrink-0 ${
                      done
                        ? 'bg-green-500 text-white'
                        : 'border border-gray-300 bg-gray-50'
                    }`}>
                      {done && <Check size={10} />}
                    </div>
                    <span className={done
                      ? 'text-gray-700' : 'text-gray-400'}>
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="bg-gray-100 rounded-full h-2 mb-1">
              <div
                className="bg-green-500 h-2 rounded-full transition-all 
                           duration-300"
                style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">
              {doneCount}/{CHECKLIST.length} fields complete
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 
                          rounded-xl p-4 text-xs text-blue-700 
                          leading-relaxed">
            <p className="font-bold mb-2">Quick Tips</p>
            <ul className="flex flex-col gap-1.5">
              <li>• SKU auto-generates from product name</li>
              <li>• Discount % is auto-calculated</li>
              <li>• AI search uses SEO tags</li>
              <li>• Max 8 images — first = main photo</li>
              <li>• Images stored in Azure Blob Storage</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}