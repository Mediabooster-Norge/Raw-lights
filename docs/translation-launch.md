# Norsk hovedspråk og engelsk oversettelse

## Før migrering

Kjør `npm run migration:report`. Kommandoen er skrivebeskyttet og gir listen over dokumenter, foreslåtte norske URL-er og kjente avvik. Eksporter en URL-liste fra den tidligere WordPress-siden og opprett ett Sanity-redirect per gammel URL før DNS byttes.

## Vercel

I Production Environment Variables:

- `NEXT_PUBLIC_SITE_URL=https://rawlights.no`
- `OPENAI_API_KEY` (hemmelig)
- `OPENAI_TRANSLATION_MODEL=gpt-5-mini`
- `SANITY_TRANSLATION_WEBHOOK_SECRET` (hemmelig, tilfeldig verdi)

Koble både `rawlights.no` og `www.rawlights.no` til Vercel. Sett `rawlights.no` som primær domene. `www` og den tidligere Vercel-produksjonsadressen videresendes permanent i appen.

## Sanity webhook for oversettelsesjobber

Opprett en webhook i Sanity Manage med trigger på opprettelse/oppdatering av dokumenttypen `translationJob` og URL `https://rawlights.no/api/translate`. Legg `SANITY_TRANSLATION_WEBHOOK_SECRET` i headeren `x-translation-secret`. Velg en projection som sender `{ "_id": _id }`.

Studio-handlingen **Opprett engelsk kladd** oppretter bare jobben. Webhooken kjører oversettelsen server-side, oppretter en ubrukt engelsk kladd og lager lenketøyet som binder språkversjonene sammen. En eksisterende engelsk versjon blir aldri overskrevet.

## Utfør den kontrollerte migreringen

Når rapporten er godkjent og OpenAI-nøkkelen er satt lokalt eller i en sikret CI-prosess:

`CONFIRM_RAW_MIGRATION=rawlights-no npm run migration:report -- --apply`

Migreringen beholder dagens dokument-ID-er som norske hoveddokumenter, oversetter redaksjonelle felt til norsk, lager engelske kladder, kobler referanser mellom språkene og setter språkspesifikk standard-SEO. Den avbryter før den skriver dersom den finner eksisterende oversettelsesmetadata eller engelske kladder.

Etterpå skal norsk publisering testes på `/`, `/om-oss`, `/produkter`, `/kontakt`, `/personvern` og `/produkter/[slug]`. Engelske kladder kvalitetssikres og publiseres manuelt før de blir tilgjengelige under `/en`.
