import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api";
import Layout from "../components/Layout";

const STATUS_STEPS = [
  { key: "pending", label: "Pending", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { key: "processing", label: "Processing", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
  )},
  { key: "shipped", label: "Shipped", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
  )},
  { key: "delivered", label: "Delivered", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
];

const STATUS_COLORS = {
  pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", ring: "ring-amber-400/30" },
  processing: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", ring: "ring-blue-400/30" },
  shipped: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-400", ring: "ring-indigo-400/30" },
  delivered: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", ring: "ring-emerald-400/30" },
  cancelled: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", ring: "ring-red-400/30" },
};

function StatusTracker({ status }) {
  const isCancelled = status === "cancelled";
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);
  const activeIndex = isCancelled ? -1 : currentIndex;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 rounded-full w-fit">
        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">Cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
      {STATUS_STEPS.map((step, i) => {
        const isActive = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600"
              } ${isCurrent ? "ring-2 ring-offset-1 ring-gray-900 dark:ring-white" : ""}`}>
                {step.icon}
              </div>
              <span className={`text-[9px] sm:text-[10px] mt-1 font-medium ${
                isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"
              }`}>{step.label}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 mx-0.5 sm:mx-1 mt-[-12px] sm:mt-[-14px] ${
                i < activeIndex ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-white/10"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AccountPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    let cancelled = false;
    async function load() {
      try {
        const data = await api.orders.list();
        if (!cancelled) setOrders(data.orders || data || []);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email format";
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      await api.auth.updateProfile(form);
      toast.success("Profile updated successfully");
      setEditing(false);
      setFormErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) errs.newPassword = "New password is required";
    else if (passwordForm.newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      await api.auth.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success("Password changed successfully");
      setChangingPassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFormErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  const handleCancelOrder = async (orderId) => {
    try {
      await api.orders.cancel(orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o));
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    }
  };

  return (
    <Layout hideSideNav>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-6 md:mb-10">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6">
              <div className="w-14 h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-lg font-bold mb-4">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 space-y-3">
                <Link to="/" className="block text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Shop</Link>
                <button onClick={() => { setEditing(!editing); setChangingPassword(false); setFormErrors({}); }} className="block text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">{editing ? "Cancel Edit" : "Edit Profile"}</button>
                <button onClick={() => { setChangingPassword(!changingPassword); setEditing(false); setFormErrors({}); }} className="block text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">{changingPassword ? "Cancel" : "Change Password"}</button>
                <button onClick={() => { logout(); navigate("/"); }} className="block text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Sign Out</button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {editing ? (
              <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Edit Profile</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${formErrors.name ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30"}`} />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${formErrors.email ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30"}`} />
                    {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:border-gray-400 dark:focus:border-white/30 focus:ring-1 focus:ring-gray-100 dark:focus:ring-white/10 transition-all" />
                  </div>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            ) : changingPassword ? (
              <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                    <input type="password" value={passwordForm.currentPassword} onChange={(e) => { setPasswordForm({ ...passwordForm, currentPassword: e.target.value }); if (formErrors.currentPassword) setFormErrors({ ...formErrors, currentPassword: "" }); }} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${formErrors.currentPassword ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30"}`} />
                    {formErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{formErrors.currentPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                    <input type="password" value={passwordForm.newPassword} onChange={(e) => { setPasswordForm({ ...passwordForm, newPassword: e.target.value }); if (formErrors.newPassword) setFormErrors({ ...formErrors, newPassword: "" }); }} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${formErrors.newPassword ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30"}`} />
                    {formErrors.newPassword && <p className="text-xs text-red-500 mt-1">{formErrors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                    <input type="password" value={passwordForm.confirmPassword} onChange={(e) => { setPasswordForm({ ...passwordForm, confirmPassword: e.target.value }); if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: "" }); }} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${formErrors.confirmPassword ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30"}`} />
                    {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>}
                  </div>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50">
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            ) : null}

            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Order History</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-50 dark:bg-white/5 rounded-sm animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-sm">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">No orders yet</p>
                <Link to="/" className="text-xs font-medium text-gray-900 dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  return (
                    <div key={order.id} className="border border-gray-100 dark:border-white/10 rounded-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(order.created_at || order.createdAt || order.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
                          {(order.status || "pending").charAt(0).toUpperCase() + (order.status || "pending").slice(1)}
                        </span>
                      </div>
                      <div className="mb-4">
                        <StatusTracker status={order.status || "pending"} />
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</p>
                          {order.status === "pending" && (
                            <button onClick={() => handleCancelOrder(order.id)} className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 underline underline-offset-4 transition-colors cursor-pointer">Cancel</button>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">${Number(order.total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
