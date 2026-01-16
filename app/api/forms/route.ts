import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/utils/rateLimit'
import { z } from 'zod'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5
})

const formSchema = z.object({
  formId: z.string().min(1),
  data: z.record(z.any())
})

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, remaining } = limiter.check(ip)

  if (!success) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { 
        status: 429,
        headers: { 'X-RateLimit-Remaining': remaining.toString() }
      }
    )
  }

  try {
    const body = await request.json()
    const { formId, data } = formSchema.parse(body)

    // TODO: Handle form submission
    // Options:
    // 1. Send to email
    // 2. Store in Sanity
    // 3. Send to external service
    console.log('Form submission:', { formId, data })

    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
