import {
  CodeIcon,
  CogIcon,
  ComposeIcon,
  ControlsIcon,
  DocumentIcon,
  EarthGlobeIcon,
  EyeOpenIcon,
  ImageIcon,
  MenuIcon,
  SearchIcon,
  ShareIcon,
  StackIcon,
  ThLargeIcon,
  TransferIcon,
} from '@sanity/icons'

export const contentGroup = {
  name: 'content',
  title: 'Innhold',
  default: true,
  icon: ComposeIcon,
}

export const seoGroup = {
  name: 'seo',
  title: 'SEO',
  icon: SearchIcon,
}

export const visibilityGroup = {
  name: 'visibility',
  title: 'Synlighet',
  icon: EyeOpenIcon,
}

export const appearanceGroup = {
  name: 'appearance',
  title: 'Utseende',
  icon: ControlsIcon,
}

export const mediaGroup = {
  name: 'media',
  title: 'Media',
  icon: ImageIcon,
}

export const displayGroup = {
  name: 'display',
  title: 'Visning',
  icon: ThLargeIcon,
}

export const brandGroup = {
  name: 'brand',
  title: 'Merkevare',
  default: true,
  icon: EarthGlobeIcon,
}

export const codeGroup = {
  name: 'code',
  title: 'Kode',
  icon: CodeIcon,
}

export const headerGroup = {
  name: 'header',
  title: 'Header',
  default: true,
  icon: MenuIcon,
}

export const footerGroup = {
  name: 'footer',
  title: 'Footer',
  icon: StackIcon,
}

export const socialGroup = {
  name: 'social',
  title: 'Sosiale medier',
  icon: ShareIcon,
}

export const generalGroup = {
  name: 'general',
  title: 'Generelt',
  default: true,
  icon: DocumentIcon,
}

export const archiveGroup = {
  name: 'archive',
  title: 'Arkivside',
  icon: ThLargeIcon,
}

export const redirectGroup = {
  name: 'redirect',
  title: 'Redirect',
  default: true,
  icon: TransferIcon,
}

export const settingsGroup = {
  name: 'settings',
  title: 'Innstillinger',
  icon: CogIcon,
}
