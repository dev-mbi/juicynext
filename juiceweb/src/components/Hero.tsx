"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { flagshipProduct } from "@/data/products"

const MangoScene = dynamic(() => import("@/components/3d/MangoScene"), { ssr: false })

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const product = flagshipProduct

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-juicy-dark to-black" />

      {/* 3D Scene */}
      {mounted && (
        <MangoScene bottleColor="#FFD700" liquidColor="#FF6B00" />
      )}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-juicy-gold/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2 rounded-full bg-juicy-orange/20 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center mt-20">
        <div
          className={`mb-6 transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-juicy-gold/30 bg-juicy-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-juicy-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-juicy-gold animate-pulse" />
            SEASON 1 — NOW AVAILABLE
          </div>
        </div>

        <h1
          className={`font-heading text-5xl font-black tracking-wider transition-all duration-1000 delay-200 md:text-7xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className="bg-gradient-to-r from-juicy-gold via-yellow-300 to-juicy-orange bg-clip-text text-transparent">
            Mango Rush
          </span>
        </h1>

        <p
          className={`mt-4 text-lg text-zinc-400 transition-all duration-1000 delay-300 md:text-xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {product.tagline}
        </p>

        <p
          className={`mt-1 text-xs tracking-widest text-zinc-600 uppercase transition-all duration-1000 delay-400 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Powered by JuicyNext
        </p>

        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row transition-all duration-1000 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <a
            href="#collection"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-8 py-3 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-juicy-orange/30"
          >
            Explore Flavor
            <span>→</span>
          </a>
          <a
            href="#buy"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 font-semibold text-white transition-all hover:border-juicy-gold/50 hover:bg-white/5"
          >
            Buy Now
            <span className="text-juicy-gold">Rs. {product.price}</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
