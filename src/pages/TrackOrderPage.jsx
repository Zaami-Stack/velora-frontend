import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../api";
import { formatPrice } from "../utils/currency";
import Layout from "../components/Layout";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default function TrackOrderPage() {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const data = await api.orders.track(orderId.trim());
      if (data && (data.id || data.status)) {
        setOrder(data);
      } else {
        setError(t("trackOrder.notFound"));
      }
    } catch (err) {
      setError(err.message || t("trackOrder.notFound"));
    } finally {
      setLoading(false);
    }
  };

  const activeIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <Layout hideSideNav>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-6 md:mb-10">{t("trackOrder.title")}</h1>

        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <input
            type="text"
            value={orderId}
            onChange={(e) => { setOrderId(e.target.value); if (error) setError(""); }}
            placeholder={t("trackOrder.placeholder")}
            className="flex-1 px-4 py-3 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-sm focus:outline-none focus:border-gray-400 dark:focus:border-white/30 focus:ring-1 focus:ring-gray-100 dark:focus:ring-white/10 transition-all"
          />
          <button type="submit" disabled={loading || !orderId.trim()} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? t("trackOrder.tracking") : t("trackOrder.track")}
          </button>
        </form>

        {error && (
          <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-sm">
            <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <Link to="/" className="text-xs font-medium text-gray-900 dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t("common.startShopping")}</Link>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t("trackOrder.orderId")}: {order.id}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(order.created_at || order.createdAt || order.date).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ring-1 ${isCancelled ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 ring-red-400/30" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-400/30"}`}>
                  {isCancelled ? t("trackOrder.status.cancelled") : t(`trackOrder.status.${order.status}`)}
                </span>
              </div>

              {isCancelled ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 rounded-full w-fit">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">{t("trackOrder.status.cancelled")}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, i) => {
                    const isActive = i <= activeIndex;
                    const isCurrent = i === activeIndex;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                              : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600"
                          } ${isCurrent ? "ring-2 ring-offset-1 ring-gray-900 dark:ring-white" : ""}`}>
                            {i === 0 && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                            {i === 1 && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                            )}
                            {i === 2 && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                            )}
                            {i === 3 && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                          </div>
                          <span className={`text-[10px] mt-1.5 font-medium text-center ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"}`}>
                            {t(`trackOrder.timeline.${step}`)}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`w-full h-0.5 mt-[-14px] ${i < activeIndex ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-white/10"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("trackOrder.orderItems")}</h2>
              <div className="space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0 first:pt-0">
                    <img src={item.image || item.imageUrl} alt={item.name || item.productName} className="w-12 h-[72px] object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name || item.productName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("trackOrder.qty", { count: item.quantity })}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("trackOrder.summary")}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("trackOrder.subtotal")}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t("trackOrder.shipping")}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.shipping === 0 ? t("common.free") : formatPrice(order.shipping || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>{t("trackOrder.discount")}</span>
                    <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t("common.total")}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(order.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!order && !error && !loading && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-sm text-gray-400 dark:text-gray-500">{t("trackOrder.enterOrderId")}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
