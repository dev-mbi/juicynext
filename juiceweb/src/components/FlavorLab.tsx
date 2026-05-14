"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const FlavorForge = dynamic(() => import("@/components/3d/FlavorForge"), { ssr: false })

export default function FlavorLab() {
  return (
    <section id="flavor-lab" className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-wider text-white md:text-5xl">
            🔬 Flavor <span className="text-juicy-orange">Forge</span>
          </h2>
          <p className="mt-3 text-zinc-500">
            Tap two fruits to merge them into a new flavor
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-juicy-card">
          <FlavorForge />
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600">
          <span>🥭 Mango</span>
          <span className="text-zinc-700">+</span>
          <span>🍓 Berry</span>
          <span className="text-zinc-700">+</span>
          <span>🍊 Citrus</span>
          <span className="text-zinc-700">+</span>
          <span>🍇 Grape</span>
          <span className="text-zinc-700">+</span>
          <span>🌿 Mint</span>
          <span className="text-zinc-700">=</span>
          <span className="text-juicy-gold">✨ New Flavor</span>
        </div>
      </div>
    </section>
  )
}
