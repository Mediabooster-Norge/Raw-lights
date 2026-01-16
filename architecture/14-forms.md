# Forms System

## File Structure
```
/lib/components/forms/
  Form.tsx
  FormField.tsx
  Input.tsx
  Textarea.tsx
  Select.tsx
  Checkbox.tsx
  RadioGroup.tsx
  SubmitButton.tsx
/app/api/forms/route.ts
schemas/objects/formField.ts
schemas/shared/form.ts
```

---

## Form Schema
```
schemas/shared/form.ts
```

```ts
export default {
  name: 'form',
  title: 'Form',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Form Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    {
      name: 'fields',
      type: 'array',
      of: [{ type: 'formField' }]
    },
    { name: 'submitButtonText', type: 'string', initialValue: 'Send' },
    { name: 'successMessage', type: 'text' },
    {
      name: 'recipient',
      type: 'string',
      title: 'Email Recipient',
      validation: (Rule) => Rule.email()
    }
  ]
}
```

---

## FormField Schema
```
schemas/objects/formField.ts
```

```ts
export default {
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    { name: 'label', type: 'string' },
    { name: 'name', type: 'string', title: 'Field Name (unique)' },
    {
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Textarea', value: 'textarea' },
          { title: 'Select', value: 'select' },
          { title: 'Checkbox', value: 'checkbox' },
          { title: 'Radio', value: 'radio' }
        ]
      }
    },
    { name: 'placeholder', type: 'string' },
    { name: 'required', type: 'boolean', initialValue: false },
    {
      name: 'options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => !['select', 'radio'].includes(parent?.type)
    }
  ]
}
```

---

## Form Component Pattern
```tsx
// /lib/components/forms/Form.tsx
'use client'
import { useState } from 'react'

export function Form({ form }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        body: JSON.stringify({
          formId: form._id,
          data: Object.fromEntries(formData)
        })
      })
      
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <div className="form-success">{form.successMessage}</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {form.fields.map((field) => (
        <FormField key={field.name} field={field} />
      ))}
      <SubmitButton loading={status === 'loading'}>
        {form.submitButtonText}
      </SubmitButton>
    </form>
  )
}
```

---

## API Route
```ts
// /app/api/forms/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { formId, data } = await req.json()
  
  // Get form config from Sanity
  const form = await client.fetch(
    `*[_type == "form" && _id == $id][0]`,
    { id: formId }
  )
  
  // Send email (use Resend, SendGrid, etc.)
  await sendEmail({
    to: form.recipient,
    subject: `New submission: ${form.title}`,
    data
  })
  
  return NextResponse.json({ success: true })
}
```
