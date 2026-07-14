"use server";

import { SITE } from "@/lib/site";
import type { ContactState } from "./form-state";

const MIN_FILL_MS = 2500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitEnquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: a real person never fills a hidden field. Answer as if it worked.
  if (field(formData, "company_website")) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  // Bots submit instantly. Humans do not.
  const startedAt = Number(field(formData, "started_at"));
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return {
      status: "error",
      message: "That was submitted a little too fast. Please try again.",
    };
  }

  const name = field(formData, "name");
  const email = field(formData, "email");
  const role = field(formData, "role");
  const message = field(formData, "message");
  const service = field(formData, "service");

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email)) errors.email = "That email address doesn't look right.";
  if (message.length < 15) {
    errors.message = "A sentence or two, so we know what we'd be working on.";
  }
  if (message.length > 4000) errors.message = "That's a bit long — please trim it.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the fields below.", errors };
  }

  const subject = `Tenzok enquiry — ${service || "General"} — ${name}`;
  const body = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `I am a:  ${role || "Not specified"}`,
    `Service: ${service || "Not specified"}`,
    "",
    message,
  ].join("\n");

  try {
    const delivered = await deliver({ subject, body, replyTo: email, name });
    if (!delivered) {
      // No provider configured. Never pretend we captured the lead.
      return {
        status: "error",
        fallback: true,
        message:
          "Our form isn't connected to an inbox yet, so this message was NOT sent. Please email us directly — we reply to every message.",
      };
    }
  } catch {
    return {
      status: "error",
      fallback: true,
      message:
        "Something went wrong sending that, so it was NOT delivered. Please email us directly instead.",
    };
  }

  return {
    status: "success",
    message: `Thanks ${name} — that's with us. We reply to every enquiry, usually within a working day.`,
  };
}

/**
 * Delivery is provider-agnostic and configured by env var. Returns false when
 * nothing is configured, so the caller can fail loudly rather than swallow a lead.
 *
 * Web3Forms  — WEB3FORMS_ACCESS_KEY: free, works with a plain Gmail address, no
 *              domain needed. Note it does relay the submission through a third party.
 * Resend     — RESEND_API_KEY + RESEND_FROM: requires a verified sending domain.
 */
async function deliver({
  subject,
  body,
  replyTo,
  name,
}: {
  subject: string;
  body: string;
  replyTo: string;
  name: string;
}): Promise<boolean> {
  const web3forms = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3forms) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3forms,
        subject,
        from_name: name,
        replyto: replyTo,
        message: body,
      }),
    });
    if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);
    return true;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  if (resendKey && resendFrom) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [SITE.email],
        reply_to: replyTo,
        subject,
        text: body,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return true;
  }

  return false;
}
