import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../api";
import Logo from "./Logo";

export default function Header({ onMenuToggle }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const cartRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { dark, toggle } = useTheme();

  useEffect(() => {
    function handleClick(e) {
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(searchTimer.current);
    if (q.trim().length > 0) {
      setSearching(true);
      searchTimer.current = setTimeout(async () => {
        try {
          const data = await api.products.list({ search: q });
          setSearchResults(data.products.slice(0, 5));
        } catch {
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100/80 dark:border-white/5">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-6">
          <button onClick={onMenuToggle} className="lg:hidden p-1 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link to="/" className="flex items-center"><Logo size="sm" /></Link>
        </div>

        <div className="flex items-center gap-1.5">
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 fixed inset-x-0 top-0 z-50 bg-white dark:bg-gray-950 p-3 border-b border-gray-100 dark:border-white/5 lg:static lg:inset-auto lg:z-auto lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:border-0">
                <input
                  autoFocus type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search products..."
                  className="flex-1 lg:w-72 px-4 py-2 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full focus:outline-none focus:border-gray-400 dark:focus:border-white/20 focus:ring-2 focus:ring-gray-100 dark:focus:ring-white/10 transition-all"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </button>
            )}
            {searchOpen && searchResults.length > 0 && (
              <div className="fixed inset-x-0 top-14 lg:absolute lg:top-full lg:mt-2 lg:right-0 lg:w-80 bg-white dark:bg-gray-900 lg:rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 max-h-[60vh] lg:max-h-80 overflow-y-auto mx-4 lg:mx-0 mt-2 lg:mt-2 rounded-xl lg:rounded-xl">
                {searchResults.map((p) => (
                  <button key={p.id} onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); navigate(`/product/${p.id}`); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left cursor-pointer">
                    <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded" />
                    <div><p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">${p.price}</p></div>
                  </button>
                ))}
              </div>
            )}
            {searchOpen && searchQuery.trim().length > 0 && !searching && searchResults.length === 0 && (
              <div className="fixed inset-x-0 top-14 lg:absolute lg:top-full lg:mt-2 lg:right-0 lg:w-80 bg-white dark:bg-gray-900 lg:rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-6 text-center mx-4 lg:mx-0 mt-2 lg:mt-2 rounded-xl lg:rounded-xl">
                <p className="text-sm text-gray-400 dark:text-gray-500">No results found</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate("/wishlist")} className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
          </button>

          <button onClick={toggle} className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer">
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            )}
          </button>

          <div ref={userRef} className="relative">
            <button onClick={() => user ? setUserMenuOpen(!userMenuOpen) : navigate("/login")} className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer">
              {user ? (
                <div className="w-5 h-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-[10px] font-bold">{user.name.charAt(0).toUpperCase()}</div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              )}
            </button>
            {userMenuOpen && user && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <button onClick={() => { setUserMenuOpen(false); navigate("/account"); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">My Account</button>
                <button onClick={() => { setUserMenuOpen(false); navigate("/account"); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">My Orders</button>
                {isAdmin && <button onClick={() => { setUserMenuOpen(false); navigate("/admin"); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">Dashboard</button>}
                <div className="border-t border-gray-100 dark:border-white/5" />
                <button onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">Sign Out</button>
              </div>
            )}
          </div>

          <div ref={cartRef} className="relative">
            <button onClick={() => setCartOpen(!cartOpen)} className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            {cartOpen && (
              <div className="absolute top-full mt-2 right-0 w-[calc(100vw-2rem)] max-w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Shopping Bag ({totalItems})</h3>
                  <button onClick={() => setCartOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <svg className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Your bag is empty</p>
                    </div>
                  ) : items.map((item) => (
                    <div key={item.cartKey} className="flex gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${item.price} {item.selectedSize && `· ${item.selectedSize}`}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="w-6 h-6 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/20 text-xs cursor-pointer">-</button>
                          <span className="text-xs font-medium w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="w-6 h-6 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/20 text-xs cursor-pointer">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item.cartKey)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {items.length > 0 && (
                  <div className="px-5 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                    <button onClick={() => { setCartOpen(false); navigate("/checkout"); }} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer">Checkout</button>
                    <button onClick={() => { setCartOpen(false); navigate("/bag"); }} className="w-full py-2.5 mt-2 bg-transparent text-gray-600 dark:text-gray-400 text-xs font-medium hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">View Shopping Bag</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
