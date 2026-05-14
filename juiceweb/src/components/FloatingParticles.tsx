"use client"

export default function FloatingParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ["#FFD700", "#FF6B00", "#8B00FF", "#FF1493"][i % 4],
            opacity: 0,
            animation: `float-particle ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 5}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
