"use client"

import { useRef } from "react"
import Reveal from "@/components/Reveal"
import dynamic from "next/dynamic"

const ThreeBackground = dynamic(() => import("@/components/3d/ThreeBackground"), { ssr: false })

const news = [
  {
    date: "May 2026",
    title: "Mango Rush — Coming Soon",
    description: "New high-energy mango flavor with a neon tropical kick. Faster, bolder, and amplified for the daredevils. 500ml bottles launching soon.",
    tag: "Coming Soon",
    color: "#FFD700",
  },
  {
    date: "April 2026",
    title: "Pure Pakistani Mango — Farm to Bottle",
    description: "Every bottle of JuicyNext uses handpicked Chaunsa mangoes from Punjab orchards. No concentrates. No artificial flavors. Just real fruit.",
    tag: "Craft",
    color: "#22c55e",
  },
  {
    date: "March 2026",
    title: "JuicyNext — Now Available in Karachi",
    description: "JuicyNext beverages are now available at select retail locations across Karachi. Store locator coming soon to help you find your nearest stockist.",
    tag: "Availability",
    color: "#FF6B00",
  },
  {
    date: "February 2026",
    title: "Zero Sugar Line — Coming This Summer",
    description: "Stevia-sweetened, naturally flavored, zero compromise. The new Zero Sugar lineup launches June 2026. No artificial sweeteners, just pure taste.",
    tag: "Coming Soon",
    color: "#8B00FF",
  },
  {
    date: "December 2025",
    title: "Flavor Lab — First Batch Approved",
    description: "After 14 iterations, the JuicyNext R&D team finalized the signature Mango Blend. Sweet, tangy, and unmistakably Pakistani. Tasting notes available.",
    tag: "R&D",
    color: "#06b6d4",
  },
]

function TimelineDot({ color }: { color: string }) {
  const dotRef = useRef<HTMLDivElement>(null!)

  return (
    <div className="relative flex flex-col items-center">
      <div
        ref={dotRef}
        className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}30`, borderColor: color, borderWidth: 2 }}
      >
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function NewsSection() {
  return (
    <section id="news" className="relative overflow-hidden py-32 px-6">
      <ThreeBackground color="#FF6B00" particleCount={30} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-wider text-white md:text-5xl">
              News & <span className="text-juicy-orange">Changes</span>
            </h2>
            <p className="mt-3 text-zinc-500">
              What&apos;s new in the JuicyNext universe
            </p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gradient-to-b from-juicy-gold/40 via-juicy-orange/30 to-juicy-purple/20 md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {news.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className={`relative flex flex-col gap-4 md:flex-row md:items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Mobile: dot + content */}
                  <div className="flex items-start gap-4 md:hidden">
                    <TimelineDot color={item.color} />
                    <div className="flex-1 rounded-2xl border border-white/5 bg-juicy-card p-5 transition-all hover:border-white/10">
                      <div className="mb-2 flex items-center gap-3">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          {item.tag}
                        </span>
                        <span className="text-[10px] text-zinc-600">{item.date}</span>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-white">{item.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Desktop: timeline layout */}
                  <div className="hidden md:flex md:w-1/2 md:items-start md:gap-4" style={{ justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                    <div className={`${i % 2 === 0 ? "text-right" : "text-left"} ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                      <div className="rounded-2xl border border-white/5 bg-juicy-card p-5 transition-all hover:border-white/10">
                        <div className={`mb-2 flex items-center gap-3 ${i % 2 === 0 ? "justify-end" : ""}`}>
                          <span className="text-[10px] text-zinc-600">{item.date}</span>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                            style={{ backgroundColor: `${item.color}15`, color: item.color }}
                          >
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="font-heading text-sm font-bold text-white">{item.title}</h3>
                        <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop center dot */}
                  <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0 md:items-start">
                    <TimelineDot color={item.color} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
