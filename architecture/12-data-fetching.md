# Data fetching

`lib/sanity/fetcher.ts` wraps `client.fetch` with `draftMode()` for preview, cache tags, and `$locale`.

Untranslated documents (`!defined(language)`) match `nb`.

Webhook `POST /api/revalidate` calls `revalidateTag(tag, { expire: 0 })` in Next 16.

Do not enable Cache Components / PPR unless a project needs them. ISR + tags is the default.
