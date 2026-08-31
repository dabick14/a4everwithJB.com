"use client";

import { useState, type FormEvent } from "react";
import styles from "./GuestForm.module.css";

const GUEST_ENDPOINT = "https://us-central1-cfweddingslive.cloudfunctions.net/guests";
const WEDDING_SLUG = "afriyie-jeremy";

type Side = "jeremy" | "afriyie" | null;
type Status = "idle" | "submitting" | "success" | "error";

// Ghana pinned first (the couple's home country), then A–Z. Not
// exhaustive — the common guest countries for this wedding, so the
// list stays scannable rather than a full ISO dump.
const COUNTRY_CODES = [
  { code: "+233", name: "Ghana" },
  { code: "+61", name: "Australia" },
  { code: "+32", name: "Belgium" },
  { code: "+55", name: "Brazil" },
  { code: "+1", name: "Canada / US" },
  { code: "+225", name: "Côte d'Ivoire" },
  { code: "+45", name: "Denmark" },
  { code: "+20", name: "Egypt" },
  { code: "+251", name: "Ethiopia" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
  { code: "+353", name: "Ireland" },
  { code: "+39", name: "Italy" },
  { code: "+254", name: "Kenya" },
  { code: "+31", name: "Netherlands" },
  { code: "+64", name: "New Zealand" },
  { code: "+234", name: "Nigeria" },
  { code: "+47", name: "Norway" },
  { code: "+974", name: "Qatar" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+65", name: "Singapore" },
  { code: "+27", name: "South Africa" },
  { code: "+34", name: "Spain" },
  { code: "+46", name: "Sweden" },
  { code: "+41", name: "Switzerland" },
  { code: "+228", name: "Togo" },
  { code: "+971", name: "UAE" },
  { code: "+44", name: "United Kingdom" },
] as const;

export default function GuestForm() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+233");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [side, setSide] = useState<Side>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const fullPhone = trimmedPhone ? `${countryCode} ${trimmedPhone}` : "";
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError("Please let us know your name.");
      return;
    }
    if (!trimmedPhone && !trimmedEmail) {
      setFormError("Please add a phone number or an email so we can reach you.");
      return;
    }
    if (!side) {
      setFormError("Let us know whose side you're joining us for.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(GUEST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingSlug: WEDDING_SLUG,
          name: trimmedName,
          phone: fullPhone,
          email: trimmedEmail,
          side,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.card}>
        <div className={styles.success} role="status">
          <p className={styles.successHeading}>You&rsquo;re on the list &hearts;</p>
          <p className={styles.successText}>
            Thank you, {name.trim().split(" ")[0]} — we can&rsquo;t wait to celebrate with you.
          </p>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="guest-name">
            Full name
          </label>
          <input
            id="guest-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.sideLabel}>Whose side are you here for?</span>
          <div
            className={`${styles.sideToggle} ${
              side === "jeremy" ? styles.isJeremy : side === "afriyie" ? styles.isAfriyie : ""
            }`}
            role="radiogroup"
            aria-label="Whose side are you here for?"
          >
            <span className={styles.sideThumb} aria-hidden="true" />
            <button
              type="button"
              role="radio"
              aria-checked={side === "jeremy"}
              className={`${styles.sideOption} ${side === "jeremy" ? styles.isActive : ""}`}
              onClick={() => setSide("jeremy")}
              disabled={submitting}
            >
              Jeremy&rsquo;s side
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={side === "afriyie"}
              className={`${styles.sideOption} ${side === "afriyie" ? styles.isActive : ""}`}
              onClick={() => setSide("afriyie")}
              disabled={submitting}
            >
              Afriyie&rsquo;s side
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="guest-phone">
            Phone
          </label>
          <div className={styles.phoneRow}>
            <div className={styles.countrySelectWrap}>
              <select
                id="guest-country-code"
                aria-label="Country code"
                className={styles.countrySelect}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={submitting}
              >
                {COUNTRY_CODES.map(({ code, name }) => (
                  <option key={code + name} value={code}>
                    {code} {name}
                  </option>
                ))}
              </select>
            </div>
            <input
              id="guest-phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              placeholder="24 123 4567"
              className={`${styles.input} ${styles.phoneInput}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="guest-email">
            Email
          </label>
          <input
            id="guest-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div role="status" aria-live="polite">
          {formError && <p className={styles.formError}>{formError}</p>}
          {status === "error" && !formError && (
            <p className={styles.serverError}>
              Something went wrong on our end — please try again in a moment.
            </p>
          )}
        </div>

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Sending…" : "Join the guest list"}
        </button>
      </form>
    </div>
  );
}
