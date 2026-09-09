export const baseTheme = {
  palette: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    tertiary: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff'
  },
  typography: {
    fontFamily: {
      heading: 'Inter',
      body: 'Inter'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    section: {
      sm: '2rem',
      md: '4rem',
      lg: '6rem',
      xl: '8rem'
    },
    container: {
      padding: '1rem',
      maxWidth: '1280px'
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  components: {
    header: {
      background: '#ffffff',
      text: '#0f172a'
    },
    footer: {
      background: '#0f172a',
      text: '#f8fafc'
    },
    cta: {
      primary: {
        background: '#2563eb',
        text: '#ffffff',
        border: '#2563eb'
      },
      secondary: {
        background: '#7c3aed',
        text: '#ffffff',
        border: '#7c3aed'
      }
    },
    section: {
      defaultBackground: '#ffffff',
      altBackground: '#f8fafc'
    }
  }
}

export type Theme = typeof baseTheme
