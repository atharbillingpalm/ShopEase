import { useEffect, useState } from "react";
import api from "../../shared/utils/api";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  deliveryAddress: string;
  city: string;
  state: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  trackingId: string;
  createdAt: string;
  itemCount: number;
  items: OrderItem[];
}

const STATUS_OPTIONS = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Placed:    "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped:   "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch]     = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading orders...
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders}
          className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
          Refresh
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or order number..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Update</th>
                <th className="px-4 py-3 text-left">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <>
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-gray-700">
                      {order.orderNumber || `#${order.id}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {expanded === order.id ? "Hide" : `View (${order.itemCount})`}
                      </button>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-items`}>
                      <td colSpan={8} className="px-6 py-3 bg-blue-50">
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          Items — {order.deliveryAddress}, {order.city}, {order.state}
                        </div>
                        <div className="flex flex-col gap-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs text-gray-700">
                              <span>{item.productName} × {item.quantity}</span>
                              <span>₹{item.totalPrice.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}