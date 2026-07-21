import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import Layout from "../components/Layout";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();
  const { t } = useLanguage();

  const addAllToBag = () => {
    items.forEach((item) => {
      addItem({ ...item, selectedSize: "M", selectedColor: item.colors?.[0]?.hex || item.colors?.[0] || null, cartKey: `${item.id}-M-0` });
      toggle(item);
    });
    toast.success(t("wishlist.allItemsAdded"));
  };

  return (
    <Layout hideSideNav>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-10 gap-3">
          <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wide">{t("wishlist.wishlistTitle", { count: items.length })}</h1>
          {items.length > 0 && (
            <button onClick={addAllToBag} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] sm:text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
              {t("wishlist.addAllToBag")}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">{t("wishlist.empty")}</p>
            <Link to="/" className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              {t("wishlist.browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-8">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <Link to={`/product/${item.id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                </Link>
                <div className="mt-3 px-0.5">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate hover:underline">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">${item.price}</span>
                    {item.originalPrice && <span className="text-xs text-gray-400 dark:text-gray-500 line-through">${item.originalPrice}</span>}
                  </div>
                  <button onClick={() => { toggle(item); toast.info(t("product.removedFromWishlist")); }}
                    className="mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer">
                    {t("wishlist.remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
