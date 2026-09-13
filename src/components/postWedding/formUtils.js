export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\+\d{7,}$/;

export const languageOptions = [
  'Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali',
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Other',
];

export const eventTimes = [
  ...Array.from({ length: 48 }, (_, index) => {
    const hour24 = Math.floor(index / 2);
    const hour = hour24 % 12 || 12;
    const minutes = index % 2 ? '30' : '00';
    return {
      text: `${hour}:${minutes} ${hour24 < 12 ? 'AM' : 'PM'}${index === 0 ? ' (midnight)' : index === 24 ? ' (noon)' : ''}`,
      value: `${String(hour24).padStart(2, '0')}:${minutes}`,
    };
  }),
];

export function createWeddingEvent() {
  return {
    id: null,
    wedding_day_id: null,
    title: '',
    description: '',
    is_music_or_dancing: false,
    dress_code: '',
  };
}

export function createWeddingDay() {
  return {
    id: null,
    wedding_id: null,
    wedding_day_date: '',
    wedding_day_time: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    post_code: '',
    landmark_near: '',
    latitude: null,
    longitude: null,
    wedding_day_events: [],
  };
}

export function ensureWeddingDays(numberOfDays, days = []) {
  const totalDays = Math.max(1, Number(numberOfDays) || 1);

  return Array.from({ length: totalDays }, (_, index) => {
    const source = days[index] || {};
    return {
      ...createWeddingDay(),
      ...source,
      wedding_day_events: (source.wedding_day_events || []).map((event) => ({
        ...createWeddingEvent(),
        ...event,
      })),
    };
  });
}

export function ensureWeddingEvents(numberOfDays, days = []) {
  return ensureWeddingDays(numberOfDays, days);
}

export function getInitialWeddingForm(user = {}) {
  const fullName = (user.name || user.full_name || '').trim();
  const [firstName = '', ...remainingNames] = fullName.split(/\s+/).filter(Boolean);

  return {
    creatorType: '',
    creatorTypeOther: '',
    firstName: user.first_name || user.firstName || firstName,
    lastName: user.last_name || user.lastName || remainingNames.join(' '),
    email: user.email || '',
    phone: user.phone || '',
    bride: { firstName: '', lastName: '', email: '', phone: '', fathersName: '', mothersName: '' },
    groom: { firstName: '', lastName: '', email: '', phone: '', fathersName: '', mothersName: '' },
    description: '',
    videoUrl: '',
    weddingDays: '1',
    foodType: '',
    wedding_days: [createWeddingDay()],
    images: [],
  };
}

function unwrapContact(source) {
  const contact = Array.isArray(source) ? source[0] : source;
  if (!contact) return {};
  return contact.data ? unwrapContact(contact.data) : contact;
}

function normalizePartnerContact(source = {}, prefix = '') {
  const contact = unwrapContact(source);
  const fullName = contact.name || contact.full_name || contact[`${prefix}_name`] || '';
  const [firstName = '', ...remainingNames] = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: contact.firstName || contact.first_name || contact[`${prefix}_first_name`] || firstName,
    lastName: contact.lastName || contact.last_name || contact[`${prefix}_last_name`] || remainingNames.join(' '),
    email: contact.email || contact[`${prefix}_email`] || '',
    phone: contact.phone || contact.phone_number || contact[`${prefix}_phone`] || '',
    fathersName: contact.fathersName || contact.fathers_name || '',
    mothersName: contact.mothersName || contact.mothers_name || '',
  };
}

function normalizeWeddingDay(day = {}) {
  return {
    ...createWeddingDay(),
    ...day,
    wedding_day_events: (day.wedding_day_events || []).map((event) => ({
      ...createWeddingEvent(),
      ...event,
    })),
  };
}

function normalizePhoto(photo, index) {
  return {
    id: photo.id || `photo-${index}`,
    url: photo.url || photo.image_url || photo.path || photo.photo || '',
    order: photo.order || photo.display_order || index + 1,
  };
}


export function normalizeWeddingForm(response, user = {}) {
  const wedding = response || {};
  const initial = getInitialWeddingForm(user);
  const storedDays = wedding.wedding_days || [];
  const numberOfDays = wedding.number_of_days || wedding.weddingDays || storedDays.length || initial.weddingDays;

  return {
    ...initial,
    creatorType: wedding.creator_type || initial.creatorType,
    creatorTypeOther: wedding.creator_type_other || initial.creatorTypeOther,
    firstName: wedding.first_name || initial.firstName,
    lastName: wedding.last_name || initial.lastName,
    email: wedding.email || initial.email,
    phone: wedding.phone || initial.phone,
    bride: normalizePartnerContact(wedding.bride, 'bride'),
    groom: normalizePartnerContact(wedding.groom, 'groom'),
    description: wedding.description || '',
    videoUrl: wedding.video_url || '',
    weddingDays: String(numberOfDays),
    foodType: wedding.food_observance || wedding.food_type || '',
    wedding_days: ensureWeddingDays(numberOfDays, storedDays.map(normalizeWeddingDay)),
    images: (wedding.images || []).map(normalizePhoto).sort((a, b) => a.order - b.order),
  };
}

function addRequiredError(errors, value, field, message) {
  if (!value?.toString().trim()) errors[field] = message;
}

function validateContact(errors, contact = {}, prefix, label) {
  addRequiredError(errors, contact.firstName, `${prefix}.firstName`, `Enter ${label.toLowerCase()} first name.`);
  addRequiredError(errors, contact.lastName, `${prefix}.lastName`, `Enter ${label.toLowerCase()} last name.`);
  if (!emailPattern.test(contact.email?.trim() || '')) errors[`${prefix}.email`] = `Enter a valid ${label.toLowerCase()} email address.`;
  if (!phonePattern.test(contact.phone || '')) errors[`${prefix}.phone`] = "Phone number must start with '+' and contain at least 7 digits.";
}

function isYouTubeUrl(value) {
  try {
    return /(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(new URL(value).hostname);
  } catch {
    return false;
  }
}

export function validateWeddingStep(step, form) {
  const errors = {};

  if (step === 1) {
    if (!['bride', 'groom', 'other'].includes(form.creatorType)) errors.creatorType = 'Choose your role in the wedding.';
    if (form.creatorType === 'other') addRequiredError(errors, form.creatorTypeOther, 'creatorTypeOther', 'Please specify your role in the wedding.');
    addRequiredError(errors, form.firstName, 'firstName', 'Enter your first name.');
    addRequiredError(errors, form.lastName, 'lastName', 'Enter your last name.');
    if (!emailPattern.test(form.email?.trim() || '')) errors.email = 'Enter a valid email address.';
    if (!phonePattern.test(form.phone || '')) errors.phone = "Phone number must start with '+' and contain at least 7 digits.";
  }

  if (step === 2) {
    if (form.creatorType === 'bride' || form.creatorType === 'other') validateContact(errors, form.groom, 'groom', 'Groom');
    if (form.creatorType === 'groom' || form.creatorType === 'other') validateContact(errors, form.bride, 'bride', 'Bride');
  }

  if (step === 3) {
    if (!form.description.trim()) errors.description = 'Tell us a little about your story.';
    if (form.description.length > 2000) errors.description = 'Your story must be 2,000 characters or fewer.';
    if (form.videoUrl.trim() && !isYouTubeUrl(form.videoUrl.trim())) errors.videoUrl = 'Enter a valid YouTube link.';
  }

  if (step === 4) {
    if (!form.weddingDays) errors.weddingDays = 'Select the number of wedding days.';
    if (!form.foodType) errors.foodType = 'Select the food offering.';

    (form.wedding_days || []).forEach((day, index) => {
      const prefix = `wedding_days.${index}`;
      addRequiredError(errors, day.wedding_day_date, `${prefix}.wedding_day_date`, `Choose the Day ${index + 1} date.`);
      addRequiredError(errors, day.wedding_day_time, `${prefix}.wedding_day_time`, `Choose the Day ${index + 1} time.`);
      addRequiredError(errors, day.address_line_1, `${prefix}.address_line_1`, `Enter the Day ${index + 1} address.`);
      addRequiredError(errors, day.city, `${prefix}.city`, `Enter the Day ${index + 1} city.`);
      addRequiredError(errors, day.state, `${prefix}.state`, `Enter the Day ${index + 1} state.`);

      day.wedding_day_events.forEach((event, eventIndex) => {
        const eventPrefix = `${prefix}.wedding_day_events.${eventIndex}`;
        addRequiredError(errors, event.title, `${eventPrefix}.title`, `Enter the Day ${index + 1} event title.`);
        addRequiredError(errors, event.description, `${eventPrefix}.description`, `Enter the Day ${index + 1} event description.`);
        addRequiredError(errors, event.dress_code, `${eventPrefix}.dress_code`, `Enter the Day ${index + 1} event dress code.`);
      });
    });
  }

  if (step === 5 && !form.images.length) errors.images = 'Add at least one wedding photo before publishing.';
  return errors;
}

export function validateEntireWedding(form) {
  return [1, 2, 3, 4, 5].reduce((errors, step) => ({ ...errors, ...validateWeddingStep(step, form) }), {});
}

export function getStepPayload(step, form) {
  const contactPayload = (contact) => ({
    first_name: contact.firstName.trim(),
    last_name: contact.lastName.trim(),
    email: contact.email.trim(),
    phone: contact.phone,
    fathers_name: contact.fathersName.trim(),
    mothers_name: contact.mothersName.trim(),
  });

  if (step === 1) return {
    creator_type: form.creatorType,
    creator_type_other: form.creatorType === 'other' ? form.creatorTypeOther.trim() : null,
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone,
    status: 'draft',
  };

  if (step === 2) {
    if (form.creatorType === 'bride') return { groom: contactPayload(form.groom) };
    if (form.creatorType === 'groom') return { bride: contactPayload(form.bride) };
    return { bride: contactPayload(form.bride), groom: contactPayload(form.groom) };
  }

  if (step === 3) return { description: form.description.trim(), video_url: form.videoUrl.trim() || null };

  return {
    number_of_days: Number(form.weddingDays),
    food_observance: form.foodType,
    wedding_days: (form.wedding_days || []).map((day) => ({
      id: day.id,
      wedding_id: day.wedding_id,
      wedding_day_date: day.wedding_day_date,
      wedding_day_time: day.wedding_day_time,
      address_line_1: day.address_line_1.trim(),
      address_line_2: day.address_line_2.trim(),
      city: day.city.trim(),
      state: day.state.trim(),
      post_code: day.post_code.trim(),
      landmark_near: String(day.landmark_near).trim(),
      latitude: day.latitude,
      longitude: day.longitude,
      wedding_day_events: day.wedding_day_events.map((event) => ({
        id: event.id,
        wedding_day_id: event.wedding_day_id,
        title: event.title.trim(),
        description: event.description.trim(),
        is_music_or_dancing: event.is_music_or_dancing,
        dress_code: event.dress_code.trim(),
      })),
    })),
  };
}
