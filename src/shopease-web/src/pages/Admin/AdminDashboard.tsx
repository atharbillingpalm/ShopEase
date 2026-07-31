import { ShoppingBag, Users, Package, 
         TrendingUp, AlertTriangle, Bot,
         Eye, RefreshCw } from 'lucide-react'

const stats = [
  { label: 'Revenue this month', value: 'Rs.2.4L',
    delta: '+18% vs last month',  positive: true,
    icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  { label: 'Total orders',       value: '134',
    delta: '24 new today',        positive: true,
    icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { label: 'Registered users',   value: '542',
    delta: '12 new this week',    positive: true,
    icon: Users, color: 'bg-purple-50 text-purple-600' },
  { label: 'Products listed',    value: '48',
    delta: '8 categories active', positive: true,
    icon: Package, color: 'bg-yellow-50 text-yellow-600' },
]

const recentOrders = [
  { id:'#SE-001', customer:'Mohd Athar',   amount:'Rs.21,706',
    status:'In Transit', statusColor:'bg-orange-100 text-orange-700' },
  { id:'#SE-002', customer:'Priya Singh',  amount:'Rs.6,800',
    status:'Delivered',  statusColor:'bg-green-100 text-green-700'  },
  { id:'#SE-003', customer:'Rajan Kumar',  amount:'Rs.3,599',
    status:'Processing', statusColor:'bg-blue-100 text-blue-700'    },
  { id:'#SE-004', customer:'Neha Sharma',  amount:'Rs.14,800',
    status:'Pending',    statusColor:'bg-yellow-100 text-yellow-700' },
  { id:'#SE-005', customer:'Amit Verma',   amount:'Rs.5,200',
    status:'Delivered',  statusColor:'bg-green-100 text-green-700'  },
]

const lowStockItems = [
  { name:'3-Seater Sofa (Grey)',  category:'Furniture',    stock:3  },
  { name:'Smart Speaker',         category:'Electronics',  stock:5  },
  { name:'Cotton Kurta (M)',      category:'Clothes',      stock:8  },
  { name:'Oak Dining Chair',      category:'Furniture',    stock:4  },
]

const topProducts = [
  { name:'3-Seater Sofa',  units:24, revenue:'Rs.4.07L' },
  { name:'Study Table',    units:38, revenue:'Rs.2.58L' },
  { name:'Smart Speaker',  units:62, revenue:'Rs.0.80L' },
  { name:'Oak Chair',      units:91, revenue:'Rs.3.27L' },
]

const categoryPerformance = [
  { name:'Furniture',    products:24, orders:78, revenue:'Rs.1.8L' },
  { name:'Electronics',  products:38, orders:34, revenue:'Rs.0.4L' },
  { name:'Kitchen',      products:24, orders:22, revenue:'Rs.0.2L' },
  { name:'Clothes',      products:56, orders:18, revenue:'Rs.0.1L' },
]

export default function AdminDashboard() {
  return (
    <div>

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Last updated just now
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm 
                           text-gray-500 hover:text-gray-700 
                           bg-white border border-gray-200 
                           px-3 py-2 rounded-lg">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label}
              className="bg-white rounded-xl border border-gray-200 
                         p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {stat.label}
              </div>
              <div className={`text-xs font-medium ${
                stat.positive ? 'text-green-600' : 'text-red-500'
              }`}>
                {stat.positive ? '▲' : '▼'} {stat.delta}
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 
                      border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
            <Bot size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-blue-800 mb-1">
              AI Insights — Powered by Semantic Kernel
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">
              🔥 Sofa demand up <strong>40%</strong> this week —
              recommend restocking 20 units before weekend sale. &nbsp;|&nbsp;
              ⚠️ Smart Speaker critically low (5 units, avg 2/day) —
              order within 2 days. &nbsp;|&nbsp;
              📈 Revenue forecast: <strong>Rs.2.8L</strong> this month
              (+17% vs last month).
            </div>
          </div>
        </div>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-2 gap-5 mb-5">

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 
                        shadow-sm overflow-hidden">
          <div className="flex justify-between items-center 
                          px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-sm">
              Recent Orders
            </h2>
            <button className="text-xs text-blue-600 hover:underline">
              View all
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID','Customer','Amount',
                  'Status','Action'].map(h => (
                  <th key={h}
                    className="text-left px-4 py-2.5 text-xs 
                               text-gray-500 font-bold uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={order.id}
                  className={`border-t border-gray-50 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                  <td className="px-4 py-2.5 text-xs font-medium 
                                 text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {order.customer}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold 
                                 text-[#c8a84b]">
                    {order.amount}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 
                                     rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-xs text-blue-600 
                                       bg-blue-50 border border-blue-200 
                                       px-2 py-1 rounded 
                                       hover:bg-blue-100 flex items-center gap-1">
                      <Eye size={10} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-gray-200 
                        shadow-sm overflow-hidden">
          <div className="flex justify-between items-center 
                          px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-sm flex 
                           items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              Low Stock Alert
            </h2>
            <button className="text-xs text-blue-600 hover:underline">
              Manage stock
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Product','Category','Stock','Action'].map(h => (
                  <th key={h}
                    className="text-left px-4 py-2.5 text-xs 
                               text-gray-500 font-bold uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, i) => (
                <tr key={item.name}
                  className={`border-t border-gray-50 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                  <td className="px-4 py-2.5 text-xs font-medium 
                                 text-gray-700">
                    {item.name}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-bold ${
                      item.stock <= 4 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {item.stock} left
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-xs text-green-600 
                                       bg-green-50 border border-green-200 
                                       px-2 py-1 rounded 
                                       hover:bg-green-100">
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-2 gap-5">

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 
                        shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-sm">
              Top Selling Products
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Product','Units Sold','Revenue'].map(h => (
                  <th key={h}
                    className="text-left px-4 py-2.5 text-xs 
                               text-gray-500 font-bold uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.name}
                  className={`border-t border-gray-50 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                  <td className="px-4 py-2.5 text-xs font-medium 
                                 text-gray-700">
                    {p.name}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {p.units}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold 
                                 text-[#c8a84b]">
                    {p.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-gray-200 
                        shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-sm">
              Category Performance
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Category','Products','Orders','Revenue'].map(h => (
                  <th key={h}
                    className="text-left px-4 py-2.5 text-xs 
                               text-gray-500 font-bold uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryPerformance.map((cat, i) => (
                <tr key={cat.name}
                  className={`border-t border-gray-50 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                  <td className="px-4 py-2.5 text-xs font-medium 
                                 text-gray-700">
                    {cat.name}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {cat.products}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {cat.orders}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold 
                                 text-[#c8a84b]">
                    {cat.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}