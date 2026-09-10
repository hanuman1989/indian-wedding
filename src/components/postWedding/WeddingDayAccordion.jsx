"use client";

import { useState } from 'react';
import { ChevronDown, MapPin } from '@/components/Icons';
import { FormField, getInputClassName, InputWithIcon } from './PostWeddingField';
import { createWeddingDay, createWeddingEvent, eventTimes } from './formUtils';

function getMinimumWeddingDate() {
  const minimumDate = new Date();
  minimumDate.setDate(minimumDate.getDate() + 1);
  return [minimumDate.getFullYear(), String(minimumDate.getMonth() + 1).padStart(2, '0'), String(minimumDate.getDate()).padStart(2, '0')].join('-');
}

export default function WeddingDayAccordion({ errors, day, index, onBlur, onChange }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const dayDetails = { ...createWeddingDay(), ...(day || {}) };
  const events = (dayDetails.wedding_day_events?.length ? dayDetails.wedding_day_events : [createWeddingEvent()])
    .map((event) => ({ ...createWeddingEvent(), ...event }));
  const getError = (field) => errors[`wedding_days.${index}.${field}`];
  const getEventError = (eventIndex, field) => errors[`wedding_days.${index}.wedding_day_events.${eventIndex}.${field}`];
  const updateDay = (field, value) => onChange(index, field, value);
  const updateEvent = (eventIndex, field, value) => onChange(index, `wedding_day_events.${eventIndex}.${field}`, value);
  const blur = (field) => onBlur(`wedding_days.${index}.${field}`);

  return (
    <section className="overflow-hidden border border-gold-200 bg-white/70">
      <button type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} className="flex min-h-14 w-full items-center justify-between gap-4 bg-gold-100/45 px-4 text-left transition-colors hover:bg-gold-100/70 sm:px-5">
        <span>
          <span className="font-display text-lg font-bold text-wine-700">Day {index + 1}</span>
          <span className="ml-3 text-xs text-ink-soft">{dayDetails.wedding_day_date || 'Add wedding day details'}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-wine-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <FormField htmlFor={`wedding-day-date-${index}`} label="Wedding Date" error={getError('wedding_day_date')} required>
            <input id={`wedding-day-date-${index}`} type="date" min={getMinimumWeddingDate()} value={dayDetails.wedding_day_date} onChange={(event) => updateDay('wedding_day_date', event.target.value)} onBlur={() => blur('wedding_day_date')} className={getInputClassName(getError('wedding_day_date'), false)} />
          </FormField>
          <FormField htmlFor={`wedding-day-time-${index}`} label="Wedding Time" error={getError('wedding_day_time')} required>
            <select id={`wedding-day-time-${index}`} value={dayDetails.wedding_day_time} onChange={(event) => updateDay('wedding_day_time', event.target.value)} onBlur={() => blur('wedding_day_time')} className={getInputClassName(getError('wedding_day_time'), false)}>
              <option value="">Please choose</option>
              {eventTimes.map((option) => <option key={option.value} value={option.value}>{option.text}</option>)}
            </select>
          </FormField>
          {[
            ['address_line_1', 'Address Line 1', MapPin],
            ['address_line_2', 'Address Line 2', MapPin],
            ['city', 'City', MapPin],
            ['state', 'State', MapPin],
            ['post_code', 'Post Code', MapPin],
            ['landmark_near', 'Landmark', MapPin],
          ].map(([field, label, Icon]) => (
            <FormField key={field} htmlFor={`wedding-day-${field}-${index}`} label={label} error={getError(field)} required={field === 'address_line_1' || field === 'city' || field === 'state'}>
              <InputWithIcon id={`wedding-day-${field}-${index}`} Icon={Icon} value={dayDetails[field] ?? ''} onChange={(event) => updateDay(field, event.target.value)} onBlur={() => blur(field)} error={getError(field)} />
            </FormField>
          ))}

          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <h4 className="font-display text-lg font-bold text-wine-700">Events</h4>
              <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
            </div>
            <div className="space-y-4">
              {events.map((event, eventIndex) => (
                <div key={event.id || eventIndex} className="grid gap-4 border border-gold-200 p-4 sm:grid-cols-2">
                  <FormField htmlFor={`event-title-${index}-${eventIndex}`} label="Title" error={getEventError(eventIndex, 'title')} required>
                    <InputWithIcon id={`event-title-${index}-${eventIndex}`} value={event.title} onChange={(inputEvent) => updateEvent(eventIndex, 'title', inputEvent.target.value)} error={getEventError(eventIndex, 'title')} />
                  </FormField>
                  <FormField htmlFor={`event-dress-code-${index}-${eventIndex}`} label="Dress Code" error={getEventError(eventIndex, 'dress_code')} required>
                    <InputWithIcon id={`event-dress-code-${index}-${eventIndex}`} value={event.dress_code} onChange={(inputEvent) => updateEvent(eventIndex, 'dress_code', inputEvent.target.value)} error={getEventError(eventIndex, 'dress_code')} />
                  </FormField>
                  <FormField htmlFor={`event-description-${index}-${eventIndex}`} label="Description" error={getEventError(eventIndex, 'description')} required>
                    <textarea id={`event-description-${index}-${eventIndex}`} rows="3" value={event.description} onChange={(inputEvent) => updateEvent(eventIndex, 'description', inputEvent.target.value)} className={`${getInputClassName(getEventError(eventIndex, 'description'), false)} resize-y leading-6`} />
                  </FormField>
                  <label className="flex items-center gap-2 self-center text-sm font-medium text-ink">
                    <input type="checkbox" checked={event.is_music_or_dancing} onChange={(inputEvent) => updateEvent(eventIndex, 'is_music_or_dancing', inputEvent.target.checked)} />
                    Music or dancing
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
