"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { SERVICES_MENU } from "./nav-links";
import TenzokLogo from "./TenzokLogo";

const PILL_BASE = "px-4 py-1.5 rounded-full text-sm font-medium transition-colors";
const PILL_ACTIVE = `bg-white text-gray-900 ${PILL_BASE}`;
const PILL_INACTIVE = `text-white/80 hover:bg-white/20 hover:text-white ${PILL_BASE}`;

export default function TenzokNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();
  const onServicePage = pathname?.startsWith("/services") ?? false;

  const openServices = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setServicesOpen(true);
  };

  // Delay closing slightly so the pointer can travel from trigger to panel.
  const scheduleCloseServices = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    };
  }, []);

  // Darken the bar once content starts scrolling underneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the services dropdown on Escape or on any press outside it.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (servicesRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setServicesOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between border-b p-4 transition-colors duration-300 sm:p-5 ${
        scrolled || menuOpen
          ? "border-white/10 bg-black/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <TenzokLogo size={26} />
        <span className="text-white text-2xl font-playfair italic">Tenzok</span>
      </Link>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        <Link href="/" className={onServicePage ? PILL_INACTIVE : PILL_ACTIVE}>
          About Us
        </Link>

        <div
          ref={servicesRef}
          onMouseEnter={openServices}
          onMouseLeave={scheduleCloseServices}
        >
          <button
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            onClick={openServices}
            className={`flex items-center gap-1.5 ${onServicePage ? PILL_ACTIVE : PILL_INACTIVE}`}
          >
            Our Services
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <a href="#" className={PILL_INACTIVE}>
          Feedbacks
        </a>
        <a href="#" className={PILL_INACTIVE}>
          Blogs
        </a>
      </div>

      {/* Near-opaque panel: readable over bright imagery even where backdrop
          blur is unsupported. Rendered outside the pill so its blur can work. */}
      {servicesOpen && (
        <div
          ref={panelRef}
          onMouseEnter={openServices}
          onMouseLeave={scheduleCloseServices}
          className="hidden md:block absolute left-1/2 top-full -translate-x-1/2 -mt-1"
        >
          <div className="w-64 rounded-2xl border border-white/15 bg-[#0e0e0e]/95 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
            {SERVICES_MENU.map(({ id, label, icon: Icon }) => (
              <Link
                key={id}
                href={`/services/${id}`}
                onClick={() => setServicesOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon size={15} className="shrink-0 text-[#e8702a]" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <a
        href="mailto:hello@tenzok.com"
        className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        Book a Call
      </a>

      <div className="md:hidden flex items-center gap-2">
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-1 flex flex-col rounded-2xl border border-white/15 bg-[#0e0e0e]/95 p-3 shadow-2xl shadow-black/70 backdrop-blur-xl">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            About Us
          </Link>

          <button
            aria-expanded={mobileServicesOpen}
            onClick={() => setMobileServicesOpen((open) => !open)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            Our Services
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileServicesOpen && (
            <div className="ml-4 flex flex-col border-l border-white/10 pl-3">
              {SERVICES_MENU.map(({ id, label, icon: Icon }) => (
                <Link
                  key={id}
                  href={`/services/${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon size={14} className="shrink-0 text-[#e8702a]" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            Feedbacks
          </a>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            Blogs
          </a>

          <a
            href="mailto:hello@tenzok.com"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-xl bg-white py-3 text-center text-sm font-semibold text-gray-900"
          >
            Book a Call
          </a>
        </div>
      )}
    </nav>
  );
}
