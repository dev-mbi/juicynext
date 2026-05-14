import { useId } from "react"

export default function MangoIcon({ className = "text-5xl", color1 = "#FFA500", color2 = "#FF6B00" }: {
  className?: string
  color1?: string
  color2?: string
}) {
  const uid = useId()

  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`mango-body-${uid}`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="60%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </radialGradient>
        <radialGradient id={`mango-blush-${uid}`} cx="0.7" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#FF3D00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`leaf-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <filter id={`shadow-${uid}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={color2} floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${uid})`}>
        {/* Mango body - kidney/oval shape */}
        <path
          d="M60 15 C85 15 105 35 108 60 C111 85 100 110 80 120 C60 130 40 125 25 110 C10 95 5 75 10 55 C15 35 35 15 60 15Z"
          fill={`url(#mango-body-${uid})`}
        />

        {/* Blush / red gradient on one side */}
        <path
          d="M60 15 C85 15 105 35 108 60 C111 85 100 110 80 120 C60 130 40 125 25 110 C10 95 5 75 10 55 C15 35 35 15 60 15Z"
          fill={`url(#mango-blush-${uid})`}
        />

        {/* Highlight / shine */}
        <path
          d="M35 40 C45 30 65 28 75 35"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M30 55 C35 45 45 38 55 38"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Subtle crease line (mango characteristic) */}
        <path
          d="M25 65 C30 70 35 72 40 70"
          stroke={color2}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
        />
      </g>

      {/* Stem */}
      <rect x="56" y="8" width="8" height="12" rx="3" fill="#5C3A1E" />

      {/* Leaf */}
      <path
        d="M60 12 C65 2 80 -2 90 2 C80 8 68 12 60 12Z"
        fill={`url(#leaf-${uid})`}
        stroke="#15803d"
        strokeWidth="0.5"
      />

      {/* Leaf vein */}
      <path
        d="M62 10 C70 7 80 5 87 4"
        stroke="#15803d"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  )
}
