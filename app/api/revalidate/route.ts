import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { _type, slug } = body

    // Revalidate based on document type
    switch (_type) {
      case 'page':
        revalidateTag('pages')
        if (slug?.current) {
          revalidateTag(`page-${slug.current}`)
          revalidatePath(`/${slug.current}`)
        }
        break
      case 'post':
        revalidateTag('posts')
        if (slug?.current) {
          revalidateTag(`post-${slug.current}`)
        }
        break
      case 'postType':
        revalidateTag('post-types')
        break
      case 'navigation':
        revalidateTag('navigation')
        break
      case 'globalSettings':
        revalidateTag('global-settings')
        break
      default:
        revalidateTag('all')
    }

    return NextResponse.json({ 
      revalidated: true, 
      type: _type,
      timestamp: Date.now() 
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating' }, 
      { status: 500 }
    )
  }
}
