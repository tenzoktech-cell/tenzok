import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ChatMessage, Enquiry, Profile, Project, ProjectFile, ProjectUpdate } from "@/lib/db-types";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = { title: "Admin", description: "Tenzok administration.", robots: { index: false } };
export interface AdminConversation { id: string; created_at: string; member_ids: string[]; }

export default async function AdminPage() {
  if (!isSupabaseConfigured) redirect("/login");
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/");

  const [usersResult, projectsResult, conversationsResult, membersResult, messagesResult, enquiriesResult, updatesResult, filesResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500).returns<Profile[]>(),
    supabase.from("projects").select("*").order("updated_at", { ascending: false }).limit(500).returns<Project[]>(),
    supabase.from("conversations").select("id, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("conversation_members").select("conversation_id, user_id"),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(1000).returns<ChatMessage[]>(),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500).returns<Enquiry[]>(),
    supabase.from("project_updates").select("*").order("created_at", { ascending: false }).limit(500).returns<ProjectUpdate[]>(),
    supabase.from("project_files").select("*").order("created_at", { ascending: false }).limit(500).returns<ProjectFile[]>(),
  ]);

  const memberMap = new Map<string, string[]>();
  for (const member of membersResult.data ?? []) { const list = memberMap.get(member.conversation_id) ?? []; list.push(member.user_id); memberMap.set(member.conversation_id, list); }
  const conversations: AdminConversation[] = (conversationsResult.data ?? []).map((conversation) => ({ id: conversation.id, created_at: conversation.created_at, member_ids: memberMap.get(conversation.id) ?? [] }));
  const operationsReady = !enquiriesResult.error && !updatesResult.error && !filesResult.error;

  return <main id="main" tabIndex={-1} className="bg-surface"><AdminDashboard adminId={user.id} users={usersResult.data ?? []} projects={projectsResult.data ?? []} enquiries={enquiriesResult.data ?? []} projectUpdates={updatesResult.data ?? []} projectFiles={filesResult.data ?? []} conversations={conversations} messages={(messagesResult.data ?? []).reverse()} operationsReady={operationsReady}/></main>;
}