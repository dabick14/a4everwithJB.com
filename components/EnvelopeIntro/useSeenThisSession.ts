const PREFIX = "envelope-intro:";

/** Reads the "already played" flag synchronously so the overlay never flashes on repeat views. */
export function hasSeenThisSession(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(PREFIX + key) === "1";
  } catch {
    // Storage may be unavailable (private mode, disabled cookies). Fail open and play the intro.
    return false;
  }
}

export function markSeenThisSession(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PREFIX + key, "1");
  } catch {
    // Ignore — worst case the intro replays on the next internal navigation.
  }
}

export function slugifyKey(names: [string, string]): string {
  return names.join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
