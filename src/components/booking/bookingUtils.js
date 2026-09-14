// Flat contribution per traveler (the API does not expose wedding pricing yet).
export const CONTRIBUTION_PER_PERSON = 250;

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
  const [firstName = '', ...remainingNames] = fullName.split(/\s+/).filter(Boolean)

  return {
    firstName: user?.first_name || user?.firstName || firstName,
    lastName: user?.last_name || user?.lastName || remainingNames.join(' '),
    email: user?.email || '',
    phone: user?.phone || '',
    visitingFrom: '',
    hearAboutUs: '',
    travelerCount: 1,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardCountry: 'India',
    acceptedTerms: false,
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

  if (!form.firstName.trim()) errors.firstName = 'First name is required.'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  if (!form.phone.trim()) errors.phone = 'Phone number is required.'
  if (!form.visitingFrom.trim()) errors.visitingFrom = 'Please tell us where you are visiting from.'
  if (!form.hearAboutUs) errors.hearAboutUs = 'Please select an option.'
  if (!selectedDayIds.length) errors.weddingDays = 'Select at least one wedding day to attend.'
  if (form.travelerCount < 1) errors.travelerCount = 'At least one traveler is required.'

  if (form.paymentMethod === 'card') {
    if (form.cardNumber.replace(/\s/g, '').length < 15) errors.cardNumber = 'Enter a valid card number.'
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) errors.cardExpiry = 'Enter a valid expiration date (MM/YY).'
    if (!/^\d{3,4}$/.test(form.cardCvc)) errors.cardCvc = 'Enter a valid security code.'
  }

  if (!form.acceptedTerms) errors.acceptedTerms = 'You must accept the Terms of Use and Privacy Notice.'

  return errors
}
