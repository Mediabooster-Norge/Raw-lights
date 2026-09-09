# Redirects

Redirect documents in Studio (`source`, `destination`, `permanent`) are applied in `proxy.ts`.

- Cached for 60 seconds and tagged `redirects`
- Homepage slugs (`forside`, `home`, and the CMS homepage) redirect to `/` or `/en`
- Source can be with or without a locale prefix
- Internal destinations are locale-aware; absolute `http(s)` URLs are unchanged
- 308 if `permanent` is true, otherwise 307
