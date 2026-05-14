"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { flagshipProduct } from "@/data/products"
import AnimatedGradientText from "@/components/AnimatedGradientText"
import FloatingParticles from "@/components/FloatingParticles"

const MangoScene = dynamic(() => import("@/components/3d/MangoScene"), { ssr: false })

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const product = flagshipProduct

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIntroDone(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-juicy-dark to-black" />

      {mounted && <MangoScene bottleColor="#FFD700" liquidColor="#FF6B00" />}

      <FloatingParticles count={15} />

      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-juicy-gold/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2 rounded-full bg-juicy-orange/20 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center mt-20">
        {/* Brand splash — JuicyNext */}
        <div
          className={`mb-4 transition-all duration-[1200ms] ${
            mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90"
          } ${introDone ? "mb-4" : "mb-0"}`}
        >
          <h1 className="font-heading text-6xl font-black tracking-[0.15em] md:text-8xl">
            <span
              className={`inline-block transition-all duration-1000 ${
                introDone ? "scale-75 opacity-60" : "scale-100 opacity-100"
              }`}
            >
              <AnimatedGradientText from="#FFD700" via="#FF6B00" to="#FFD700">
                JuicyNext
              </AnimatedGradientText>
            </span>
          </h1>
        </div>

        {/* Divider */}
        <div
          className={`mb-4 transition-all duration-700 delay-300 ${
            introDone ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-zinc-600 uppercase">
            presents
          </span>
        </div>

        {/* Product info */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            introDone ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-juicy-gold/30 bg-juicy-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-juicy-gold mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-juicy-gold animate-pulse" />
            SEASON 1 — NOW AVAILABLE
          </div>

          <h2 className="font-heading text-5xl font-black tracking-wider md:text-7xl">
            <AnimatedGradientText from="#FFD700" via="#FF6B00" to="#FFD700">
              {product.name}
            </AnimatedGradientText>
          </h2>

          <p className="mt-4 text-lg text-zinc-400 md:text-xl">
            {product.tagline}
          </p>

          <p className="mt-1 text-xs tracking-widest text-zinc-600 uppercase">
            Premium Pakistani Craft
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row transition-all duration-1000 delay-700 ${
            introDone ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <a
            href="#collection"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-8 py-3 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-juicy-orange/30"
          >
            Explore Flavor
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="/buy"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 font-semibold text-white transition-all hover:border-juicy-gold/50 hover:bg-white/5 hover:shadow-lg hover:shadow-juicy-gold/10"
          >
            Buy Now
            <span className="text-juicy-gold">Rs. {product.price}</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
