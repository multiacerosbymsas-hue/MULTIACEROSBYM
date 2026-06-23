import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  qty: number;
};

type AddInput = Omit<CartItem, "qty">;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: AddInput) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              isOpen: true,
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { isOpen: true, items: [...s.items, { ...item, qty: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "multiaceros-cart", partialize: (s) => ({ items: s.items }) }
  )
);

export const useCartCount = () =>
  useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
export const useCartTotal = () =>
  useCart((s) => s.items.reduce((n, i) => n + i.qty * i.price, 0));
