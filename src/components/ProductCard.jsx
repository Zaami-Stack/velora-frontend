import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import { formatPrice } from "../utils/currency";

const quickSizes = ["XS", "S", "M", "L"];

export default function ProductCard({ product, variant = "default" }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const toast = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const liked = isWishlisted(product.id);
  const [quickSize, setQuickSize] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);

  const displayImage = hoveredColor?.image || product.image;

  const handleAddToCart = (e, size) => {
    e.stopPropagation();
    const s = size || quickSize || "M";
    const colorIdx = hoveredColor ? product.colors.findIndex((c) => (typeof c === "string" ? c : c.hex) === hoveredColor.hex) : 0;
    const colorHex = hoveredColor?.hex || product.colors?.[0]?.hex || (typeof product.colors?.[0] === "string" ? product.colors[0] : null) || null;
    addItem({ ...product, selectedSize: s, selectedColor: colorHex, cartKey: `${product.id}-${s}-${colorIdx >= 0 ? colorIdx : 0}` });
    toast.success(t("product.addedToBag", { name: `${product.name} (${s})` }));
    setQuickSize(null);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggle(product);
    toast[liked ? "info" : "success"](liked ? t("product.removedFromWishlistName", { name: product.name }) : t("product.addedToWishlistName", { name: product.name }));
  };

  if (variant === "hero") {
    return (
      <div className="group relative cursor-pointer col-span-2 aspect-[16/7] bg-gray-900 dark:bg-white/5 overflow-hidden rounded-sm" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          {product.badge && (
            <span className={`self-start px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm mb-4 ${product.badge === "Sale" ? "bg-rose-600 text-white animate-badge-pulse" : "bg-white text-gray-900"}`}>
              {product.badge}
            </span>
          )}
          <h3 className="text-2xl md:text-3xl font-light text-white tracking-wide mb-2">{product.name}</h3>
          <p className="text-sm text-white/60 mb-4 max-w-md">{product.description || product.category}</p>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg font-semibold text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-sm text-white/40 line-through">{formatPrice(product.originalPrice)}</span>}
          </div>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="self-start px-8 py-3 bg-white text-gray-900 text-xs font-semibold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            {t("product.shopNow")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setQuickSize(null)}
      onMouseLeave={() => { setQuickSize(null); setHoveredColor(null); }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-sm">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0">
          <button onClick={handleWishlist} className="w-9 h-9 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all cursor-pointer">
            <svg className={`w-4 h-4 transition-colors ${liked ? "text-rose-500" : "text-gray-600 dark:text-gray-300"}`} fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
          {quickSize ? (
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-sm shadow-lg p-2 space-y-2">
              <div className="flex gap-1.5 justify-center">
                {quickSizes.map((s) => (
                  <button key={s} onClick={(e) => handleAddToCart(e, s)}
                    className="px-2.5 py-1.5 text-[10px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-sm hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white transition-all cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
               <button onClick={(e) => { e.stopPropagation(); setQuickSize(null); }} className="w-full text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">{t("common.cancel")}</button>
            </div>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); setQuickSize(true); }} className="w-full py-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold rounded-sm hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2">
               <span>{t("product.quickAdd")}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
          )}
        </div>

        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${product.badge === "Sale" ? "bg-rose-600 text-white animate-badge-pulse" : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"}`}>
            {product.badge}
          </span>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{product.name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider">{product.category}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {product.originalPrice && <span className="text-xs text-gray-400 dark:text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>}
            <span className={`text-sm font-semibold ${product.originalPrice ? "text-rose-600" : "text-gray-900 dark:text-white"}`}>{formatPrice(product.price)}</span>
          </div>
        </div>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-3 h-3 ${star <= Math.floor(product.rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">({product.reviews})</span>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((color, i) => {
              const hex = typeof color === "string" ? color : color.hex;
              const image = typeof color === "string" ? null : color.image;
              return (
                <span
                  key={i}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    if (image) setHoveredColor({ hex, image });
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setHoveredColor(null);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${hoveredColor?.hex === hex ? "border-gray-900 dark:border-white scale-125 ring-1 ring-gray-900/30 dark:ring-white/30" : "border-gray-200 dark:border-white/10 hover:scale-125"}`}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
            {product.colors.length > 4 && <span className="text-[11px] text-gray-400 dark:text-gray-500">+{product.colors.length - 4}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
