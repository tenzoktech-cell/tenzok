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
  "rounded-xl border border-line bg-surface/80 px-3.5 py-2.5 text-sm text-ink transition-all hover:border-line-strong focus:border-cool focus:bg-surface focus:outline-none";

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
    <div className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10rem] top-12 -z-10 h-[36rem] w-[36rem] rounded-full bg-cool/10 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-12rem] top-[42rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/[0.08] blur-[130px]"
      />
      <Container className="max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Administration</Eyebrow>
            <h1 className="mt-5 flex items-center gap-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cool/30 bg-cool/10 text-cool">
                <ShieldCheck size={23} />
              </span>
              Control centre
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
              Manage access, review project activity, and keep conversations healthy
              across the Tenzok workspace.
            </p>
          </div>
          <span className="rounded-full border border-cool/25 bg-cool/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-cool">
            Admin access
          </span>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }, index) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-[1.6rem] border border-line bg-surface-raised/80 p-6 shadow-xl shadow-black/10"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                  index === 1 ? "via-accent/70" : "via-cool/70"
                } to-transparent`}
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <dt className="order-2 mt-1 text-xs uppercase tracking-[0.12em] text-ink-subtle">
                    {label}
                  </dt>
                  <dd className="order-1 text-3xl font-semibold tracking-tight text-ink">{value}</dd>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface text-cool">
                  <Icon size={19} />
                </span>
              </div>
            </div>
          ))}
        </dl>

        <div
          role="group"
          aria-label="Administration sections"
          className="mt-10 flex w-full flex-wrap gap-1.5 rounded-2xl border border-line bg-surface-raised/70 p-1.5 shadow-lg shadow-black/10 sm:w-fit"
        >
          {(
            [
              ["users", "Users"],
              ["projects", "Projects"],
              ["conversations", "Conversations"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
              className={`min-h-11 flex-1 cursor-pointer rounded-xl border px-5 text-sm font-medium transition-all sm:flex-none ${
                tab === id
                  ? "border-cool/35 bg-cool/10 text-ink"
                  : "border-transparent text-ink-subtle hover:bg-surface-overlay hover:text-ink"
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
    <div className="rounded-[2rem] border border-line bg-surface-raised/70 p-5 shadow-xl shadow-black/10 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-lg font-semibold tracking-tight text-ink">Workspace users</p>
          <p className="mt-1 text-sm text-ink-muted">
            Search accounts and manage their role or access status.
          </p>
        </div>
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Search workspace users</span>
          <Search
            aria-hidden
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users…"
            className={`${INPUT} w-full pl-9`}
          />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-line bg-surface/40">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface-overlay/70 text-[0.68rem] uppercase tracking-[0.12em] text-ink-subtle">
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
              <tr
                key={u.id}
                className="border-b border-line transition-colors last:border-0 hover:bg-surface-raised/60"
              >
                <td className="px-4 py-4">
                  <p className="font-medium text-ink">{u.full_name ?? "—"}</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">{u.email}</p>
                </td>
                <td className="px-4 py-4 text-ink-muted">{fmt(u.created_at)}</td>
                <td className="px-4 py-4 capitalize text-ink-muted">{u.plan}</td>
                {u.id === adminId ? (
                  <td colSpan={3} className="px-4 py-4 text-xs text-ink-subtle">
                    <span className="rounded-full border border-cool/25 bg-cool/10 px-3 py-1.5 text-cool">
                      This is you · {ROLE_LABELS[u.role]}
                    </span>
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
      <td className="px-4 py-4">
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
      <td className="px-4 py-4">
        <select name="status" form={formId} defaultValue={user.status} className={INPUT}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </td>
      <td className="px-4 py-4">
        <Button
          type="submit"
          form={formId}
          size="md"
          variant="secondary"
          disabled={pending}
          aria-label={`Save changes for ${user.full_name ?? user.email}`}
        >
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
    return (
      <div className="rounded-[2rem] border border-dashed border-line-strong bg-surface-raised/60 p-14 text-center">
        <FolderKanban size={25} className="mx-auto text-cool" />
        <p className="mt-4 text-sm text-ink-muted">No projects yet.</p>
      </div>
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <article
          key={p.id}
          className="group flex min-h-56 flex-col rounded-[1.6rem] border border-line bg-surface-raised/80 p-5 shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-line-strong"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold tracking-tight text-ink">{p.title}</h3>
            <span className="shrink-0 rounded-full border border-cool/20 bg-cool/[0.07] px-2.5 py-1 text-xs capitalize text-cool">
              {p.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">
            by {nameOf(p.owner_id)} · {fmt(p.created_at)}
          </p>
          {p.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">
              {p.description}
            </p>
          )}
          <form
            action={action}
            className="mt-auto border-t border-line pt-4"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  `Delete "${p.title}" permanently? This cannot be undone.`,
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={p.id} />
            <button
              type="submit"
              disabled={pending}
              aria-label={`Delete project ${p.title}`}
              className="flex min-h-9 items-center gap-1.5 rounded-xl px-2 text-xs text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
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
    return (
      <div className="rounded-[2rem] border border-dashed border-line-strong bg-surface-raised/60 p-14 text-center">
        <MessagesSquare size={25} className="mx-auto text-cool" />
        <p className="mt-4 text-sm text-ink-muted">No conversations yet.</p>
      </div>
    );

  const open = conversations.find((c) => c.id === openId) ?? null;
  const thread = open
    ? messages.filter((m) => m.conversation_id === open.id)
    : [];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="max-h-[560px] overflow-y-auto rounded-[1.75rem] border border-line bg-surface-raised/70 p-2 shadow-xl shadow-black/10">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpenId(c.id)}
            className={`mb-1 block w-full cursor-pointer rounded-2xl border px-4 py-3.5 text-left transition-all last:mb-0 ${
              openId === c.id
                ? "border-cool/30 bg-cool/10"
                : "border-transparent hover:bg-surface-overlay"
            }`}
          >
            <p className="truncate text-sm font-medium text-ink">
              {c.member_ids.map(nameOf).join(" ↔ ") || "Empty conversation"}
            </p>
            <p className="mt-0.5 text-xs text-ink-subtle">Started {fmt(c.created_at)}</p>
          </button>
        ))}
      </div>

      <div className="max-h-[560px] overflow-y-auto rounded-[1.75rem] border border-line bg-surface-raised/70 p-4 shadow-xl shadow-black/10 sm:p-5">
        {!open ? (
          <div className="flex min-h-60 flex-col items-center justify-center p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cool/25 bg-cool/10 text-cool">
              <MessagesSquare size={20} />
            </span>
            <p className="mt-4 text-sm text-ink-muted">
              Select a conversation to read it.
            </p>
          </div>
        ) : thread.length === 0 ? (
          <p className="p-4 text-sm text-ink-muted">No messages in this conversation.</p>
        ) : (
          <ul className="grid gap-3">
            {thread.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border border-line bg-surface/70 p-4 transition-colors hover:border-line-strong"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-ink">{nameOf(m.sender_id)}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-ink-subtle">{fmt(m.created_at)}</span>
                    <form
                      action={action}
                      onSubmit={(event) => {
                        if (
                          !window.confirm(
                            `Delete this message from ${nameOf(m.sender_id)}? This cannot be undone.`,
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        disabled={pending}
                        aria-label={`Delete message from ${nameOf(m.sender_id)}`}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-ink-subtle transition-colors hover:bg-red-500/10 hover:text-red-400"
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
