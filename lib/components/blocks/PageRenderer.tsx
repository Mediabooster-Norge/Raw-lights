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

function renderBlock(block: SanityBlock): React.ReactNode {
  const Component = blockRegistry[block._type]

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      return <UnknownBlock key={block._key} type={block._type} data={block} />
    }
    return null
  }

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
