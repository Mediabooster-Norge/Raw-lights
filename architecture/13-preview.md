# Preview and draft mode

Presentation uses:

```ts
previewUrl: {
  origin: PREVIEW_URL,
  previewMode: { enable: '/api/draft' },
}
```

`/api/draft` is `defineEnableDraftMode` from `next-sanity/draft-mode` and requires `SANITY_API_TOKEN`.

The preview banner exits via `/api/preview/disable`.

`/api/preview?secret=...&slug=/path` still enables draft mode with `SANITY_PREVIEW_SECRET` for a direct link.

The preview client uses `perspective: 'drafts'` and stega for click-to-edit.
