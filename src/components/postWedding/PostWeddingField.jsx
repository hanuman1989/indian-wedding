export function getInputClassName(error, hasIcon = true) {
  return `w-full rounded-md border bg-white/80 py-3 ${hasIcon ? 'pl-10 pr-3' : 'px-3'} text-sm text-ink outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border-gold-200 focus:border-wine-400 focus:ring-wine-200'
  }`;
}

export function FormField({ children, description, error, htmlFor, label, required = false }) {
  const errorId = `${htmlFor}-error`;

  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ink">
        {label} {required && <span className="text-wine-600">*</span>}
      </label>
      {description && <p className="-mt-1 mb-2 text-xs leading-5 text-ink-soft">{description}</p>}
      {children}
      {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function InputWithIcon({ Icon, className = '', error, ...inputProps }) {
  return (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-wine-500" />}
      <input
        {...inputProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputProps.id}-error` : undefined}
        className={`${getInputClassName(error, Boolean(Icon))} ${className}`}
      />
    </div>
  );
}