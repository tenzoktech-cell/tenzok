"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { PROJECTS_MENU, SERVICES_MENU } from "./nav-links";
import TenzokLogo from "./TenzokLogo";
import { ButtonLink } from "./ui/Button";

/* The floating centre pill group. min-h-11 keeps every item at a 44px tap
   target — the old version was 32px, which fails at the md breakpoint (iPad). */
const PILL = "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors";
const PILL_ACTIVE = `${PILL} bg-ink text-surface`;
const PILL_INACTIVE = `${PILL} text-ink/80 hover:bg-white/15 hover:text-ink`;

/** Disclosure navigation: plain links behind an aria-expanded toggle.
 *  Deliberately NOT role="menu" — these are navigation links, and menuitem
 *  would strip the link role and oblige us to implement arrow-key semantics. */
const DROPDOWNS = [
  { id: "projects", label: "Projects", base: "/projects", items: PROJECTS_MENU },
  { id: "services", label: "Our Services", base: "/services", items: SERVICES_MENU },
] as const;

export default function TenzokNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the open dropdown on Escape or on any press outside the nav.
  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  // Every link calls this, so a navigation always leaves the nav closed.
  const closeAll = () => {
    setOpenId(null);
    setMenuOpen(false);
    setMobileOpenId(null);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-60 border-b p-4 transition-colors duration-300 sm:p-5 ${
        scrolled || menuOpen || openId
          ? "border-line bg-surface/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={closeAll}
          aria-label="Tenzok — home"
          className="flex min-h-11 items-center gap-2.5"
        >
          <TenzokLogo size={26} />
          <span className="font-display text-2xl italic text-ink">Tenzok</span>
        </Link>

        {/* Floating centre pill group */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-md md:flex">
          <Link
            href="/"
            onClick={closeAll}
            className={isActive("/") ? PILL_ACTIVE : PILL_INACTIVE}
          >
            About Us
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
                    ? "bg-ink text-surface"
                    : "text-ink/80 hover:bg-white/15 hover:text-ink"
                }`}
              >
                <Link
                  href={menu.base}
                  onClick={closeAll}
                  className="flex min-h-11 items-center rounded-l-full pl-4 pr-1.5 text-sm font-medium"
                >
                  {menu.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${menu.id}-panel`}
                  aria-label={`${open ? "Hide" : "Show"} ${menu.label} menu`}
                  onClick={() => setOpenId(open ? null : menu.id)}
                  className="flex min-h-11 cursor-pointer items-center rounded-r-full pl-0.5 pr-3.5"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            );
          })}

          <Link
            href="/blogs"
            onClick={closeAll}
            className={isActive("/blogs") ? PILL_ACTIVE : PILL_INACTIVE}
          >
            Blogs
          </Link>
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
              className="absolute left-1/2 top-full hidden -translate-x-1/2 md:block"
            >
              <div
                className={`mt-1 rounded-2xl border border-line bg-surface-overlay p-2 shadow-2xl shadow-black/70 ${
                  twoColumn ? "w-[34rem]" : "w-72"
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
                      className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                    >
                      <Icon size={15} className="shrink-0 text-ink-subtle" />
                      <span className="truncate">{label}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={menu.base}
                  onClick={closeAll}
                  className="mt-1 flex min-h-11 items-center rounded-xl border-t border-line px-3 text-sm font-medium text-accent transition-colors hover:bg-surface-raised"
                >
                  View all {menu.label.replace("Our ", "").toLowerCase()}
                </Link>
              </div>
            </div>
          );
        })}

        <ButtonLink
          href="/contact"
          onClick={closeAll}
          variant="inverse"
          className="hidden md:inline-flex"
        >
          Book a Call
        </ButtonLink>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-4 top-full mt-1 flex flex-col rounded-2xl border border-line bg-surface-overlay p-3 shadow-2xl shadow-black/70 md:hidden">
          <Link
            href="/"
            onClick={closeAll}
            className="flex min-h-12 items-center rounded-xl px-4 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            About Us
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
                  <div className="ml-4 flex flex-col border-l border-line pl-3">
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

          <Link
            href="/blogs"
            onClick={closeAll}
            className="flex min-h-12 items-center rounded-xl px-4 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            Blogs
          </Link>

          <ButtonLink
            href="/contact"
            onClick={closeAll}
            variant="inverse"
            size="lg"
            className="mt-2 w-full"
          >
            Book a Call
          </ButtonLink>
        </div>
      )}
    </nav>
  );
}
