import { create } from "zustand"

export type CartItem = {
  productId: number
  name: string
  slug: string
  price: number
  sizeMl: number
  sizeLabel: string
  quantity: number
  themeColor: string
  glowColor: string
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: number, sizeMl: number) => void
  updateQuantity: (productId: number, sizeMl: number, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.find(
      (i) => i.productId === item.productId && i.sizeMl === item.sizeMl,
    )
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.productId === item.productId && i.sizeMl === item.sizeMl
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      })
    } else {
      set({ items: [...get().items, { ...item, quantity: 1 }] })
    }
  },

  removeItem: (productId, sizeMl) => {
    set({
      items: get().items.filter(
        (i) => !(i.productId === productId && i.sizeMl === sizeMl),
      ),
    })
  },

  updateQuantity: (productId, sizeMl, qty) => {
    if (qty <= 0) {
      get().removeItem(productId, sizeMl)
      return
    }
    set({
      items: get().items.map((i) =>
        i.productId === productId && i.sizeMl === sizeMl
          ? { ...i, quantity: qty }
          : i,
      ),
    })
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

  totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}))
