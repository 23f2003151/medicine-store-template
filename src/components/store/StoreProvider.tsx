"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { StoreCartCopy, StoreOffer } from "@/types/template";
import { calculateCartSubtotal } from "@/lib/cart";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface StoreContextValue {
  currency: string;
  locale: string;
  freeDeliveryMinimum: number;
  offer: StoreOffer | null;
  cartCopy: StoreCartCopy;
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (value: string | null) => void;
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  cartOpen: boolean;
  mobileNavOpen: boolean;
  setMobileNavOpen: (value: boolean) => void;
  toast: string | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({
  children,
  currency,
  locale,
  freeDeliveryMinimum,
  offer,
  cartCopy,
}: {
  children: ReactNode;
  currency: string;
  locale: string;
  freeDeliveryMinimum: number;
  offer: StoreOffer | null;
  cartCopy: StoreCartCopy;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = useCallback((productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      return existing
        ? current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { productId, quantity: 1 }];
    });
    setToast(`${product.name} added to your bag`);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((current) =>
        quantity <= 0
          ? current.filter((line) => line.productId !== productId)
          : current.map((line) =>
              line.productId === productId ? { ...line, quantity } : line,
            ),
      );
    },
    [],
  );
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartSubtotal = calculateCartSubtotal(cart, products);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<StoreContextValue>(
    () => ({
      currency,
      locale,
      freeDeliveryMinimum,
      offer,
      cartCopy,
      search,
      setSearch,
      categoryFilter,
      setCategoryFilter,
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      openCart,
      closeCart,
      clearCart,
      cartOpen,
      mobileNavOpen,
      setMobileNavOpen,
      toast,
    }),
    [
      currency,
      locale,
      freeDeliveryMinimum,
      offer,
      cartCopy,
      search,
      categoryFilter,
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      openCart,
      closeCart,
      clearCart,
      cartOpen,
      mobileNavOpen,
      toast,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <CartDrawer />
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && <p className="toast-message">{toast}</p>}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return context;
}
