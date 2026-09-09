# Error handling

`app/global-error.tsx` covers root failures.

`app/[locale]/not-found.tsx` renders `globalSettings.notFoundPage` for the locale, or a UI-string 404.

Block errors are caught by `BlockErrorBoundary`.
