import { useEffect, useState } from 'react'
import { useClient } from 'sanity'

type ChecklistState = {
  siteName?: string
  homePage?: { _ref?: string } | null
  notFoundPage?: { _ref?: string } | null
  privacyPage?: { _ref?: string } | null
  navLanguages: string[]
  legacyJsonLdTypes: { title?: string; language?: string; jsonLdType?: string }[]
}

type Row = {
  ok: boolean
  label: string
  hint?: string
}

function languageLabel(value?: string) {
  return value === 'en' ? 'en' : 'nb'
}

export function SetupChecklist() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [state, setState] = useState<ChecklistState | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      client.fetch(`*[_type == "globalSettings"][0]{
        siteName,
        homePage,
        notFoundPage,
        privacyPage
      }`),
      client.fetch(`*[_type == "navigation"]{ language }`),
      client.fetch(`*[_type == "postType" && defined(jsonLdType) && !(jsonLdType in ["None", "Article", "NewsArticle", "BlogPosting"])]{ title, language, jsonLdType }`),
    ])
      .then(([settings, navs, legacyJsonLdTypes]) => {
        if (cancelled) return
        setState({
          siteName: settings?.siteName,
          homePage: settings?.homePage,
          notFoundPage: settings?.notFoundPage,
          privacyPage: settings?.privacyPage,
          navLanguages: (navs ?? []).map((nav: { language?: string }) => languageLabel(nav.language)),
          legacyJsonLdTypes: legacyJsonLdTypes ?? [],
        })
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Kunne ikke laste sjekklisten')
      })
    return () => {
      cancelled = true
    }
  }, [client])

  if (error) {
    return (
      <div style={{ padding: 24, color: 'var(--card-fg-color)' }}>
        <p>{error}</p>
      </div>
    )
  }

  if (!state) {
    return (
      <div style={{ padding: 24, color: 'var(--card-fg-color)' }}>
        <p>Laster…</p>
      </div>
    )
  }

  const rows: Row[] = [
    {
      ok: Boolean(state.siteName?.trim()),
      label: 'Nettstednavn',
      hint: 'Globale innstillinger → Nettstednavn',
    },
    {
      ok: Boolean(state.homePage?._ref),
      label: 'Forside valgt',
      hint: 'Globale innstillinger → Forside',
    },
    {
      ok: Boolean(state.notFoundPage?._ref),
      label: '404-side valgt',
      hint: 'Valgfritt, men anbefalt',
    },
    {
      ok: Boolean(state.privacyPage?._ref),
      label: 'Personvernside valgt',
      hint: 'Lenkes fra cookie-banneret',
    },
    {
      ok: state.navLanguages.includes('nb'),
      label: 'Navigasjon for norsk',
    },
    {
      ok: state.navLanguages.includes('en'),
      label: 'Navigasjon for engelsk',
    },
    {
      ok: state.legacyJsonLdTypes.length === 0,
      label: 'Støttede schema-typer på posttyper',
      hint:
        state.legacyJsonLdTypes.length === 0
          ? undefined
          : state.legacyJsonLdTypes
              .map((item) => `${item.title ?? 'Uten tittel'}: ${item.jsonLdType} (${languageLabel(item.language)})`)
              .join(', '),
    },
  ]

  return (
    <div style={{ padding: 24, maxWidth: 560, color: 'var(--card-fg-color)' }}>
      <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Oppstart</h2>
      <p style={{ margin: '0 0 16px', opacity: 0.7 }}>
        Gå gjennom dette før første publisering. Listen oppdateres når du åpner panelet på nytt.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {rows.map((row) => (
          <li
            key={row.label}
            style={{
              padding: 12,
              borderRadius: 6,
              background: row.ok ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            }}
          >
            <strong>{row.ok ? 'OK' : 'Mangler'}</strong> — {row.label}
            {row.hint ? (
              <div style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>{row.hint}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
