// Flat contribution per traveler (the API does not expose wedding pricing yet).
export const CONTRIBUTION_PER_PERSON = 150;

export const hearAboutUsOptions = [
  { value: '', label: 'Select an option' },
  { value: 'friend_family', label: 'Friend / Family' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'search_engine', label: 'Search Engine' },
  { value: 'wedding_invitation', label: 'Wedding Invitation / Card' },
  { value: 'other', label: 'Other' },
]

export function getInitialBookingForm(user = {}) {
  const fullName = (user?.name || user?.full_name || '').trim()
  const [first_name = '', ...remainingNames] = fullName.split(/\s+/).filter(Boolean)

  return {
    first_name: first_name,
    last_name: remainingNames.join(' '),
    email: user?.email || '',
    phone: user?.phone || '',
    visiting_from: '',
    hear_about: '',
    number_of_travelers: 1,
    card_country: 'India',
    accepted_terms: false,
  }
}

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function formatCardExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function validateBookingForm(form, selectedDayIds) {
  const errors = {}

  if (!form.first_name.trim()) errors.first_name = 'First name is required.'
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  if (!form.phone.trim()) errors.phone = 'Phone number is required.'
  if (!form.visiting_from.trim()) errors.visiting_from = 'Please tell us where you are visiting from.'
  if (!form.hear_about) errors.hear_about = 'Please select an option.'
  if (!selectedDayIds.length) errors.weddingDays = 'Select at least one wedding day to attend.'
  if (form.number_of_travelers < 1) errors.number_of_travelers = 'At least one traveler is required.'

  if (form.paymentMethod === 'card') {
    if (form.card_number.replace(/\s/g, '').length < 15) errors.card_number = 'Enter a valid card number.'
    if (!/^\d{2}\/\d{2}$/.test(form.card_expiry)) errors.card_expiry = 'Enter a valid expiration date (MM/YY).'
    if (!/^\d{3,4}$/.test(form.card_cvc)) errors.card_cvc = 'Enter a valid security code.'
    if (!form.accepted_terms) errors.accepted_terms = 'You must accept the Terms of Use and Privacy Notice.'
  }

  

  return errors
}
