"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Toast";
import {
  adminCreateFinanceEntry,
  adminDeleteFinanceEntry,
  adminUpdateFinanceEntry,
} from "@/lib/admin-actions";
import type { ActionState } from "@/lib/profile-actions";
import {
  FINANCE_CATEGORY_LABELS,
  FINANCE_PARTNERS,
  type FinanceCategory,
  type FinanceEntry,
  type FinanceKind,
} from "@/lib/db-types";

/* ------------------------------------------------------------------ */
/* Formatting & colour                                                  */
/* ------------------------------------------------------------------ */

// Validated pair (dataviz validator, light surface #fbf9f4): all checks pass.
const IN_COLOR = "#1f8a70";
const OUT_COLOR = "#c8451c";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
/** Axis labels in Indian units: ₹12K, ₹1.5L, ₹2Cr. */
function compactMoney(n: number) {
  const trim = (v: number) => v.toFixed(1).replace(/\.0$/, "");
  if (n >= 1e7) return `₹${trim(n / 1e7)}Cr`;
  if (n >= 1e5) return `₹${trim(n / 1e5)}L`;
  if (n >= 1e3) return `₹${trim(n / 1e3)}K`;
  return `₹${Math.round(n)}`;
}
const formatMoney = (n: number) => money.format(n);
const formatSigned = (n: number) => `${n < 0 ? "−" : ""}${money.format(Math.abs(n))}`;
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
const monthLabel = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "UTC",
  });
const monthLong = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/** Local calendar date as YYYY-MM-DD. */
const todayISO = () => new Date().toLocaleDateString("en-CA");
const amountOf = (e: FinanceEntry) => Number(e.amount) || 0;

const CATEGORIES = Object.keys(FINANCE_CATEGORY_LABELS) as FinanceCategory[];
const INPUT =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-ink focus:outline-none sm:text-sm";
const LABEL = "text-[12px] font-medium text-ink-muted";

type Period = "all" | "month" | "quarter" | "year";
const PERIODS: [Period, string][] = [
  ["all", "All time"],
  ["month", "This month"],
  ["quarter", "Last 3 months"],
  ["year", "This year"],
];

function periodStart(period: Period): string | null {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const iso = (d: Date) => d.toLocaleDateString("en-CA");
  if (period === "month") return iso(new Date(y, m, 1));
  if (period === "quarter") return iso(new Date(y, m - 2, 1));
  if (period === "year") return iso(new Date(y, 0, 1));
  return null;
}

function useActionToast(state: ActionState) {
  const toast = useToast();
  useEffect(() => {
    if (state?.notice) toast("success", state.notice);
    if (state?.error) toast("error", state.error);
  }, [state, toast]);
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const subscribeNoop = () => () => {};

/**
 * "Today", "this month" and Indian number formatting depend on the viewer's
 * clock and locale, which the server (UTC) can't know. Render in the browser
 * only — this page is admin-only and never indexed, so nothing is lost.
 */
export default function FinanceDashboard(props: { entries: FinanceEntry[]; ready: boolean }) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return mounted ? <FinanceWorkspace {...props} /> : <FinanceSkeleton />;
}

function FinanceSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading finance" className="pb-24 pt-24 sm:pt-28">
      <Container className="max-w-7xl">
        <div className="h-4 w-28 animate-pulse rounded bg-ink/[0.07]" />
        <div className="mt-6 h-9 w-48 animate-pulse rounded bg-ink/[0.07]" />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-line bg-surface-raised" />
          ))}
        </div>
        <div className="mt-5 h-72 animate-pulse rounded-xl border border-line bg-surface-raised" />
      </Container>
    </div>
  );
}

function FinanceWorkspace({
  entries,
  ready,
}: {
  entries: FinanceEntry[];
  ready: boolean;
}) {
  const [period, setPeriod] = useState<Period>("all");
  const [kind, setKind] = useState<"all" | FinanceKind>("all");
  const [category, setCategory] = useState<"all" | FinanceCategory>("all");
  const [query, setQuery] = useState("");

  // Period scopes everything; kind/category/search narrow the list only, so
  // the totals always answer "what happened in this period".
  const inPeriod = useMemo(() => {
    const start = periodStart(period);
    return start ? entries.filter((e) => e.entry_date >= start) : entries;
  }, [entries, period]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const e of inPeriod) {
      if (e.kind === "income") income += amountOf(e);
      else expense += amountOf(e);
    }
    const net = income - expense;
    return { income, expense, net, share: net / FINANCE_PARTNERS };
  }, [inPeriod]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inPeriod.filter(
      (e) =>
        (kind === "all" || e.kind === kind) &&
        (category === "all" || e.category === category) &&
        (!q ||
          e.title.toLowerCase().includes(q) ||
          (e.details ?? "").toLowerCase().includes(q)),
    );
  }, [inPeriod, kind, category, query]);

  const filtered = kind !== "all" || category !== "all" || query.trim() !== "";

  return (
    <div className="pb-24 pt-24 sm:pt-28">
      <Container className="max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} />
          Control centre
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Administration</Eyebrow>
            <h1 className="mt-3 text-3xl text-ink sm:text-4xl">Finance</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              Every rupee in and out, the running balance, and what each of the{" "}
              {FINANCE_PARTNERS} partners takes home.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Admins only
          </span>
        </div>

        {!ready && (
          <p className="mt-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-900">
            Run <code className="font-mono">supabase/finance.sql</code> in the Supabase SQL
            editor to create the finance ledger. Until then nothing can be saved.
          </p>
        )}

        {/* Filters: one row, above everything they scope. */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Time period"
            className="flex flex-wrap gap-1 rounded-full border border-line bg-surface-raised p-1"
          >
            {PERIODS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={period === id}
                onClick={() => setPeriod(id)}
                className={`min-h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                  period === id
                    ? "bg-ink text-surface"
                    : "text-ink-muted hover:bg-ink/[0.05] hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <StatTiles totals={totals} count={inPeriod.length} />

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <MonthlyChart entries={inPeriod} period={period} />
          <CategoryBreakdown entries={inPeriod} />
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[22rem_1fr]">
          <EntryForm disabled={!ready} />

          <section className="rounded-xl border border-line bg-surface-raised">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
              <div>
                <h2 className="text-lg text-ink">Entries</h2>
                <p className="mt-0.5 text-xs text-ink-subtle">
                  {visible.length} {visible.length === 1 ? "entry" : "entries"}
                  {filtered && ` · filtered from ${inPeriod.length}`}
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <label className="relative min-w-0 flex-1 sm:w-52 sm:flex-none">
                  <span className="sr-only">Search entries</span>
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className={`${INPUT} min-h-10 py-2 pl-9`}
                  />
                </label>
                <label className="sr-only" htmlFor="kind-filter">Money in or out</label>
                <select
                  id="kind-filter"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as typeof kind)}
                  className={`${INPUT} min-h-10 w-auto cursor-pointer py-2`}
                >
                  <option value="all">In &amp; out</option>
                  <option value="income">Money in</option>
                  <option value="expense">Money out</option>
                </select>
                <label className="sr-only" htmlFor="category-filter">Category</label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className={`${INPUT} min-h-10 w-auto cursor-pointer py-2`}
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {FINANCE_CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <EntryList entries={visible} hasAny={entries.length > 0} />
          </section>
        </div>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat tiles                                                           */
/* ------------------------------------------------------------------ */

function StatTiles({
  totals,
  count,
}: {
  totals: { income: number; expense: number; net: number; share: number };
  count: number;
}) {
  const tiles = [
    {
      label: "Money in",
      value: formatMoney(totals.income),
      note: "Received",
      icon: ArrowDownLeft,
      dot: IN_COLOR,
    },
    {
      label: "Money out",
      value: formatMoney(totals.expense),
      note: "Deducted / spent",
      icon: ArrowUpRight,
      dot: OUT_COLOR,
    },
    {
      label: "Net balance",
      value: formatSigned(totals.net),
      note: `${count} ${count === 1 ? "entry" : "entries"}`,
      icon: Wallet,
      dot: null,
    },
  ];
  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ label, value, note, icon: Icon, dot }) => (
        <div key={label} className="rounded-xl border border-line bg-surface-raised p-5">
          <dt className="flex items-center justify-between text-[13px] text-ink-muted">
            <span className="inline-flex items-center gap-2">
              {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
              {label}
            </span>
            <Icon size={16} className="text-ink-subtle" />
          </dt>
          <dd className="mt-3 font-display text-[1.75rem] leading-none text-ink tabular-nums">
            {value}
          </dd>
          <dd className="mt-2 text-xs text-ink-subtle">{note}</dd>
        </div>
      ))}
      {/* The headline tile: what each partner takes home. */}
      <div className="theme-ink rounded-xl bg-surface p-5 text-ink">
        <dt className="flex items-center justify-between text-[13px] text-ink-muted">
          Each partner&rsquo;s share
          <Users size={16} className="text-ink-subtle" />
        </dt>
        <dd className="mt-3 font-display text-[1.75rem] leading-none tabular-nums">
          {formatSigned(totals.share)}
        </dd>
        <dd className="mt-2 text-xs text-ink-subtle">
          Net ÷ {FINANCE_PARTNERS} partners
        </dd>
      </div>
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Monthly in vs out — grouped bars with a hover tooltip               */
/* ------------------------------------------------------------------ */

function MonthlyChart({ entries, period }: { entries: FinanceEntry[]; period: Period }) {
  const [hover, setHover] = useState<number | null>(null);

  const months = useMemo(() => {
    const count = period === "month" ? 1 : period === "quarter" ? 3 : period === "year" ? new Date().getMonth() + 1 : 6;
    const now = new Date();
    const keys: string[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    const map = new Map(keys.map((k) => [k, { key: k, income: 0, expense: 0 }]));
    for (const e of entries) {
      const row = map.get(e.entry_date.slice(0, 7));
      if (!row) continue;
      if (e.kind === "income") row.income += amountOf(e);
      else row.expense += amountOf(e);
    }
    return [...map.values()];
  }, [entries, period]);

  const max = Math.max(0, ...months.flatMap((m) => [m.income, m.expense]));
  const niceMax = niceCeil(max);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * niceMax);
  const empty = max === 0;

  // Geometry (viewBox units).
  const W = 640;
  const H = 240;
  const padL = 52;
  const padB = 28;
  const padT = 12;
  const plotW = W - padL - 8;
  const plotH = H - padB - padT;
  const groupW = plotW / months.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  const y = (v: number) => padT + plotH - (niceMax ? (v / niceMax) * plotH : 0);

  const active = hover !== null ? months[hover] : null;

  return (
    <section className="rounded-xl border border-line bg-surface-raised p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg text-ink">Money in vs out</h2>
          <p className="mt-0.5 text-xs text-ink-subtle">By month</p>
        </div>
        <Legend />
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Monthly money in and out: ${months
            .map((m) => `${monthLong(m.key)} in ${formatMoney(m.income)}, out ${formatMoney(m.expense)}`)
            .join("; ")}`}
          onMouseLeave={() => setHover(null)}
        >
          {/* Recessive grid + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={padL}
                x2={W - 8}
                y1={y(t)}
                y2={y(t)}
                stroke="currentColor"
                className="text-ink/10"
                strokeDasharray={t === 0 ? undefined : "2 4"}
              />
              <text
                x={padL - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="fill-ink-subtle text-[11px] tabular-nums"
              >
                {empty ? "" : compactMoney(t)}
              </text>
            </g>
          ))}

          {months.map((m, i) => {
            const cx = padL + groupW * i + groupW / 2;
            const xIn = cx - barW - 1; // 2px gap between the pair
            const xOut = cx + 1;
            return (
              <g key={m.key}>
                {hover === i && (
                  <rect
                    x={padL + groupW * i + 4}
                    y={padT}
                    width={groupW - 8}
                    height={plotH}
                    rx={6}
                    className="fill-ink/[0.04]"
                  />
                )}
                <Bar x={xIn} w={barW} y0={y(0)} y1={y(m.income)} color={IN_COLOR} />
                <Bar x={xOut} w={barW} y0={y(0)} y1={y(m.expense)} color={OUT_COLOR} />
                <text
                  x={cx}
                  y={H - 8}
                  textAnchor="middle"
                  className={`text-[11px] ${hover === i ? "fill-ink" : "fill-ink-subtle"}`}
                >
                  {monthLabel(m.key)}
                </text>
                {/* Hit target: the whole column, bigger than the marks. */}
                <rect
                  x={padL + groupW * i}
                  y={0}
                  width={groupW}
                  height={H}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${monthLong(m.key)}: in ${formatMoney(m.income)}, out ${formatMoney(m.expense)}`}
                />
              </g>
            );
          })}
        </svg>

        {empty && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-ink-subtle">
            No entries in this period yet.
          </p>
        )}

        {active && !empty && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-48 rounded-lg border border-line bg-surface-raised p-3 text-xs shadow-[0_8px_24px_rgba(27,23,18,0.12)]"
            style={{
              left: `clamp(0px, calc(${((padL + groupW * (hover! + 0.5)) / W) * 100}% - 6rem), calc(100% - 12rem))`,
            }}
          >
            <p className="font-medium text-ink">{monthLong(active.key)}</p>
            <TooltipRow color={IN_COLOR} label="Money in" value={formatMoney(active.income)} />
            <TooltipRow color={OUT_COLOR} label="Money out" value={formatMoney(active.expense)} />
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-ink">
              <span>Net</span>
              <span className="tabular-nums">{formatSigned(active.income - active.expense)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Bar with 4px rounded data-end, square at the baseline. */
function Bar({ x, w, y0, y1, color }: { x: number; w: number; y0: number; y1: number; color: string }) {
  const h = y0 - y1;
  if (h <= 0) return null;
  const r = Math.min(4, h, w / 2);
  const d = `M${x},${y0} V${y1 + r} Q${x},${y1} ${x + r},${y1} H${x + w - r} Q${x + w},${y1} ${x + w},${y1 + r} V${y0} Z`;
  return <path d={d} fill={color} />;
}

function TooltipRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="mt-1.5 flex items-center justify-between gap-3 text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
        {label}
      </span>
      <span className="tabular-nums text-ink">{value}</span>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: IN_COLOR }} />
        Money in
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: OUT_COLOR }} />
        Money out
      </span>
    </div>
  );
}

function niceCeil(v: number) {
  if (v <= 0) return 0;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return step * exp;
}

/* ------------------------------------------------------------------ */
/* Category breakdown — single-hue horizontal bars                      */
/* ------------------------------------------------------------------ */

function CategoryBreakdown({ entries }: { entries: FinanceEntry[] }) {
  const [mode, setMode] = useState<FinanceKind>("income");
  const rows = useMemo(() => {
    const sums = new Map<FinanceCategory, { total: number; count: number }>(
      CATEGORIES.map((c) => [c, { total: 0, count: 0 }]),
    );
    for (const e of entries) {
      if (e.kind !== mode) continue;
      const s = sums.get(e.category)!;
      s.total += amountOf(e);
      s.count += 1;
    }
    return [...sums.entries()]
      .map(([category, s]) => ({ category, ...s }))
      .sort((a, b) => b.total - a.total);
  }, [entries, mode]);

  const total = rows.reduce((sum, r) => sum + r.total, 0);
  const max = Math.max(0, ...rows.map((r) => r.total));
  const color = mode === "income" ? IN_COLOR : OUT_COLOR;

  return (
    <section className="rounded-xl border border-line bg-surface-raised p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg text-ink">By category</h2>
          <p className="mt-0.5 text-xs text-ink-subtle">
            {mode === "income" ? "Where money came from" : "Where money went"}
          </p>
        </div>
        <div
          role="group"
          aria-label="Show money in or money out"
          className="flex rounded-full border border-line p-0.5"
        >
          {(["income", "expense"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`min-h-10 cursor-pointer rounded-full px-4 text-xs font-medium transition-colors ${
                mode === m ? "bg-ink text-surface" : "text-ink-muted hover:text-ink"
              }`}
            >
              {m === "income" ? "In" : "Out"}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 space-y-3.5">
        {rows.map((r) => (
          <li key={r.category} title={`${FINANCE_CATEGORY_LABELS[r.category]}: ${formatMoney(r.total)} across ${r.count} ${r.count === 1 ? "entry" : "entries"}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-ink">{FINANCE_CATEGORY_LABELS[r.category]}</span>
              <span className="tabular-nums text-ink">
                {formatMoney(r.total)}
                <span className="ml-1.5 text-xs text-ink-subtle">
                  {total ? Math.round((r.total / total) * 100) : 0}%
                </span>
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-ink/[0.06]">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${max ? (r.total / max) * 100 : 0}%`, background: color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Add / edit form                                                      */
/* ------------------------------------------------------------------ */

function EntryForm({
  entry,
  disabled = false,
  onDone,
}: {
  entry?: FinanceEntry;
  disabled?: boolean;
  onDone?: () => void;
}) {
  const editing = Boolean(entry);
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<FinanceKind>(entry?.kind ?? "income");
  const [amount, setAmount] = useState(entry ? String(Number(entry.amount)) : "");
  const [isPending, startTransition] = useTransition();

  const [state, action, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const run = editing ? adminUpdateFinanceEntry : adminCreateFinanceEntry;
      const result = await run(prev, formData);
      if (result?.notice) {
        if (editing) onDone?.();
        else {
          formRef.current?.reset();
          setAmount("");
          setKind("income");
        }
      }
      return result;
    },
    null,
  );
  useActionToast(state);

  // Submit manually so a failed save keeps everything that was typed
  // (a form `action` prop would reset the fields either way).
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  const busy = pending || isPending;
  const share = Number(amount) > 0 ? Number(amount) / FINANCE_PARTNERS : 0;
  const prefix = entry ? `edit-${entry.id}-` : "new-";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={
        editing
          ? "grid gap-3"
          : "grid gap-3 rounded-xl border border-line bg-surface-raised p-4 sm:p-5 lg:sticky lg:top-24"
      }
    >
      {!editing && (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-surface">
            <Plus size={16} />
          </span>
          <h2 className="text-lg text-ink">Add an entry</h2>
        </div>
      )}
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <fieldset>
        <legend className="sr-only">Money in or money out</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface p-1">
          {(["income", "expense"] as const).map((k) => (
            <label
              key={k}
              className={`flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${
                kind === k ? "bg-ink text-surface" : "text-ink-muted hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="kind"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
                className="sr-only"
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: k === "income" ? IN_COLOR : OUT_COLOR }}
              />
              {k === "income" ? "Money in" : "Money out"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Amount (₹)</span>
          <input
            name="amount"
            inputMode="decimal"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="0"
            className={`${INPUT} tabular-nums`}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Date</span>
          <input
            name="entry_date"
            type="date"
            required
            defaultValue={entry?.entry_date ?? todayISO()}
            suppressHydrationWarning
            className={INPUT}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Category</span>
        <select
          name="category"
          required
          defaultValue={entry?.category ?? "student_project"}
          className={`${INPUT} cursor-pointer`}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {FINANCE_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5" htmlFor={`${prefix}title`}>
        <span className={LABEL}>Title</span>
        <input
          id={`${prefix}title`}
          name="title"
          required
          maxLength={140}
          defaultValue={entry?.title ?? ""}
          placeholder={kind === "income" ? "e.g. ML project — final payment" : "e.g. Hosting renewal"}
          className={INPUT}
        />
      </label>

      <label className="flex flex-col gap-1.5" htmlFor={`${prefix}details`}>
        <span className={LABEL}>
          Details <span className="text-ink-subtle">(optional)</span>
        </span>
        <textarea
          id={`${prefix}details`}
          name="details"
          rows={3}
          maxLength={2000}
          defaultValue={entry?.details ?? ""}
          placeholder="Who paid, invoice number, notes…"
          className={`${INPUT} resize-y`}
        />
      </label>

      <div className="flex items-center justify-between rounded-lg bg-ink/[0.04] px-3.5 py-2.5 text-sm">
        <span className="text-ink-muted">Each partner</span>
        <span className="tabular-nums text-ink">
          {kind === "expense" && share > 0 ? "−" : ""}
          {formatMoney(share)}
        </span>
      </div>

      <div className={editing ? "flex gap-2" : ""}>
        <Button type="submit" disabled={busy || disabled} className="w-full">
          {busy ? "Saving…" : editing ? "Save changes" : "Save entry"}
        </Button>
        {editing && (
          <Button type="button" variant="secondary" onClick={onDone} className="shrink-0">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Entries — table on desktop, cards on phones                          */
/* ------------------------------------------------------------------ */

function EntryList({ entries, hasAny }: { entries: FinanceEntry[]; hasAny: boolean }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteState, deleteAction, deleting] = useActionState(adminDeleteFinanceEntry, null);
  useActionToast(deleteState);
  const [, startTransition] = useTransition();

  const remove = (entry: FinanceEntry) => {
    if (!window.confirm(`Delete "${entry.title}"? This can't be undone.`)) return;
    const fd = new FormData();
    fd.set("id", entry.id);
    startTransition(() => deleteAction(fd));
  };

  if (!entries.length) {
    return (
      <div className="px-6 py-16 text-center">
        <Wallet size={24} className="mx-auto text-ink-subtle" />
        <p className="mt-3 text-sm text-ink-muted">
          {hasAny ? "No entries match these filters." : "No entries yet — add the first one."}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {entries.map((e) => {
        const amount = amountOf(e);
        const income = e.kind === "income";
        return (
          <li key={e.id} className="p-4 sm:px-5">
            {editingId === e.id ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">Edit entry</p>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel editing"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-ink/[0.05]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <EntryForm entry={e} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <div className="flex items-start gap-3 sm:gap-4">
                <span
                  aria-hidden
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${income ? IN_COLOR : OUT_COLOR}1a`, color: income ? IN_COLOR : OUT_COLOR }}
                >
                  {income ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <p className="min-w-0 font-medium text-ink">{e.title}</p>
                    <p className="tabular-nums font-medium text-ink">
                      <span className="sr-only">{income ? "Money in" : "Money out"}: </span>
                      {income ? "+" : "−"}
                      {formatMoney(amount)}
                    </p>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-subtle">
                    <span>{formatDate(e.entry_date)}</span>
                    <span aria-hidden>·</span>
                    <span className="rounded-full border border-line px-2 py-0.5 text-ink-muted">
                      {FINANCE_CATEGORY_LABELS[e.category]}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums">
                      Each {income ? "" : "−"}
                      {formatMoney(amount / FINANCE_PARTNERS)}
                    </span>
                  </div>
                  {e.details && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-muted">
                      {e.details}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(e.id)}
                    aria-label={`Edit ${e.title}`}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-ink/[0.05] hover:text-ink"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(e)}
                    disabled={deleting}
                    aria-label={`Delete ${e.title}`}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-red-500/10 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
