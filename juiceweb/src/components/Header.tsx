export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥭</span>
          <span className="font-heading text-lg font-bold tracking-wider text-juicy-gold">
            JuicyNext
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#flavors" className="text-zinc-400 transition-colors hover:text-white">
            Flavors
          </a>
          <a href="#collection" className="text-zinc-400 transition-colors hover:text-white">
            Collection
          </a>
          <a href="#future" className="text-zinc-400 transition-colors hover:text-white">
            Coming Soon
          </a>
        </nav>

        <a
          href="#buy"
          className="rounded-full bg-gradient-to-r from-juicy-orange to-juicy-gold px-6 py-2 text-sm font-semibold text-black transition-all hover:scale-105"
        >
          Buy Now
        </a>
      </div>
    </header>
  )
}
