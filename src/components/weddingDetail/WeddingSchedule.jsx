"use client";

import { useState } from 'react';
import { Calendar, Info } from '@/components/Icons';
import { Flourish } from '@/components/Ornaments';
import WeddingDayDetails from './WeddingDayDetails';
import WeddingDaySelector from './WeddingDaySelector';
import { getSortedWeddingDays } from './weddingDetailUtils';

export default function WeddingSchedule({ weddingDays = [] }) {
  const orderedDays = getSortedWeddingDays(weddingDays);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resolvedIndex = Math.min(selectedIndex, Math.max(orderedDays.length - 1, 0));
  const selectedDay = orderedDays[resolvedIndex];

  return (
    <section id="schedule" className="py-10 sm:py-10">
      <div className="shell bg-white p-6 sm:p-8 lg:p-10">
        <div className="">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-wine-50 text-wine-600"><Calendar className="h-5 w-5" /></span>
            <h2 className="font-display text-3xl font-bold text-wine-700">Wedding Schedule</h2>
            <Flourish />
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-soft">Here's what to expect during our celebration.</p>

          {!orderedDays.length ? (
            <p className="mt-6 border border-dashed border-gold-300 bg-white px-4 py-10 text-center text-sm text-ink-soft">The wedding schedule will be shared soon.</p>
          ) : (
            <>
              <WeddingDaySelector weddingDays={orderedDays} selectedIndex={resolvedIndex} onSelectDay={setSelectedIndex} />
              <WeddingDayDetails weddingDay={selectedDay} dayIndex={resolvedIndex} />
              {orderedDays.length > 1 && (
                <p className="mt-10 flex items-center justify-center gap-2 text-center text-md text-ink-soft">
                  <Info className="h-4 w-4 shrink-0 text-wine-500" />
                  Select a day above to view details, events and location for that day.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}