import DOMPurify, { type Config } from "dompurify"

/**
 * SSR-safe HTML sanitizer. Returns the raw HTML unchanged on the server
 * (where there is no DOM) and sanitizes via DOMPurify on the client.
 */
export function sanitizeHtml(
  dirty: string,
  config?: Config,
): string {
  if (typeof window === "undefined") return dirty
  return DOMPurify.sanitize(dirty, { ...config, RETURN_DOM: false, RETURN_DOM_FRAGMENT: false })
}
