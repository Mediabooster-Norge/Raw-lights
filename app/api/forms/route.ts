import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/utils/rateLimit'
import { getForm } from '@/lib/sanity/fetcher'
import { isHoneypotSubmission, stripHoneypot } from '@/lib/forms/honeypot'
import { z } from 'zod'

const limiter = rateLimit({
  interval: 60 * 1000,
  maxRequests: 5
})

const formSchema = z.object({
  formId: z.string().min(1),
  locale: z.string().optional(),
  data: z.record(z.any())
})

export async function POST(request: NextRequest) {
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
    const form = await getForm(formId)

    if (!form) {
      return NextResponse.json({ message: 'Unknown form' }, { status: 404 })
    }

    if (isHoneypotSubmission(data)) {
      return NextResponse.json({
        success: true,
        message: form.successMessage ?? 'Form submitted successfully',
      })
    }

    const payload = stripHoneypot(data)
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.FORM_FROM_EMAIL
    const to = form.notifyEmail || process.env.FORM_TO_EMAIL

    if (!apiKey || !from || !to) {
      return NextResponse.json(
        { message: 'Form delivery is not configured' },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)
    const rows = Object.entries(payload)
      .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${String(value)}</td></tr>`)
      .join('')

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Skjema: ${form.title ?? formId}`,
      html: `<table>${rows}</table>`,
    })

    if (error) {
      return NextResponse.json({ message: 'Could not send email' }, { status: 502 })
    }

    return NextResponse.json({
      success: true,
      message: form.successMessage ?? 'Form submitted successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
