import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { revalidateSpec } from '@/lib/sanity/revalidateTargets'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')
  const expected = process.env.SANITY_WEBHOOK_SECRET

  if (!expected || secret !== expected) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const spec = revalidateSpec(body)

    for (const tag of spec.tags) {
      revalidateTag(tag, { expire: 0 })
    }
    for (const item of spec.paths) {
      if (item.type) {
        revalidatePath(item.path, item.type)
      } else {
        revalidatePath(item.path)
      }
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      tags: spec.tags,
      paths: spec.paths.map((item) => item.path),
      timestamp: Date.now(),
    })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
