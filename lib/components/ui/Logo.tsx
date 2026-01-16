import { SanityImage } from './SanityImage'

type LogoProps = {
  logo: any
  logoDark?: any
  variant?: 'light' | 'dark' | 'auto'
  className?: string
}

export function Logo({ logo, logoDark, variant = 'auto', className }: LogoProps) {
  if (variant === 'dark' && logoDark) {
    return <SanityImage image={logoDark} alt="Logo" className={className} />
  }
  
  if (variant === 'auto' && logoDark) {
    return (
      <>
        <SanityImage image={logo} alt="Logo" className={`${className} dark:hidden`} />
        <SanityImage image={logoDark} alt="Logo" className={`${className} hidden dark:block`} />
      </>
    )
  }
  
  return <SanityImage image={logo} alt={logo?.alt ?? 'Logo'} className={className} />
}
