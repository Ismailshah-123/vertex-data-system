/**
 * Safely serialize an object for use inside <script type="application/ld+json">
 * via dangerouslySetInnerHTML.
 *
 * Plain JSON.stringify() does NOT escape "<", so if any string value in the
 * object ever contained the literal sequence "</script>", it would
 * prematurely close the script tag and let the rest of that string be
 * parsed as raw HTML — a real injection vector the moment this data stops
 * being 100%-hardcoded (e.g. if titles/descriptions ever come from a CMS,
 * user input, or an external API instead of a local const).
 *
 * Every current call site in this codebase only feeds this hardcoded
 * developer-authored data, so there's no live exploit today — this is
 * cheap insurance for whenever that stops being true, not a fix for an
 * active bug.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
