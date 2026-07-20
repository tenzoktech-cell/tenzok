"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  MessageCircle,
  Minus,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";
import type { RealtimeChannel, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/Toast";
import type { ChatContact, ChatMessage, UserRole } from "@/lib/db-types";
import { ROLE_LABELS } from "@/lib/db-types";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";

/* ------------------------------------------------------------------ */

interface ConversationSummary {
  conversation_id: string;
  other_id: string;
  other_name: string | null;
  other_role: UserRole;
  other_avatar: string | null;
  last_message: string | null;
  last_at: string | null;
  unread: number;
}

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

/** LinkedIn-style floating messenger. Renders nothing while signed out. */
export default function ChatWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [chatToasts, setChatToasts] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();

    const load = async (u: User | null) => {
      setUser(u);
      if (!u) {
        setRole(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role, prefs")
        .eq("id", u.id)
        .single();
      setRole((data?.role as UserRole) ?? "student");
      setChatToasts((data?.prefs?.chat_notifications as boolean | undefined) ?? true);
    };

    supabase.auth.getUser().then(({ data }) => load(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      load(session?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!user || !role) return null;
  return <ChatPanel user={user} role={role} chatToasts={chatToasts} />;
}

/* ------------------------------------------------------------------ */

function ChatPanel({
  user,
  role,
  chatToasts,
}: {
  user: User;
  role: UserRole;
  chatToasts: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [online, setOnline] = useState<Set<string>>(new Set());
  // Which conversation the counterparty is typing in — derived, so switching
  // conversations needs no state reset.
  const [typingConv, setTypingConv] = useState<string | null>(null);

  const activeIdRef = useRef<string | null>(null);
  const openRef = useRef(false);
  useEffect(() => {
    activeIdRef.current = activeId;
    openRef.current = open;
  }, [activeId, open]);
  const listRef = useRef<HTMLDivElement>(null);
  const typingChannel = useRef<RealtimeChannel | null>(null);
  const typingTimer = useRef<number | null>(null);

  const active = conversations?.find((c) => c.conversation_id === activeId) ?? null;
  const totalUnread =
    conversations?.reduce((sum, c) => sum + Number(c.unread), 0) ?? 0;
  const peerTyping = typingConv !== null && typingConv === activeId;

  const loadConversations = useCallback(async () => {
    const { data } = await supabase.rpc("my_conversations");
    setConversations((data as ConversationSummary[] | null) ?? []);
  }, [supabase]);

  /* ---- realtime: new + updated messages (RLS filters to my rooms) ---- */
  useEffect(() => {
    // Initial fetch lives here (not its own effect) so the subscription and the
    // first load share one lifecycle. Inlined as a .then chain so the setState
    // is visibly asynchronous.
    supabase
      .rpc("my_conversations")
      .then(({ data }) => setConversations((data as ConversationSummary[] | null) ?? []));
    const channel = supabase
      .channel("chat-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as ChatMessage;
          if (msg.conversation_id === activeIdRef.current) {
            setMessages((m) =>
              m.some((existing) => existing.id === msg.id) ? m : [...m, msg],
            );
            if (msg.sender_id !== user.id) {
              supabase.rpc("mark_conversation_read", { conv: msg.conversation_id });
              setTypingConv(null);
            }
          } else if (msg.sender_id !== user.id) {
            if (chatToasts && !openRef.current) toast("success", "New message");
          }
          loadConversations();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as ChatMessage;
          if (msg.conversation_id === activeIdRef.current) {
            setMessages((m) =>
              m.map((existing) => (existing.id === msg.id ? msg : existing)),
            );
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id, chatToasts, toast, loadConversations]);

  /* ---- presence: who's online ---- */
  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: { presence: { key: user.id } },
    });
    channel
      .on("presence", { event: "sync" }, () => {
        setOnline(new Set(Object.keys(channel.presenceState())));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ at: Date.now() });
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id]);

  /* ---- typing indicator for the open conversation ---- */
  useEffect(() => {
    if (!activeId) return;
    const conv = activeId;
    const channel = supabase
      .channel(`typing:${conv}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload?.who !== user.id) {
          setTypingConv(conv);
          if (typingTimer.current) window.clearTimeout(typingTimer.current);
          typingTimer.current = window.setTimeout(() => setTypingConv(null), 3000);
        }
      })
      .subscribe();
    typingChannel.current = channel;
    return () => {
      typingChannel.current = null;
      supabase.removeChannel(channel);
    };
  }, [supabase, activeId, user.id]);

  /* ---- open a conversation ---- */
  const openConversation = useCallback(
    async (conversationId: string) => {
      setActiveId(conversationId);
      setMessages([]);
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(200);
      setMessages((data as ChatMessage[] | null) ?? []);
      await supabase.rpc("mark_conversation_read", { conv: conversationId });
      loadConversations();
    },
    [supabase, loadConversations],
  );

  const startWith = useCallback(
    async (target: string | null) => {
      const { data, error } = await supabase.rpc("start_conversation_with", {
        target,
      });
      if (error) {
        toast("error", error.message);
        return;
      }
      await loadConversations();
      await openConversation(data as string);
      setQuery("");
      setContacts([]);
    },
    [supabase, toast, loadConversations, openConversation],
  );

  /* ---- contact search (companies/recruiters/admin only) ---- */
  useEffect(() => {
    if (role === "student" || role === "freelancer") return;
    const q = query.trim();
    if (!q) return; // clearing happens in the input's onChange
    const timer = window.setTimeout(async () => {
      const { data } = await supabase.rpc("search_contacts", { q });
      setContacts((data as ChatContact[] | null) ?? []);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [supabase, query, role]);

  /* ---- send ---- */
  const send = async () => {
    const text = draft.trim();
    if (!text || !activeId) return;
    setDraft("");
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeId,
      sender_id: user.id,
      message: text,
    });
    if (error) {
      toast("error", error.message);
      setDraft(text);
    }
  };

  const notifyTyping = () => {
    typingChannel.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { who: user.id },
    });
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, peerTyping]);

  /* ------------------------------------------------------------------ */

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Minimise chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-ink shadow-2xl shadow-black/50 transition-transform hover:scale-105"
      >
        {open ? <Minus size={22} /> : <MessageCircle size={22} />}
        {!open && totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-surface bg-red-500 px-1.5 text-xs font-semibold text-white">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Messages"
          className="fade-up fixed bottom-24 right-5 z-[90] flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-2xl shadow-black/60"
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-line bg-surface-overlay px-4 py-3">
            {active ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Back to conversations"
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <ArrowLeft size={16} />
                </button>
                <Avatar
                  name={active.other_name}
                  url={active.other_avatar}
                  online={online.has(active.other_id)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {active.other_name ?? "Conversation"}
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {peerTyping
                      ? "typing…"
                      : online.has(active.other_id)
                        ? "Online"
                        : ROLE_LABELS[active.other_role]}
                  </p>
                </div>
              </>
            ) : (
              <p className="flex-1 text-sm font-medium text-ink">Messages</p>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X size={16} />
            </button>
          </header>

          {/* Body */}
          {active ? (
            <>
              <div ref={listRef} className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <p className="p-4 text-center text-sm text-ink-subtle">
                    Say hello — this is the start of your conversation.
                  </p>
                ) : (
                  <ul className="grid gap-2">
                    {messages.map((m) => {
                      const mine = m.sender_id === user.id;
                      return (
                        <li key={m.id} className={mine ? "flex justify-end" : "flex"}>
                          <div
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                              mine
                                ? "rounded-br-md bg-accent text-accent-ink"
                                : "rounded-bl-md border border-line bg-surface text-ink"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.message}</p>
                            <p
                              className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                mine ? "text-accent-ink/70" : "text-ink-subtle"
                              }`}
                            >
                              {fmtTime(m.created_at)}
                              {mine &&
                                (m.is_read ? (
                                  <CheckCheck size={12} />
                                ) : (
                                  <Check size={12} />
                                ))}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {peerTyping && (
                  <p className="mt-2 text-xs text-ink-subtle">typing…</p>
                )}
              </div>

              <footer className="flex items-end gap-2 border-t border-line p-3">
                <textarea
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    notifyTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="Write a message…"
                  className="max-h-28 flex-1 resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-line-strong focus:outline-none"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!draft.trim()}
                  aria-label="Send"
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-ink transition-opacity disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </footer>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* Students and freelancers talk to Tenzok; others can search. */}
              {role === "student" || role === "freelancer" ? (
                <div className="border-b border-line p-4">
                  <button
                    type="button"
                    onClick={() => startWith(null)}
                    className="w-full cursor-pointer rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
                  >
                    Message Tenzok support
                  </button>
                  <p className="mt-2 text-center text-xs text-ink-subtle">
                    Your messages go directly to the Tenzok team.
                  </p>
                </div>
              ) : (
                <div className="border-b border-line p-3">
                  <label className="relative block">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                    />
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        if (!e.target.value.trim()) setContacts([]);
                      }}
                      placeholder="Search people…"
                      className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-line-strong focus:outline-none"
                    />
                  </label>
                  {contacts.length > 0 && (
                    <ul className="mt-2 grid gap-1">
                      {contacts.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => startWith(c.id)}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface"
                          >
                            <Avatar name={c.full_name} url={c.avatar_url} online={online.has(c.id)} />
                            <span className="min-w-0">
                              <span className="block truncate text-sm text-ink">
                                {c.full_name ?? c.username ?? "User"}
                              </span>
                              <span className="block text-xs text-ink-subtle">
                                {ROLE_LABELS[c.role]}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Recent conversations */}
              {conversations === null ? (
                <div className="grid gap-2 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-overlay" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <p className="p-6 text-center text-sm text-ink-subtle">
                  No conversations yet.
                </p>
              ) : (
                <ul>
                  {conversations.map((c) => (
                    <li key={c.conversation_id}>
                      <button
                        type="button"
                        onClick={() => openConversation(c.conversation_id)}
                        className="flex w-full cursor-pointer items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors last:border-0 hover:bg-surface"
                      >
                        <Avatar
                          name={c.other_name}
                          url={c.other_avatar}
                          online={online.has(c.other_id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium text-ink">
                              {c.other_name ?? "Conversation"}
                            </span>
                            {c.last_at && (
                              <span className="shrink-0 text-[10px] text-ink-subtle">
                                {fmtTime(c.last_at)}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 flex items-center justify-between gap-2">
                            <span className="truncate text-xs text-ink-subtle">
                              {c.last_message ?? "No messages yet"}
                            </span>
                            {Number(c.unread) > 0 && (
                              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-ink">
                                {c.unread}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Avatar({
  name,
  url,
  online,
}: {
  name: string | null;
  url: string | null;
  online: boolean;
}) {
  return (
    <span className="relative shrink-0">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-overlay">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={name ?? ""} className="h-full w-full object-cover" />
        ) : (
          <UserRound size={16} className="text-ink-subtle" />
        )}
      </span>
      <span
        aria-hidden
        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-raised ${
          online ? "bg-emerald-400" : "bg-ink-subtle/40"
        }`}
      />
    </span>
  );
}
