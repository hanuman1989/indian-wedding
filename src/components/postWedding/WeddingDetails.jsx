import WeddingDayAccordion from './WeddingDayAccordion';
import { FormField, getInputClassName } from './PostWeddingField';
import { languageOptions } from './formUtils';

const foodOptions = ['Vegetarian', 'Non-Vegetarian', 'Veg & Non-Veg', 'Jain', 'Other'];

export default function WeddingDetails({ errors, form, onBlur, onChange, onEventChange, onWeddingDaysChange }) {
  const toggleLanguage = (language) => {
    const languages = form.languages.includes(language)
      ? form.languages.filter((item) => item !== language)
      : [...form.languages, language];
    onChange('languages', languages);
  };

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

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink">Main Language(s) of the Wedding <span className="text-wine-600">*</span></legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {languageOptions.map((language) => (
            <label key={language} className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm transition-colors ${form.languages.includes(language) ? 'border-wine-400 bg-wine-50 text-wine-700' : 'border-gold-200 bg-white/70 text-ink-soft hover:bg-gold-100/45'}`}>
              <input type="checkbox" checked={form.languages.includes(language)} onChange={() => toggleLanguage(language)} onBlur={() => onBlur('languages')} className="h-4 w-4 rounded border-gold-300 text-wine-600 focus:ring-wine-300" />
              {language}
            </label>
          ))}
        </div>
        {errors.languages && <p id="languages-error" role="alert" className="mt-2 text-xs text-red-700">{errors.languages}</p>}
      </fieldset>

      <section className="mt-8" aria-labelledby="event-details-heading">
        <div className="flex items-center gap-3">
          <h3 id="event-details-heading" className="font-display text-xl font-bold text-wine-700">Wedding Event Details</h3>
          <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
        </div>
        <p className="mt-1 text-sm text-ink-soft">Add the main event and venue for each day of your wedding.</p>
        <div className="mt-4 space-y-3">
          {form.events.map((event, index) => <WeddingDayAccordion key={event?.day || index + 1} event={event} index={index} errors={errors} onChange={onEventChange} onBlur={onBlur} />)}
        </div>
      </section>
    </div>
  );
}