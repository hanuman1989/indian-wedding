/**
 * Decorative ornaments — the gold-on-maroon borders, mandalas, marigold
 * garlands and section flourishes that frame the page.
 *
 * All of them are pure SVG so they scale crisply and recolour with props.
 */

/* Thin repeating paisley band that sits above the navbar and under the footer */
export const PaisleyBand = ({ className = '', flip = false }) => (
  <div className={`h-4 w-full overflow-hidden bg-wine-900 ${className}`}>
    <svg
      className={`h-4 w-full ${flip ? 'rotate-180' : ''}`}
      preserveAspectRatio="none"
      viewBox="0 0 1200 16"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="paisley"
          x="0"
          y="0"
          width="48"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 2c5 0 8 3 8 6.5S28 15 24 15s-8-3-8-6.5S19 2 24 2Z"
            fill="none"
            stroke="#d9a94a"
            strokeWidth="0.9"
            opacity="0.85"
          />
          <circle cx="24" cy="8.5" r="1.8" fill="#e9ca83" opacity="0.9" />
          <path
            d="M0 8.5h14M34 8.5h14"
            stroke="#c28c2c"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <circle cx="7" cy="8.5" r="1" fill="#d9a94a" opacity="0.6" />
          <circle cx="41" cy="8.5" r="1" fill="#d9a94a" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="1200" height="16" fill="url(#paisley)" />
    </svg>
  </div>
)

/* Concentric-petal mandala, used as a watermark and inside logo/step chips */
export const Mandala = ({ className = 'h-10 w-10', petals = 12 }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="34" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="12" />
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i
        return (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <path d="M50 14c5 7 5 13 0 20-5-7-5-13 0-20Z" strokeWidth="1.5" />
            <path d="M50 38v-4" strokeWidth="1.2" />
          </g>
        )
      })}
      {Array.from({ length: petals }).map((_, i) => (
        <circle
          key={`d-${i}`}
          cx="50"
          cy="6"
          r="1.6"
          fill="currentColor"
          stroke="none"
          transform={`rotate(${(360 / petals) * i + 360 / petals / 2} 50 50)`}
        />
      ))}
    </g>
    <circle cx="50" cy="50" r="5" fill="currentColor" />
  </svg>
)

/* The "~~◆ Title ◆~~" flourish that brackets every section heading */
const Flourish = ({ mirrored = false }) => (
  <svg
    viewBox="0 0 74 16"
    className={`h-4 w-[74px] text-gold-500 ${mirrored ? 'scale-x-[-1]' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M2 8c6-6 12 6 18 0s12-6 18 0" />
    <path d="M44 8h12" />
    <path
      d="M64 3.4 68.6 8 64 12.6 59.4 8 64 3.4Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
)

export const SectionHeading = ({ title, subtitle, className = '' }) => (
  <div className={`text-center ${className}`}>
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <Flourish mirrored />
      <h2 className="font-display text-2xl font-bold text-wine-700 sm:text-[28px]">
        {title}
      </h2>
      <Flourish />
    </div>
    {subtitle && (
      <p className="mt-2 text-sm text-ink-soft sm:text-[15px]">{subtitle}</p>
    )}
  </div>
)

/* Horizontal marigold garland — a row of flowers with a hanging thread */
export const MarigoldGarland = ({
  className = '',
  count = 26,
  height = 34,
  width = 1200,
}) => {
  const step = width / (count - 1)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={`M0 6 Q ${width / 2} ${height * 0.62} ${width} 6`}
        fill="none"
        stroke="#7a5a2a"
        strokeWidth="1.4"
        opacity="0.5"
      />
      {Array.from({ length: count }).map((_, i) => {
        const x = i * step
        // Follow the sag of the thread
        const t = i / (count - 1)
        const y = 6 + 4 * (height * 0.62 - 6) * t * (1 - t) * 2
        const r = i % 3 === 0 ? 9 : i % 3 === 1 ? 7 : 8
        const fill = ['#f7b733', '#f08c1f', '#dd6a12'][i % 3]
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={fill} />
            <circle cx={x} cy={y} r={r * 0.55} fill="#fde08a" opacity="0.75" />
            {i % 4 === 0 && (
              <path
                d={`M${x} ${y + r} q 5 6 0 12 q -5 -6 0 -12Z`}
                fill="#3f7d3a"
                opacity="0.75"
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* Vertical marigold strand for the hero's left/right edges */
export const MarigoldStrand = ({ className = '', count = 14 }) => (
  <svg
    viewBox="0 0 30 420"
    className={className}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M15 0v420" stroke="#7a5a2a" strokeWidth="1.2" opacity="0.45" />
    {Array.from({ length: count }).map((_, i) => {
      const y = 12 + i * (400 / count)
      const r = i % 2 === 0 ? 10 : 8
      const fill = ['#f7b733', '#dd6a12', '#f08c1f'][i % 3]
      return (
        <g key={i}>
          <circle cx="15" cy={y} r={r} fill={fill} />
          <circle cx="15" cy={y} r={r * 0.5} fill="#fde08a" opacity="0.7" />
        </g>
      )
    })}
  </svg>
)

/* Brass temple bell on a chain */
export const HangingBell = ({ className = '' }) => (
  <svg viewBox="0 0 60 190" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a3711f" />
        <stop offset="35%" stopColor="#f0cd7a" />
        <stop offset="60%" stopColor="#d9a94a" />
        <stop offset="100%" stopColor="#8d5f16" />
      </linearGradient>
    </defs>
    <path d="M30 0v78" stroke="#a3711f" strokeWidth="2.4" />
    {[18, 34, 50, 66].map((y) => (
      <circle
        key={y}
        cx="30"
        cy={y}
        r="4.6"
        fill="none"
        stroke="#c28c2c"
        strokeWidth="2"
      />
    ))}
    <path
      d="M30 78c-11 0-19 9-21 22-1.6 10-4 16-6 20h54c-2-4-4.4-10-6-20-2-13-10-22-21-22Z"
      fill="url(#brass)"
    />
    <ellipse cx="30" cy="122" rx="27" ry="5.4" fill="#e9ca83" />
    <path d="M30 124v14" stroke="#8d5f16" strokeWidth="2.6" />
    <circle cx="30" cy="143" r="6.4" fill="url(#brass)" />
  </svg>
)

/* Rounded-square mandala emblem used as the brand mark */
export const BrandMark = ({ className = 'h-11 w-11' }) => (
  <span
    className={`grid place-items-center rounded-xl border border-gold-400/70 bg-wine-900/40 text-gold-300 ${className}`}
  >
    <Mandala className="h-[70%] w-[70%]" petals={8} />
  </span>
)

export const Logo = ({ tone = 'light' }) => (
  <a href="#top" className="flex items-center gap-3" aria-label="Shaadi Invites home">
    <BrandMark />
    <span className="leading-none">
      <span
        className={`block font-display text-[26px] font-semibold ${
          tone === 'light' ? 'text-cream-50' : 'text-wine-700'
        }`}
      >
        Shaadi
      </span>
      <span className="mt-0.5 flex items-center gap-1.5 text-[9px] font-medium tracking-[0.28em] text-gold-300">
        <span className="h-px w-3 bg-gold-400/70" />
        INVITES
        <span className="h-px w-3 bg-gold-400/70" />
      </span>
    </span>
  </a>
)
