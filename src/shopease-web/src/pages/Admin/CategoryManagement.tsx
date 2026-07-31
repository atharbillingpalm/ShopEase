import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, 
         ChevronUp, ChevronDown, X, Check } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  icon: string
  parent: string
  subCats: number
  products: number
  sortOrder: number
  status: 'Active' | 'Inactive'
  showInNav: boolean
}

const initialCategories: Category[] = [
  { id:'1', name:'Furniture',    slug:'furniture',
    icon:'🪑', parent:'—', subCats:3, products:24,
    sortOrder:1, status:'Active',   showInNav:true  },
  { id:'2', name:'Electronics',  slug:'electronics',
    icon:'📱', parent:'—', subCats:5, products:38,
    sortOrder:2, status:'Active',   showInNav:true  },
  { id:'3', name:'Kitchen',      slug:'kitchen',
    icon:'🍳', parent:'—', subCats:2, products:24,
    sortOrder:3, status:'Active',   showInNav:true  },
  { id:'4', name:'Clothes',      slug:'clothes',
    icon:'👕', parent:'—', subCats:4, products:56,
    sortOrder:4, status:'Active',   showInNav:true  },
  { id:'5', name:'Hardware',     slug:'hardware',
    icon:'🔧', parent:'—', subCats:1, products:18,
    sortOrder:5, status:'Inactive', showInNav:false },
  { id:'6', name:'Sports',       slug:'sports',
    icon:'⚽', parent:'—', subCats:2, products:22,
    sortOrder:6, status:'Active',   showInNav:true  },
  { id:'7', name:'Dining Chairs',slug:'dining-chairs',
    icon:'🪑', parent:'Furniture', subCats:0, products:12,
    sortOrder:1, status:'Active',   showInNav:false },
  { id:'8', name:'Sofas',        slug:'sofas',
    icon:'🛋', parent:'Furniture', subCats:0, products:8,
    sortOrder:2, status:'Active',   showInNav:false },
]

const emptyForm = {
  name:'', slug:'', icon:'', parent:'None — top level',
  sortOrder:1, status:'Active' as 'Active'|'Inactive',
  showInNav:true, description:'', metaDesc:''
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [sortCol, setSortCol] = useState<keyof Category>('sortOrder')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')

  // Auto generate slug from name
  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: name.toLowerCase()
                 .replace(/\s+/g, '-')
                 .replace(/[^a-z0-9-]/g, '')
    }))
  }

  // Sort columns
  const handleSort = (col: keyof Category) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  // Save category (add or edit)
  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Category name is required')
      return
    }
    if (editId) {
      setCategories(cats =>
        cats.map(c => c.id === editId
          ? { ...c, name:form.name, slug:form.slug,
              icon:form.icon, status:form.status,
              showInNav:form.showInNav,
              sortOrder:form.sortOrder }
          : c
        )
      )
    } else {
      const newCat: Category = {
        id: Date.now().toString(),
        name: form.name,
        slug: form.slug,
        icon: form.icon,
        parent: form.parent === 'None — top level' ? '—' : form.parent,
        subCats: 0,
        products: 0,
        sortOrder: form.sortOrder,
        status: form.status,
        showInNav: form.showInNav,
      }
      setCategories(cats => [...cats, newCat])
    }
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
  }

  // Edit category
  const handleEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      parent: cat.parent === '—' ? 'None — top level' : cat.parent,
      sortOrder: cat.sortOrder,
      status: cat.status,
      showInNav: cat.showInNav,
      description: '',
      metaDesc: ''
    })
    setEditId(cat.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Delete category
  const handleDelete = (id: string) => {
    setCategories(cats => cats.filter(c => c.id !== id))
    setDeleteId(null)
  }

  // Filter and sort
  const filtered = categories
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortCol]
      const bv = b[sortCol]
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

  const SortIcon = ({ col }: { col: keyof Category }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp size={10}
        className={sortCol===col && sortDir==='asc'
          ? 'text-[#f0c040]' : 'text-gray-400'} />
      <ChevronDown size={10}
        className={sortCol===col && sortDir==='desc'
          ? 'text-[#f0c040]' : 'text-gray-400'} />
    </span>
  )

  const topLevelCats = categories
    .filter(c => c.parent === '—')
    .map(c => c.name)

  return (
    <div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Category Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {categories.length} categories &nbsp;|&nbsp;
            {categories.filter(c=>c.status==='Active').length} active,
            &nbsp;
            {categories.filter(c=>c.status==='Inactive').length} inactive
          </p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm)
            setEditId(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-[#f0c040] 
                     text-[#1a1a2e] font-bold px-4 py-2 
                     rounded-lg text-sm hover:bg-[#d4a832]"
        >
          <Plus size={16} />
          Add New Category
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 
                        rounded-xl p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-blue-800 text-base">
              {editId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setEditId(null)
                setForm(emptyForm)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Category Name *
              </label>
              <input
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Furniture"
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                URL Slug * (auto-generated)
              </label>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({
                  ...f, slug: e.target.value
                }))}
                placeholder="e.g. furniture"
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white 
                           font-mono text-blue-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Parent Category
              </label>
              <select
                value={form.parent}
                onChange={e => setForm(f => ({
                  ...f, parent: e.target.value
                }))}
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              >
                <option>None — top level</option>
                {topLevelCats.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Icon / Emoji
              </label>
              <input
                value={form.icon}
                onChange={e => setForm(f => ({
                  ...f, icon: e.target.value
                }))}
                placeholder="e.g. 🪑"
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white text-center 
                           text-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={e => setForm(f => ({
                  ...f, sortOrder: Number(e.target.value)
                }))}
                min={1}
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({
                  ...f,
                  status: e.target.value as 'Active'|'Inactive'
                }))}
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              >
                <option value="Active">Active — visible</option>
                <option value="Inactive">Inactive — hidden</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Show in Navigation
              </label>
              <select
                value={form.showInNav ? 'Yes' : 'No'}
                onChange={e => setForm(f => ({
                  ...f, showInNav: e.target.value === 'Yes'
                }))}
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Description
              </label>
              <input
                value={form.description}
                onChange={e => setForm(f => ({
                  ...f, description: e.target.value
                }))}
                placeholder="Brief description of this category"
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 
                                block mb-1">
                Meta Description (SEO)
              </label>
              <input
                value={form.metaDesc}
                onChange={e => setForm(f => ({
                  ...f, metaDesc: e.target.value
                }))}
                placeholder="Category meta description for search engines"
                className="w-full border border-gray-300 rounded-lg 
                           px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#f0c040] 
                         text-[#1a1a2e] font-bold px-5 py-2 
                         rounded-lg text-sm hover:bg-[#d4a832]"
            >
              <Check size={14} />
              {editId ? 'Update Category' : 'Save Category'}
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setEditId(null)
                setForm(emptyForm)
              }}
              className="px-5 py-2 border border-gray-300 
                         text-gray-600 rounded-lg text-sm 
                         hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + count */}
      <div className="flex justify-between items-center mb-3">
        <div className="relative">
          <Search size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 
                       text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="pl-8 pr-4 py-2 border border-gray-300 
                       rounded-lg text-sm outline-none 
                       focus:border-blue-400 bg-white w-56"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing {filtered.length} of {categories.length} categories
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="bg-red-50 border border-red-200 
                        rounded-xl p-4 mb-4 flex items-center 
                        justify-between">
          <div className="text-sm text-red-700 font-medium">
            Are you sure you want to delete this category?
            This cannot be undone.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDelete(deleteId)}
              className="bg-red-600 text-white text-sm font-bold 
                         px-4 py-1.5 rounded-lg hover:bg-red-700"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteId(null)}
              className="bg-white border border-gray-300 text-gray-600 
                         text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 
                      shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1a2e]">
            <tr>
              {[
                ['#',         null],
                ['name',      'Category Name'],
                ['slug',      'Slug'],
                ['icon',      'Icon'],
                ['parent',    'Parent'],
                ['subCats',   'Sub-cats'],
                ['products',  'Products'],
                ['sortOrder', 'Order'],
                ['status',    'Status'],
                [null,        'Actions'],
              ].map(([col, label]) => (
                <th
                  key={label as string}
                  onClick={() => col && handleSort(col as keyof Category)}
                  className={`text-left px-4 py-3 text-xs 
                             text-gray-300 font-bold uppercase 
                             tracking-wide ${
                    col ? 'cursor-pointer hover:text-[#f0c040]' : ''
                  }`}
                >
                  {label}
                  {col && <SortIcon col={col as keyof Category} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat, i) => (
              <tr
                key={cat.id}
                className={`border-t border-gray-100 
                           hover:bg-blue-50/30 transition-colors ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-3 text-xs text-gray-400">
                  {i + 1}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-800">
                    {cat.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-blue-600">
                    {cat.slug}
                  </span>
                </td>
                <td className="px-4 py-3 text-xl">{cat.icon}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {cat.parent}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 
                               text-center">
                  {cat.subCats}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 
                               text-center">
                  {cat.products}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 
                               text-center">
                  {cat.sortOrder}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 
                                   rounded-full ${
                    cat.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="flex items-center gap-1 text-xs 
                                 text-blue-600 bg-blue-50 
                                 border border-blue-200 px-2 py-1 
                                 rounded hover:bg-blue-100"
                    >
                      <Pencil size={10} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="flex items-center gap-1 text-xs 
                                 text-red-500 bg-red-50 
                                 border border-red-200 px-2 py-1 
                                 rounded hover:bg-red-100"
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm font-medium">
              No categories found
            </div>
            <div className="text-xs mt-1">
              Try a different search term
            </div>
          </div>
        )}
      </div>

    </div>
  )
}