import { createContext, useContext, useState, useCallback } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("velora_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const toggle = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      const next = exists ? prev.filter((i) => i.id !== product.id) : [...prev, product];
      localStorage.setItem("velora_wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback((id) => items.some((i) => i.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
