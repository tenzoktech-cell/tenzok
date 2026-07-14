/** Shared form state. Deliberately NOT in actions.ts — a "use server" module
 *  may only export async functions, so exporting this object from there is a
 *  runtime error ("A 'use server' file can only export async functions"). */
export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors, keyed by input name. */
  errors?: Record<string, string>;
  /** Set when delivery is not configured, so the UI can surface the mailto
   *  fallback loudly instead of pretending the lead was sent. */
  fallback?: boolean;
}

export const INITIAL_CONTACT_STATE: ContactState = { status: "idle", message: "" };
