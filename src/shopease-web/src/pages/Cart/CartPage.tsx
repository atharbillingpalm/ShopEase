import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, Tag } from 'lucide-react'
import { useCartStore } from '../../features/cart/cartStore'
import api from '../../shared/utils/api'

const paymentMethods = [
  { id:'upi',  label:'UPI — GPay, PhonePe, Paytm, BHIM' },
  { id:'card', label:'Credit / Debit Card' },
  { id:'net',  label:'Net Banking' },
  { id:'cod',  label:'Cash on Delivery (COD)' },
]

export default function CartPage() {
  const { items, removeItem, updateQuantity, 
          totalPrice, clearCart } = useCartStore()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [payment, setPayment] = useState('upi')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pin, setPin] = useState('')
  const navigate = useNavigate()

  const subtotal = totalPrice()
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const gst = Math.round((subtotal - discount) * 0.18)
  const total = subtotal - discount + gst

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'SHOP10') {
      setCouponApplied(true)
    } else {
      alert('Invalid coupon code. Try SHOP10')
    }
  }

  const handlePlaceOrder = async () => {
  if (!name || !mobile || !address || !city || !pin) {
    alert('Please fill all required delivery details')
    return
  }

  try {
    const orderPayload = {
      customerName:    name,
      customerEmail:   'customer@shopease.com',
      customerMobile:  mobile,
      deliveryAddress: address + (address2 ? ', ' + address2 : ''),
      city,
      state,
      pinCode: pin,
      paymentMethod: payment,
      couponCode: couponApplied ? 'SHOP10' : '',
      items: items.map(i => ({
        productId:      Number(i.product.id),
        productName:    i.product.name,
        selectedColour: i.selectedColour,
        quantity:       i.quantity,
        unitPrice:      i.product.price,
      }))
    }

    const res = await api.post('/orders', orderPayload)
    clearCart()
    navigate(`/orders?orderId=${res.data.id}`)
  } catch (error) {
    alert('Could not place order. Please check API is running.')
  }
}

  if (items.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center 
                      justify-center">
        <div className="bg-white rounded-xl p-12 text-center 
                        shadow-sm max-w-md">
          <ShoppingBag size={64} className="text-gray-300 mx-auto 
                                            mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Add items to your cart to see them here
          </p>
          <Link to="/products"
            className="bg-[#f0c040] text-[#1a1a2e] font-bold 
                       px-8 py-3 rounded-lg hover:bg-[#d4a832]">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen p-3">

      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-3">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <span className="text-gray-700">Shopping Cart</span>
        <span className="ml-2 font-medium text-gray-800">
          ({items.length} items)
        </span>
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* Left Column */}
        <div className="col-span-8 flex flex-col gap-4">

          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-bold text-gray-800 text-base 
                           mb-4 pb-3 border-b border-gray-200">
              Cart Items
            </h2>
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={item.product.id}
                  className="grid grid-cols-12 gap-3 
                             pb-4 border-b border-gray-100 
                             last:border-0 last:pb-0">

                  {/* Image */}
                  <div className="col-span-2 bg-gray-100 rounded-lg 
                                  flex items-center justify-center 
                                  text-3xl h-20">
                    📦
                  </div>

                  {/* Details */}
                  <div className="col-span-7">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-medium text-sm text-gray-800 
                                 hover:text-blue-600 line-clamp-2">
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Colour: {item.selectedColour} &nbsp;|&nbsp;
                      SKU: WC-{item.product.id.padStart(3,'0')}
                    </div>
                    <div className="text-xs text-green-600 mt-0.5">
                      In Stock
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex border border-gray-300 
                                      rounded overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )}
                          className="px-2 py-1 bg-gray-50 
                                     hover:bg-gray-100 text-gray-700"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 text-sm 
                                         font-bold text-gray-800 
                                         border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )}
                          className="px-2 py-1 bg-gray-50 
                                     hover:bg-gray-100 text-gray-700"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-400 hover:text-red-600 
                                   flex items-center gap-1 text-xs"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                      <button className="text-blue-500 
                                         hover:text-blue-700 text-xs">
                        Save for Later
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-3 text-right">
                    <div className="font-bold text-base 
                                    text-[#c8a84b]">
                      ₹{(item.product.price * 
                          item.quantity).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      ₹{item.product.price.toLocaleString()} x{' '}
                      {item.quantity}
                    </div>
                    {item.product.mrp > item.product.price && (
                      <div className="text-xs text-green-600 mt-0.5">
                        Saved ₹{(
                          (item.product.mrp - item.product.price) *
                          item.quantity
                        ).toLocaleString()}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-bold text-gray-800 text-base 
                           mb-4 pb-3 border-b border-gray-200">
              Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  Full Name *
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  Mobile Number *
                </label>
                <input
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  Address Line 1 *
                </label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House no., Building, Street"
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  Address Line 2 (Landmark / Area)
                </label>
                <input
                  value={address2}
                  onChange={e => setAddress2(e.target.value)}
                  placeholder="Nearby landmark, area"
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  City *
                </label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400 bg-white"
                >
                  <option value="">Select State</option>
                  {['Delhi','Uttar Pradesh','Haryana',
                    'Maharashtra','Karnataka','Tamil Nadu',
                    'West Bengal','Gujarat','Rajasthan',
                    'Punjab'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 
                                  block mb-1">
                  PIN Code *
                </label>
                <input
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="110001"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-bold text-gray-800 text-base 
                           mb-4 pb-3 border-b border-gray-200">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              {paymentMethods.map(pm => (
                <label key={pm.id}
                  className={`flex items-center gap-3 p-3 
                             border rounded-lg cursor-pointer 
                             transition-all ${
                    payment === pm.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={payment === pm.id}
                    onChange={() => setPayment(pm.id)}
                    className="accent-[#f0c040]"
                  />
                  <span className="text-sm text-gray-700">
                    {pm.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column — Order Summary */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-4 
                          sticky top-32">
            <h2 className="font-bold text-gray-800 text-base 
                           mb-4 pb-3 border-b border-gray-200">
              Order Summary
            </h2>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Items ({items.length})
                </span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    Coupon SHOP10
                  </span>
                  <span className="text-green-600">
                    −₹{discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600 font-medium">
                  FREE
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GST (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 
                                block mb-1">
                Coupon / Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={couponApplied}
                  className="flex-1 border border-gray-300 rounded 
                             px-3 py-2 text-sm outline-none 
                             focus:border-blue-400 disabled:bg-gray-50"
                />
                {couponApplied ? (
                  <button
                    onClick={() => {
                      setCouponApplied(false)
                      setCoupon('')
                    }}
                    className="px-3 py-2 bg-red-50 text-red-500 
                               border border-red-200 rounded 
                               text-xs font-medium">
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-blue-50 text-blue-600 
                               border border-blue-200 rounded 
                               text-xs font-medium hover:bg-blue-100">
                    Apply
                  </button>
                )}
              </div>
              {!couponApplied && (
                <div className="flex items-center gap-1 mt-1">
                  <Tag size={10} className="text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Try: SHOP10 for 10% off
                  </span>
                </div>
              )}
              {couponApplied && (
                <div className="text-xs text-green-600 mt-1 
                                font-medium">
                  ✅ Coupon applied! You save 
                  ₹{discount.toLocaleString()}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  Total Amount
                </span>
                <span className="font-bold text-xl text-[#c8a84b]">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              {couponApplied && (
                <div className="text-xs text-green-600 
                                text-right mt-1">
                  You saved ₹{(discount).toLocaleString()} 
                  on this order
                </div>
              )}
            </div>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#f0c040] text-[#1a1a2e] 
                         font-bold py-3 rounded-lg text-sm 
                         hover:bg-[#d4a832] mb-3">
              Place Order — ₹{total.toLocaleString()}
            </button>

            <div className="text-xs text-gray-400 text-center mb-3">
              By placing order you agree to our Terms of Service
            </div>

            <div className="bg-green-50 border border-green-200 
                            rounded-lg p-2.5 text-xs text-green-700 
                            text-center">
              🔒 100% Secure Payment &nbsp;|&nbsp; 
              All data encrypted
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}