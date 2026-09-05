import { FormField, getInputClassName } from './PostWeddingField';

export default function CoupleStory({ errors, form, onBlur, onChange }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-wine-700">Step 3: Tell Us More About Yourselves</h2>
      <p className="mt-1 text-sm text-ink-soft">Share the story that brought you to this celebration.</p>

      <div className="mt-6 space-y-6">
        <FormField htmlFor="story" label="Your Story" error={errors.story} required>
          <textarea
            id="story"
            rows="9"
            value={form.story}
            onChange={(event) => onChange('story', event.target.value)}
            onBlur={() => onBlur('story')}
            maxLength="2000"
            placeholder="Tell guests about your journey together..."
            aria-invalid={Boolean(errors.story)}
            aria-describedby={errors.story ? 'story-error' : 'story-counter'}
            className={`${getInputClassName(errors.story, false)} min-h-52 resize-y leading-6`}
          />
          <p id="story-counter" className="mt-1.5 text-right text-xs text-ink-soft">{form.story.length} / 2000</p>
        </FormField>

        <FormField
          htmlFor="youtube-url"
          label="YouTube Link"
          error={errors.youtubeUrl}
          description="Share your pre-wedding video, proposal video, or any special moments."
        >
          <input
            id="youtube-url"
            type="url"
            value={form.youtubeUrl}
            onChange={(event) => onChange('youtubeUrl', event.target.value)}
            onBlur={() => onBlur('youtubeUrl')}
            placeholder="https://www.youtube.com/watch?v=..."
            aria-invalid={Boolean(errors.youtubeUrl)}
            aria-describedby={errors.youtubeUrl ? 'youtube-url-error' : undefined}
            className={getInputClassName(errors.youtubeUrl, false)}
          />
        </FormField>
      </div>
    </div>
  );
}