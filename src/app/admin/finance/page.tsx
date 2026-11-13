import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { FinanceEntry } from "@/lib/db-types";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import FinanceDashboard from "./FinanceDashboard";

export const metadata: Metadata = {
  title: "Finance",
  description: "Tenzok finance ledger.",
  robots: { index: false, follow: false },
};

export default async function FinancePage() {
  if (!isSupabaseConfigured) redirect("/login");
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Same gate as /admin. Row level security on finance_entries enforces it
  // again in the database, so a non-admin gets no rows even if this slipped.
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") redirect("/");

  const { data, error } = await supabase
    .from("finance_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(2000)
    .returns<FinanceEntry[]>();

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <FinanceDashboard entries={data ?? []} ready={!error} />
    </main>
  );
}
