import { FormField, getInputClassName } from './PostWeddingField';

export default function CoupleStory({ errors, form, onBlur, onChange }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-wine-700">Step 3: Tell Us More About Yourselves</h2>
      <p className="mt-1 text-sm text-ink-soft">Share the story that brought you to this celebration.</p>

      <div className="mt-6 space-y-6">
        <FormField htmlFor="description" label="Your Story" error={errors.description} required>
          <textarea
            id="description"
            rows="9"
            value={form.description}
            onChange={(event) => onChange('description', event.target.value)}
            onBlur={() => onBlur('description')}
            maxLength="2000"
            placeholder="Tell guests about your journey together..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-error' : 'description-counter'}
            className={`${getInputClassName(errors.description, false)} min-h-52 resize-y leading-6`}
          />
          <p id="description-counter" className="mt-1.5 text-right text-xs text-ink-soft">{form.description.length} / 2000</p>
        </FormField>

        <FormField
          htmlFor="youtube-url"
          label="YouTube Link"
          error={errors.videoUrl}
          description="Share your pre-wedding video, proposal video, or any special moments."
        >
          <input
            id="youtube-url"
            type="url"
            value={form.videoUrl}
            onChange={(event) => onChange('videoUrl', event.target.value)}
            onBlur={() => onBlur('videoUrl')}
            placeholder="https://www.youtube.com/watch?v=..."
            aria-invalid={Boolean(errors.videoUrl)}
            aria-describedby={errors.videoUrl ? 'youtube-url-error' : undefined}
            className={getInputClassName(errors.videoUrl, false)}
          />
        </FormField>
      </div>
    </div>
  );
}