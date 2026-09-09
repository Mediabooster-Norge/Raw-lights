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
        revalidateTag('pages', { expire: 0 })
        if (slug?.current) {
          revalidateTag(`page-${slug.current}`, { expire: 0 })
          revalidatePath(`/${slug.current}`)
        }
        break
      case 'post':
        revalidateTag('posts', { expire: 0 })
        if (slug?.current) {
          revalidateTag(`post-${slug.current}`, { expire: 0 })
        }
        break
      case 'postType':
        revalidateTag('post-types', { expire: 0 })
        break
      case 'navigation':
        revalidateTag('navigation', { expire: 0 })
        break
      case 'redirect':
        revalidateTag('redirects', { expire: 0 })
        break
      case 'form':
        revalidateTag('forms', { expire: 0 })
        break
      case 'globalSettings':
        revalidateTag('global-settings', { expire: 0 })
        break
      default:
        revalidateTag('all', { expire: 0 })
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
