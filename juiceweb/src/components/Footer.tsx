import dynamic from "next/dynamic"

const Scroll3D = dynamic(() => import("@/components/3d/Scroll3D"), { ssr: false })

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 py-12 px-6">
      <Scroll3D />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="/" className="font-heading text-lg font-bold tracking-wider text-juicy-gold">
              🥭 JuicyNext
            </a>
            <p className="mt-1 text-xs text-zinc-600">
              Next-generation beverages. Taste the Future.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-xs text-zinc-500">
            <a href="#flavors" className="transition-colors hover:text-white">
              Flavors
            </a>
            <a href="#collection" className="transition-colors hover:text-white">
              Collection
            </a>
            <a href="#future" className="transition-colors hover:text-white">
              Coming Soon
            </a>
            <a href="/track" className="transition-colors hover:text-white">
              Track Order
            </a>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3 text-zinc-600">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/everpure.2025?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs transition-colors hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>everpure.2025</span>
              </a>
            </div>
            <div className="flex gap-4 text-zinc-600">
              <span className="text-xs">TikTok</span>
              <span className="text-xs">YouTube</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-400">
              🇵🇰 100% Pakistani Brand
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              ☪️ Halal Certified
            </span>
          </div>
          <p className="text-[10px] text-zinc-700">
            &copy; {new Date().getFullYear()} JuicyNext. All rights reserved.
          </p>
          <p className="mt-1 text-[10px] text-zinc-700">
            Developed & Designed by <span className="text-zinc-500">Cloueaxil</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
