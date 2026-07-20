// One-time admin account seeder. Run from your machine — NEVER commit keys.
//
//   ADMIN_EMAIL=info@tenzok.in \
//   ADMIN_PASSWORD='<choose a strong password>' \
//   SUPABASE_URL=https://eusezzheousudrcyapzu.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<Project Settings → API → service_role> \
//   node scripts/seed-admin.mjs
//
// PowerShell:
//   $env:ADMIN_EMAIL="info@tenzok.in"; $env:ADMIN_PASSWORD="..."; `
//   $env:SUPABASE_URL="https://eusezzheousudrcyapzu.supabase.co"; `
//   $env:SUPABASE_SERVICE_ROLE_KEY="..."; node scripts/seed-admin.mjs
//
// The service_role key bypasses RLS — it must only ever live in your shell
// for the duration of this command, never in the repo or the browser bundle.

const url = process.env.SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const email = process.env.ADMIN_EMAIL?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error(
    "Missing env vars. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD",
  );
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

async function api(path, options = {}) {
  const res = await fetch(`${url}${path}`, { headers, ...options });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

// 1. Create the auth user (pre-confirmed), or find it if it already exists.
let userId;
const created = await api("/auth/v1/admin/users", {
  method: "POST",
  body: JSON.stringify({ email, password, email_confirm: true }),
});

if (created.ok) {
  userId = created.body.id;
  console.log(`Created admin auth user ${userId}`);
} else if (
  created.status === 422 ||
  /already.*(registered|exists)/i.test(JSON.stringify(created.body))
) {
  const list = await api(`/auth/v1/admin/users?page=1&per_page=200`);
  const existing = (list.body.users ?? []).find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!existing) {
    console.error("User reported as existing but not found:", created.body);
    process.exit(1);
  }
  userId = existing.id;
  // Keep the password in sync with what was requested.
  await api(`/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ password, email_confirm: true }),
  });
  console.log(`Admin auth user already existed (${userId}); password updated.`);
} else {
  console.error("Failed to create admin user:", created.status, created.body);
  process.exit(1);
}

// 2. Ensure the profile row exists and carries the admin role.
const upsert = await api("/rest/v1/profiles", {
  method: "POST",
  headers: { ...headers, Prefer: "resolution=merge-duplicates" },
  body: JSON.stringify({
    id: userId,
    email,
    username: "tenzok",
    full_name: "Tenzok Admin",
    role: "admin",
    status: "active",
  }),
});

if (!upsert.ok) {
  console.error("Failed to set admin profile:", upsert.status, upsert.body);
  process.exit(1);
}

console.log(`Done. ${email} is an admin. Log in at /login.`);
