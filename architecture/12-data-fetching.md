# Data fetching

`lib/sanity/fetcher.ts` wraps `client.fetch` with `draftMode()` for preview, cache tags, and `$locale`.

Untranslated documents (`!defined(language)`) match `nb`.

Webhook `POST /api/revalidate` uses `revalidateTag(tag, { expire: 0 })` and locale-aware `revalidatePath` (`/` and `/en`, plus slug paths). See README for the GROQ projection.

Do not enable Cache Components / PPR unless a project needs them. ISR + tags is the default.
