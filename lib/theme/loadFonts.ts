function fontFamilyParam(name: string) {
  return name.trim().replace(/\s+/g, '+')
}

export function googleFontsHref(fonts: (string | undefined)[]) {
  const unique = [...new Set(fonts.map((font) => font?.trim()).filter(Boolean))] as string[]
  if (!unique.length) return null
  const families = unique
    .map((font) => `family=${fontFamilyParam(font)}:wght@400;500;600;700`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
