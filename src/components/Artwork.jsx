import { useId } from 'react'

/**
 * Illustrated artwork.
 *
 * The reference design uses photography. Rather than ship broken <img> tags,
 * every photo slot is drawn as an SVG scene in the same warm palette, so the
 * page renders complete out of the box.
 *
 * TO USE REAL PHOTOS: drop files into `public/images/` and set the `image`
 * field on a wedding in `src/data/weddings.js`, or set HERO_IMAGE in
 * `src/components/Hero.jsx`. Both fall back to these illustrations.
 */

const palettes = {
  udaipur: { top: '#fbe6c0', bottom: '#eab97e', arch: '#c1854a', accent: '#a8324e' },
  jaipur: { top: '#fae3cd', bottom: '#e4b686', arch: '#bd7846', accent: '#95264a' },
  goa: { top: '#d6ebf2', bottom: '#f2e1bd', arch: '#c2a276', accent: '#2f7c8a' },
  jodhpur: { top: '#f8e2b6', bottom: '#dda45f', arch: '#b1713a', accent: '#8f2740' },
}

/* ------------------------------------------------------------------ */
/*  Shared figure groups                                              */
/* ------------------------------------------------------------------ */

const Groom = ({ accent = '#c1332f' }) => (
  <g>
    {/* churidar */}
    <path d="M-9 0h18v-32h-18z" fill="#efe2c8" />
    {/* sherwani */}
    <path
      d="M-16 -18Q-19 -46-12 -68L12 -68Q19 -46 16 -18Z"
      fill="#f7edda"
      stroke="#d9a94a"
      strokeWidth="1.2"
    />
    <path d="M0 -68v50" stroke="#d9a94a" strokeWidth="1" opacity="0.8" />
    {/* dupatta over shoulder */}
    <path d="M-12 -66Q-22 -50-18 -24Q-11 -34-8 -56Z" fill={accent} opacity="0.85" />
    {/* arm reaching toward bride */}
    <path
      d="M13 -58Q26 -48 30 -40"
      fill="none"
      stroke="#f7edda"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* head + turban */}
    <circle cx="0" cy="-77" r="9" fill="#e8b98d" />
    <path d="M-13 -81Q-14 -97 0 -97Q14 -97 13 -81Q6 -87 0 -86Q-6 -87-13 -81Z" fill={accent} />
    <path
      d="M-13 -81Q0 -74 13 -81"
      fill="none"
      stroke="#d9a94a"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    {/* kalgi */}
    <path
      d="M5 -96q7-9 3-17"
      fill="none"
      stroke="#d9a94a"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="-113" r="2.4" fill="#e9ca83" />
  </g>
)

const Bride = ({ accent = '#c1204a' }) => (
  <g>
    {/* lehenga */}
    <path
      d="M-27 0Q-22 -34-10 -58L10 -58Q22 -34 27 0Z"
      fill={accent}
      stroke="#d9a94a"
      strokeWidth="1.2"
    />
    <path
      d="M-25 -7Q0 -1 25 -7"
      fill="none"
      stroke="#e9ca83"
      strokeWidth="2.6"
      opacity="0.9"
    />
    <path d="M-14 -22q14 6 28 0" fill="none" stroke="#e9ca83" strokeWidth="1.2" opacity="0.6" />
    {/* choli */}
    <path d="M-11 -56Q-12 -72 0 -72Q12 -72 11 -56Z" fill={accent} />
    {/* arm toward groom */}
    <path
      d="M-11 -58Q-24 -48-28 -40"
      fill="none"
      stroke="#e8b98d"
      strokeWidth="5.4"
      strokeLinecap="round"
    />
    {/* head */}
    <circle cx="0" cy="-80" r="8.6" fill="#e8b98d" />
    {/* trailing dupatta */}
    <path
      d="M11 -84Q28 -70 25 -32Q13 -42 7 -62Z"
      fill={accent}
      opacity="0.9"
      stroke="#d9a94a"
      strokeWidth="1"
    />
    {/* veil over hair */}
    <path d="M-10 -85Q0 -93 10 -85Q0 -78-10 -85Z" fill={accent} />
    <path d="M-9 -86Q0 -91 9 -86" fill="none" stroke="#e9ca83" strokeWidth="1.6" />
    <circle cx="0" cy="-91" r="2" fill="#e9ca83" />
  </g>
)

const CoupleFigures = ({ x, y, s = 1, accent }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="2" rx="62" ry="7" fill="#8a5a2a" opacity="0.16" />
    <g transform="translate(-26 0)">
      <Groom accent={accent === '#2f7c8a' ? '#c1332f' : accent} />
    </g>
    <g transform="translate(26 0)">
      <Bride accent={accent === '#2f7c8a' ? '#c1204a' : accent} />
    </g>
    {/* joined hands */}
    <path
      d="M-4 -40h8"
      stroke="#e8b98d"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </g>
)

/* Row of marigold flowers used inside the scenes */
const FloralRow = ({ y, count, width, r = 7 }) =>
  Array.from({ length: count }).map((_, i) => {
    const x = (width / (count - 1)) * i
    const dy = y + (i % 2 === 0 ? 0 : 4)
    return (
      <g key={i}>
        <circle cx={x} cy={dy} r={i % 3 === 0 ? r : r * 0.8} fill={['#f7b733', '#f08c1f', '#dd6a12'][i % 3]} />
        <circle cx={x} cy={dy} r={r * 0.42} fill="#fde08a" opacity="0.8" />
      </g>
    )
  })

/* ------------------------------------------------------------------ */
/*  Wedding card scene (400 x 250)                                     */
/* ------------------------------------------------------------------ */

export const CoupleScene = ({ palette = 'udaipur', className = '' }) => {
  const id = useId().replace(/:/g, '')
  const p = palettes[palette] ?? palettes.udaipur
  const beach = palette === 'goa'

  return (
    <svg viewBox="0 0 400 250" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.top} />
          <stop offset="100%" stopColor={p.bottom} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#fff6de" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff6de" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="250" fill={`url(#sky-${id})`} />

      {/* bokeh lights */}
      {[
        [40, 60, 16],
        [120, 38, 10],
        [300, 52, 14],
        [366, 90, 18],
        [250, 30, 8],
        [180, 66, 7],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fffaf0" opacity="0.35" />
      ))}

      {beach ? (
        <>
          {/* sea + sand */}
          <rect y="130" width="400" height="34" fill="#7fb6c4" opacity="0.75" />
          <path d="M0 150q40 8 80 0t80 0 80 0 80 0 80 0v16H0Z" fill="#a9d2da" opacity="0.6" />
          <rect y="164" width="400" height="86" fill="#eddcb6" />
          {/* palms */}
          {[46, 352].map((x, i) => (
            <g key={i} transform={`translate(${x} 164)`}>
              <path d="M0 0C-2-30 2-58 6-84" stroke="#8a6a3a" strokeWidth="5" fill="none" />
              {[-70, -35, 0, 35, 70].map((a) => (
                <path
                  key={a}
                  d="M6-84q26-14 34-4-16 2-34 8Z"
                  fill="#3f7d4a"
                  transform={`rotate(${a} 6 -84)`}
                  opacity="0.9"
                />
              ))}
            </g>
          ))}
        </>
      ) : (
        <>
          {/* palace skyline */}
          <g fill={p.arch} opacity="0.35">
            <rect x="10" y="120" width="70" height="60" />
            <path d="M45 96c14 0 22 12 22 24H23c0-12 8-24 22-24Z" />
            <rect x="320" y="110" width="72" height="70" />
            <path d="M356 84c15 0 24 13 24 26h-48c0-13 9-26 24-26Z" />
          </g>
          {/* mandap pillars + arch */}
          <g stroke={p.arch} strokeWidth="7" fill="none" opacity="0.75">
            <path d="M104 196V96M296 196V96" />
            <path d="M104 96q96-56 192 0" />
          </g>
          <rect y="180" width="400" height="70" fill={p.arch} opacity="0.22" />
        </>
      )}

      <ellipse cx="200" cy="200" rx="170" ry="70" fill={`url(#glow-${id})`} />

      {/* floral arch along the top */}
      <g>{FloralRow({ y: 12, count: 30, width: 400, r: 8 })}</g>
      {/* hanging strands */}
      {[24, 376].map((x) => (
        <g key={x}>
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={x} cy={30 + i * 17} r={6} fill={['#f7b733', '#dd6a12'][i % 2]} />
          ))}
        </g>
      ))}

      <CoupleFigures x={200} y={216} s={1.2} accent={p.accent} />

      {/* petals on the ground */}
      {[
        [70, 226],
        [110, 236],
        [300, 230],
        [340, 240],
        [150, 242],
        [255, 238],
      ].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="6" ry="3" fill="#e0637a" opacity="0.5" />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero scene (1200 x 560)                                            */
/* ------------------------------------------------------------------ */

export const HeroScene = ({ className = '' }) => {
  const id = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="0 0 1200 560"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`hs-${id}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#fdf0d6" />
          <stop offset="45%" stopColor="#f9e3bd" />
          <stop offset="100%" stopColor="#e9c290" />
        </linearGradient>
        <radialGradient id={`hg-${id}`} cx="72%" cy="62%" r="46%">
          <stop offset="0%" stopColor="#fffaea" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fffaea" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`brass-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8d5f16" />
          <stop offset="40%" stopColor="#f0cd7a" />
          <stop offset="70%" stopColor="#d9a94a" />
          <stop offset="100%" stopColor="#8d5f16" />
        </linearGradient>
      </defs>

      <rect width="1200" height="560" fill={`url(#hs-${id})`} />

      {/* bokeh */}
      {[
        [90, 120, 34],
        [230, 70, 20],
        [520, 110, 26],
        [700, 60, 16],
        [1010, 130, 40],
        [1150, 250, 28],
        [400, 180, 14],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fffdf4" opacity="0.4" />
      ))}

      {/* palace on the right */}
      <g fill="#d3a678" opacity="0.5">
        <rect x="1010" y="250" width="150" height="180" />
        <path d="M1085 196c26 0 42 24 42 50h-84c0-26 16-50 42-50Z" />
        <rect x="1060" y="150" width="50" height="50" rx="6" />
        <path d="M1085 118c12 0 20 12 20 26h-40c0-14 8-26 20-26Z" />
        <rect x="960" y="300" width="60" height="130" />
        <path d="M990 262c18 0 28 18 28 38h-56c0-20 10-38 28-38Z" />
      </g>

      {/* mandap */}
      <g stroke="#c08b52" strokeWidth="14" fill="none" opacity="0.55">
        <path d="M660 470V190M1080 470V190" />
        <path d="M660 190q210-118 420 0" />
      </g>

      <ellipse cx="860" cy="420" rx="360" ry="170" fill={`url(#hg-${id})`} />

      {/* floral arch across the whole top */}
      <g>{FloralRow({ y: 20, count: 60, width: 1200, r: 13 })}</g>
      <g opacity="0.95">{FloralRow({ y: 46, count: 44, width: 1200, r: 9 })}</g>

      {/* hanging vertical strands */}
      {[36, 130, 1074, 1168].map((x, si) => (
        <g key={x}>
          <path d={`M${x} 40v${180 + si * 40}`} stroke="#7a5a2a" strokeWidth="2" opacity="0.4" />
          {Array.from({ length: 11 + si }).map((_, i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={60 + i * 24}
                r={i % 2 ? 9 : 11}
                fill={['#f7b733', '#dd6a12', '#f08c1f'][i % 3]}
              />
              <circle cx={x} cy={60 + i * 24} r={4.5} fill="#fde08a" opacity="0.8" />
            </g>
          ))}
        </g>
      ))}

      {/* temple bells */}
      {[
        [200, 60, 0.9],
        [1006, 40, 0.75],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 0v96" stroke="#a3711f" strokeWidth="3" />
          {[20, 40, 60, 80].map((cy) => (
            <circle key={cy} cx="0" cy={cy} r="5.4" fill="none" stroke="#c28c2c" strokeWidth="2.4" />
          ))}
          <path
            d="M0 96c-13 0-23 11-25 27-2 12-5 19-8 24h66c-3-5-6-12-8-24-2-16-12-27-25-27Z"
            fill={`url(#brass-${id})`}
          />
          <ellipse cx="0" cy="147" rx="33" ry="6.5" fill="#e9ca83" />
          <path d="M0 149v16" stroke="#8d5f16" strokeWidth="3" />
          <circle cx="0" cy="171" r="7.5" fill={`url(#brass-${id})`} />
        </g>
      ))}

      {/* ground + petals */}
      <path d="M0 470h1200v90H0Z" fill="#e7bd88" opacity="0.55" />
      {Array.from({ length: 40 }).map((_, i) => (
        <ellipse
          key={i}
          cx={((i * 137) % 1200) + 10}
          cy={480 + ((i * 53) % 70)}
          rx={8}
          ry={4}
          fill={i % 3 === 0 ? '#e0637a' : '#f0a03c'}
          opacity="0.45"
        />
      ))}

      {/* diya lamps */}
      {[300, 470, 640].map((x, i) => (
        <g key={x} transform={`translate(${x} ${500 + i * 8})`}>
          <path d="M-18 0h36c-2 9-9 14-18 14S-16 9-18 0Z" fill="#c08b52" />
          <path d="M0 0v-9" stroke="#8d5f16" strokeWidth="2" />
          <path d="M0-9c4-4 6-7 6-11 0-5-3-8-6-12-3 4-6 7-6 12 0 4 2 7 6 11Z" fill="#f7b733" />
        </g>
      ))}

      {/* couple */}
      <CoupleFigures x={880} y={476} s={2.5} accent="#a8324e" />

      {/* shehnai (bottom-left) */}
      <g transform="translate(60 330) rotate(28)">
        <path d="M0 0 210-26 214-8 4 18Z" fill={`url(#brass-${id})`} />
        <path d="M214-14c26-6 44 4 46 18s-14 26-40 22Z" fill={`url(#brass-${id})`} />
        <ellipse cx="258" cy="12" rx="10" ry="26" fill="#e9ca83" />
        {[50, 100, 150].map((x) => (
          <circle key={x} cx={x} cy={4 - x * 0.11} r="4" fill="#8d5f16" opacity="0.8" />
        ))}
      </g>

      {/* dhol (bottom-right) */}
      <g transform="translate(1030 400)">
        <path d="M-70 -46h140v92h-140Z" fill="#9d5b2a" />
        <ellipse cx="-70" cy="0" rx="16" ry="48" fill="#c8873f" />
        <ellipse cx="70" cy="0" rx="16" ry="48" fill="#e3cba0" />
        <ellipse cx="70" cy="0" rx="10" ry="34" fill="#c8873f" opacity="0.6" />
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M${-62 + i * 16} -44 ${-54 + i * 16} 44`}
            stroke="#f3e2c2"
            strokeWidth="3"
            opacity="0.85"
          />
        ))}
        <path d="M-70 -46h140M-70 46h140" stroke="#6f3c17" strokeWidth="4" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Small background scenes                                            */
/* ------------------------------------------------------------------ */

/* Dhol players — left side of "How It Works" */
export const MusiciansScene = ({ className = '' }) => (
  <svg viewBox="0 0 260 220" className={className} aria-hidden="true">
    {[
      [78, 0.98, '#e05a3a'],
      [162, 0.88, '#d98b2b'],
    ].map(([x, s, turban], i) => (
      <g key={i} transform={`translate(${x} 206) scale(${s})`}>
        <path d="M-16 0h32v-40h-32z" fill="#efe2c8" />
        <path d="M-22 -34Q-25 -70-14 -92L14 -92Q25 -70 22 -34Z" fill="#fbf3e2" stroke="#d9a94a" strokeWidth="1.4" />
        <circle cx="0" cy="-104" r="12" fill="#e8b98d" />
        <path d="M-17 -108Q-18 -128 0 -128Q18 -128 17 -108Q8 -115 0 -114Q-8 -115-17 -108Z" fill={turban} />
        <path d="M-17 -108Q0 -100 17 -108" fill="none" stroke="#d9a94a" strokeWidth="3" />
        {/* drum */}
        <g transform="translate(0 -46)">
          <path d="M-34 -16h68v34h-68Z" fill="#9d5b2a" />
          <ellipse cx="-34" cy="1" rx="8" ry="18" fill="#c8873f" />
          <ellipse cx="34" cy="1" rx="8" ry="18" fill="#e3cba0" />
          {Array.from({ length: 6 }).map((_, k) => (
            <path key={k} d={`M${-28 + k * 12} -15 ${-24 + k * 12} 17`} stroke="#f3e2c2" strokeWidth="2" />
          ))}
        </g>
        {/* arms */}
        <path d="M-20 -78Q-40 -60-36 -46" fill="none" stroke="#fbf3e2" strokeWidth="8" strokeLinecap="round" />
        <path d="M20 -78Q40 -60 36 -46" fill="none" stroke="#fbf3e2" strokeWidth="8" strokeLinecap="round" />
      </g>
    ))}
    {/* marigolds at their feet */}
    <g>{FloralRow({ y: 212, count: 14, width: 260, r: 6 })}</g>
  </svg>
)

/* Flower-lined mandap walkway — right side of "How It Works" */
export const MandapWalkScene = ({ className = '' }) => (
  <svg viewBox="0 0 260 220" className={className} aria-hidden="true">
    <path d="M40 210V70q90-58 180 0v140Z" fill="#f6e3c4" />
    <path d="M40 70q90-58 180 0" fill="none" stroke="#c08b52" strokeWidth="9" />
    <path d="M40 210V70M220 210V70" stroke="#c08b52" strokeWidth="11" fill="none" />
    <path d="M78 210V116q52-34 104 0v94Z" fill="#fbf1dc" />
    <path d="M78 116q52-34 104 0" fill="none" stroke="#d9a94a" strokeWidth="5" />
    {/* petal walkway */}
    <path d="M96 210 130 150 164 210Z" fill="#e6a2b0" opacity="0.7" />
    {/* flower clusters */}
    {[
      [40, 74],
      [220, 74],
      [130, 44],
      [60, 120],
      [200, 120],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="15" fill="#e8748c" opacity="0.85" />
        <circle cx={cx + 12} cy={cy + 8} r="10" fill="#f7b733" opacity="0.9" />
        <circle cx={cx - 12} cy={cy + 9} r="9" fill="#f4dfa0" opacity="0.9" />
      </g>
    ))}
    <g>{FloralRow({ y: 62, count: 16, width: 260, r: 6 })}</g>
  </svg>
)

/* Decorated elephant — bottom-left of the "Host Your Wedding" panel */
export const ElephantScene = ({ className = '' }) => (
  <svg viewBox="0 0 190 150" className={className} aria-hidden="true">
    <g fill="#b8763c">
      <path d="M46 132V96q-16-8-16-30 0-34 38-34h42q34 0 34 34v66h-18V98H64v34Z" />
      <path d="M150 68q16 4 16 22t-14 24l-6-4Z" />
      <path d="M30 62q-16 10-14 34t18 30l6-6q-12-10-12-26t8-26Z" />
    </g>
    {/* ear */}
    <path d="M62 46q26-8 34 12t-12 30q-24 2-30-14Z" fill="#a2652f" />
    {/* howdah / canopy */}
    <path d="M64 32h56l-8-16H72Z" fill="#a8324e" />
    <path d="M60 16h64l-32-14Z" fill="#d9a94a" />
    <circle cx="92" cy="0" r="4" fill="#f7b733" />
    {/* jewelled drape */}
    <path d="M40 62q26 14 58 0" fill="none" stroke="#d9a94a" strokeWidth="4" />
    {[48, 62, 76, 90].map((x, i) => (
      <circle key={x} cx={x} cy={68 + (i % 2) * 4} r="3.4" fill="#f7b733" />
    ))}
    {/* tusk + eye */}
    <path d="M34 84q-12 6-6 16" fill="none" stroke="#fdf6ea" strokeWidth="5" strokeLinecap="round" />
    <circle cx="52" cy="60" r="3" fill="#4a2b2b" />
  </svg>
)

/* Draped reception hall — right side of the "Host Your Wedding" panel */
export const VenueScene = ({ className = '' }) => (
  <svg viewBox="0 0 420 240" className={className} aria-hidden="true">
    <rect width="420" height="240" fill="#f8e6c8" />
    {/* curtains */}
    {[0, 300].map((x, i) => (
      <g key={i} transform={`translate(${x} 0)`}>
        <path d="M0 0h120v240q-40-30-60-120T0 0Z" fill="#c8546f" opacity="0.6" />
        <path d="M24 0q6 120 40 200" stroke="#e8a0b0" strokeWidth="6" fill="none" opacity="0.5" />
        <path d="M76 0q-4 120-30 200" stroke="#e8a0b0" strokeWidth="6" fill="none" opacity="0.5" />
      </g>
    ))}
    {/* arch */}
    <path d="M140 240V110q70-52 140 0v130Z" fill="#fbf1dc" opacity="0.9" />
    <path d="M140 110q70-52 140 0" fill="none" stroke="#d9a94a" strokeWidth="7" />
    <path d="M140 240V110M280 240V110" stroke="#d9a94a" strokeWidth="7" />
    {/* chandelier */}
    <g transform="translate(210 10)">
      <path d="M0 0v26" stroke="#c28c2c" strokeWidth="3" />
      <path d="M-34 30h68" stroke="#d9a94a" strokeWidth="4" />
      {[-26, -13, 0, 13, 26].map((x) => (
        <g key={x}>
          <path d={`M${x} 30v14`} stroke="#d9a94a" strokeWidth="2" />
          <circle cx={x} cy={48} r="5" fill="#f7e2a8" />
        </g>
      ))}
    </g>
    {/* chairs */}
    {Array.from({ length: 7 }).map((_, i) => (
      <g key={i} transform={`translate(${34 + i * 58} 196)`}>
        <path d="M0 0h26v34H0Z" fill="#fdf6ea" opacity="0.95" />
        <path d="M2 0h22v-30q-11-8-22 0Z" fill="#fdf6ea" opacity="0.95" />
        <path d="M2 -14h22" stroke="#d9a94a" strokeWidth="3" />
      </g>
    ))}
    <g>{FloralRow({ y: 96, count: 22, width: 420, r: 8 })}</g>
  </svg>
)
