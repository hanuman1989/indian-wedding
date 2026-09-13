import { formatWeddingDate } from './weddingDetailUtils';

export default function WeddingDaySelector({ selectedIndex, weddingDays, onSelectDay }) {
  if (weddingDays.length < 2) return null;

  return (
    <div className="no-scrollbar mt-6 overflow-x-auto pb-2">
      <div className="flex gap-2" role="tablist" aria-label="Wedding day selector">
        {weddingDays.map((day, index) => {
          const isSelected = index === selectedIndex;
          const dayNumber = day?.day_number || index + 1;

          return (
            <button
              key={day?.id ?? `${day?.wedding_day_date}-${index}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectDay(index)}
              className={`min-w-[6.5rem] flex-1 border px-4 py-3 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-wine-300 ${isSelected ? 'border-wine-700 bg-wine-700 text-cream-50 shadow-sm' : 'border-gold-200 bg-white text-ink-soft hover:border-wine-300 hover:bg-wine-50'}`}
            >
              <span className="block text-sm font-bold">Day {dayNumber}</span>
              <span className={`mt-1 block text-xs ${isSelected ? 'text-cream-100' : 'text-ink-soft'}`}>{formatWeddingDate(day?.wedding_day_date, { day: 'numeric', month: 'short' })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}