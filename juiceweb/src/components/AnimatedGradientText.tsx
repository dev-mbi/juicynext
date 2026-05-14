"use client"

export default function AnimatedGradientText({
  children,
  className = "",
  from = "#FFD700",
  via = "#FF6B00",
  to = "#FFD700",
}: {
  children: React.ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
}) {
  return (
    <span
      className={`bg-clip-text text-transparent animate-gradient ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to}, ${from})`,
        backgroundSize: "300% 300%",
      }}
    >
      {children}
    </span>
  )
}
