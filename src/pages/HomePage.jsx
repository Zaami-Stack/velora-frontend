import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import ProductCard from "../components/ProductCard";
import Logo from "../components/Logo";
import Carousel from "../components/Carousel";
import { api } from "../api";

const sortMap = { "Featured": "", "Newest": "newest", "Price: Low to High": "price_asc", "Price: High to Low": "price_desc" };
const sortOptions = Object.keys(sortMap);
const allCategories = ["All", "New In", "Dresses", "Tops", "Pants", "Knitwear", "Shoes", "Bags", "Blazers", "Accessories"];

const categoryCards = [
  { name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=560&fit=crop" },
  { name: "Tops", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=560&fit=crop" },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=560&fit=crop" },
  { name: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=560&fit=crop" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=560&fit=crop" },
];

const categoryKeys = {
  All: "categories.all",
  "New In": "categories.newIn",
  Dresses: "categories.dresses",
  Tops: "categories.tops",
  Pants: "categories.pants",
  Knitwear: "categories.knitwear",
  Shoes: "categories.shoes",
  Bags: "categories.bags",
  Blazers: "categories.blazers",
  Accessories: "categories.accessories",
};

const sortKeys = {
  Featured: "home.sortFeatured",
  Newest: "home.sortNewest",
  "Price: Low to High": "home.sortPriceLow",
  "Price: High to Low": "home.sortPriceHigh",
};

export default function HomePage() {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Featured");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [bannerSlides, setBannerSlides] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchBanners() {
      try {
        const data = await api.products.banners();
        if (!cancelled && data.length > 0) {
          setBannerSlides(data.map((b) => ({
            image: b.image,
            badge: b.badge || "",
            title: b.title,
            subtitle: b.subtitle || "",
            buttonText: b.buttonText || t("hero.shopNow"),
            buttonLink: b.buttonLink || "#products",
          })));
        }
      } catch { /* use fallback */ }
    }
    fetchBanners();
    return () => { cancelled = true; };
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== "All") params.category = activeCategory;
        if (sortMap[activeSort]) params.sort = sortMap[activeSort];
        const data = await api.products.list(params);
        if (!cancelled) { setProducts(data.products); setError(null); }
      } catch {
        if (!cancelled) { setProducts([]); setError(t("home.loadError")); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [activeCategory, activeSort, t]);

  useEffect(() => {
    if (activeCategory !== "All") {
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeCategory]);

  const heroProduct = products.find((p) => p.badge === "New") || products[0];
  const gridProducts = products.filter((p) => p.id !== heroProduct?.id);

  const fallbackSlides = [
    {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=420&fit=crop",
      badge: t("hero.summer2026"),
      title: t("hero.newCollection"),
      subtitle: t("hero.newCollectionSubtitle"),
      buttonText: t("hero.shopNow"),
      buttonLink: "#products",
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=420&fit=crop",
      badge: t("hero.limitedTime"),
      title: t("hero.summerSale"),
      subtitle: t("hero.summerSaleSubtitle"),
      buttonText: t("hero.shopSale"),
      buttonLink: "#products",
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&h=420&fit=crop",
      badge: t("hero.editorsPick"),
      title: t("hero.mustHaveEssentials"),
      subtitle: t("hero.mustHaveSubtitle"),
      buttonText: t("hero.explore"),
      buttonLink: "#products",
    },
  ];

  const carouselSlides = bannerSlides.length > 0 ? bannerSlides : fallbackSlides;

  const marqueeItems = [
    t("marquee.freeShipping"),
    t("marquee.newArrivals"),
    t("marquee.easyReturns"),
    t("marquee.secureCheckout"),
    t("marquee.membersDiscount"),
    t("marquee.sustainable"),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header onMenuToggle={() => setSideNavOpen(!sideNavOpen)} />

      <div className="flex pt-16">
        <SideNav
          isOpen={sideNavOpen}
          onClose={() => setSideNavOpen(false)}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="flex-1 min-w-0">
          {/* Hero Carousel */}
          <Carousel slides={carouselSlides} autoPlay interval={5000} />

          {/* Marquee */}
          <div className="overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex animate-marquee whitespace-nowrap py-3">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="mx-8 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Category Image Cards */}
          <div className="px-4 md:px-6 py-6 md:py-10">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-light text-gray-900 dark:text-white tracking-wide">{t("home.shopByCategory")}</h2>
              <button onClick={() => setActiveCategory("All")} className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer">{t("common.viewAll")}</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
              {categoryCards.map((cat) => (
                <button key={cat.name} onClick={() => { setActiveCategory(cat.name); navigate("/"); }}
                  className="group relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-sm cursor-pointer">
                  <img src={cat.image} alt={t(categoryKeys[cat.name])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
                    <span className="text-sm font-medium text-white tracking-wide mb-1">{t(categoryKeys[cat.name])}</span>
                    <span className="text-[10px] text-white/60 uppercase tracking-widest">{t("product.shopNow")}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Features Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-y border-gray-100 dark:border-white/5">
            {[
              { icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", textKey: "home.freeShipping" },
              { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", textKey: "home.freeReturns" },
              { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", textKey: "home.securePayment" },
              { icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155", textKey: "home.support247" },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-5 border-r border-gray-100 dark:border-white/5 last:border-r-0">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{t(f.textKey)}</span>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div id="products" className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 min-w-0">
                {allCategories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${activeCategory === cat ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"}`}>
                    {t(categoryKeys[cat])}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:inline">{t("home.sort")}:</span>
                <select value={activeSort} onChange={(e) => setActiveSort(e.target.value)} className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none focus:outline-none cursor-pointer">
                  {sortOptions.map((opt) => <option key={opt} value={opt}>{t(sortKeys[opt])}</option>)}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">{loading ? t("common.loading") : t("home.productCount", { count: products.length })}</p>
          </div>

          {/* Product Grid - Editorial Layout */}
          <div className="px-4 md:px-6 py-6 md:py-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-sm" />
                    <div className="mt-3 space-y-2">
                      <div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto text-red-200 dark:text-red-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
                <button onClick={() => { setError(null); setLoading(true); }} className="text-xs font-medium text-gray-900 dark:text-white underline underline-offset-4 cursor-pointer">{t("common.tryAgain")}</button>
              </div>
            ) : (
              <>
                {/* Hero product card - full width */}
                {heroProduct && activeCategory === "All" && (
                  <div className="mb-6 animate-float-up">
                    <ProductCard product={heroProduct} variant="hero" />
                  </div>
                )}

                {gridProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-8">
                    {gridProducts.map((product, i) => (
                      <div key={product.id} className="animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 && (
                  <div className="text-center py-20">
                    <svg className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">{t("home.noProducts")}</p>
                    <button onClick={() => setActiveCategory("All")} className="mt-3 text-xs font-medium text-gray-900 dark:text-white underline underline-offset-4 cursor-pointer">{t("common.viewAllProducts")}</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Newsletter */}
          <div className="mx-4 md:mx-6 mb-6 md:mb-8 p-6 md:p-10 bg-gray-900 dark:bg-white/5 rounded-2xl text-center overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative">
              <h3 className="text-base md:text-lg font-light text-white tracking-wide mb-1.5 md:mb-2">{t("home.stayInLoop")}</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 md:mb-6 max-w-md mx-auto">{t("home.newsletterDesc")}</p>
              <div className="flex max-w-sm mx-auto">
                <input type="email" placeholder={t("home.enterEmail")} className="flex-1 px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-l-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40" />
                <button onClick={() => { setSubscribed(true); toast.success(t("home.subscribedToast")); }} disabled={subscribed} className="px-4 sm:px-6 py-3 bg-white dark:bg-white text-gray-900 dark:text-gray-900 text-xs sm:text-sm font-medium rounded-r-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 shrink-0">{subscribed ? t("home.subscribed") : t("home.subscribe")}</button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-100 dark:border-white/5 px-4 md:px-6 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div>
                <h4 className="text-[11px] font-semibold text-gray-900 dark:text-white uppercase tracking-[0.15em] mb-4">{t("nav.help")}</h4>
                <ul className="space-y-2.5">
                  {[t("footer.customerService"), t("footer.trackOrder"), t("footer.returnsExchanges"), t("footer.shippingInfo")].map((item) => (<li key={item}><a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-gray-900 dark:text-white uppercase tracking-[0.15em] mb-4">{t("footer.about")}</h4>
                <ul className="space-y-2.5">
                  {[t("footer.ourStory"), t("footer.careers"), t("footer.press"), t("footer.sustainability")].map((item) => (<li key={item}><a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-gray-900 dark:text-white uppercase tracking-[0.15em] mb-4">{t("footer.followUs")}</h4>
                <ul className="space-y-2.5">
                  {[t("footer.instagram"), t("footer.twitter"), t("footer.pinterest"), t("footer.tiktok")].map((item) => (<li key={item}><a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a></li>))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-gray-900 dark:text-white uppercase tracking-[0.15em] mb-4">{t("footer.contact")}</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">support@velora.com</a></li>
                  <li><a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">+1 (555) 123-4567</a></li>
                  <li><a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t("footer.liveChat")}</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              <Logo />
              <div className="flex items-center gap-4">
                {[t("footer.visa"), t("footer.mastercard"), t("footer.amex"), t("footer.payPal")].map((p) => (<span key={p} className="text-[10px] text-gray-400 dark:text-gray-500 font-medium border border-gray-200 dark:border-white/10 rounded px-2 py-1">{p}</span>))}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{t("footer.copyright")}</p>
            </div>
          </footer>
        </main>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 cursor-pointer animate-fade-in">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
        </button>
      )}
    </div>
  );
}
