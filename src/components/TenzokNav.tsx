"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { PROJECTS_MENU, SERVICES_MENU } from "./nav-links";
import TenzokLogo from "./TenzokLogo";
import { Button, ButtonLink } from "./ui/Button";

/* The floating centre pill group. min-h-11 keeps every item at a 44px tap
   target — the old version was 32px, which fails at the md breakpoint (iPad). */
const PILL =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-colors";
const PILL_ACTIVE = `${PILL} bg-white/[0.1] text-white`;
const PILL_INACTIVE = `${PILL} text-ink-muted hover:bg-white/[0.06] hover:text-ink`;

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
  const [user, setUser] = useState<User | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

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
    if (isSupabaseConfigured) await createClient().auth.signOut();
    closeAll();
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const displayName = user
    ? ((user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
      user.email?.split("@")[0] ??
      "there")
    : "";

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-60 border-b px-4 py-3 transition-colors duration-300 sm:px-6 ${
        scrolled || menuOpen || openId
          ? "border-line bg-surface/88 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl"
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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/20">
            <TenzokLogo size={20} />
          </span>
          <span className="font-display text-xl font-bold tracking-[-0.04em] text-ink">
            Tenzok
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.045] p-1 backdrop-blur-xl xl:flex">
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
                className={`inline-flex min-h-11 items-center rounded-full transition-colors ${
                  active
                    ? "bg-white/[0.1] text-white"
                    : "text-ink-muted hover:bg-white/[0.06] hover:text-ink"
                }`}
              >
                <Link
                  href={menu.base}
                  onClick={closeAll}
                  className="flex min-h-11 items-center rounded-l-full pl-3.5 pr-1 text-[13px] font-medium"
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
                    className="flex min-h-11 cursor-pointer items-center rounded-r-full pl-0.5 pr-3"
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
                className={`premium-card mt-2 rounded-3xl p-2 shadow-2xl shadow-black/70 ${
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
                      className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                    >
                      <Icon size={15} className="shrink-0 text-ink-subtle" />
                      <span className="truncate">{label}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={menu.base}
                  onClick={closeAll}
                  className="mt-1 flex min-h-11 items-center rounded-xl border-t border-line px-3 text-sm font-semibold text-cool transition-colors hover:bg-white/[0.06]"
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
          {user ? (
            <>
              <span className="hidden text-sm text-ink-muted lg:block">
                Welcome, <span className="font-medium text-ink">{displayName}</span>
              </span>
              <ButtonLink href="/profile" onClick={closeAll} variant="inverse">
                Profile
              </ButtonLink>
              <Button variant="ghost" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" onClick={closeAll} variant="inverse">
                Login
              </ButtonLink>
              <ButtonLink href="/contact" onClick={closeAll}>
                Start Your Project
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
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-white/10 xl:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="premium-card absolute inset-x-4 top-full mt-2 flex max-h-[calc(100dvh-6rem)] flex-col overflow-y-auto rounded-3xl p-3 shadow-2xl shadow-black/70 xl:hidden">
          <Link
            href="/"
            onClick={closeAll}
            className="flex min-h-12 items-center rounded-xl px-4 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            Home
          </Link>

          {DROPDOWNS.map((menu) => {
            const open = mobileOpenId === menu.id;
            return (
              <div key={menu.id}>
                <div className="flex items-center">
                  <Link
                    href={menu.base}
                    onClick={closeAll}
                    className="flex min-h-12 flex-1 items-center rounded-xl px-4 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                  >
                    {menu.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${menu.id}-mobile-panel`}
                    aria-label={`${open ? "Hide" : "Show"} ${menu.label} menu`}
                    onClick={() => setMobileOpenId(open ? null : menu.id)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink-subtle hover:text-ink"
                  >
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {open && (
                  <div
                    id={`${menu.id}-mobile-panel`}
                    className="ml-4 flex flex-col border-l border-line pl-3"
                  >
                    {menu.items.map(({ id, label, icon: Icon }) => (
                      <Link
                        key={id}
                        href={`${menu.base}/${id}`}
                        onClick={closeAll}
                        className="flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
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
              className="flex min-h-12 items-center rounded-xl px-4 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <>
              <p className="mt-3 px-4 text-sm text-ink-muted">
                Welcome, <span className="font-medium text-ink">{displayName}</span>
              </p>
              <ButtonLink
                href="/profile"
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
              <ButtonLink
                href="/login"
                onClick={closeAll}
                variant="inverse"
                size="lg"
                className="mt-2 w-full"
              >
                Login
              </ButtonLink>
              <ButtonLink
                href="/contact"
                onClick={closeAll}
                size="lg"
                className="mt-2 w-full"
              >
                Start Your Project
              </ButtonLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
