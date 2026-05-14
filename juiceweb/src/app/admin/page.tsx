"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"

type Product = {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  status: string
  category: string | null
  series: string | null
  flavor: string | null
  theme_color: string | null
  glow_color: string | null
  tagline: string | null
  description: string | null
}

type OrderItem = {
  id: number
  product_id: number
  product_name: string
  quantity: number
  size_ml: number | null
  unit_price: number
}

type Order = {
  id: number
  customer_name: string
  customer_phone: string
  customer_address: string | null
  payment_method: string
  total: number
  status: string
  created_at: string | null
  items: OrderItem[]
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<"products" | "orders">("products")
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", price: 60, stock: 0, status: "active", category: "", series: "", flavor: "", tagline: "", description: "", theme_color: "#FFA500", glow_color: "#FFD700" })

  const authedApi = (path: string, options?: RequestInit) =>
    api(path, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })

  const fetchData = async () => {
    setLoading(true)
    const [pRes, oRes] = await Promise.all([
      authedApi("/api/products"),
      token ? authedApi("/api/orders") : Promise.resolve(null),
    ])
    if (pRes.ok) setProducts(await pRes.json())
    if (oRes?.ok) setOrders(await oRes.json())
    setLoading(false)
  }

  useEffect(() => { if (token) fetchData() }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: formData.get("username"), password: formData.get("password") }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setToken(data.access_token)
    } catch {
      alert("Login failed. Start the backend on port 8000.\n\nDefault: admin / juicynext123")
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await authedApi("/api/products", {
        method: "POST",
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setShowAdd(false)
      setForm({ name: "", slug: "", price: 60, stock: 0, status: "active", category: "", series: "", flavor: "", tagline: "", description: "", theme_color: "#FFA500", glow_color: "#FFD700" })
      fetchData()
    } catch {
      alert("Failed to add product")
    }
  }

  const updateStock = async (id: number, stock: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    try {
      await authedApi(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...product, stock }),
      })
      fetchData()
    } catch {
      alert("Failed to update stock")
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-juicy-dark p-8">
        <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-juicy-card p-8 text-center">
          <div className="mb-4 text-4xl">🔐</div>
          <h1 className="font-heading text-xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-xs text-zinc-500">JuicyNext Admin Panel</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input name="username" defaultValue="admin" placeholder="Username" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
            <input name="password" type="password" defaultValue="juicynext123" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
            <button className="w-full rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold py-3 text-sm font-bold text-black transition-all hover:scale-[1.02]">
              Login
            </button>
          </form>
          <p className="mt-4 text-[10px] text-zinc-700">Default: admin / juicynext123</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-juicy-dark p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-juicy-gold">JuicyNext Admin</h1>
            <p className="text-sm text-zinc-500">Manage products & orders</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-juicy-gold/10 px-3 py-1 text-xs text-juicy-gold">
              {loading ? "..." : `${products.length} products · ${orders.length} orders`}
            </span>
            <button onClick={() => { setToken(null); setOrders([]) }} className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/30 hover:text-white">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button onClick={() => setTab("products")} className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${tab === "products" ? "bg-juicy-gold/20 text-juicy-gold" : "text-zinc-500 hover:text-white"}`}>
            Products
          </button>
          <button onClick={() => setTab("orders")} className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${tab === "orders" ? "bg-juicy-gold/20 text-juicy-gold" : "text-zinc-500 hover:text-white"}`}>
            Orders
          </button>
        </div>

        {tab === "products" && (
          <>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="mb-4 rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-5 py-2 text-xs font-bold text-black transition-all hover:scale-105"
            >
              {showAdd ? "Cancel" : "+ Add Product"}
            </button>

            {showAdd && (
              <form onSubmit={handleAddProduct} className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-juicy-card p-6 md:grid-cols-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="Name" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
                <input value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} type="number" placeholder="Price" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
                <input value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} type="number" placeholder="Stock" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-juicy-gold/50">
                  <option value="active">Active</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Tagline" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-juicy-gold/50" />
                <input value={form.theme_color} onChange={(e) => setForm({ ...form, theme_color: e.target.value })} type="color" className="h-10 rounded-xl border border-white/10 bg-white/5" />
                <input value={form.glow_color} onChange={(e) => setForm({ ...form, glow_color: e.target.value })} type="color" className="h-10 rounded-xl border border-white/10 bg-white/5" />
                <div className="col-span-full flex items-center gap-4">
                  <input
                    type="file"
                    accept=".glb"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 file:mr-3 file:rounded-full file:border-0 file:bg-juicy-gold/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-juicy-gold"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-")
                      const formData = new FormData()
                      formData.append("file", file)
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload/${slug}`, {
                          method: "POST",
                          headers: token ? { Authorization: `Bearer ${token}` } : {},
                          body: formData,
                        })
                        if (res.ok) alert("Model uploaded!")
                        else alert("Upload failed")
                      } catch {
                        alert("Upload failed — ensure backend is running")
                      }
                    }}
                  />
                </div>
                <button className="col-span-full rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold py-3 text-sm font-bold text-black transition-all hover:scale-[1.02]">
                  Save Product
                </button>
              </form>
            )}

            {/* Products Table */}
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-juicy-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500">
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                      <td className="p-4 text-zinc-400">{p.id}</td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-juicy-gold">Rs. {p.price}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          defaultValue={p.stock}
                          onBlur={(e) => {
                            const val = Number(e.target.value)
                            if (val !== p.stock) updateStock(p.id, val)
                          }}
                          className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white outline-none focus:border-juicy-gold/50"
                        />
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.status === "active" ? "bg-green-500/10 text-green-400" : "bg-purple-500/10 text-purple-400"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this product?")) return
                            try {
                              await api(`/api/products/${p.id}`, { method: "DELETE" })
                              fetchData()
                            } catch { alert("Failed to delete") }
                          }}
                          className="rounded-lg border border-red-500/20 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="rounded-2xl border border-white/5 bg-juicy-card p-10 text-center text-zinc-600">
                No orders yet.
              </div>
            )}
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/5 bg-juicy-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading text-sm font-bold text-white">Order #{order.id}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${order.status === "pending" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {order.customer_name} · {order.customer_phone}
                    </p>
                    <p className="text-xs text-zinc-600">{order.customer_address}</p>
                  </div>
                  <span className="font-heading text-lg font-bold text-juicy-gold">Rs. {order.total}</span>
                </div>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                    Items · {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{item.product_name} × {item.quantity}</span>
                      <span className="text-zinc-500">Rs. {item.unit_price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                {order.created_at && (
                  <p className="mt-3 text-[10px] text-zinc-700">{new Date(order.created_at).toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
