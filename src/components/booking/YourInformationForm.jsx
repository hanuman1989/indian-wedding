import { Globe, Mail, MessageCircle, Users } from '@/components/Icons'
import { FormField, getInputClassName, InputWithIcon } from '@/components/postWedding/PostWeddingField'
import StepHeader from './StepHeader'
import { hearAboutUsOptions } from './bookingUtils'

function PhoneField({ error, onChange, value }) {
  const digits = value.replace(/^\+91/, '')

  return (
    <FormField htmlFor="phone" label="Phone Number (including country code)" error={error} required>
      <div className="flex">
        <span className="inline-flex min-h-[46px] shrink-0 items-center gap-1.5 rounded-l-md border border-r-0 border-gold-200 bg-cream-100 px-3 text-sm text-ink">
          <span aria-hidden="true">🇮🇳</span> +91
        </span>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          value={digits}
          onChange={(event) => onChange(`+91${event.target.value.replace(/\D/g, '').slice(0, 10)}`)}
          placeholder="7665880635"
          autoComplete="tel-national"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'phone-error' : undefined}
          className={`${getInputClassName(error, false)} rounded-l-none`}
        />
      </div>
    </FormField>
  )
}

export default function YourInformationForm({ errors, form, onChange }) {
  const updateField = (field) => (event) => onChange(field, event.target.value)

  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={1} title="Your Information" description="Please share a few details so we know you&apos;ll be joining us." />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="first-name" label="First Name" error={errors.firstName} required>
          <InputWithIcon id="first-name" Icon={Users} value={form.firstName} onChange={updateField('firstName')} autoComplete="given-name" error={errors.firstName} />
        </FormField>
        <FormField htmlFor="last-name" label="Last Name" error={errors.lastName} required>
          <InputWithIcon id="last-name" Icon={Users} value={form.lastName} onChange={updateField('lastName')} autoComplete="family-name" error={errors.lastName} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="email" label="Email Address" error={errors.email} description="Your email address cannot be changed." required>
          <InputWithIcon id="email" Icon={Mail} type="email" value={form.email} readOnly autoComplete="email" error={errors.email} className="cursor-not-allowed !bg-cream-100/80 text-ink-soft" />
        </FormField>
        <PhoneField value={form.phone} onChange={(value) => onChange('phone', value)} error={errors.phone} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="visiting-from" label="Where are you visiting from?" error={errors.visitingFrom} required>
          <InputWithIcon id="visiting-from" Icon={Globe} value={form.visitingFrom} onChange={updateField('visitingFrom')} placeholder="e.g., Jaipur, Rajasthan" error={errors.visitingFrom} />
        </FormField>
        <FormField htmlFor="hear-about-us" label="Where did you hear about us?" error={errors.hearAboutUs} required>
          <div className="relative">
            <MessageCircle className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
            <select
              id="hear-about-us"
              value={form.hearAboutUs}
              onChange={updateField('hearAboutUs')}
              aria-invalid={Boolean(errors.hearAboutUs)}
              aria-describedby={errors.hearAboutUs ? 'hear-about-us-error' : undefined}
              className={`${getInputClassName(errors.hearAboutUs)} appearance-none`}
            >
              {hearAboutUsOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </FormField>
      </div>
    </section>
  )
}
