# Security

- `customCode` is validated against blocked patterns in the schema
- Cookie consent (on by default) gates those scripts until the visitor accepts
- Draft and revalidate routes require secrets
- `SANITY_API_TOKEN` stays on the server
- Security headers are set in `next.config.ts`
