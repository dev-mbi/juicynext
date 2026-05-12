"use client"

import { useState } from "react"
import { products } from "@/data/products"
import BottleIcon from "@/components/BottleIcon"

const mangoSeries = products.filter((p) => p.series === "Mango Series")

export default function MangoCollection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = mangoSeries[activeIndex]

  return (
    <section id="collection" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-wider text-white md:text-5xl">
            🥭 Mango <span className="text-juicy-gold">Collection</span>
          </h2>
          <p className="mt-3 text-zinc-500">
            Swipe through the full Mango series — each with its own vibe
          </p>
        </div>

        {/* Product cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {mangoSeries.map((product, index) => (
            <button
              key={product.id}
              onClick={() => setActiveIndex(index)}
              className={`group relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-500 ${
                index === activeIndex
                  ? "border-juicy-gold/50 bg-juicy-gold/10 shadow-lg shadow-juicy-gold/20"
                  : "border-white/5 bg-juicy-card hover:border-white/20"
              }`}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${product.glowColor}20 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                {/* Bottle emoji placeholder */}
                <div
                  className="mx-auto mb-4 transition-transform duration-500 group-hover:scale-110"
                  style={{ filter: `drop-shadow(0 0 12px ${product.glowColor}60)` }}
                >
                  <BottleIcon color1={product.themeColor} color2={product.glowColor} />
                </div>

                <h3 className="font-heading text-sm font-bold tracking-wide text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{product.tagline}</p>

                {/* Color indicator */}
                <div className="mt-3 flex justify-center gap-1">
                  <span
                    className="h-1.5 w-6 rounded-full"
                    style={{ backgroundColor: product.themeColor }}
                  />
                  <span
                    className="h-1.5 w-6 rounded-full"
                    style={{ backgroundColor: product.glowColor }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active product detail */}
        <div className="mt-12 rounded-3xl border border-white/5 bg-juicy-card p-8 md:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Visual */}
            <div
              className="flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl animate-float"
              style={{
                background: `radial-gradient(circle, ${active.glowColor}20 0%, transparent 70%)`,
                boxShadow: `0 0 60px ${active.glowColor}20`,
              }}
            >
              <BottleIcon className="text-7xl" color1={active.themeColor} color2={active.glowColor} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3">
                <h3 className="font-heading text-2xl font-bold text-white">
                  {active.name}
                </h3>
                {active.isFlagship && (
                  <span className="rounded-full bg-juicy-gold/20 px-3 py-0.5 text-xs font-semibold text-juicy-gold">
                    FLAGSHIP
                  </span>
                )}
              </div>
              <p className="mt-2 text-zinc-400">{active.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="font-heading text-2xl font-bold text-juicy-gold">
                  Rs. {active.price}
                </span>
                {active.status === "active" ? (
                  <a
                    href="#buy"
                    className="rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-6 py-2 text-sm font-semibold text-black transition-all hover:scale-105"
                  >
                    Add to Cart
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-juicy-purple/30 bg-juicy-purple/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-juicy-purple">
                    <span className="h-1.5 w-1.5 rounded-full bg-juicy-purple" />
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
