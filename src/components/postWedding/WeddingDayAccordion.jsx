"use client";

import { useState } from 'react';
import { ChevronDown, MapPin } from '@/components/Icons';
import { FormField, getInputClassName, InputWithIcon } from './PostWeddingField';
import { createWeddingEvent } from './formUtils';

export default function WeddingDayAccordion({ errors, event, index, onBlur, onChange }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const eventDetails = { ...createWeddingEvent(index + 1), ...(event || {}) };
  const getError = (field) => errors[`events.${index}.${field}`];
  const update = (field, value) => onChange(index, field, value);
  const blur = (field) => onBlur(`events.${index}.${field}`);

  return (
    <section className="overflow-hidden border border-gold-200 bg-white/70">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex min-h-14 w-full items-center justify-between gap-4 bg-gold-100/45 px-4 text-left transition-colors hover:bg-gold-100/70 sm:px-5"
      >
        <span>
          <span className="font-display text-lg font-bold text-wine-700">Day {eventDetails.day}</span>
          <span className="ml-3 text-xs text-ink-soft">{eventDetails.eventName || 'Add event details'}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-wine-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <FormField htmlFor={`event-name-${index}`} label="Event Name" error={getError('eventName')} required>
            <input id={`event-name-${index}`} value={eventDetails.eventName} onChange={(inputEvent) => update('eventName', inputEvent.target.value)} onBlur={() => blur('eventName')} placeholder="e.g., Mehendi Ceremony" aria-invalid={Boolean(getError('eventName'))} aria-describedby={getError('eventName') ? `event-name-${index}-error` : undefined} className={getInputClassName(getError('eventName'), false)} />
          </FormField>
          <FormField htmlFor={`event-date-${index}`} label="Event Date" error={getError('eventDate')} required>
            <input id={`event-date-${index}`} type="date" value={eventDetails.eventDate} onChange={(inputEvent) => update('eventDate', inputEvent.target.value)} onBlur={() => blur('eventDate')} aria-invalid={Boolean(getError('eventDate'))} aria-describedby={getError('eventDate') ? `event-date-${index}-error` : undefined} className={getInputClassName(getError('eventDate'), false)} />
          </FormField>
          <FormField htmlFor={`start-time-${index}`} label="Start Time" error={getError('startTime')} required>
            <input id={`start-time-${index}`} type="time" value={eventDetails.startTime} onChange={(inputEvent) => update('startTime', inputEvent.target.value)} onBlur={() => blur('startTime')} aria-invalid={Boolean(getError('startTime'))} aria-describedby={getError('startTime') ? `start-time-${index}-error` : undefined} className={getInputClassName(getError('startTime'), false)} />
          </FormField>
          <FormField htmlFor={`end-time-${index}`} label="End Time" error={getError('endTime')} required>
            <input id={`end-time-${index}`} type="time" value={eventDetails.endTime} onChange={(inputEvent) => update('endTime', inputEvent.target.value)} onBlur={() => blur('endTime')} aria-invalid={Boolean(getError('endTime'))} aria-describedby={getError('endTime') ? `end-time-${index}-error` : undefined} className={getInputClassName(getError('endTime'), false)} />
          </FormField>
          <FormField htmlFor={`venue-name-${index}`} label="Venue Name" error={getError('venueName')} required>
            <InputWithIcon id={`venue-name-${index}`} Icon={MapPin} value={eventDetails.venueName} onChange={(inputEvent) => update('venueName', inputEvent.target.value)} onBlur={() => blur('venueName')} placeholder="e.g., The Grand Palace" error={getError('venueName')} />
          </FormField>
          <FormField htmlFor={`venue-address-${index}`} label="Venue Address" error={getError('venueAddress')} required>
            <InputWithIcon id={`venue-address-${index}`} Icon={MapPin} value={eventDetails.venueAddress} onChange={(inputEvent) => update('venueAddress', inputEvent.target.value)} onBlur={() => blur('venueAddress')} placeholder="City, State" error={getError('venueAddress')} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField htmlFor={`event-description-${index}`} label="Event Description" error={getError('description')}>
              <textarea id={`event-description-${index}`} rows="3" value={eventDetails.description} onChange={(inputEvent) => update('description', inputEvent.target.value)} onBlur={() => blur('description')} placeholder="Share a note about this celebration..." className={`${getInputClassName(getError('description'), false)} resize-y leading-6`} />
            </FormField>
          </div>
        </div>
      )}
    </section>
  );
}