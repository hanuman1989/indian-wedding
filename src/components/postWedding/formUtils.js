export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\+\d{7,}$/;

export const languageOptions = [
  'Hindi',
  'English',
  'Punjabi',
  'Gujarati',
  'Marathi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Other',
];

export function createWeddingEvent(day) {
  return {
    day,
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    venueName: '',
    venueAddress: '',
    description: '',
  };
}

export function ensureWeddingEvents(weddingDays, events = []) {
  const totalDays = Math.max(1, Number(weddingDays) || 1);

  return Array.from({ length: totalDays }, (_, index) => ({
    ...createWeddingEvent(index + 1),
    ...(events[index] || {}),
    day: index + 1,
  }));
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
    bride: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    groom: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    story: '',
    youtubeUrl: '',
    weddingDays: '1',
    foodType: '',
    languages: [],
    events: [createWeddingEvent(1)],
    photos: [],
  };
}

function unwrapContact(source) {
  const contact = Array.isArray(source) ? source[0] : source;
  if (!contact) return {};
  return contact.data ? unwrapContact(contact.data) : contact;
}

function normalizeContact(source = {}, prefix = '') {
  const contact = unwrapContact(source);
  const fullName = contact.name || contact.full_name || contact[`${prefix}_name`] || '';
  const [firstName = '', ...remainingNames] = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: contact.firstName || contact.first_name || contact[`${prefix}_first_name`] || contact[`${prefix}FirstName`] || firstName,
    lastName: contact.lastName || contact.last_name || contact[`${prefix}_last_name`] || contact[`${prefix}LastName`] || remainingNames.join(' '),
    email: contact.email || contact[`${prefix}_email`] || contact[`${prefix}Email`] || '',
    phone: contact.phone || contact.phone_number || contact[`${prefix}_phone`] || contact[`${prefix}Phone`] || '',
  };
}

function getPartnerContact(wedding, partner) {
  return unwrapContact(wedding[partner]
    || wedding[`${partner}_details`]
    || wedding[`${partner}Details`]
    || wedding[`${partner}_detail`]
    || wedding[`${partner}Detail`]
    || wedding[`${partner}_data`]
    || wedding[`${partner}Data`]
    || wedding.partners?.[partner]
    || wedding.partner_details?.[partner]
    || wedding.partnerDetails?.[partner]
    || wedding);
}

function normalizeEvent(event, index) {
  return {
    day: event.day || index + 1,
    eventName: event.eventName || event.event_name || '',
    eventDate: event.eventDate || event.event_date || event.date || '',
    startTime: event.startTime || event.start_time || '',
    endTime: event.endTime || event.end_time || '',
    venueName: event.venueName || event.venue_name || '',
    venueAddress: event.venueAddress || event.venue_address || '',
    description: event.description || '',
  };
}

function normalizePhoto(photo, index) {
  return {
    id: photo.id || photo.photo_id || photo.uuid || `photo-${index}`,
    url: photo.url || photo.image_url || photo.path || photo.photo || '',
    order: photo.order || photo.display_order || index + 1,
  };
}

function normalizeLanguages(languages) {
  if (Array.isArray(languages)) return languages;
  if (typeof languages === 'string') {
    return languages.split(',').map((language) => language.trim()).filter(Boolean);
  }
  return [];
}

export function getWeddingFromResponse(response) {
  return response?.wedding || response?.data?.wedding || response?.data || response;
}

export function normalizeWeddingForm(response, user = {}) {
  const wedding = getWeddingFromResponse(response) || {};
  const initial = getInitialWeddingForm(user);
  const storedEvents = wedding.events || wedding.wedding_events || [];
  const weddingDays = String(wedding.weddingDays || wedding.wedding_days || storedEvents.length || initial.weddingDays);

  return {
    ...initial,
    creatorType: wedding.creator_type || initial.creatorType,
    creatorTypeOther: wedding.creatorTypeOther || wedding.creator_type_other || initial.creatorTypeOther,
    firstName: wedding.firstName || wedding.first_name || initial.firstName,
    lastName: wedding.lastName || wedding.last_name || initial.lastName,
    email: wedding.email || initial.email,
    phone: wedding.phone || initial.phone,
    bride: normalizeContact(getPartnerContact(wedding, 'bride'), 'bride'),
    groom: normalizeContact(getPartnerContact(wedding, 'groom'), 'groom'),
    story: wedding.story || '',
    youtubeUrl: wedding.youtubeUrl || wedding.youtube_url || '',
    weddingDays,
    foodType: wedding.foodType || wedding.food_type || '',
    languages: normalizeLanguages(wedding.languages || wedding.main_languages),
    events: ensureWeddingEvents(weddingDays, storedEvents.map(normalizeEvent)),
    photos: (wedding.photos || wedding.wedding_photos || []).map(normalizePhoto).sort((first, second) => first.order - second.order),
  };
}

function addRequiredError(errors, value, field, message) {
  if (!value?.trim()) errors[field] = message;
}

function validateContact(errors, contact, prefix, label) {
  addRequiredError(errors, contact.firstName, `${prefix}.firstName`, `Enter ${label.toLowerCase()} first name.`);
  addRequiredError(errors, contact.lastName, `${prefix}.lastName`, `Enter ${label.toLowerCase()} last name.`);

  if (!emailPattern.test(contact.email?.trim() || '')) {
    errors[`${prefix}.email`] = `Enter a valid ${label.toLowerCase()} email address.`;
  }
  if (!phonePattern.test(contact.phone || '')) {
    errors[`${prefix}.phone`] = `Enter a valid ${label.toLowerCase()} phone number with country code.`;
  }
}

function isYouTubeUrl(value) {
  try {
    const url = new URL(value);
    return /(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(url.hostname);
  } catch {
    return false;
  }
}

export function validateWeddingStep(step, form) {
  const errors = {};

  if (step === 1) {
    if (!['bride', 'groom', 'other'].includes(form.creatorType)) {
      errors.creatorType = 'Choose your role in the wedding.';
    }
    if (form.creatorType === 'other') {
      addRequiredError(errors, form.creatorTypeOther, 'creatorTypeOther', 'Please specify your role in the wedding.');
    }
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
    if (!form.story.trim()) errors.story = 'Tell us a little about your story.';
    if (form.story.length > 2000) errors.story = 'Your story must be 2,000 characters or fewer.';
    if (form.youtubeUrl.trim() && !isYouTubeUrl(form.youtubeUrl.trim())) {
      errors.youtubeUrl = 'Enter a valid YouTube link.';
    }
  }

  if (step === 4) {
    if (!form.weddingDays) errors.weddingDays = 'Select the number of wedding days.';
    if (!form.foodType) errors.foodType = 'Select the food offering.';
    if (!form.languages.length) errors.languages = 'Choose at least one wedding language.';

    form.events.forEach((event, index) => {
      const prefix = `events.${index}`;
      addRequiredError(errors, event.eventName, `${prefix}.eventName`, `Enter the Day ${event.day} event name.`);
      addRequiredError(errors, event.eventDate, `${prefix}.eventDate`, `Choose the Day ${event.day} event date.`);
      addRequiredError(errors, event.startTime, `${prefix}.startTime`, `Choose the Day ${event.day} start time.`);
      addRequiredError(errors, event.endTime, `${prefix}.endTime`, `Choose the Day ${event.day} end time.`);
      addRequiredError(errors, event.venueName, `${prefix}.venueName`, `Enter the Day ${event.day} venue name.`);
      addRequiredError(errors, event.venueAddress, `${prefix}.venueAddress`, `Enter the Day ${event.day} venue address.`);

      if (event.startTime && event.endTime && event.endTime <= event.startTime) {
        errors[`${prefix}.endTime`] = 'End time must be later than start time.';
      }
    });
  }

  if (step === 5 && !form.photos.length) {
    errors.photos = 'Add at least one wedding photo before publishing.';
  }

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
  });

  if (step === 1) {
    return {
      creator_type: form.creatorType,
      creator_type_other: form.creatorType === 'other' ? form.creatorTypeOther.trim() : null,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone,
      status: 'draft',
    };
  }

  if (step === 2) {
    if (form.creatorType === 'bride') {
      return { groom: contactPayload(form.groom) };
    }

    if (form.creatorType === 'groom') {
      return { bride: contactPayload(form.bride) };
    }

    return {
      bride: contactPayload(form.bride),
      groom: contactPayload(form.groom),
    };
  }

  if (step === 3) {
    return {
      story: form.story.trim(),
      youtube_url: form.youtubeUrl.trim() || null,
    };
  }

  return {
    wedding_days: Number(form.weddingDays),
    food_type: form.foodType,
    languages: form.languages,
    events: form.events.map((event) => ({
      day: event.day,
      event_name: event.eventName.trim(),
      event_date: event.eventDate,
      start_time: event.startTime,
      end_time: event.endTime,
      venue_name: event.venueName.trim(),
      venue_address: event.venueAddress.trim(),
      description: event.description.trim() || null,
    })),
  };
}