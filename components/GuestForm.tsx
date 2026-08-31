"use client";

import { useState, type FormEvent } from "react";
import styles from "./GuestForm.module.css";

const GUEST_ENDPOINT = "https://us-central1-cfweddingslive.cloudfunctions.net/guests";
const WEDDING_ID = "38a6ce2b343e5d62cb528471e37687024246c1eea93a0e42";

type Side = "jeremy" | "afriyie" | null;
type Status = "idle" | "submitting" | "success" | "error";

export default function GuestForm() {
  const [name, setName] = useState("");
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
          weddingId: WEDDING_ID,
          name: trimmedName,
          phone: trimmedPhone,
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
          <input
            id="guest-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 ..."
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
          />
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
