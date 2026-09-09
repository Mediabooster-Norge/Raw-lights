# Forms

Studio document `form` plus `formBlock` in the page builder.

`FormRenderer` posts to `/api/forms`. The route loads the form from Sanity and sends mail with Resend (`RESEND_API_KEY`, `FORM_FROM_EMAIL`, `FORM_TO_EMAIL`). A form can override the recipient with `notifyEmail`.

A hidden `company_website` field is a honeypot: filled submissions get a fake success and no email.

If Resend is not configured the API returns 503.

Rate limiting is in-memory (`lib/utils/rateLimit.ts`). On serverless that is per instance, not global. Use a queue or provider-side limits for production traffic.
