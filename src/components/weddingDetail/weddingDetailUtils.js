function parseWeddingDate(value) {
  if (!value) return null;

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatWeddingDate(value, options = {}) {
  const date = parseWeddingDate(value);
  if (!date) return 'Date to be announced';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function formatWeddingDateRange(weddingDays = []) {
  const dates = weddingDays
    .map((day) => parseWeddingDate(day?.wedding_day_date))
    .filter(Boolean)
    .sort((firstDate, secondDate) => firstDate - secondDate);

  if (!dates.length) return 'Date to be announced';

  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const firstText = formatWeddingDate(firstDate);
  const lastText = formatWeddingDate(lastDate);

  return firstText === lastText ? firstText : `${firstText} - ${lastText}`;
}

// Splits the range into separate start/end strings so a UI can show "to <end>" only when the dates differ.
export function getWeddingDateRangeParts(weddingDays = []) {
  const dates = weddingDays
    .map((day) => parseWeddingDate(day?.wedding_day_date))
    .filter(Boolean)
    .sort((firstDate, secondDate) => firstDate - secondDate);

  if (!dates.length) return { start: 'Date to be announced', end: '', isRange: false };

  const start = formatWeddingDate(dates[0]);
  const end = formatWeddingDate(dates[dates.length - 1]);

  return { start, end, isRange: start !== end };
}

export function formatWeddingTime(value) {
  if (!value) return null;

  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(value);

  const hour = Number(match[1]);
  const minutes = match[2];
  if (hour > 23 || Number.isNaN(hour)) return String(value);

  return `${hour % 12 || 12}:${minutes} ${hour < 12 ? 'AM' : 'PM'}`;
}

export function getWeddingParty(wedding, role) {
  const directParty = wedding?.[role];
  if (directParty) return directParty;

  return (wedding?.creators || []).find((person) => person?.creator_type === role) || null;
}

export function getPersonName(person) {
  if (!person) return '';

  return [person.first_name, person.last_name].filter(Boolean).join(' ').trim();
}

export function getCoupleName(wedding) {
  const brideName = getPersonName(getWeddingParty(wedding, 'bride'));
  const groomName = getPersonName(getWeddingParty(wedding, 'groom'));

  if (brideName && groomName) return `${brideName} & ${groomName}`;
  return brideName || groomName || wedding?.couple_name || 'Wedding celebration';
}

export function getGeneralLocation(day) {
  return [day?.city, day?.state].filter(Boolean).join(', ') || 'Location to be announced';
}

export function getSortedWeddingDays(weddingDays = []) {
  return weddingDays
    .map((day, index) => ({ day, index, date: parseWeddingDate(day?.wedding_day_date) }))
    .sort((first, second) => {
      const firstDayNumber = Number(first.day?.day_number);
      const secondDayNumber = Number(second.day?.day_number);
      const hasFirstDayNumber = Number.isFinite(firstDayNumber);
      const hasSecondDayNumber = Number.isFinite(secondDayNumber);

      if (hasFirstDayNumber && hasSecondDayNumber && firstDayNumber !== secondDayNumber) {
        return firstDayNumber - secondDayNumber;
      }
      if (first.date && second.date && first.date.getTime() !== second.date.getTime()) {
        return first.date - second.date;
      }
      return first.index - second.index;
    })
    .map(({ day }) => day);
}

export function getSortedWeddingImages(images = []) {
  return images
    .map((image, index) => ({ image, index }))
    .filter(({ image }) => Boolean(image?.url || image?.image_url))
    .sort((first, second) => {
      const firstOrder = Number(first.image?.sort_order);
      const secondOrder = Number(second.image?.sort_order);
      const normalizedFirstOrder = Number.isFinite(firstOrder) ? firstOrder : first.index;
      const normalizedSecondOrder = Number.isFinite(secondOrder) ? secondOrder : second.index;
      return normalizedFirstOrder - normalizedSecondOrder || first.index - second.index;
    })
    .map(({ image }) => image);
}

export function getSortedWeddingEvents(events = []) {
  return events
    .map((event, index) => ({ event, index }))
    .sort((first, second) => {
      const firstOrder = Number(first.event?.sort_order);
      const secondOrder = Number(second.event?.sort_order);
      const normalizedFirstOrder = Number.isFinite(firstOrder) ? firstOrder : 0;
      const normalizedSecondOrder = Number.isFinite(secondOrder) ? secondOrder : 0;
      return normalizedFirstOrder - normalizedSecondOrder || first.index - second.index;
    })
    .map(({ event }) => event);
}

export function getEventCount(weddingDays = []) {
  return weddingDays.reduce((total, day) => total + (day?.wedding_day_events?.length || 0), 0);
}

export function getMainLanguage(wedding) {
  const languages = wedding?.main_languages || wedding?.languages;
  if (Array.isArray(languages)) return languages.filter(Boolean).join(', ') || 'Not specified';
  return languages || 'Not specified';
}

export function getAlcoholAvailability(wedding) {
  if (wedding?.is_alcohol_offered === true) return 'Available';
  if (wedding?.is_alcohol_offered === false) return 'Not available';
  return 'Not specified';
}

export function toCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}