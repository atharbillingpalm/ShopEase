import { useEffect, useState } from "react";
import api from "../../shared/utils/api";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: string;
  itemCount: number;
  items: OrderItem[];
}

const STATUS_OPTIONS = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Pending:   "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped:   "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "stats">("stats");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders"),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">ShopEase management panel</p>
        </div>
        <button
          onClick={fetchData}
          className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total Orders",   value: stats.totalOrders,   icon: "📦", color: "bg-blue-50 text-blue-700" },
              { label: "New Orders", value: stats.pendingOrders,  icon: "⏳", color: "bg-yellow-50 text-yellow-700" },
              { label: "Products",       value: stats.totalProducts,  icon: "🛍️", color: "bg-purple-50 text-purple-700" },
              { label: "Users",          value: stats.totalUsers,     icon: "👥", color: "bg-green-50 text-green-700" },
              {
                label: "Revenue",
                value: `₹${stats.totalRevenue.toLocaleString()}`,
                icon: "💰",
                color: "bg-orange-50 text-orange-700",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} rounded-xl p-4 flex flex-col gap-1`}
              >
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs font-medium opacity-75">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">
              All Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-gray-700">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="flex flex-col gap-0.5">
                          {order.items.map((item, i) => (
                            <span key={i} className="text-xs">
                              {item.productName} × {item.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updating === order.id && (
                          <span className="ml-2 text-xs text-gray-400">Saving...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}