export default function StepHeader({ number, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-wine-700 text-sm font-bold text-cream-50">{number}</span>
      <div>
        <h2 className="font-display text-xl font-bold text-wine-700">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
      </div>
    </div>
  )
}
