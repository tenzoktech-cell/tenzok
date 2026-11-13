"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, LogOut, Menu, UserRound, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PROJECTS_MENU, SERVICES_MENU } from "./nav-links";
import TenzokLogo from "./TenzokLogo";
import { Button, ButtonLink } from "./ui/Button";

/* The floating centre pill group. min-h-11 keeps every item at a 44px tap
   target — the old version was 32px, which fails at the md breakpoint (iPad). */
const PILL =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors";
const PILL_ACTIVE = `${PILL} bg-ink text-surface`;
const PILL_INACTIVE = `${PILL} text-ink-muted hover:bg-ink/[0.05] hover:text-ink`;

/** Disclosure navigation: plain links behind an aria-expanded toggle.
 *  Deliberately NOT role="menu" — these are navigation links, and menuitem
 *  would strip the link role and oblige us to implement arrow-key semantics. */
const DROPDOWNS = [
  { id: "services", label: "Services", base: "/services", items: SERVICES_MENU },
  {
    id: "projects",
    label: "Student Projects",
    base: "/projects",
    items: PROJECTS_MENU,
  },
] as const;

const DIRECT_LINKS = [
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function TenzokNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { user, status: authStatus, signOut: signOutUser } = useAuth();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled((current) => {
          const next = window.scrollY > 24;
          return current === next ? current : next;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (user) router.prefetch("/profile");
  }, [router, user]);

  // Close disclosures on Escape or on any press outside the nav.
  useEffect(() => {
    if (!openId && !menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenId(null);
        setMenuOpen(false);
        setMobileOpenId(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const desktopTrigger = openId ? dropdownTriggerRefs.current[openId] : null;
      setOpenId(null);
      setMenuOpen(false);
      setMobileOpenId(null);
      window.requestAnimationFrame(() =>
        (desktopTrigger ?? mobileTriggerRef.current)?.focus(),
      );
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, openId]);

  // Every link calls this, so a navigation always leaves the nav closed.
  const closeAll = () => {
    setOpenId(null);
    setMenuOpen(false);
    setMobileOpenId(null);
  };

  const signOut = async () => {
    await signOutUser();
    closeAll();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const displayName = user
    ? ((user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
      user.email?.split("@")[0] ??
      "there")
    : "";

  const accountInitial = displayName.charAt(0).toUpperCase() || "T";

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 ${menuOpen ? "z-[85]" : "z-60"} border-b px-4 py-3 transition-colors duration-300 sm:px-6 ${
        scrolled || menuOpen || openId
          ? "border-line bg-surface/80 shadow-[0_1px_0_rgba(27,23,18,0.04)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          onClick={closeAll}
          aria-label="Tenzok — home"
          className="flex min-h-11 items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-surface">
            <TenzokLogo size={20} />
          </span>
          <span className="font-brand text-xl font-bold tracking-[-0.04em] text-ink">
            Tenzok
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-line bg-surface-raised/80 p-1 shadow-[0_1px_2px_rgba(27,23,18,0.05)] xl:flex">
          <Link
            href="/"
            onClick={closeAll}
            className={isActive("/") ? PILL_ACTIVE : PILL_INACTIVE}
          >
            Home
          </Link>

          {/* The pill background lives on the WRAPPER, not the link — so the
              chevron sits inside the pill instead of overhanging its rounded edge. */}
          {DROPDOWNS.map((menu) => {
            const open = openId === menu.id;
            const active = isActive(menu.base);
            return (
              <div
                key={menu.id}
                className={`inline-flex min-h-10 items-center rounded-full transition-colors ${
                  active
                    ? "bg-ink text-surface"
                    : open
                      ? "bg-ink/[0.05] text-ink"
                      : "text-ink-muted hover:bg-ink/[0.05] hover:text-ink"
                }`}
              >
                <Link
                  href={menu.base}
                  onClick={closeAll}
                  className="flex min-h-10 items-center rounded-l-full pl-4 pr-1 text-[13px] font-medium"
                >
                  {menu.label}
                </Link>
                <button
                  ref={(node) => {
                    dropdownTriggerRefs.current[menu.id] = node;
                  }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${menu.id}-panel`}
                  aria-label={`${open ? "Hide" : "Show"} ${menu.label} menu`}
                  onClick={() => setOpenId(open ? null : menu.id)}
                    className="flex min-h-10 cursor-pointer items-center rounded-r-full pl-0.5 pr-3"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            );
          })}

          {DIRECT_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeAll}
              className={isActive(item.href) ? PILL_ACTIVE : PILL_INACTIVE}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Dropdown panels live outside the pill: the pill has backdrop-blur,
            which makes any nested backdrop-blur a no-op. */}
        {DROPDOWNS.map((menu) => {
          if (openId !== menu.id) return null;
          // With 18 project domains a single column runs off the bottom of a
          // laptop screen, so long menus go two-up and the list scrolls.
          const twoColumn = menu.items.length > 8;
          return (
            <div
              key={menu.id}
              id={`${menu.id}-panel`}
              className="absolute left-1/2 top-full hidden -translate-x-1/2 xl:block"
            >
              <div
                className={`premium-card mt-2 rounded-3xl p-2 shadow-sm shadow-ink/5 ${
                  twoColumn ? "w-[38rem]" : "w-72"
                }`}
              >
                <div
                  className={`max-h-[min(60vh,26rem)] overflow-y-auto ${
                    twoColumn ? "grid grid-cols-2 gap-x-1" : ""
                  }`}
                >
                  {menu.items.map(({ id, label, icon: Icon }) => (
                    <Link
                      key={id}
                      href={`${menu.base}/${id}`}
                      onClick={closeAll}
                      className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
                    >
                      <Icon size={15} className="shrink-0 text-ink-subtle" />
                      <span className="truncate">{label}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={menu.base}
                  onClick={closeAll}
                  className="mt-1 flex min-h-11 items-center rounded-xl border-t border-line px-3 text-sm font-semibold text-cool transition-colors hover:bg-ink/[0.06]"
                >
                  View all {menu.label.replace("Our ", "").toLowerCase()}
                </Link>
              </div>
            </div>
          );
        })}

        {/* The wrapper does the hiding, not a `hidden` class on the button.
            Button's base class already sets `inline-flex`, and two display
            utilities of equal specificity are resolved by CSS source order, not
            by the order they appear in the class attribute — `inline-flex` won,
            so the button never hid on mobile and pushed the whole page sideways. */}
        <div className="hidden items-center gap-2 xl:flex">
          {authStatus === "loading" ? (
            <div
              role="status"
              aria-label="Loading account"
              className="flex min-h-11 w-[19rem] items-center justify-end gap-2"
            >
              <span className="h-3 w-24 animate-pulse rounded-full bg-ink/[0.08]" />
              <span className="h-11 w-24 animate-pulse rounded-full bg-ink/[0.08]" />
              <span className="h-11 w-20 animate-pulse rounded-full bg-ink/[0.05]" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface-raised/80 p-1 shadow-[0_1px_2px_rgba(27,23,18,0.05)]">
              <Link
                href="/profile"
                prefetch={true}
                onPointerEnter={() => router.prefetch("/profile")}
                onClick={closeAll}
                aria-label={`Open your profile (${displayName})`}
                className="group flex min-h-9 items-center gap-2.5 rounded-full py-0.5 pl-0.5 pr-3.5 transition-colors hover:bg-ink/[0.05]"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-brand text-[13px] font-bold text-surface"
                >
                  {accountInitial}
                </span>
                <span className="max-w-28 truncate text-[13px] font-medium capitalize text-ink">
                  {displayName.toLowerCase()}
                </span>
                <UserRound
                  size={14}
                  aria-hidden
                  className="text-ink-subtle transition-colors group-hover:text-ink"
                />
              </Link>
              <span aria-hidden className="h-5 w-px bg-line" />
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-red-500/10 hover:text-red-700"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <ButtonLink
                href="/login"
                onClick={closeAll}
                variant="ghost"
                className="min-h-10! rounded-full! px-4! text-[13px]!"
              >
                Login
              </ButtonLink>
              <ButtonLink
                href="/contact"
                onClick={closeAll}
                className="group min-h-10! rounded-full! pl-5! pr-4! text-[13px]!"
              >
                Start Your Project
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </ButtonLink>
            </>
          )}
        </div>

        <button
          ref={mobileTriggerRef}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/10 xl:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full flex h-[calc(100dvh-68px)] flex-col overflow-y-auto overscroll-contain border-t border-line bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 xl:hidden">
          <Link
            href="/"
            onClick={closeAll}
            aria-current={isActive("/") ? "page" : undefined}
            className="flex min-h-14 items-center justify-between border-b border-line font-display text-2xl text-ink transition-colors hover:text-accent"
          >
            Home
            {isActive("/") && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
          </Link>

          {DROPDOWNS.map((menu) => {
            const open = mobileOpenId === menu.id;
            return (
              <div key={menu.id}>
                <div className="flex items-center border-b border-line">
                  <Link
                    href={menu.base}
                    onClick={closeAll}
                    className="flex min-h-14 flex-1 items-center font-display text-2xl text-ink transition-colors hover:text-accent"
                  >
                    {menu.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${menu.id}-mobile-panel`}
                    aria-label={`${open ? "Hide" : "Show"} ${menu.label} menu`}
                    onClick={() => setMobileOpenId(open ? null : menu.id)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {open && (
                  <div
                    id={`${menu.id}-mobile-panel`}
                    className="grid grid-cols-1 gap-0.5 border-b border-line py-2 min-[420px]:grid-cols-2"
                  >
                    {menu.items.map(({ id, label, icon: Icon }) => (
                      <Link
                        key={id}
                        href={`${menu.base}/${id}`}
                        onClick={closeAll}
                        className="flex min-h-11 items-center gap-2.5 rounded-lg px-2 text-sm text-ink-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
                      >
                        <Icon size={14} className="shrink-0 text-ink-subtle" />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {DIRECT_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeAll}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="flex min-h-14 items-center justify-between border-b border-line font-display text-2xl text-ink transition-colors hover:text-accent"
            >
              {item.label}
              {isActive(item.href) && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </Link>
          ))}

          {authStatus === "loading" ? (
            <div
              role="status"
              aria-label="Loading account"
              className="mt-auto grid gap-2 pt-8"
            >
              <span className="h-4 w-32 animate-pulse rounded-full bg-ink/[0.08]" />
              <span className="h-12 w-full animate-pulse rounded-full bg-ink/[0.08]" />
            </div>
          ) : user ? (
            <>
              <p className="mt-auto pt-8 text-sm text-ink-muted">
                Welcome, <span className="font-medium text-ink">{displayName}</span>
              </p>
              <ButtonLink
                href="/profile"
                prefetch={true}
                onPointerEnter={() => router.prefetch("/profile")}
                onClick={closeAll}
                variant="inverse"
                size="lg"
                className="mt-2 w-full"
              >
                Profile
              </ButtonLink>
              <Button
                variant="secondary"
                size="lg"
                className="mt-2 w-full"
                onClick={signOut}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <div className="mt-auto grid gap-2.5 pt-8">
                <ButtonLink
                  href="/contact"
                  onClick={closeAll}
                  size="lg"
                  className="w-full rounded-full!"
                >
                  Start Your Project
                  <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  onClick={closeAll}
                  variant="secondary"
                  size="lg"
                  className="w-full rounded-full!"
                >
                  Login
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
