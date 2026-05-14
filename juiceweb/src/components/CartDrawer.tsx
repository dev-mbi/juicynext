"use client"

import { useCart } from "@/lib/cart"

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-juicy-dark border-l border-white/5 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="font-heading text-lg font-bold text-white">Cart</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 && (
              <div className="mt-20 text-center text-zinc-600">
                <div className="mb-4 text-4xl">🛒</div>
                <p className="text-sm">Your cart is empty</p>
              </div>
            )}
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.sizeMl}`}
                className="mb-3 rounded-xl border border-white/5 bg-juicy-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-500">{item.sizeLabel}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.sizeMl)}
                    className="text-xs text-zinc-600 transition-colors hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-juicy-gold">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/5 px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total</span>
                <span className="font-heading text-xl font-bold text-juicy-gold">Rs. {totalPrice()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 rounded-full border border-white/10 py-3 text-xs text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                >
                  Clear
                </button>
                <a
                  href="/buy"
                  onClick={onClose}
                  className="flex-1 rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold py-3 text-center text-xs font-bold text-black transition-all hover:scale-[1.02]"
                >
                  Checkout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
