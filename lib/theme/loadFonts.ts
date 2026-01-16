import { 
  Inter, 
  Playfair_Display, 
  Montserrat, 
  Roboto, 
  Open_Sans, 
  Poppins, 
  Lato, 
  Oswald, 
  Merriweather, 
  Raleway, 
  Source_Sans_3, 
  Nunito, 
  Work_Sans 
} from 'next/font/google'

type FontLoader = () => { variable: string }

const fontLoaders: Record<string, FontLoader> = {
  'Inter': () => Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' }),
  'Playfair Display': () => Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' }),
  'Montserrat': () => Montserrat({ subsets: ['latin'], variable: '--font-heading', display: 'swap' }),
  'Roboto': () => Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' }),
  'Open Sans': () => Open_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' }),
  'Poppins': () => Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-heading', display: 'swap' }),
  'Lato': () => Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' }),
  'Oswald': () => Oswald({ subsets: ['latin'], variable: '--font-heading', display: 'swap' }),
  'Merriweather': () => Merriweather({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-heading', display: 'swap' }),
  'Raleway': () => Raleway({ subsets: ['latin'], variable: '--font-heading', display: 'swap' }),
  'Source Sans Pro': () => Source_Sans_3({ subsets: ['latin'], variable: '--font-body', display: 'swap' }),
  'Nunito': () => Nunito({ subsets: ['latin'], variable: '--font-body', display: 'swap' }),
  'Work Sans': () => Work_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' }),
}

export function loadFonts(headingFont?: string, bodyFont?: string) {
  const heading = headingFont && fontLoaders[headingFont] ? fontLoaders[headingFont]() : null
  const body = bodyFont && fontLoaders[bodyFont] ? fontLoaders[bodyFont]() : null
  
  return { heading, body }
}
