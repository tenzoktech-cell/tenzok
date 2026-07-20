import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TenzokNav from "@/components/TenzokNav";
import type { ChatMessage, Profile, Project } from "@/lib/db-types";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Tenzok administration.",
  robots: { index: false },
};

export interface AdminConversation {
  id: string;
  created_at: string;
  member_ids: string[];
}

export default async function AdminPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  // Role-based route protection: only the admin ever sees this page.
  if (me?.role !== "admin") redirect("/");

  const [{ data: users }, { data: projects }, { data: conversations }, { data: members }, { data: messages }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500)
        .returns<Profile[]>(),
      supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(500)
        .returns<Project[]>(),
      supabase
        .from("conversations")
        .select("id, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("conversation_members").select("conversation_id, user_id"),
      supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)
        .returns<ChatMessage[]>(),
    ]);

  const memberMap = new Map<string, string[]>();
  for (const m of members ?? []) {
    const list = memberMap.get(m.conversation_id) ?? [];
    list.push(m.user_id);
    memberMap.set(m.conversation_id, list);
  }

  const convs: AdminConversation[] = (conversations ?? []).map((c) => ({
    id: c.id,
    created_at: c.created_at,
    member_ids: memberMap.get(c.id) ?? [],
  }));

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <TenzokNav />
      <AdminDashboard
        adminId={user.id}
        users={users ?? []}
        projects={projects ?? []}
        conversations={convs}
        messages={(messages ?? []).reverse()}
      />
    </main>
  );
}
