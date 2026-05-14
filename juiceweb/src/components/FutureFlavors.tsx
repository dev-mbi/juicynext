"use client"

import dynamic from "next/dynamic"
import { futureFlavors } from "@/data/products"

const ThreeBackground = dynamic(() => import("@/components/3d/ThreeBackground"), { ssr: false })

export default function FutureFlavors() {
  return (
    <section id="future" className="relative overflow-hidden py-32 px-6">
      <ThreeBackground color="#8B00FF" particleCount={40} />
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-wider text-white md:text-5xl">
            Future <span className="text-juicy-purple">Worlds</span>
          </h2>
          <p className="mt-3 text-zinc-500">
            New flavor dimensions loading... Be the first to enter.
          </p>
        </div>

        {/* Flavor portals */}
        <div className="grid gap-6 md:grid-cols-4">
          {futureFlavors.map((flavor) => (
            <div
              key={flavor.id}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-juicy-card p-8 text-center transition-all duration-500 hover:border-white/20"
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${flavor.color} 0%, transparent 70%)`,
                }}
              />

              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="text-center">
                  <p className="text-xs font-semibold tracking-widest text-juicy-gold">
                    {flavor.launchDate}
                  </p>
                  <button className="mt-2 rounded-full border border-white/20 px-4 py-1.5 text-xs text-white transition-all hover:bg-white/10">
                    Notify Me
                  </button>
                </div>
              </div>

              <div className="relative z-10">
                <div
                  className="mx-auto mb-4 text-5xl transition-transform duration-500 group-hover:scale-110"
                  style={{ filter: `drop-shadow(0 0 20px ${flavor.color}40)` }}
                >
                  {flavor.emoji}
                </div>

                <h3 className="font-heading text-sm font-bold tracking-wide text-white">
                  {flavor.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{flavor.theme}</p>

                {/* Status badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-juicy-purple/30 bg-juicy-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-juicy-purple">
                  <span className="h-1.5 w-1.5 rounded-full bg-juicy-purple" />
                  Coming Soon
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Waitlist CTA */}
        <div className="mt-16 rounded-3xl border border-juicy-purple/20 bg-gradient-to-r from-juicy-purple/10 to-transparent p-8 text-center md:p-12">
          <h3 className="font-heading text-xl font-bold text-white md:text-2xl">
            Want Early Access?
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Get notified when new flavor worlds unlock.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-juicy-purple/50"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-juicy-purple to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
