export default function BottleIcon({ className = "text-5xl", color1 = "#FF6B00", color2 = "#FFD700" }: {
  className?: string
  color1?: string
  color2?: string
}) {
  return (
    <svg className={className} viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bottle body */}
      <defs>
        <linearGradient id={`bottle-grad-${color1}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="0.7" />
          <stop offset="50%" stopColor={color2} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color1} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id={`liquid-grad-${color1}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color2} />
          <stop offset="100%" stopColor={color1} />
        </linearGradient>
      </defs>

      {/* Glow */}
      <ellipse cx="50" cy="100" rx="35" ry="60" fill={color1} opacity="0.15" filter="url(#glow)" />
      <defs>
        <filter id={`glow-${color1}`}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Bottle outline */}
      <path
        d="M35 150 C35 170 40 180 50 180 C60 180 65 170 65 150 L68 70 C68 55 72 45 75 40 L78 35 C80 30 78 25 75 23 L70 20 C65 18 55 15 50 15 C45 15 35 18 30 20 L25 23 C22 25 20 30 22 35 L25 40 C28 45 32 55 32 70 L35 150Z"
        fill={`url(#bottle-grad-${color1})`}
        stroke={color2}
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* Cap */}
      <rect x="42" y="10" width="16" height="8" rx="2" fill="#222" stroke="#444" strokeWidth="0.5" />
      <rect x="40" y="8" width="20" height="4" rx="1" fill="#333" />

      {/* Liquid inside */}
      <path
        d="M36 145 C36 160 42 175 50 175 C58 175 64 160 64 145 L66 75 C66 62 68 52 70 47 L65 50 C62 55 58 65 58 75 L56 145 C56 152 53 160 50 160 C47 160 44 152 44 145 L42 75 C42 65 38 55 35 50 L30 47 C32 52 34 62 34 75 L36 145Z"
        fill={`url(#liquid-grad-${color1})`}
        opacity="0.6"
      />

      {/* Highlight / shine */}
      <path
        d="M38 50 C38 50 40 80 40 140 C40 150 42 160 44 165"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Label area */}
      <rect x="38" y="100" width="24" height="30" rx="3" fill="white" opacity="0.1" />
    </svg>
  )
}
