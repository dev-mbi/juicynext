"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

function TrackContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 text-6xl">📦</div>
          <h1 className="font-heading text-3xl font-bold text-white md:text-5xl">
            Track Your <span className="text-juicy-gold">Order</span>
          </h1>
          <p className="mt-3 text-zinc-500">Enter your order ID to check delivery status</p>
          <form className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              name="id"
              defaultValue={orderId || ""}
              placeholder="Order ID (e.g. 1)"
              className="flex-1 rounded-full border border-white/10 bg-juicy-card px-6 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50"
            />
            <button className="rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-6 py-3 text-sm font-bold text-black transition-all hover:scale-105">
              Track
            </button>
          </form>
          <div className="mt-12 rounded-2xl border border-white/5 bg-juicy-card p-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Status</span>
              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                Pending
              </span>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {["Confirmed", "Preparing", "Shipped", "Delivered"].map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? "bg-juicy-gold/20 text-juicy-gold" : "bg-white/5 text-zinc-600"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="mt-1 text-[10px] text-zinc-600">{step}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2 h-1 rounded-full bg-white/5">
                <div className="absolute left-0 top-0 h-1 w-1/4 rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold" />
              </div>
            </div>
            <p className="mt-6 text-xs text-zinc-600">
              Order confirmed. Awaiting preparation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-juicy-dark">
        <p className="text-zinc-500">Loading...</p>
      </div>
    }>
      <TrackContent />
    </Suspense>
  )
}
