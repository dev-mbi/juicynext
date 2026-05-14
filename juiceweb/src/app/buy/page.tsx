"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart"
import { api } from "@/lib/api"
import MangoIcon from "@/components/MangoIcon"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

type PaymentMethod = "cod" | "online"

export default function BuyPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [method, setMethod] = useState<PaymentMethod>("cod")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", address: "", card: "", expiry: "", cvv: "" })

  const total = totalPrice()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          payment_method: method,
          items: items.map((item) => ({
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            size_ml: item.sizeMl,
            unit_price: item.price,
          })),
        }),
      })

      if (!res.ok) throw new Error("Order failed")
      setSubmitted(true)
      clearCart()
    } catch {
      alert("Order submission failed. Make sure the backend is running on port 8000.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 text-6xl">🎉</div>
          <h1 className="font-heading text-3xl font-bold text-juicy-gold">Order Placed!</h1>
          <p className="mt-3 text-zinc-400 max-w-md">
            {method === "cod"
              ? "Your order will be delivered soon. Pay on delivery."
              : "Payment successful! Your order is on its way."}
          </p>
          <div className="mt-6 flex gap-4">
            <a href="/track" className="rounded-full border border-white/20 px-8 py-3 text-sm text-white transition-all hover:bg-white/5">
              Track Order
            </a>
            <a href="/" className="rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-8 py-3 text-sm font-bold text-black transition-all hover:scale-105">
              Back to Home
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-3xl font-bold text-white md:text-5xl">
              Checkout
            </h1>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Left — Order Summary */}
            <div>
              <h2 className="mb-4 font-heading text-lg font-bold text-white">Your Order</h2>
              {items.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-juicy-card p-10 text-center">
                  <p className="text-zinc-500">Your cart is empty</p>
                  <a href="/" className="mt-4 inline-block text-sm text-juicy-gold hover:underline">
                    Browse products
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.sizeMl}`}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-juicy-card p-4"
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: `radial-gradient(circle, ${item.glowColor}20, transparent)`,
                        }}
                      >
                        <MangoIcon className="w-8 h-8" color1={item.themeColor} color2={item.glowColor} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                        <p className="text-xs text-zinc-500">{item.sizeLabel} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-juicy-gold">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="font-heading text-xl font-bold text-juicy-gold">Rs. {total}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right — Form */}
            <div>
              {items.length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMethod("cod")}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          method === "cod"
                            ? "border-juicy-gold/50 bg-juicy-gold/10 text-juicy-gold"
                            : "border-white/5 bg-juicy-card text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        <div className="text-2xl">💵</div>
                        <div className="mt-1 text-sm font-semibold">Cash on Delivery</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMethod("online")}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          method === "online"
                            ? "border-juicy-gold/50 bg-juicy-gold/10 text-juicy-gold"
                            : "border-white/5 bg-juicy-card text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        <div className="text-2xl">💳</div>
                        <div className="mt-1 text-sm font-semibold">Online Payment</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-juicy-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-juicy-gold/50"
                      placeholder="Muhammad Ali"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Phone Number</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-juicy-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-juicy-gold/50"
                      placeholder="03xx-xxxxxxx"
                    />
                  </div>

                  {method === "cod" && (
                    <div>
                      <label className="mb-1 block text-xs text-zinc-500">Delivery Address</label>
                      <textarea
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-juicy-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-juicy-gold/50"
                        placeholder="House #, Street, City"
                        rows={3}
                      />
                    </div>
                  )}

                  {method === "online" && (
                    <>
                      <div>
                        <label className="mb-1 block text-xs text-zinc-500">Card Number</label>
                        <input
                          required
                          value={form.card}
                          onChange={(e) => setForm({ ...form, card: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-juicy-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-juicy-gold/50"
                          placeholder="xxxx-xxxx-xxxx-xxxx"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs text-zinc-500">Expiry</label>
                          <input
                            required
                            value={form.expiry}
                            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-juicy-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-juicy-gold/50"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-zinc-500">CVV</label>
                          <input
                            required
                            value={form.cvv}
                            onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-juicy-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-juicy-gold/50"
                            placeholder="***"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold py-4 font-heading text-sm font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-juicy-orange/30 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : method === "cod" ? `Place Order — Rs. ${total}` : `Pay Rs. ${total}`}
                  </button>
                </form>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-400">
                  🇵🇰 100% Pakistani Brand
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  ☪️ Halal Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
