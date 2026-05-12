export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
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
          </div>

          {/* Social */}
          <div className="flex gap-4 text-zinc-600">
            <span className="text-xs">Instagram</span>
            <span className="text-xs">TikTok</span>
            <span className="text-xs">YouTube</span>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-[10px] text-zinc-700">
          &copy; {new Date().getFullYear()} JuicyNext. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
