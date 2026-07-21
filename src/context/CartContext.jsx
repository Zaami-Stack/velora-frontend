import { createContext, useContext, useReducer, useCallback, useEffect } from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("velora_cart") || "[]");
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.cartKey !== action.payload) };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.cartKey !== action.payload.cartKey) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartKey === action.payload.cartKey ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: loadCart() });

  const addItem = useCallback((product) => dispatch({ type: "ADD_ITEM", payload: product }), []);
  const removeItem = useCallback((cartKey) => dispatch({ type: "REMOVE_ITEM", payload: cartKey }), []);
  const updateQuantity = useCallback((cartKey, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { cartKey, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalSavings = state.items.reduce((sum, i) => sum + (i.originalPrice ? (i.originalPrice - i.price) * i.quantity : 0), 0);
  const totalDelivery = state.items.reduce((sum, i) => sum + (i.deliveryPrice || 0) * i.quantity, 0);

  useEffect(() => {
    localStorage.setItem("velora_cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, totalSavings, totalDelivery }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
