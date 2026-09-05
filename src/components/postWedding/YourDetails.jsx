import Image from 'next/image';
import { Mail, Phone, Users } from '@/components/Icons';
import { FormField, getInputClassName, InputWithIcon } from './PostWeddingField';

export default function YourDetails({ errors, form, onBlur, onChange }) {
  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-wine-700">Step 1: Let&apos;s Get to Know You</h2>
          <p className="mt-1 text-sm text-ink-soft">Tell us who you are and share your contact details.</p>
        </div>

        <FormField htmlFor="creator-type" label="Who are you?" error={errors.creatorType} required>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
            <select
              id="creator-type"
              value={form.creatorType}
              onChange={(event) => onChange('creatorType', event.target.value)}
              onBlur={() => onBlur('creatorType')}
              aria-invalid={Boolean(errors.creatorType)}
              aria-describedby={errors.creatorType ? 'creator-type-error' : undefined}
              className={`${getInputClassName(errors.creatorType)} appearance-none`}
            >
              <option value="">Select</option>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
              <option value="other">Other</option>
            </select>
          </div>
        </FormField>

        {form.creatorType === 'other' && (
          <FormField htmlFor="creator-type-other" label="Please specify" error={errors.creatorTypeOther} required>
            <InputWithIcon
              id="creator-type-other"
              name="creator_type_other"
              Icon={Users}
              value={form.creatorTypeOther}
              onChange={(event) => onChange('creatorTypeOther', event.target.value)}
              onBlur={() => onBlur('creatorTypeOther')}
              placeholder="Please describe your relationship to the couple*"
              error={errors.creatorTypeOther}
            />
          </FormField>
        )}

        <div>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-display text-lg font-bold text-wine-700">Your Contact Details</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField htmlFor="first-name" label="First Name" error={errors.firstName} required>
              <InputWithIcon id="first-name" Icon={Users} value={form.firstName} onChange={(event) => onChange('firstName', event.target.value)} onBlur={() => onBlur('firstName')} autoComplete="given-name" error={errors.firstName} />
            </FormField>
            <FormField htmlFor="last-name" label="Last Name" error={errors.lastName} required>
              <InputWithIcon id="last-name" Icon={Users} value={form.lastName} onChange={(event) => onChange('lastName', event.target.value)} onBlur={() => onBlur('lastName')} autoComplete="family-name" error={errors.lastName} />
            </FormField>
          </div>
          <div className="mt-4 space-y-4">
            <FormField htmlFor="email" label="Email Address" error={errors.email} required>
              <InputWithIcon id="email" Icon={Mail} type="email" value={form.email} readOnly autoComplete="email" error={errors.email} className="cursor-not-allowed !bg-cream-100/80 text-ink-soft" />
            </FormField>
            <FormField htmlFor="phone" label="Phone Number Including Country Code" error={errors.phone} required>
              <InputWithIcon id="phone" Icon={Phone} type="tel" inputMode="tel" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} onBlur={() => onBlur('phone')} placeholder="e.g., +919876543210" autoComplete="tel" error={errors.phone} />
            </FormField>
          </div>
        </div>
      </div>

      <aside className="relative overflow-hidden border border-gold-200 bg-gradient-to-b from-cream-50 via-[#fff0e6] to-gold-100/35 p-5 text-center">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gold-400" />
        <Image src="/images/kalash.png" alt="Traditional wedding kalash" width={220} height={220} className="mx-auto mt-2 h-auto w-full max-w-[190px] object-contain" />
        <div aria-hidden="true" className="mx-auto mt-2 h-px w-16 bg-gold-400" />
        <p className="mt-4 font-display text-xl italic leading-7 text-wine-700">
          A beautiful journey<br />
          begins with<br />
          a single step
        </p>
      </aside>
    </div>
  );
}