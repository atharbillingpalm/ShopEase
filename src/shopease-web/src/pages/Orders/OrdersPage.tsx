import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Package, Truck, CheckCircle,
  Clock, XCircle, Download,
  RotateCcw, Star
} from 'lucide-react'
import { useOrders } from '../../features/orders/orderQueries'
import type { ApiOrder } from '../../features/orders/orderQueries'

// ── Status configuration ─────────────────────
type OrderStatus =
  | 'Placed' | 'Confirmed' | 'Packed'
  | 'InTransit' | 'Delivered' | 'Cancelled'

const statusConfig: Record<OrderStatus, {
  label: string
  bg: string
  icon: any
}> = {
  Placed:    { label:'Order Placed',  bg:'bg-blue-50 text-blue-700',    icon: Clock        },
  Confirmed: { label:'Confirmed',     bg:'bg-yellow-50 text-yellow-700', icon: CheckCircle  },
  Packed:    { label:'Packed',        bg:'bg-purple-50 text-purple-700', icon: Package      },
  InTransit: { label:'In Transit',    bg:'bg-orange-50 text-orange-700', icon: Truck        },
  Delivered: { label:'Delivered',     bg:'bg-green-50 text-green-700',   icon: CheckCircle  },
  Cancelled: { label:'Cancelled',     bg:'bg-red-50 text-red-700',       icon: XCircle      },
}

const steps: OrderStatus[] = [
  'Placed', 'Confirmed', 'Packed', 'InTransit', 'Delivered'
]

// ── Format date ───────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

export default function OrdersPage() {
  const [searchParams]    = useSearchParams()
  const newOrderId        = searchParams.get('orderId')
  const [selectedId, setSelectedId] = useState<number | null>(
    newOrderId ? Number(newOrderId) : null
  )

  // ── Fetch real orders from API ────────────
  const { data: orders = [], isLoading, isError } = useOrders()

  // ── Loading ───────────────────────────────
  if (isLoading) return (
    <div className="bg-gray-100 min-h-screen flex 
                    items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#f0c040] 
                        border-t-transparent rounded-full 
                        animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">
          Loading your orders...
        </p>
      </div>
    </div>
  )

  // ── Error ─────────────────────────────────
  if (isError) return (
    <div className="bg-gray-100 min-h-screen flex 
                    items-center justify-center">
      <div className="bg-white rounded-xl p-10 text-center 
                      border border-gray-200">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-red-600 font-medium mb-2">
          Could not load orders
        </p>
        <p className="text-gray-400 text-sm">
          Make sure the API is running at localhost:7158
        </p>
      </div>
    </div>
  )

  // ── No orders yet ─────────────────────────
  if (orders.length === 0) return (
    <div className="bg-gray-100 min-h-screen flex 
                    items-center justify-center">
      <div className="bg-white rounded-xl p-12 text-center 
                      border border-gray-200">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Place your first order to see it here
        </p>
        <Link to="/products"
          className="bg-[#f0c040] text-[#1a1a2e] font-bold 
                     px-8 py-3 rounded-lg hover:bg-[#d4a832]">
          Start Shopping
        </Link>
      </div>
    </div>
  )

  // ── Selected order ────────────────────────
  const selectedOrder: ApiOrder =
    orders.find(o => o.id === selectedId) || orders[0]

  const status      = (selectedOrder.status as OrderStatus)
  const cfg         = statusConfig[status] ?? statusConfig['Placed']
  const currentStep = steps.indexOf(status)

  return (
    <div className="bg-gray-100 min-h-screen p-3">

      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-3">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <span className="text-gray-700">My Orders</span>
        <span className="ml-2 font-medium text-gray-800">
          ({orders.length} order{orders.length !== 1 ? 's' : ''})
        </span>
      </div>

      {/* New order success banner */}
      {newOrderId && (
        <div className="bg-green-50 border border-green-200 
                        rounded-xl px-5 py-3 mb-4 flex 
                        items-center gap-3">
          <CheckCircle size={18} className="text-green-600 
                                            flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-700">
              Order placed successfully!
            </p>
            <p className="text-xs text-gray-500">
              Order #{selectedOrder.orderNumber} has been received.
              You will get a confirmation email shortly.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">

        {/* Left — Order List */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-bold text-gray-800 text-base 
                           mb-4 pb-3 border-b border-gray-200">
              Order History
            </h2>
            <div className="flex flex-col gap-3">
              {orders.map(order => {
                const sCfg = statusConfig[
                  order.status as OrderStatus
                ] ?? statusConfig['Placed']
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    className={`border rounded-lg p-3 
                               cursor-pointer transition-all ${
                      selectedOrder.id === order.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between 
                                    items-start mb-1">
                      <div className="font-bold text-xs 
                                      text-gray-800">
                        #{order.orderNumber}
                      </div>
                      <span className={`text-xs font-bold 
                                       px-2 py-0.5 rounded-full 
                                       ${sCfg.bg}`}>
                        {sCfg.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      {formatDate(order.createdAt)} &nbsp;|&nbsp;
                      {order.items.length} item(s)
                    </div>
                    <div className="text-xs text-gray-600 
                                    mb-2 line-clamp-1">
                      {order.items.map(i => i.productName).join(', ')}
                    </div>
                    <div className="font-bold text-sm 
                                    text-[#c8a84b]">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right — Order Detail */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">

            {/* Header */}
            <div className="flex justify-between items-center 
                            mb-4 pb-3 border-b border-gray-200">
              <div>
                <h2 className="font-bold text-gray-800 text-base">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 
                               rounded-full ${cfg.bg}`}>
                {cfg.label}
              </span>
            </div>

            {/* Tracking Steps */}
            {status !== 'Cancelled' && (
              <div className="mb-6">
                <div className="flex items-center 
                                justify-between relative">

                  {/* Progress line */}
                  <div className="absolute top-4 left-0 
                                  right-0 h-0.5 bg-gray-200 z-0">
                    <div
                      className="h-full bg-green-400 transition-all"
                      style={{
                        width: `${Math.max(0,
                          (currentStep / (steps.length - 1)) * 100
                        )}%`
                      }}
                    />
                  </div>

                  {steps.map((step, i) => {
                    const done   = i <= currentStep
                    const active = i === currentStep
                    return (
                      <div key={step}
                        className="flex flex-col items-center 
                                   z-10 flex-1">
                        <div className={`w-8 h-8 rounded-full 
                                        flex items-center 
                                        justify-center mb-1 
                                        border-2 ${
                          done
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'
                        } ${active
                            ? 'ring-2 ring-green-200'
                            : ''}`}>
                          {done ? (
                            <CheckCircle size={16}
                              className="text-white" />
                          ) : (
                            <span className="text-xs text-gray-400">
                              {i + 1}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs text-center 
                                         leading-tight ${
                          active
                            ? 'text-green-600 font-bold'
                            : done
                              ? 'text-gray-600'
                              : 'text-gray-400'
                        }`}>
                          {statusConfig[step].label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Tracking info */}
                {status === 'InTransit' && (
                  <div className="mt-4 bg-orange-50 border 
                                  border-orange-200 rounded-lg 
                                  p-3 text-sm">
                    <div className="font-bold text-orange-700 mb-1">
                      <Truck size={14}
                        className="inline mr-1 mb-0.5" />
                      In Transit — Delhi Sorting Hub
                    </div>
                    <div className="text-xs text-gray-500">
                      Expected delivery: Tomorrow
                      {selectedOrder.trackingId &&
                        ` | Tracking: ${selectedOrder.trackingId}`}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cancelled */}
            {status === 'Cancelled' && (
              <div className="mb-4 bg-red-50 border 
                              border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 
                                text-red-600 font-bold 
                                text-sm mb-1">
                  <XCircle size={16} />
                  Order Cancelled
                </div>
                <div className="text-xs text-gray-500">
                  Refund will be processed within 5-7 business days
                </div>
              </div>
            )}

            {/* Order Items Table */}
            <div className="mb-4">
              <div className="font-bold text-sm text-gray-700 mb-3">
                Order Items
              </div>
              <div className="border border-gray-200 rounded-lg 
                              overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Product','Colour','Qty','Price'].map(h => (
                        <th key={h}
                          className="text-left px-4 py-2 text-xs 
                                     text-gray-500 font-bold uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={item.id}
                        className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-700 
                                       text-xs">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 text-gray-500 
                                       text-xs">
                          {item.selectedColour || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 
                                       text-xs text-center">
                          x{item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right 
                                       font-medium text-[#c8a84b] 
                                       text-xs">
                          ₹{item.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Summary + Delivery Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">

              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-bold text-xs text-gray-500 
                                uppercase mb-3">
                  Price Breakdown
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{selectedOrder.subTotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">
                        Coupon ({selectedOrder.couponCode})
                      </span>
                      <span className="text-green-600">
                        −₹{selectedOrder.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST (18%)</span>
                    <span>₹{selectedOrder.gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold 
                                  border-t border-gray-200 pt-1.5 mt-1">
                    <span className="text-gray-800">Total</span>
                    <span className="text-[#c8a84b] text-sm">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery + payment */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-bold text-xs text-gray-500 
                                uppercase mb-3">
                  Delivery & Payment
                </div>
                <div className="text-xs text-gray-600 
                                leading-relaxed">
                  <p className="mb-1">
                    <span className="font-medium">Name: </span>
                    {selectedOrder.customerName}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Address: </span>
                    {selectedOrder.deliveryAddress},
                    {selectedOrder.city} — {selectedOrder.pinCode}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Mobile: </span>
                    {selectedOrder.customerMobile}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Payment: </span>
                    {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Status: </span>
                    <span className="text-green-600 font-medium">
                      {selectedOrder.paymentStatus} ✅
                    </span>
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t 
                            border-gray-200">
              <button
                className="flex items-center gap-2 px-4 py-2 
                           bg-blue-50 text-blue-600 border 
                           border-blue-200 rounded-lg text-sm 
                           font-medium hover:bg-blue-100">
                <Download size={14} />
                Download Invoice
              </button>

              {status !== 'Cancelled' &&
               status !== 'Delivered' && (
                <button
                  className="flex items-center gap-2 px-4 py-2 
                             bg-red-50 text-red-500 border 
                             border-red-200 rounded-lg text-sm 
                             font-medium hover:bg-red-100">
                  <XCircle size={14} />
                  Cancel Order
                </button>
              )}

              {status === 'Delivered' && (
                <>
                  <button
                    className="flex items-center gap-2 px-4 py-2 
                               bg-yellow-50 text-yellow-600 border 
                               border-yellow-200 rounded-lg text-sm 
                               font-medium hover:bg-yellow-100">
                    <Star size={14} />
                    Rate Product
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 
                               bg-gray-50 text-gray-600 border 
                               border-gray-200 rounded-lg text-sm 
                               font-medium hover:bg-gray-100">
                    <RotateCcw size={14} />
                    Return / Replace
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}