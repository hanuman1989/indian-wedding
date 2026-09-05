/**
 * Inline SVG icon set.
 *
 * Hand-rolled instead of pulling in an icon package so the whole page has
 * zero runtime dependencies beyond React. Every icon inherits `currentColor`
 * and takes a `className` for sizing.
 */

// Stroked (outline) icons
const S = ({ className = 'h-5 w-5', children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

// Filled icons (brand marks, badges)
const F = ({ className = 'h-5 w-5', children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

/* ---------------------------------- UI ---------------------------------- */

export const Search = (p) => (
  <S {...p}>
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 4.2 4.2" />
  </S>
)

export const ArrowRight = (p) => (
  <S {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </S>
)

export const Check = (p) => (
  <S {...p}>
    <path d="m5 12.5 4.3 4.3L19 7.2" />
  </S>
)

export const Upload = (p) => (
  <S {...p}>
    <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5M5 15.5v3.7c0 .7.6 1.3 1.3 1.3h11.4c.7 0 1.3-.6 1.3-1.3v-3.7" />
  </S>
)

export const Grip = (p) => (
  <S {...p}>
    <circle cx="8.5" cy="6.5" r=".7" fill="currentColor" />
    <circle cx="15.5" cy="6.5" r=".7" fill="currentColor" />
    <circle cx="8.5" cy="12" r=".7" fill="currentColor" />
    <circle cx="15.5" cy="12" r=".7" fill="currentColor" />
    <circle cx="8.5" cy="17.5" r=".7" fill="currentColor" />
    <circle cx="15.5" cy="17.5" r=".7" fill="currentColor" />
  </S>
)

export const X = (p) => (
  <S {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </S>
)

export const Plus = (p) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
)

export const Pencil = (p) => (
  <S {...p}>
    <path d="m4.5 19.5 3.8-.8L19 8l-3-3L5.3 15.7l-.8 3.8Z" />
    <path d="m14.5 6.5 3 3" />
  </S>
)

export const Trash = (p) => (
  <S {...p}>
    <path d="M4.5 7h15M9.5 3.8h5M7 7l.8 13h8.4L17 7M10 10.5v6M14 10.5v6" />
  </S>
)

export const Photo = (p) => (
  <S {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <circle cx="8.5" cy="9" r="1.5" />
    <path d="m5 17 4.5-4.5 3.2 3.2 2.1-2.1L19 17" />
  </S>
)

export const ChevronLeft = (p) => (
  <S {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </S>
)

export const ChevronRight = (p) => (
  <S {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </S>
)

export const ChevronDown = (p) => (
  <S {...p}>
    <path d="m5 9 7 7 7-7" />
  </S>
)

export const Heart = (p) => (
  <S {...p}>
    <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
  </S>
)

export const HeartFilled = (p) => (
  <F {...p}>
    <path d="M12 20.5s-8-4.9-8-10.2A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 8 3.3c0 5.3-8 10.2-8 10.2Z" />
  </F>
)

export const MapPin = (p) => (
  <S {...p}>
    <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0C5.5 15 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.4" />
  </S>
)

export const Calendar = (p) => (
  <S {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8.5 3.5v3M15.5 3.5v3" />
  </S>
)

export const Globe = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z" />
  </S>
)

export const Sliders = (p) => (
  <S {...p}>
    <path d="M4 7h10M18 7h2M4 12h3M11 12h9M4 17h8M16 17h4" />
    <circle cx="16" cy="7" r="1.9" />
    <circle cx="9" cy="12" r="1.9" />
    <circle cx="14" cy="17" r="1.9" />
  </S>
)

export const Send = (p) => (
  <S {...p}>
    <path d="M4 11.5 20 4l-7.4 16-2-6.4L4 11.5Z" />
  </S>
)

/* ------------------------------ Trust badges ---------------------------- */

export const Rings = (p) => (
  <S {...p}>
    <circle cx="9.3" cy="14" r="5.2" />
    <circle cx="15.4" cy="14" r="5.2" />
    <path d="m12.4 5.6 1.6 2.2h-3.2l1.6-2.2Z" />
  </S>
)

export const Shield = (p) => (
  <S {...p}>
    <path d="M12 3.2 5.5 5.6v5.9c0 4.2 2.8 7.4 6.5 9.3 3.7-1.9 6.5-5.1 6.5-9.3V5.6L12 3.2Z" />
    <path d="m9.2 12.1 2 2 3.6-3.9" />
  </S>
)

export const Wallet = (p) => (
  <S {...p}>
    <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
    <path d="M3 10.5h18" />
    <circle cx="16.8" cy="14.6" r="1.1" fill="currentColor" stroke="none" />
  </S>
)

export const Ticket = (p) => (
  <S {...p}>
    <path d="M4 8.2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.4a2.4 2.4 0 0 0 0 4.8v1.4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.4a2.4 2.4 0 0 0 0-4.8V8.2Z" />
    <path d="M12.5 9v6" strokeDasharray="1.6 1.8" />
  </S>
)

/* ------------------------------ How it works ---------------------------- */

export const ListDetails = (p) => (
  <S {...p}>
    <rect x="4" y="3.2" width="16" height="17.6" rx="2.4" />
    <path d="M8 8.5h8M8 12.5h8M8 16.5h4.5" />
  </S>
)

export const UserPlus = (p) => (
  <S {...p}>
    <circle cx="10" cy="8.2" r="3.6" />
    <path d="M3.8 20c.4-3.5 3-5.8 6.2-5.8 1.2 0 2.3.3 3.2.9" />
    <path d="M16.6 15.4h4.6M18.9 13.1v4.6" />
  </S>
)

export const CreditCard = (p) => (
  <S {...p}>
    <rect x="2.8" y="5.8" width="18.4" height="12.4" rx="2.2" />
    <path d="M2.8 9.9h18.4" />
    <path d="M6.4 14.6h3.4" />
  </S>
)

export const Gift = (p) => (
  <S {...p}>
    <rect x="3.6" y="9" width="16.8" height="11.4" rx="1.8" />
    <path d="M3.6 13.4h16.8M12 9v11.4" />
    <path d="M12 9C10.6 9 7.2 8.6 7.2 6.4A2.4 2.4 0 0 1 12 6.1 2.4 2.4 0 0 1 16.8 6.4C16.8 8.6 13.4 9 12 9Z" />
  </S>
)

/* -------------------------------- Stats --------------------------------- */

export const Couple = (p) => (
  <S {...p}>
    <circle cx="8.4" cy="6.6" r="2.7" />
    <circle cx="15.8" cy="6.6" r="2.7" />
    <path d="M4 20.4c0-3 2-5.2 4.4-5.2s4.4 2.2 4.4 5.2" />
    <path d="M11.6 20.4c0-3 1.9-5.2 4.2-5.2s4.2 2.2 4.2 5.2" />
  </S>
)

export const Users = (p) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.4 20c0-3.4 2.5-5.9 5.6-5.9S14.6 16.6 14.6 20" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 6.2M17.4 14.6c2.1.6 3.6 2.7 3.6 5.4" />
  </S>
)

export const Lotus = (p) => (
  <S {...p}>
    <path d="M12 4.4c1.7 1.9 2.6 4 2.6 6.4S13.7 15.4 12 17.2c-1.7-1.8-2.6-4-2.6-6.4S10.3 6.3 12 4.4Z" />
    <path d="M12 17.2c-2.5.6-4.9-.1-6.9-2 .5-2.5 2-4.3 4.3-5.2M12 17.2c2.5.6 4.9-.1 6.9-2-.5-2.5-2-4.3-4.3-5.2" />
  </S>
)

export const Star = (p) => (
  <S {...p}>
    <path d="m12 3.8 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8L12 3.8Z" />
  </S>
)

/* ------------------------------ Host section ---------------------------- */

export const Coins = (p) => (
  <S {...p}>
    <ellipse cx="12" cy="6.6" rx="6.8" ry="2.8" />
    <path d="M5.2 6.6v4c0 1.6 3 2.9 6.8 2.9s6.8-1.3 6.8-2.9v-4" />
    <path d="M5.2 10.6v4c0 1.6 3 2.9 6.8 2.9s6.8-1.3 6.8-2.9v-4" />
  </S>
)

export const ClipboardUsers = (p) => (
  <S {...p}>
    <path d="M8.6 4.4H6.8A1.8 1.8 0 0 0 5 6.2v12.6a1.8 1.8 0 0 0 1.8 1.8h10.4a1.8 1.8 0 0 0 1.8-1.8V6.2a1.8 1.8 0 0 0-1.8-1.8h-1.8" />
    <rect x="8.6" y="2.8" width="6.8" height="3.2" rx="1.2" />
    <circle cx="12" cy="11.4" r="2" />
    <path d="M8.6 17.2c0-1.9 1.5-3.2 3.4-3.2s3.4 1.3 3.4 3.2" />
  </S>
)

export const Lock = (p) => (
  <S {...p}>
    <rect x="4.6" y="10.4" width="14.8" height="9.6" rx="2.2" />
    <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" />
    <path d="M12 14.2v2.2" />
  </S>
)

export const BookHeart = (p) => (
  <S {...p}>
    <path d="M4.4 4.6A1.8 1.8 0 0 1 6.2 2.8h13v18.4h-13a1.8 1.8 0 0 1-1.8-1.8V4.6Z" />
    <path d="M4.4 17.6h14.8" />
    <path d="M11.8 12.6s-2.7-1.6-2.7-3.4a1.6 1.6 0 0 1 2.7-1 1.6 1.6 0 0 1 2.7 1c0 1.8-2.7 3.4-2.7 3.4Z" />
  </S>
)

export const Mail = (p) => (
  <S {...p}>
    <rect x="3.2" y="5.6" width="17.6" height="12.8" rx="2.2" />
    <path d="m4 7 8 6 8-6" />
  </S>
)

export const Phone = (p) => (
  <S {...p}>
    <path d="M7.2 3.8 4.9 5.1c-1 3.2.4 7.3 3.4 10.3s7.1 4.4 10.3 3.4l1.3-2.3-4-2.4-1.7 1.7c-1.6-.7-3.2-2.3-3.9-3.9l1.7-1.7-2.4-4Z" />
  </S>
)

export const Eye = (p) => (
  <S {...p}>
    <path d="M2.4 12S5.6 5.6 12 5.6 21.6 12 21.6 12 18.4 18.4 12 18.4 2.4 12 2.4 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </S>
)

export const EyeOff = (p) => (
  <S {...p}>
    <path d="M3.6 3.6l16.8 16.8" />
    <path d="M9.9 5.1A9.6 9.6 0 0 1 12 4.8c6.4 0 9.6 6.4 9.6 6.4a15 15 0 0 1-3 3.9M6.6 6.7C3.9 8.4 2.4 11.2 2.4 11.2S5.6 17.6 12 17.6c1.2 0 2.3-.2 3.3-.6" />
    <path d="M9.9 10.9a2.8 2.8 0 0 0 3.9 3.9" />
  </S>
)

/* ------------------------------ Feature strip --------------------------- */

export const Mandap = (p) => (
  <S {...p}>
    <path d="M4 20V9.6M20 20V9.6" />
    <path d="M3 9.6h18" />
    <path d="M4.6 9.6C6.2 6.4 8.9 4.8 12 4.8s5.8 1.6 7.4 4.8" />
    <path d="M9 20v-4.4a3 3 0 0 1 6 0V20" />
  </S>
)

export const Diya = (p) => (
  <S {...p}>
    <path d="M4.6 14.4h14.8c-.8 2.8-3.6 4.6-7.4 4.6s-6.6-1.8-7.4-4.6Z" />
    <path d="M12 14.4V11" />
    <path d="M12 10.6c1.4-1 2-2 2-3.2 0-1.4-1-2.4-2-3.4-1 1-2 2-2 3.4 0 1.2.6 2.2 2 3.2Z" />
  </S>
)

export const Plate = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="4.6" />
    <path d="M12 3.4v1.6M20.6 12H19M12 20.6V19M5 12H3.4" />
  </S>
)

export const BadgeCheck = (p) => (
  <S {...p}>
    <path d="m12 2.8 2.3 1.7 2.8-.3 1 2.6 2.4 1.5-.9 2.7.9 2.7-2.4 1.5-1 2.6-2.8-.3L12 21.2l-2.3-1.7-2.8.3-1-2.6-2.4-1.5.9-2.7-.9-2.7 2.4-1.5 1-2.6 2.8.3L12 2.8Z" />
    <path d="m9.2 12.2 1.9 1.9 3.7-4" />
  </S>
)

/* --------------------------------- Social -------------------------------- */

export const Facebook = (p) => (
  <F {...p}>
    <path d="M13.9 21v-7.6h2.6l.4-3h-3V8.5c0-.9.2-1.5 1.5-1.5h1.6V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H8v3h2.6V21h3.3Z" />
  </F>
)

export const Instagram = (p) => (
  <F {...p}>
    <path d="M12 2.2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5a4.6 4.6 0 0 0-1.8 1.1 4.6 4.6 0 0 0-1.1 1.8c-.3.6-.4 1.3-.5 2.4C2 9.2 2 9.5 2 12s0 2.8.1 3.9c0 1 .2 1.8.5 2.4a4.6 4.6 0 0 0 1.1 1.8 4.6 4.6 0 0 0 1.8 1.1c.6.3 1.3.4 2.4.5 1.1 0 1.4.1 4.1.1s3 0 4.1-.1c1 0 1.8-.2 2.4-.5a4.9 4.9 0 0 0 2.9-2.9c.3-.6.4-1.3.5-2.4 0-1.1.1-1.4.1-3.9s0-2.8-.1-3.9c0-1-.2-1.8-.5-2.4a4.6 4.6 0 0 0-1.1-1.8 4.6 4.6 0 0 0-1.8-1.1c-.6-.3-1.3-.4-2.4-.5C15 2.2 14.7 2.2 12 2.2Zm0 1.8c2.6 0 2.9 0 4 .1.8 0 1.2.2 1.5.3.4.1.7.3 1 .6.3.3.5.6.6 1 .1.3.3.7.3 1.5.1 1.1.1 1.4.1 3.7s0 2.6-.1 3.7c0 .8-.2 1.2-.3 1.5-.1.4-.3.7-.6 1-.3.3-.6.5-1 .6-.3.1-.7.3-1.5.3-1.1.1-1.4.1-4 .1s-2.9 0-4-.1c-.8 0-1.2-.2-1.5-.3a2.7 2.7 0 0 1-1-.6 2.7 2.7 0 0 1-.6-1c-.1-.3-.3-.7-.3-1.5-.1-1.1-.1-1.4-.1-3.7s0-2.6.1-3.7c0-.8.2-1.2.3-1.5.1-.4.3-.7.6-1 .3-.3.6-.5 1-.6.3-.1.7-.3 1.5-.3 1.1-.1 1.4-.1 4-.1Z" />
    <path d="M12 15.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm0-8.4a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Z" />
    <circle cx="17.4" cy="6.6" r="1.2" />
  </F>
)

export const Youtube = (p) => (
  <F {...p}>
    <path d="M21.6 7.6a2.5 2.5 0 0 0-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.6C2 9.2 2 12 2 12s0 2.8.4 4.4a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.4.4-4.4s0-2.8-.4-4.4ZM10 15.1V8.9l5.3 3.1-5.3 3.1Z" />
  </F>
)

export const Whatsapp = (p) => (
  <F {...p}>
    <path d="M12 2.4A9.5 9.5 0 0 0 3.8 16.6L2.4 21.6l5.2-1.4A9.5 9.5 0 1 0 12 2.4Zm0 1.8a7.7 7.7 0 0 1 6.5 11.8l-.3.5.8 2.8-2.9-.8-.5.3A7.7 7.7 0 1 1 12 4.2Z" />
    <path d="M9.3 7.9c-.2-.5-.4-.5-.7-.5h-.5a1 1 0 0 0-.7.4c-.3.3-.9 1-.9 2.2s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.1-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.3-.1-.5l-.9-2.2Z" />
  </F>
)

// Multi-color brand mark, kept as its own SVG since it doesn't fit the single-color S/F wrappers
export const Google = ({ className = 'h-5 w-5', ...rest }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...rest}>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.5Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7Z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.9 39.7 16.4 44 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 36 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5Z" />
  </svg>
)
