import WeddingDayAccordion from './WeddingDayAccordion';
import { FormField, getInputClassName } from './PostWeddingField';
import { languageOptions } from './formUtils';

const foodOptions = ['Vegetarian', 'Non-Vegetarian', 'Veg & Non-Veg', 'Jain', 'Other'];

export default function WeddingDetails({ errors, form, onBlur, onChange, onEventChange, onWeddingDaysChange }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-wine-700">Step 4: Share Your Wedding Details</h2>
      <p className="mt-1 text-sm text-ink-soft">Set the essentials, then add one event itinerary for each wedding day.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField htmlFor="wedding-days" label="How Many Days Will Your Wedding Go For?" error={errors.weddingDays} required>
          <select id="wedding-days" value={form.weddingDays} onChange={(event) => onWeddingDaysChange(event.target.value)} onBlur={() => onBlur('weddingDays')} aria-invalid={Boolean(errors.weddingDays)} aria-describedby={errors.weddingDays ? 'wedding-days-error' : undefined} className={getInputClassName(errors.weddingDays, false)}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => <option key={day} value={day}>{day} {day === 1 ? 'Day' : 'Days'}</option>)}
          </select>
        </FormField>
        <FormField htmlFor="food-type" label="What Kind of Food Will Be Offered?" error={errors.foodType} required>
          <select id="food-type" value={form.foodType} onChange={(event) => onChange('foodType', event.target.value)} onBlur={() => onBlur('foodType')} aria-invalid={Boolean(errors.foodType)} aria-describedby={errors.foodType ? 'food-type-error' : undefined} className={getInputClassName(errors.foodType, false)}>
            <option value="">Select a food offering</option>
            {foodOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </FormField>
      </div>

      <section className="mt-8" aria-labelledby="event-details-heading">
        <div className="flex items-center gap-3">
          <h3 id="event-details-heading" className="font-display text-xl font-bold text-wine-700">Wedding Event Details</h3>
          <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
        </div>
        <p className="mt-1 text-sm text-ink-soft">Add the main event and venue for each day of your wedding.</p>
        <div className="mt-4 space-y-3">
          {(form.wedding_days || []).map((day, index) => (
            <WeddingDayAccordion
              key={day.id || index + 1}
              day={day}
              index={index}
              errors={errors}
              onChange={onEventChange}
              onBlur={onBlur}
            />
          ))}
        </div>
      </section>
    </div>
  );
}