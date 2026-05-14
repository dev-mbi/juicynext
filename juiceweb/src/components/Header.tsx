"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart"
import CartDrawer from "@/components/CartDrawer"

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const totalItems = useCart((s) => s.totalItems())

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">🥭</span>
            <span className="font-heading text-base font-bold tracking-wider text-juicy-gold md:text-lg">
              JuicyNext
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#collection" className="text-zinc-400 transition-colors hover:text-white">
              Collection
            </a>
            <a href="#future" className="text-zinc-400 transition-colors hover:text-white">
              Coming Soon
            </a>
            <a href="/track" className="text-zinc-400 transition-colors hover:text-white">
              Track
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-juicy-orange text-[10px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </button>
            <a
              href="/buy"
              className="hidden rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-4 py-2 text-xs font-semibold text-black transition-all hover:scale-105 sm:inline-block md:px-6 md:text-sm"
            >
              Buy Now
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-white/5 bg-black/90 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <a href="#collection" onClick={() => setMenuOpen(false)} className="text-sm text-zinc-400 transition-colors hover:text-white">Collection</a>
              <a href="#future" onClick={() => setMenuOpen(false)} className="text-sm text-zinc-400 transition-colors hover:text-white">Coming Soon</a>
              <a href="/track" onClick={() => setMenuOpen(false)} className="text-sm text-zinc-400 transition-colors hover:text-white">Track Order</a>
              <a href="/buy" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-juicy-gold transition-colors hover:text-juicy-orange">Buy Now</a>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
