// Disabled storage must not prevent the site from rendering.
export function readStorage(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(key, value) } catch { /* Session-only preference. */ }
}
