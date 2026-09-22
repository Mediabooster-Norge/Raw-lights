import { SanityImage } from './SanityImage'

type LogoProps = {
  logo: any
  logoLight?: any
  variant?: 'light' | 'dark' | 'auto'
  className?: string
}

export function Logo({ logo, logoLight, variant = 'auto', className }: LogoProps) {
  if (variant === 'light' && logoLight) {
    return <SanityImage image={logoLight} alt={logoLight?.alt ?? 'RAW Lights'} className={className} />
  }

  if (variant === 'auto' && logoLight) {
    return <>
      <SanityImage image={logo} alt={logo?.alt ?? 'RAW Lights'} className={`${className} raw-logo raw-logo--dark`} />
      <SanityImage image={logoLight} alt="" className={`${className} raw-logo raw-logo--light`} />
    </>
  }

  return <SanityImage image={logo} alt={logo?.alt ?? 'RAW Lights'} className={className} />
}
