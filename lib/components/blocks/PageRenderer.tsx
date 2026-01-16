'use client'

import { BlockErrorBoundary } from './BlockErrorBoundary'
import { UnknownBlock } from './UnknownBlock'
import { blockRegistry } from './registry'

type SanityBlock = {
  _key: string
  _type: string
  children?: SanityBlock[]
  [key: string]: unknown
}

type PageRendererProps = {
  blocks: SanityBlock[]
}

const isDev = process.env.NODE_ENV === 'development'

function renderBlock(block: SanityBlock): React.ReactNode {
  // DEBUG: Log block data
  if (isDev) {
    console.log(`[PageRenderer] Block: ${block._type}`, JSON.stringify(block, null, 2))
  }
  
  const Component = blockRegistry[block._type]

  if (!Component) {
    if (isDev) {
      console.warn(`[PageRenderer] Unknown block type: ${block._type}`)
      return <UnknownBlock key={block._key} type={block._type} data={block} />
    }
    return null
  }

  // Handle section blocks with children
  if (block._type === 'sectionBlock' && block.children) {
    return (
      <BlockErrorBoundary
        key={block._key}
        blockType={block._type}
        blockKey={block._key}
      >
        <Component 
          data={block} 
          renderChildren={(children: SanityBlock[]) => (
            <>
              {children.map(renderBlock)}
            </>
          )}
        />
      </BlockErrorBoundary>
    )
  }

  return (
    <BlockErrorBoundary
      key={block._key}
      blockType={block._type}
      blockKey={block._key}
    >
      <Component data={block} />
    </BlockErrorBoundary>
  )
}

export function PageRenderer({ blocks }: PageRendererProps) {
  if (!blocks?.length) return null

  return <>{blocks.map(renderBlock)}</>
}
