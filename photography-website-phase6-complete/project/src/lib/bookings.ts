import { supabase } from '@/lib/supabase';
import type { NewBooking, Booking } from '@/types/database';

export interface BookingFormInput {
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  eventType: string;
  eventDate?: string;
  eventLocation?: string;
  numberOfFunctions?: string;
  expectedGuests?: string;
  service?: string; // legacy single-select from the existing form
  photography?: boolean;
  videography?: boolean;
  editing?: boolean;
  drone?: boolean;
  album?: boolean;
  reels?: boolean;
  packageType?: string;
  budget?: string;
  message?: string;
  specialRequirements?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingFormInput, string>>;
}

const PHONE_RE = /^[+]?[\d\s()-]{7,16}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingInput(input: BookingFormInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }
  if (!input.phone || !PHONE_RE.test(input.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (input.email && !EMAIL_RE.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.eventType) {
    errors.eventType = 'Please select an event type.';
  }
  if (input.eventDate) {
    const date = new Date(input.eventDate);
    if (Number.isNaN(date.getTime())) {
      errors.eventDate = 'Please enter a valid date.';
    }
  }
  if (input.message && input.message.length > 4000) {
    errors.message = 'Message is too long (max 4000 characters).';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function toNewBooking(input: BookingFormInput): NewBooking {
  return {
    customer_name: input.name.trim(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp?.trim() || input.phone.trim(),
    email: input.email?.trim() || null,
    event_type: input.eventType,
    event_date: input.eventDate || null,
    event_location: input.eventLocation?.trim() || null,
    number_of_functions: input.numberOfFunctions ? Number(input.numberOfFunctions) : null,
    expected_guests: input.expectedGuests ? Number(input.expectedGuests) : null,
    photography_required: input.photography ?? /photo/i.test(input.service ?? ''),
    videography_required: input.videography ?? /video/i.test(input.service ?? ''),
    editing_required: input.editing ?? /edit/i.test(input.service ?? ''),
    drone_required: input.drone ?? false,
    album_required: input.album ?? false,
    reels_required: input.reels ?? false,
    package_type: input.packageType || null,
    estimated_budget: input.budget?.trim() || null,
    message: input.message?.trim() || null,
    special_requirements: input.specialRequirements?.trim() || null,
    source: 'website',
  };
}

export type SubmitBookingResult =
  | { ok: true; booking: Pick<Booking, 'booking_reference' | 'id'> }
  | { ok: false; reason: 'duplicate' | 'validation' | 'unknown'; message: string };

/**
 * Submits a booking enquiry. Server-side (Postgres) validation/dedupe is the
 * source of truth — this client-side check is only for fast UX feedback.
 */
export async function submitBooking(input: BookingFormInput): Promise<SubmitBookingResult> {
  const { valid, errors } = validateBookingInput(input);
  if (!valid) {
    return {
      ok: false,
      reason: 'validation',
      message: Object.values(errors)[0] ?? 'Please check the form and try again.',
    };
  }

  const payload = toNewBooking(input);

  const { data, error } = await supabase
    .from('bookings')
    .insert(payload as never)
    .select('id, booking_reference')
    .single<Pick<Booking, 'id' | 'booking_reference'>>();

  if (error) {
    // Our Postgres trigger raises exactly this message for duplicate submits.
    if (error.message?.includes('duplicate_booking')) {
      return {
        ok: false,
        reason: 'duplicate',
        message: 'Looks like this enquiry was already submitted a moment ago.',
      };
    }
    console.error('Booking submission failed:', error);
    return {
      ok: false,
      reason: 'unknown',
      message:
        'Something went wrong while submitting your enquiry. Please try again or contact us directly on WhatsApp.',
    };
  }

  return { ok: true, booking: data };
}
