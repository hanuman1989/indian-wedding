import { Globe, Mail, MessageCircle, Users, Phone } from '@/components/Icons'
import { FormField, getInputClassName, InputWithIcon } from '@/components/postWedding/PostWeddingField'
import StepHeader from './StepHeader'
import { hearAboutUsOptions } from './bookingUtils'

export default function YourInformationForm({ errors, form, onChange }) {
  const updateField = (field) => (event) => onChange(field, event.target.value)
  return (
    <section className="space-y-5 border border-gold-200 bg-white p-5 sm:p-7">
      <StepHeader number={1} title="Your Information" description="Please share a few details so we know you&apos;ll be joining us." />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="first-name" label="First Name" error={errors.first_name} required>
          <InputWithIcon id="first-name" Icon={Users} value={form.first_name} onChange={updateField('first_name')} autoComplete="given-name" error={errors.first_name} />
        </FormField>
        <FormField htmlFor="last-name" label="Last Name" error={errors.last_name} required>
          <InputWithIcon id="last-name" Icon={Users} value={form.last_name} onChange={updateField('last_name')} autoComplete="family-name" error={errors.last_name} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="email" label="Email Address" error={errors.email} description="Your email address cannot be changed." required>
          <InputWithIcon id="email" Icon={Mail} type="email" value={form.email} readOnly autoComplete="email" error={errors.email} className="cursor-not-allowed !bg-cream-100/80 text-ink-soft" />
        </FormField>
          <FormField htmlFor="phone" label="Phone Number Including Country Code" error={errors.phone} required>
          <InputWithIcon id="phone" Icon={Phone} type="tel" inputMode="tel" value={form.phone} placeholder="e.g., +919876543210" autoComplete="tel" onChange={(event) => onChange('phone', event.target.value)} error={errors.phone} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="visiting-from" label="Where are you visiting from?" error={errors.visiting_from} required>
          <InputWithIcon id="visiting-from" Icon={Globe} value={form.visiting_from} onChange={updateField('visiting_from')} placeholder="e.g., Jaipur, Rajasthan" error={errors.visiting_from} />
        </FormField>
        <FormField htmlFor="hear-about-us" label="Where did you hear about us?" error={errors.hear_about} required>
          <div className="relative">
            <MessageCircle className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />
            <select
              id="hear-about-us"
              value={form.hear_about}
              onChange={updateField('hear_about')}
              aria-invalid={Boolean(errors.hear_about)}
              aria-describedby={errors.hear_about ? 'hear-about-us-error' : undefined}
              className={`${getInputClassName(errors.hear_about)} appearance-none`}
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
