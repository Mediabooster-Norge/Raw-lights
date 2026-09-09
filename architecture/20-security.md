# Security

- `customCode` is validated against blocked patterns in the schema
- Cookie consent (on by default) gates those scripts until the visitor accepts
- Draft and revalidate routes require secrets; revalidate refuses empty `SANITY_WEBHOOK_SECRET`
- `SANITY_API_TOKEN` stays on the server
- Security headers are set in `next.config.ts`
