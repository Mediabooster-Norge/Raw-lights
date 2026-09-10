/**
 * Fonts that the frontend is allowed to request from Google Fonts.
 * Keeping this list finite makes the Studio control predictable and prevents
 * arbitrary values from being turned into external stylesheet URLs.
 */
export const fontOptions = [
  { title: 'Syne — RAW display', value: 'Syne' },
  { title: 'Outfit — RAW body', value: 'Outfit' },
  { title: 'Inter', value: 'Inter' },
  { title: 'Playfair Display', value: 'Playfair Display' },
  { title: 'Montserrat', value: 'Montserrat' },
  { title: 'Poppins', value: 'Poppins' },
  { title: 'Oswald', value: 'Oswald' },
  { title: 'Merriweather', value: 'Merriweather' },
  { title: 'Raleway', value: 'Raleway' },
  { title: 'Roboto', value: 'Roboto' },
  { title: 'Open Sans', value: 'Open Sans' },
  { title: 'Lato', value: 'Lato' },
  { title: 'Source Sans Pro', value: 'Source Sans Pro' },
  { title: 'Nunito', value: 'Nunito' },
  { title: 'Work Sans', value: 'Work Sans' },
] as const

export const supportedFontFamilies = new Set<string>(fontOptions.map(({ value }) => value))
