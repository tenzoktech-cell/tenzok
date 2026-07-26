"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Phone,
  Search,
} from "lucide-react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

const COUNTRY_NAMES =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const PHONE_COUNTRIES = getCountries()
  .map((country) => ({
    country,
    callingCode: getCountryCallingCode(country),
    label: COUNTRY_NAMES?.of(country) ?? country,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface InternationalPhoneFieldProps {
  id: string;
  name: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  radiusClassName?: string;
}

export function InternationalPhoneField({
  id,
  name,
  required = false,
  invalid = false,
  describedBy,
  radiusClassName = "rounded-2xl",
}: InternationalPhoneFieldProps) {
  const [country, setCountry] = useState<CountryCode>("IN");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const callingCode = getCountryCallingCode(country);
  const phone = phoneDigits ? `+${callingCode}${phoneDigits}` : "";
  const formattedInternationalPhone = phone
    ? new AsYouType().input(phone)
    : "";
  const phoneDisplay = formattedInternationalPhone.startsWith(`+${callingCode}`)
    ? formattedInternationalPhone.slice(callingCode.length + 1).trimStart()
    : phoneDigits;
  const phoneIsValid = phone ? isValidPhoneNumber(phone) : false;
  const selectedCountry =
    PHONE_COUNTRIES.find((option) => option.country === country) ??
    PHONE_COUNTRIES[0];

  const filteredCountries = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return PHONE_COUNTRIES;

    return PHONE_COUNTRIES.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        option.country.toLowerCase().includes(term) ||
        `+${option.callingCode}`.includes(term),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const focusSearch = window.requestAnimationFrame(() =>
      searchRef.current?.focus(),
    );
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusSearch);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const menuId = `${id}-country-menu`;
  const searchId = `${id}-country-search`;

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`flex overflow-hidden border bg-surface/70 transition-all focus-within:ring-2 focus-within:ring-accent/30 ${radiusClassName} ${
          invalid
            ? "border-red-400/60"
            : "border-line hover:border-line-strong focus-within:border-cool"
        }`}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={`Country calling code, ${selectedCountry.label} plus ${callingCode}`}
          onClick={() => {
            setOpen((current) => !current);
            setQuery("");
          }}
          className="flex min-w-[7.4rem] shrink-0 items-center justify-between gap-2 border-r border-line px-4 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.04]"
        >
          <span>
            {country} +{callingCode}
          </span>
          <ChevronDown
            aria-hidden
            size={14}
            className={`text-ink-subtle transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="relative min-w-0 flex-1">
          <Phone
            aria-hidden
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required={required}
            maxLength={24}
            value={phoneDisplay}
            onChange={(event) => {
              const enteredValue = event.target.value.trim();
              if (enteredValue.startsWith("+")) {
                const parsedNumber = parsePhoneNumberFromString(enteredValue);
                if (parsedNumber?.country) {
                  setCountry(parsedNumber.country);
                  setPhoneDigits(parsedNumber.nationalNumber);
                  return;
                }
              }

              const enteredDigits = enteredValue.replace(/\D/g, "");
              const parsedNationalNumber = parsePhoneNumberFromString(
                enteredValue,
                country,
              );
              const normalizedDigits =
                enteredDigits.startsWith("0") && parsedNationalNumber
                  ? parsedNationalNumber.nationalNumber
                  : enteredDigits;
              setPhoneDigits(normalizedDigits.slice(0, 15));
            }}
            placeholder="Phone number"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className="w-full bg-transparent px-11 py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          {phoneIsValid && (
            <CheckCircle2
              aria-hidden
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cool"
            />
          )}
        </div>
      </div>

      <input type="hidden" name={name} value={phone} />
      <span className="sr-only" aria-live="polite">
        {phoneIsValid ? "Valid mobile number" : ""}
      </span>

      {open && (
        <div
          id={menuId}
          role="dialog"
          aria-label="Choose a country calling code"
          className="absolute left-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-line-strong bg-surface-raised/98 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          <label htmlFor={searchId} className="sr-only">
            Search countries
          </label>
          <div className="relative">
            <Search
              aria-hidden
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
            />
            <input
              ref={searchRef}
              id={searchId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country or code"
              autoComplete="off"
              className="w-full rounded-xl border border-line bg-surface-overlay py-2.5 pl-10 pr-3 text-base text-ink outline-none placeholder:text-ink-subtle focus:border-cool"
            />
          </div>

          <div className="premium-scrollbar mt-2 max-h-64 overflow-y-auto pr-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((option) => {
                const selected = option.country === country;
                return (
                  <button
                    key={option.country}
                    type="button"
                    onClick={() => {
                      setCountry(option.country);
                      setPhoneDigits("");
                      setOpen(false);
                      setQuery("");
                      triggerRef.current?.focus();
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "bg-accent/15 text-ink"
                        : "text-ink-muted hover:bg-white/[0.05] hover:text-ink"
                    }`}
                  >
                    <span className="w-8 text-xs font-bold tracking-[0.08em] text-cool">
                      {option.country}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {option.label}
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      +{option.callingCode}
                    </span>
                    <span className="flex h-4 w-4 items-center justify-center">
                      {selected && <Check aria-hidden size={14} className="text-cool" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-8 text-center text-sm text-ink-muted">
                No countries found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
