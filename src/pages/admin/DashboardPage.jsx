import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await api.admin.dashboard();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="h-7 w-40 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5 animate-pulse">
              <div className="h-3 bg-white/5 rounded w-20 mb-4" />
              <div className="h-7 bg-white/5 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl border border-white/5 animate-pulse">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
            <div className="h-4 bg-white/5 rounded w-32" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 border-b border-white/5 last:border-0" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-white text-gray-950 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">Try Again</button>
      </div>
    );
  }

  const stats = [
    { label: "Total Orders", value: data?.totalOrders || 0, color: "from-blue-500 to-cyan-400", bg: "bg-blue-500/10", icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
    )},
    { label: "Revenue", value: `$${(data?.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "from-emerald-500 to-teal-400", bg: "bg-emerald-500/10", icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: "Customers", value: data?.totalUsers || 0, color: "from-violet-500 to-purple-400", bg: "bg-violet-500/10", icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
    )},
    { label: "Pending Orders", value: data?.pendingOrders || 0, color: "from-amber-500 to-orange-400", bg: "bg-amber-500/10", icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
  ];

  const statusColors = {
    pending: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20",
    processing: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20",
    shipped: "bg-indigo-400/10 text-indigo-400 ring-1 ring-indigo-400/20",
    delivered: "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20",
    cancelled: "bg-red-400/10 text-red-400 ring-1 ring-red-400/20",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Welcome back. Here's what's happening with your store.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/[0.03] hover:bg-white/[0.05] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5 transition-colors group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</span>
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${s.bg} flex items-center justify-center`}>
                {s.icon}
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-white">Recent Orders</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Latest transactions</p>
          </div>
          <button onClick={() => navigate("/admin/orders")} className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/5">View All</button>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Order</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Items</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-500">No orders yet</td></tr>
              ) : data?.recentOrders?.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate("/admin/orders")}>
                  <td className="px-6 py-3.5 text-sm font-medium text-white">{order.id}</td>
                  <td className="px-6 py-3.5">
                    <p className="text-sm text-gray-300">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-white">${Number(order.total).toFixed(2)}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusColors[order.status] || "bg-gray-400/10 text-gray-400"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-400">{order.items?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-white/5">
          {data?.recentOrders?.length === 0 ? (
            <p className="px-4 py-12 text-center text-xs text-gray-500">No orders yet</p>
          ) : data?.recentOrders?.map((order) => (
            <div key={order.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate("/admin/orders")}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-white">#{order.id}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusColors[order.status] || "bg-gray-400/10 text-gray-400"}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-gray-300 truncate">{order.customerName}</p>
                  <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-xs font-semibold text-white">${Number(order.total).toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500">{order.items?.length || 0} items</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
