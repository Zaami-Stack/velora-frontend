import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import Layout from "../components/Layout";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, totalSavings, totalDelivery } = useCart();
  const { t } = useLanguage();

  return (
    <Layout hideSideNav>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-6 md:mb-10">{t("cart.shoppingBag", { count: totalItems })}</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">{t("cart.bagEmpty")}</p>
            <Link to="/" className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              {t("common.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {items.map((item) => (
                  <div key={item.cartKey} className="flex gap-3 sm:gap-6 py-5 sm:py-6 first:pt-0 last:pb-0">
                    <Link to={`/product/${item.id}`} className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-26 sm:w-24 sm:h-32 object-cover rounded-sm" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:underline">{item.name}</Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.category}</p>
                          {item.selectedSize && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("cart.size", { size: item.selectedSize })}</p>}
                          {item.selectedColor && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("cart.color")} <span className="inline-block w-3 h-3 rounded-full border border-gray-200 dark:border-white/10 align-middle ml-1" style={{ backgroundColor: item.selectedColor }} /></p>}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="w-8 h-8 border border-gray-200 dark:border-white/10 rounded-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30 text-xs transition-colors cursor-pointer">{t("common.decrement")}</button>
                          <span className="text-sm font-medium w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="w-8 h-8 border border-gray-200 dark:border-white/10 rounded-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30 text-xs transition-colors cursor-pointer">{t("common.increment")}</button>
                        </div>
                        <button onClick={() => removeItem(item.cartKey)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer">{t("cart.remove")}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                <Link to="/" className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-4 transition-colors">
                  {t("common.continueShopping")}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-white/5 rounded-sm p-6 sticky top-24">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-6">{t("cart.orderSummary")}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t("cart.subtotalItems", { count: totalItems })}</span>
                    <span className="font-medium text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>{t("common.savings")}</span>
                      <span className="font-medium">-${totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t("common.shipping")}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{totalDelivery === 0 ? t("common.free") : `$${totalDelivery.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{t("common.total")}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">${(totalPrice + totalDelivery).toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="block w-full py-3.5 mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium tracking-wide text-center rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  {t("cart.proceedToCheckout")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
