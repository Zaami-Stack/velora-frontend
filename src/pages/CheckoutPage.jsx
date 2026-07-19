import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api";
import Layout from "../components/Layout";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, totalSavings, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "",
    address: "", city: "", zip: "", phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email format";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.zip.trim()) errs.zip = "ZIP code is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ productId: i.id, quantity: i.quantity, size: i.selectedSize, color: i.selectedColor }));
      const res = await api.orders.create(orderItems, form);
      setOrderId(res.order?.id || res.id || "ORD-" + Date.now());
      clearCart();
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout hideSideNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-2">Thank You!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your order has been placed successfully.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Order ID: {orderId}</p>
            <Link to="/" className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout hideSideNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Your bag is empty</p>
            <Link to="/" className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">Start Shopping</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const shipping = totalPrice >= 50 ? 0 : 9.99;

  return (
    <Layout hideSideNav>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-6 md:mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.name ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.address ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                <input name="city" value={form.city} onChange={handleChange} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.city ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">ZIP Code</label>
                <input name="zip" value={form.zip} onChange={handleChange} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.zip ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.phone ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.cartKey} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-12 h-[72px] object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `· Color selected`}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Savings</span>
                    <span className="font-medium">-${totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">${(totalPrice + shipping).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
