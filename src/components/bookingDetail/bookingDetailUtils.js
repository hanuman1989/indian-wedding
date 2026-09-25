export function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const datePart = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  const timePart = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);

  return `${datePart}, ${timePart}`;
}

export function formatCurrencyAmount(amount, currency = 'USD') {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return '—';

  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(numericAmount);
  } catch {
    return `$${numericAmount.toFixed(2)}`;
  }
}
