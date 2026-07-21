import { useState, useEffect } from "react";
import { api } from "../../api";
import { useToast } from "../../context/ToastContext";

const statusTabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const statusColors = {
  pending: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20",
  processing: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20",
  shipped: "bg-indigo-400/10 text-indigo-400 ring-1 ring-indigo-400/20",
  delivered: "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20",
  cancelled: "bg-red-400/10 text-red-400 ring-1 ring-red-400/20",
};

const statusFlow = [
  { value: "pending", label: "Pending", color: "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 ring-1 ring-amber-400/20" },
  { value: "processing", label: "Processing", color: "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 ring-1 ring-blue-400/20" },
  { value: "shipped", label: "Shipped", color: "bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/20 ring-1 ring-indigo-400/20" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 ring-1 ring-emerald-400/20" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-400/10 text-red-400 hover:bg-red-400/20 ring-1 ring-red-400/20" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();

  const loadOrders = async (status) => {
    setLoading(true);
    try {
      const data = await api.admin.orders(status);
      setOrders(Array.isArray(data) ? data : data?.orders || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(activeTab);
  }, [activeTab]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.admin.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: updated.status } : o));
    } catch (err) {
      toast.error(err.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-sm text-gray-400 mt-1">Manage and fulfill your store's orders</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.value
                ? "bg-white text-gray-950"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 animate-pulse">
              <div className="flex gap-4">
                <div className="h-4 bg-white/5 rounded w-32" />
                <div className="h-4 bg-white/5 rounded w-24" />
                <div className="h-4 bg-white/5 rounded w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-20">
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={() => loadOrders(activeTab)} className="px-5 py-2 bg-white text-gray-950 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">Try Again</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">No orders found</p>
          <p className="text-xs text-gray-600 mt-1">Orders will appear here once customers start shopping</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
              <div
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{order.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px] sm:max-w-none">{order.customerName} &middot; <span className="hidden sm:inline">{order.customerEmail}</span><span className="sm:hidden">{order.customerEmail?.split("@")[0]}</span>{order.customerPhone && <span className="hidden sm:inline"> &middot; {order.customerPhone}</span>}</p>
                </div>
                <p className="text-xs text-gray-500 hidden sm:block">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</p>
                <p className="text-sm font-bold text-white">${Number(order.total).toFixed(2)}</p>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusColors[order.status] || "bg-gray-400/10 text-gray-400"}`}>
                  {order.status}
                </span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedOrder === order.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {expandedOrder === order.id && (
                <div className="px-6 pb-6 border-t border-white/5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                            <img src={item.image} alt={item.name} className="w-11 h-14 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium truncate">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} &middot; ${Number(item.price).toFixed(2)} each</p>
                            </div>
                            <p className="text-sm font-semibold text-white">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {statusFlow.map((s) => (
                            <button
                              key={s.value}
                              onClick={() => handleStatusUpdate(order.id, s.value)}
                              disabled={updatingId === order.id || order.status === s.value}
                              className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                                order.status === s.value
                                  ? "bg-white text-gray-950"
                                  : s.color
                              }`}
                            >
                              {updatingId === order.id ? "Saving..." : s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 && (
                        <div>
                          <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Info</h4>
                          <div className="p-3 rounded-xl bg-white/[0.02] text-sm text-gray-300 space-y-0.5">
                            {order.customerName && <p className="text-white font-medium">{order.customerName}</p>}
                            {order.customerEmail && <p className="text-gray-400">{order.customerEmail}</p>}
                            {order.customerPhone && <p className="text-gray-400">{order.customerPhone}</p>}
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Summary</h4>
                        <div className="p-3 rounded-xl bg-white/[0.02] space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="text-white">${Number(order.subtotal).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Shipping</span>
                            <span className="text-white">{Number(order.shipping) === 0 ? "Free" : `$${Number(order.shipping).toFixed(2)}`}</span>
                          </div>
                          <div className="border-t border-white/5 pt-2 flex justify-between text-sm">
                            <span className="text-white font-semibold">Total</span>
                            <span className="text-white font-bold">${Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
