"use client";

import { useRef, useState } from 'react';
import { ChevronDown, MapPin, Trash } from '@/components/Icons';
import { FormField, getInputClassName, InputWithIcon } from './PostWeddingField';
import { createWeddingDay, createWeddingEvent, eventTimes } from './formUtils';
import LocationMap from './LocationMap';

function getMinimumWeddingDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function WeddingDayAccordion({ deletingEventKey, errors, day, index, onBlur, onChange, onRemoveEvent }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const weddingDateInputRef = useRef(null);
  const dayDetails = { ...createWeddingDay(), ...(day || {}) };
  const events = (dayDetails.wedding_day_events?.length ? dayDetails.wedding_day_events : [createWeddingEvent()])
    .map((event) => ({ ...createWeddingEvent(), ...event }));
  const getError = (field) => errors[`wedding_days.${index}.${field}`];
  const getEventError = (eventIndex, field) => errors[`wedding_days.${index}.wedding_day_events.${eventIndex}.${field}`];
  const updateDay = (field, value) => onChange(index, field, value);
  const updateEvent = (eventIndex, field, value) => onChange(index, `wedding_day_events.${eventIndex}.${field}`, value);
  const addEvent = () => onChange(index, 'wedding_day_events', [...events, createWeddingEvent()]);
  const removeEvent = (eventIndex) => onRemoveEvent(index, eventIndex, events[eventIndex]);
  const isRemovingEvent = (eventIndex) => deletingEventKey === `${index}-${eventIndex}`;
  const blur = (field) => onBlur(`wedding_days.${index}.${field}`);
  const combinedAddress = [dayDetails.address_line_1, dayDetails.address_line_2, dayDetails.city, dayDetails.state, dayDetails.post_code]
    .filter(Boolean)
    .join(', ');
  const handleLocationChange = ({ latitude, longitude }) => {
    updateDay('latitude', latitude);
    updateDay('longitude', longitude);
  };
  const hasDayErrors = Object.entries(errors || {}).some(([key, value]) => value && key.startsWith(`wedding_days.${index}.`));

  return (
    <section className="overflow-hidden border border-gold-200 bg-white/70">
      <button type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} className={`group flex min-h-14 w-full items-center justify-between gap-4 px-4 text-left transition-colors sm:px-5 ${hasDayErrors ? 'bg-red-300 hover:bg-red-800 hover:text-white' : 'bg-gold-100/45 hover:bg-gold-100/70'}`}>
        <span>
          <span className={`font-display text-lg font-bold text-wine-700 ${hasDayErrors ? 'group-hover:text-white' : ''}`}>Day {index + 1}</span>
          <span className={`ml-3 text-xs ${hasDayErrors ? 'text-red-900 group-hover:text-white' : 'text-ink-soft'}`}>
            {hasDayErrors ? 'Please review this day\u2019s details' : (dayDetails.wedding_day_date || 'Add wedding day details')}
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-wine-600 transition-transform ${isOpen ? 'rotate-180' : ''} ${hasDayErrors ? 'group-hover:text-white' : ''}`} />
      </button>

      {isOpen && (
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <FormField htmlFor={`wedding-day-date-${index}`} label="Wedding Day Date" error={getError('wedding_day_date')} required>
            <input id={`wedding-day-date-${index}`} 
              ref={weddingDateInputRef}
              type="date" 
              min={getMinimumWeddingDate()} 
              value={dayDetails.wedding_day_date} 
              onClick={() => weddingDateInputRef.current?.showPicker?.()}
              onChange={(event) => updateDay('wedding_day_date', event.target.value)} 
              onBlur={() => blur('wedding_day_date')} 
              className={getInputClassName(getError('wedding_day_date'), false)} 
              />
          </FormField>
          <FormField htmlFor={`wedding-day-time-${index}`} label="Event Start Time" error={getError('wedding_day_time')} required>
            <select id={`wedding-day-time-${index}`} value={dayDetails.wedding_day_time} onChange={(event) => updateDay('wedding_day_time', event.target.value)} onBlur={() => blur('wedding_day_time')} className={getInputClassName(getError('wedding_day_time'), false)}>
              <option value="">Please choose</option>
              {eventTimes.map((option) => <option key={option.value} value={option.value}>{option.text}</option>)}
            </select>
          </FormField>
          
        <div className="sm:col-span-2">
          <FormField htmlFor={`wedding-day-venue-title-${index}`} label="Venue Title" error={getError('venue_title')}>
            <InputWithIcon id={`wedding-day-venue-title-${index}`} value={dayDetails.venue_title} onChange={(event) => updateDay('venue_title', event.target.value)} onBlur={() => blur('venue_title')} error={getError('venue_title')} placeholder="Enter venue title" />
          </FormField>
        </div>
          {[
            ['address_line_1', 'Address Line 1', MapPin],
            ['address_line_2', 'Address Line 2', MapPin],
            ['city', 'City', MapPin],
            ['state', 'State', MapPin],
            ['post_code', 'Post Code', MapPin],
            ['landmark_near', 'Landmark', MapPin],
          ].map(([field, label, Icon]) => (
            <FormField key={field} htmlFor={`wedding-day-${field}-${index}`} label={label} error={getError(field)} required={field === 'address_line_1' || field === 'city' || field === 'state'}>
              <InputWithIcon id={`wedding-day-${field}-${index}`} Icon={Icon} value={dayDetails[field] ?? ''} onChange={(event) => updateDay(field, event.target.value)} onBlur={() => blur(field)} error={getError(field)} placeholder={label} />
            </FormField>
          ))}
          <div className="sm:col-span-2 dayVenueMap">
            <LocationMap
              address={combinedAddress}
              latitude={dayDetails.latitude}
              longitude={dayDetails.longitude}
              onLocationChange={handleLocationChange}
            />
          </div>
          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <h4 className="font-display text-lg font-bold text-wine-700">Events</h4>
              <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
            </div>
            <div className="space-y-4 event-box">
              {events.map((event, eventIndex) => (
                <div key={eventIndex} className="grid gap-4 border border-gold-200 p-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between sm:col-span-2">
                    <span className="text-sm font-semibold text-wine-700">Event {eventIndex + 1}</span> 
                    <button type="button" onClick={() => removeEvent(eventIndex)} disabled={events.length <= 1 || isRemovingEvent(eventIndex)} aria-label={`Remove event ${eventIndex + 1}`} className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40">
                      <Trash className="h-3.5 w-3.5" />
                      {isRemovingEvent(eventIndex) ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                  <FormField htmlFor={`event-title-${index}-${eventIndex}`} label="Title" error={getEventError(eventIndex, 'title')} required>
                    <InputWithIcon id={`event-title-${index}-${eventIndex}`} value={event.title} onChange={(inputEvent) => updateEvent(eventIndex, 'title', inputEvent.target.value)} error={getEventError(eventIndex, 'title')} placeholder="Enter event title" />
                  </FormField>
                  <FormField htmlFor={`event-dress-code-${index}-${eventIndex}`} label="What is the dress code at this event" >
                    <InputWithIcon id={`event-dress-code-${index}-${eventIndex}`} value={event.dress_code} onChange={(inputEvent) => updateEvent(eventIndex, 'dress_code', inputEvent.target.value)}  placeholder="Enter dress code" />
                  </FormField>
                  <div className="sm:col-span-2">
                  <FormField htmlFor={`event-description-${index}-${eventIndex}`} label="Description" error={getEventError(eventIndex, 'description')} required>
                    <textarea id={`event-description-${index}-${eventIndex}`} rows="3" value={event.description ?? ''} onChange={(inputEvent) => updateEvent(eventIndex, 'description', inputEvent.target.value)} className={`${getInputClassName(getEventError(eventIndex, 'description'), false)} resize-y leading-6`} placeholder="Enter event description" />
                  </FormField>
                  </div>
                  <div className="sm:col-span-1 flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 self-center text-sm font-medium text-ink">
                      <input type="checkbox" checked={event.is_music_or_dancing} onChange={(inputEvent) => updateEvent(eventIndex, 'is_music_or_dancing', inputEvent.target.checked)} />
                      Music or dancing
                    </label>
                    <label className="flex items-center gap-2 self-center text-sm font-medium text-ink">
                      <input type="checkbox" checked={Boolean(event.is_alcohol_offered)} onChange={(inputEvent) => updateEvent(eventIndex, 'is_alcohol_offered', inputEvent.target.checked)} />
                      Is Alcohol offered?
                    </label>
                  </div>
                  
                  
                </div>
              ))}
            </div>
             <button type="button" onClick={addEvent} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-dotted border-wine-500 bg-white px-3.5 py-2 text-sm font-semibold text-wine-600 transition-colors hover:bg-cream-50">
              <span aria-hidden="true" className="text-base leading-none">+</span>
              Add Another Event
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
