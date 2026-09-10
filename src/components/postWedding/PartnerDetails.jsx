import { Mail, Phone, Users } from '@/components/Icons';
import { FormField, InputWithIcon } from './PostWeddingField';

function PartnerContactSection({ errors, onBlur, onChange, partner, title, values }) {
  return (
    <section className="border border-gold-200 bg-white/65 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <h3 className="font-display text-xl font-bold text-wine-700">{title}</h3>
        <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor={`${partner}-first-name`} label="First Name" error={errors[`${partner}.firstName`]} required>
          <InputWithIcon id={`${partner}-first-name`} Icon={Users} value={values.firstName} onChange={(event) => onChange(`${partner}.firstName`, event.target.value)} onBlur={() => onBlur(`${partner}.firstName`)} autoComplete="given-name" error={errors[`${partner}.firstName`]} />
        </FormField>
        <FormField htmlFor={`${partner}-last-name`} label="Last Name" error={errors[`${partner}.lastName`]} required>
          <InputWithIcon id={`${partner}-last-name`} Icon={Users} value={values.lastName} onChange={(event) => onChange(`${partner}.lastName`, event.target.value)} onBlur={() => onBlur(`${partner}.lastName`)} autoComplete="family-name" error={errors[`${partner}.lastName`]} />
        </FormField>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FormField htmlFor={`${partner}-email`} label="Email Address" error={errors[`${partner}.email`]} required>
          <InputWithIcon id={`${partner}-email`} Icon={Mail} type="email" value={values.email} onChange={(event) => onChange(`${partner}.email`, event.target.value)} onBlur={() => onBlur(`${partner}.email`)} autoComplete="email" error={errors[`${partner}.email`]} />
        </FormField>
        <FormField htmlFor={`${partner}-phone`} label="Phone Number" error={errors[`${partner}.phone`]} required>
          <InputWithIcon id={`${partner}-phone`} Icon={Phone} type="tel" inputMode="tel" value={values.phone} onChange={(event) => onChange(`${partner}.phone`, event.target.value)} onBlur={() => onBlur(`${partner}.phone`)} placeholder="e.g., +919876543210" autoComplete="tel" error={errors[`${partner}.phone`]} />
        </FormField>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FormField htmlFor={`${partner}-fathers-name`} label="Father's Name" error={errors[`${partner}.fathersName`]} required>
          <InputWithIcon id={`${partner}-fathers-name`} Icon={Users} value={values.fathersName} onChange={(event) => onChange(`${partner}.fathersName`, event.target.value)} onBlur={() => onBlur(`${partner}.fathersName`)} autoComplete="name" error={errors[`${partner}.fathersName`]} />
        </FormField>
        <FormField htmlFor={`${partner}-mothers-name`} label="Mother's Name" error={errors[`${partner}.mothersName`]} required>
          <InputWithIcon id={`${partner}-mothers-name`} Icon={Users} value={values.mothersName} onChange={(event) => onChange(`${partner}.mothersName`, event.target.value)} onBlur={() => onBlur(`${partner}.mothersName`)} autoComplete="name" error={errors[`${partner}.mothersName`]} />
        </FormField>
      </div>
    </section>
  );
}

export default function PartnerDetails({ errors, form, onBlur, onChange }) {
  const showBride = form.creatorType === 'groom' || form.creatorType === 'other';
  const showGroom = form.creatorType === 'bride' || form.creatorType === 'other';

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-wine-700">Step 2: Partner&apos;s Details</h2>
      <p className="mt-1 text-sm text-ink-soft">
        {form.creatorType === 'bride' && "Add the groom's contact details."}
        {form.creatorType === 'groom' && "Add the bride's contact details."}
        {form.creatorType === 'other' && 'Add contact details for both partners.'}
      </p>

      <div className="mt-6 space-y-5">
        {showBride && <PartnerContactSection partner="bride" title="Bride's Contact Details" values={form.bride} errors={errors} onChange={onChange} onBlur={onBlur} />}
        {showGroom && <PartnerContactSection partner="groom" title="Groom's Contact Details" values={form.groom} errors={errors} onChange={onChange} onBlur={onBlur} />}
      </div>
    </div>
  );
}