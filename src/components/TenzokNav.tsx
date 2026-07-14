"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { PROJECTS_MENU, SERVICES_MENU } from "./nav-links";
import TenzokLogo from "./TenzokLogo";
import { ButtonLink } from "./ui/Button";

const PILL =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors";
const PILL_ACTIVE = `${PILL} bg-ink text-surface`;
const PILL_INACTIVE = `${PILL} text-ink-muted hover:bg-surface-overlay hover:text-ink`;

/** Disclosure navigation: plain links behind an aria-expanded toggle.
 *  Deliberately NOT role="menu" — these are navigation links, and menuitem
 *  would strip the link role and oblige us to implement arrow-key semantics. */
const DROPDOWNS = [
  { id: "projects", label: "Projects", base: "/projects", items: PROJECTS_MENU },
  { id: "services", label: "Services", base: "/services", items: SERVICES_MENU },
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
      className={`fixed inset-x-0 top-0 z-60 border-b transition-colors duration-300 ${
        scrolled || menuOpen || openId
          ? "border-line bg-surface/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link
          href="/"
          onClick={closeAll}
          aria-label="Tenzok — home"
          className="flex min-h-11 items-center gap-2.5"
        >
          <TenzokLogo size={24} />
          <span className="font-display text-2xl italic text-ink">Tenzok</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            onClick={closeAll}
            className={isActive("/") ? PILL_ACTIVE : PILL_INACTIVE}
          >
            Home
          </Link>

          {DROPDOWNS.map((menu) => {
            const open = openId === menu.id;
            return (
              <div key={menu.id} className="relative">
                <div className="flex items-center">
                  <Link
                    href={menu.base}
                    onClick={closeAll}
                    className={isActive(menu.base) ? PILL_ACTIVE : PILL_INACTIVE}
                  >
                    {menu.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${menu.id}-panel`}
                    aria-label={`${open ? "Hide" : "Show"} ${menu.label} menu`}
                    onClick={() => setOpenId(open ? null : menu.id)}
                    className="-ml-2 flex min-h-11 cursor-pointer items-center rounded-full px-2 text-ink-subtle transition-colors hover:text-ink"
                  >
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {open && (
                  <div
                    id={`${menu.id}-panel`}
                    className="absolute left-0 top-full z-10 mt-2 w-72 rounded-2xl border border-line bg-surface-overlay p-2 shadow-2xl shadow-black/60"
                  >
                    {menu.items.map(({ id, label, icon: Icon }) => (
                      <Link
                        key={id}
                        href={`${menu.base}/${id}`}
                        onClick={closeAll}
                        className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                      >
                        <Icon size={15} className="shrink-0 text-ink-subtle" />
                        {label}
                      </Link>
                    ))}
                    <Link
                      href={menu.base}
                      onClick={closeAll}
                      className="mt-1 flex min-h-11 items-center gap-2 rounded-xl border-t border-line px-3 text-sm font-medium text-accent transition-colors hover:bg-surface-raised"
                    >
                      View all {menu.label.toLowerCase()}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Secondary on purpose: saturated accent is reserved for the single
            primary CTA in the current view, and that is the hero's button. */}
        <div className="hidden md:block">
          <ButtonLink href="/contact" variant="secondary" onClick={closeAll}>
            Talk to us
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-overlay md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-surface px-5 pb-5 md:hidden">
          <Link
            href="/"
            onClick={closeAll}
            className="flex min-h-12 items-center text-sm font-medium text-ink-muted hover:text-ink"
          >
            Home
          </Link>

          {DROPDOWNS.map((menu) => {
            const open = mobileOpenId === menu.id;
            return (
              <div key={menu.id} className="border-t border-line">
                <div className="flex items-center justify-between">
                  <Link
                    href={menu.base}
                    onClick={closeAll}
                    className="flex min-h-12 flex-1 items-center text-sm font-medium text-ink-muted hover:text-ink"
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
                      size={16}
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {open && (
                  <div className="mb-2 ml-1 flex flex-col border-l border-line pl-4">
                    {menu.items.map(({ id, label, icon: Icon }) => (
                      <Link
                        key={id}
                        href={`${menu.base}/${id}`}
                        onClick={closeAll}
                        className="flex min-h-11 items-center gap-3 text-sm text-ink-muted hover:text-ink"
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

          <ButtonLink href="/contact" onClick={closeAll} className="mt-4 w-full" size="lg">
            Talk to us
          </ButtonLink>
        </div>
      )}
    </nav>
  );
}
