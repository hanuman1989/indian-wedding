function StatIcon({ type }) {
  if (type === "revenue") return <span className="text-3xl font-bold">$</span>;

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      {type === "bookings" && (
        <g fill="currentColor">
          <circle cx="12" cy="6" r="3" />
          <circle cx="5" cy="8" r="2.5" />
          <circle cx="19" cy="8" r="2.5" />
          <path d="M7 21v-7a5 5 0 0 1 10 0v7H7ZM1 19v-5a4 4 0 0 1 5-3.9A7 7 0 0 0 5 14v5H1ZM19 19v-5a7 7 0 0 0-1-3.9 4 4 0 0 1 5 3.9v5h-4Z" />
        </g>
      )}
      {type === "pending" && (
        <g
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3h12M6 21h12M7 3v4l5 5-5 5v4M17 3v4l-5 5 5 5v4" />
        </g>
      )}
      {type === "confirmed" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" />
          <path
            d="m7.5 12 3 3 6-6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {type === "cancelled" && (
        <>
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path
            d="m8.5 8.5 7 7m0-7-7 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export default function BookingStats({ stats = {} }) {
  const confirmed = stats.confirmed ?? stats.bookings_by_status?.confirmed ?? 0;
  const cards = [
    {
      type: "bookings",
      label: "Total Bookings",
      value: stats.total_bookings ?? 0,
      description: "All bookings",
      color: "bg-red-100 text-red-700",
    },
    {
      type: "pending",
      label: "Pending",
      value: stats.pending ?? stats.bookings_by_status?.pending_payment ?? 0,
      description: "Awaiting payment",
      color: "bg-amber-100 text-amber-500",
    },
    {
      type: "confirmed",
      label: "Confirmed",
      value: confirmed,
      description: "Paid & confirmed",
      color: "bg-green-100 text-green-500",
    },
    {
      type: "cancelled",
      label: "Cancelled",
      value: stats.cancelled ?? stats.bookings_by_status?.cancelled ?? 0,
      description: "Cancelled by user",
      color: "bg-red-100 text-red-500",
    },
    {
      type: "revenue",
      label: "Total Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(stats.total_revenue ?? 0),
      description: `From ${confirmed} confirmed ${confirmed === 1 ? "booking" : "bookings"}`,
      color: "bg-green-100 text-green-500",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ type, label, value, description, color }) => (
        <div
          key={type}
          className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div
            aria-hidden="true"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${color}`}
          >
            <StatIcon type={type} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <p className="mt-1 break-words text-xl font-bold leading-tight text-gray-800 dark:text-white/90">
              {value}
            </p>
            <p className="mt-1 text-xs leading-4 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
