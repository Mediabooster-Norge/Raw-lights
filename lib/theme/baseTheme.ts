export const baseTheme = {
  palette: {
    primary: '#c6e000',
    secondary: '#d3e440',
    tertiary: '#7a8a04',
    background: '#07080a',
    surface: '#151617',
    textPrimary: '#f3efe4',
    textSecondary: '#908e87',
    onPrimary: '#0f172a',
    onSecondary: '#0f172a'
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
      background: '#07080a',
      text: '#f3efe4'
    },
    footer: {
      background: '#07080a',
      text: '#f3efe4'
    },
    cta: {
      primary: {
        background: '#c6e000',
        text: '#0f172a',
        border: '#c6e000'
      },
      secondary: {
        background: '#d3e440',
        text: '#0f172a',
        border: '#d3e440'
      }
    },
    section: {
      defaultBackground: '#07080a',
      altBackground: '#151617'
    }
  }
}

export type Theme = typeof baseTheme
