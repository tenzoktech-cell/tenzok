"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  MessagesSquare,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Toast";
import {
  adminDeleteMessage,
  adminDeleteProject,
  adminUpdateUser,
} from "@/lib/admin-actions";
import type { ActionState } from "@/lib/profile-actions";
import type { ChatMessage, Profile, Project } from "@/lib/db-types";
import { ROLE_LABELS } from "@/lib/db-types";
import type { AdminConversation } from "./page";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const INPUT =
  "rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-line-strong focus:outline-none";

type Tab = "users" | "projects" | "conversations";

interface Props {
  adminId: string;
  users: Profile[];
  projects: Project[];
  conversations: AdminConversation[];
  messages: ChatMessage[];
}

export default function AdminDashboard({
  adminId,
  users,
  projects,
  conversations,
  messages,
}: Props) {
  const [tab, setTab] = useState<Tab>("users");

  const nameOf = useMemo(() => {
    const map = new Map(users.map((u) => [u.id, u.full_name ?? u.email ?? "Unknown"]));
    return (id: string) => map.get(id) ?? "Unknown";
  }, [users]);

  const stats = [
    { icon: Users, label: "Users", value: users.length },
    { icon: FolderKanban, label: "Projects", value: projects.length },
    { icon: MessagesSquare, label: "Conversations", value: conversations.length },
  ];

  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <Container>
        <Eyebrow>Administration</Eyebrow>
        <h1 className="mt-4 flex items-center gap-3 text-3xl text-ink sm:text-4xl">
          <ShieldCheck size={28} className="text-accent" />
          Admin dashboard
        </h1>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 bg-surface-raised p-6">
              <Icon size={20} className="text-accent" />
              <div>
                <dd className="text-2xl font-medium text-ink">{value}</dd>
                <dt className="text-xs text-ink-subtle">{label}</dt>
              </div>
            </div>
          ))}
        </dl>

        <div role="tablist" className="mt-10 flex flex-wrap gap-2 border-b border-line pb-px">
          {(
            [
              ["users", "Users"],
              ["projects", "Projects"],
              ["conversations", "Conversations"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`min-h-11 cursor-pointer rounded-t-xl border-b-2 px-4 text-sm font-medium transition-colors ${
                tab === id
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-subtle hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "users" && <UsersTab users={users} adminId={adminId} />}
          {tab === "projects" && <ProjectsTab projects={projects} nameOf={nameOf} />}
          {tab === "conversations" && (
            <ConversationsTab
              conversations={conversations}
              messages={messages}
              nameOf={nameOf}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function useActionToast(state: ActionState) {
  const toast = useToast();
  useEffect(() => {
    if (state?.notice) toast("success", state.notice);
    if (state?.error) toast("error", state.error);
  }, [state, toast]);
}

function UsersTab({ users, adminId }: { users: Profile[]; adminId: string }) {
  const [query, setQuery] = useState("");
  const [state, action, pending] = useActionState(adminUpdateUser, null);
  useActionToast(state);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? users.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q),
      )
    : users;

  return (
    <div>
      <label className="relative block max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users…"
          className={`${INPUT} w-full pl-9`}
        />
      </label>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface-raised text-xs uppercase tracking-wide text-ink-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Save</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-ink-subtle">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{fmt(u.created_at)}</td>
                <td className="px-4 py-3 capitalize text-ink-muted">{u.plan}</td>
                {u.id === adminId ? (
                  <td colSpan={3} className="px-4 py-3 text-xs text-ink-subtle">
                    This is you — role locked ({ROLE_LABELS[u.role]})
                  </td>
                ) : (
                  <UserEditCells user={u} action={action} pending={pending} />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserEditCells({
  user,
  action,
  pending,
}: {
  user: Profile;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  const formId = `user-${user.id}`;
  return (
    <>
      <td className="px-4 py-3">
        <form id={formId} action={action}>
          <input type="hidden" name="id" value={user.id} />
        </form>
        <select name="role" form={formId} defaultValue={user.role} className={INPUT}>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <select name="status" form={formId} defaultValue={user.status} className={INPUT}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <Button type="submit" form={formId} size="md" variant="secondary" disabled={pending}>
          Save
        </Button>
      </td>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ProjectsTab({
  projects,
  nameOf,
}: {
  projects: Project[];
  nameOf: (id: string) => string;
}) {
  const [state, action, pending] = useActionState(adminDeleteProject, null);
  useActionToast(state);

  if (projects.length === 0)
    return <p className="text-sm text-ink-muted">No projects yet.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <article key={p.id} className="rounded-2xl border border-line bg-surface-raised p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium text-ink">{p.title}</h3>
            <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-xs capitalize text-ink-muted">
              {p.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            by {nameOf(p.owner_id)} · {fmt(p.created_at)}
          </p>
          {p.description && (
            <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{p.description}</p>
          )}
          <form action={action} className="mt-4 border-t border-line pt-3">
            <input type="hidden" name="id" value={p.id} />
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-red-300"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ConversationsTab({
  conversations,
  messages,
  nameOf,
}: {
  conversations: AdminConversation[];
  messages: ChatMessage[];
  nameOf: (id: string) => string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [state, action, pending] = useActionState(adminDeleteMessage, null);
  useActionToast(state);

  if (conversations.length === 0)
    return <p className="text-sm text-ink-muted">No conversations yet.</p>;

  const open = conversations.find((c) => c.id === openId) ?? null;
  const thread = open
    ? messages.filter((m) => m.conversation_id === open.id)
    : [];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="max-h-[520px] overflow-y-auto rounded-2xl border border-line">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpenId(c.id)}
            className={`block w-full cursor-pointer border-b border-line px-4 py-3 text-left last:border-0 transition-colors ${
              openId === c.id ? "bg-surface-overlay" : "hover:bg-surface-raised"
            }`}
          >
            <p className="truncate text-sm font-medium text-ink">
              {c.member_ids.map(nameOf).join(" ↔ ") || "Empty conversation"}
            </p>
            <p className="mt-0.5 text-xs text-ink-subtle">Started {fmt(c.created_at)}</p>
          </button>
        ))}
      </div>

      <div className="max-h-[520px] overflow-y-auto rounded-2xl border border-line bg-surface-raised p-4">
        {!open ? (
          <p className="p-4 text-sm text-ink-muted">
            Select a conversation to read it.
          </p>
        ) : thread.length === 0 ? (
          <p className="p-4 text-sm text-ink-muted">No messages in this conversation.</p>
        ) : (
          <ul className="grid gap-3">
            {thread.map((m) => (
              <li key={m.id} className="rounded-xl border border-line bg-surface p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-ink">{nameOf(m.sender_id)}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-ink-subtle">{fmt(m.created_at)}</span>
                    <form action={action}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        disabled={pending}
                        aria-label="Delete message"
                        className="text-ink-subtle transition-colors hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </form>
                  </div>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-muted">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
