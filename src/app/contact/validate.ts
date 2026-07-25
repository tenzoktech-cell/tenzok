export interface EnquiryFields {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  service: string;
}

export type FieldErrors = Partial<Record<keyof EnquiryFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,19}$/;

export function validateEnquiry(fields: EnquiryFields): FieldErrors {
  const errors: FieldErrors = {};

  if (fields.name.trim().length < 2) {
    errors.name = "Please tell us your name.";
  }
  if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }
  const phone = fields.phone.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  if (
    phone &&
    (!PHONE_RE.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
  ) {
    errors.phone = "Enter a valid mobile number, including the country code.";
  }
  if (fields.message.trim().length < 15) {
    errors.message = "A sentence or two, so we know what we'd be working on.";
  }
  if (fields.message.trim().length > 4000) {
    errors.message = "That's a bit long — please trim it.";
  }

  return errors;
}

/** Bots submit instantly. Humans do not. */
export const MIN_FILL_MS = 2500;
