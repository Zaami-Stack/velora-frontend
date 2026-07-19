import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import Layout from "../components/Layout";

const sizes = ["XS", "S", "M", "L", "XL"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const p = await api.products.get(id);
        if (!cancelled) {
          setProduct(p);
          if (p.colors && p.colors.length > 0) setSelectedColor(0);
          const res = await api.products.list({ category: p.category });
          if (!cancelled) setRelated(res.products.filter((r) => r.id !== p.id).slice(0, 4));
        }
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const liked = product ? isWishlisted(product.id) : false;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    const colorObj = product.colors?.[selectedColor];
    addItem({ ...product, selectedSize, selectedColor: colorObj?.hex || null, quantity, cartKey: `${product.id}-${selectedSize}-${selectedColor}` });
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = () => {
    toggle(product);
    toast[liked ? "info" : "success"](liked ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading) {
    return (
      <Layout hideSideNav>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 animate-pulse">
            <div className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-sm" />
            <div className="space-y-4 pt-8">
              <div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-1/4" />
              <div className="h-8 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
              <div className="h-6 bg-gray-100 dark:bg-white/5 rounded w-1/6" />
              <div className="h-20 bg-gray-100 dark:bg-white/5 rounded w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout hideSideNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">Product not found</p>
            <Link to="/" className="text-sm font-medium text-gray-900 dark:text-white underline underline-offset-4">Back to shop</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideSideNav>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav className="text-xs text-gray-400 dark:text-gray-500 mb-6 md:mb-8 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <div>
            <div className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-sm overflow-hidden mb-4">
              <img
                src={product.colors?.[selectedColor]?.image || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          <div className="lg:pt-4">
            <h1 className="text-2xl font-light text-gray-900 dark:text-white tracking-wide mb-2">{product.name}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{product.category}</p>

            <div className="flex items-center gap-3 mb-6">
              <span className={`text-xl font-semibold ${product.originalPrice ? "text-rose-600" : "text-gray-900 dark:text-white"}`}>${product.price}</span>
              {product.originalPrice && <span className="text-sm text-gray-400 dark:text-gray-500 line-through">${product.originalPrice}</span>}
            </div>

            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= Math.floor(product.rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{product.reviews} reviews</span>
              </div>
            )}

            {product.description && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{product.description}</p>}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Color</p>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${selectedColor === i ? "border-gray-900 dark:border-white scale-110" : "border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30"}`}
                      style={{ backgroundColor: color.hex }} />
                  ))}
                </div>
                {product.colors[selectedColor]?.image && (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">Showing {product.colors[selectedColor].hex} variant</p>
                )}
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 text-xs font-medium border rounded-sm transition-all cursor-pointer ${selectedSize === size ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white/30"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-gray-200 dark:border-white/10 rounded-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30 transition-colors cursor-pointer">-</button>
                <span className="text-sm font-medium w-8 text-center text-gray-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-gray-200 dark:border-white/10 rounded-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30 transition-colors cursor-pointer">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="flex-1 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer">Add to Bag</button>
              <button onClick={handleWishlist} className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-all cursor-pointer ${liked ? "border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10" : "border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30"}`}>
                <svg className={`w-5 h-5 ${liked ? "text-rose-500" : "text-gray-600 dark:text-gray-300"}`} fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12 md:mt-20">
            <h2 className="text-base md:text-lg font-light text-gray-900 dark:text-white tracking-wide mb-6 md:mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-8">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
