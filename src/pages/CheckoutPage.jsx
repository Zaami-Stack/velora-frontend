import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../api";
import { formatPrice } from "../utils/currency";
import Layout from "../components/Layout";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, totalSavings, totalDelivery, clearCart } = useCart();
  const toast = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("checkout.fullNameRequired");
    if (!form.email) errs.email = t("common.emailRequired");
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = t("common.invalidEmail");
    if (!form.phone.trim()) errs.phone = t("checkout.phoneRequired");
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
      const shippingAddress = {
        firstName: form.name.trim().split(" ")[0] || form.name.trim(),
        lastName: form.name.trim().split(" ").slice(1).join(" ") || "",
        email: form.email,
        phone: form.phone.trim(),
      };
      const res = await api.orders.create(orderItems, shippingAddress);
      setOrderId(res.id);
      clearCart();
      setOrderPlaced(true);
      toast.success(t("checkout.orderSuccess"));
    } catch (err) {
      toast.error(err.message || t("checkout.orderFailed"));
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
            <h1 className="text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-2">{t("checkout.thankYou")}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("checkout.orderConfirmed")}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">{t("checkout.orderId", { id: orderId })}</p>
            <Link to="/" className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              {t("common.continueShopping")}
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
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">{t("checkout.bagEmpty")}</p>
            <Link to="/" className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">{t("checkout.startShopping")}</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideSideNav>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-6 md:mb-10">{t("checkout.checkout")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t("checkout.contactInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("checkout.fullName")}</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} placeholder={t("checkout.johnDoe")} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.name ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("checkout.phone")}</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder={t("checkout.phonePlaceholder")} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.phone ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("checkout.email")}</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder={t("checkout.emailPlaceholder")} className={`w-full px-4 py-3 text-sm border bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-sm focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-red-400 focus:ring-red-500" : "border-gray-200 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:ring-gray-100 dark:focus:ring-white/10"}`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="pt-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("checkout.orderItems")}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.cartKey} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-12 h-[72px] object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.selectedSize && t("checkout.size", { size: item.selectedSize })} {item.selectedColor && `· ${t("checkout.colorSelected")}`}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{t("checkout.qty", { count: item.quantity })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}
            </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-6">{t("checkout.summary")}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("checkout.subtotalItems", { count: totalItems })}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>{t("common.savings")}</span>
                    <span className="font-medium">-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("common.shipping")}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalDelivery === 0 ? t("common.free") : formatPrice(totalDelivery)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t("common.total")}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice + totalDelivery)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
