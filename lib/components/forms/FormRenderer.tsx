'use client'

import { useState } from 'react'
import { InputField } from './InputField'
import { SelectField } from './SelectField'
import { TextareaField } from './TextareaField'
import { CheckboxField } from './CheckboxField'

type FormField = {
  _key: string
  _type: string
  name: string
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
}

type FormRendererProps = {
  formId: string
  fields: FormField[]
  submitButtonText?: string
  successMessage?: string
}

type FormState = {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message?: string
}

export function FormRenderer({ 
  formId, 
  fields, 
  submitButtonText = 'Send', 
  successMessage = 'Takk for din henvendelse!' 
}: FormRendererProps) {
  const [state, setState] = useState<FormState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState({ status: 'submitting' })

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, data })
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      setState({ status: 'success', message: successMessage })
    } catch (error) {
      setState({ status: 'error', message: 'Noe gikk galt. Prøv igjen senere.' })
    }
  }

  if (state.status === 'success') {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-800">
        {state.message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => {
        switch (field._type) {
          case 'textInput':
          case 'emailInput':
          case 'phoneInput':
            return (
              <InputField
                key={field._key}
                type={field._type === 'emailInput' ? 'email' : field._type === 'phoneInput' ? 'tel' : 'text'}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
              />
            )
          case 'textareaInput':
            return (
              <TextareaField
                key={field._key}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
              />
            )
          case 'selectInput':
            return (
              <SelectField
                key={field._key}
                name={field.name}
                label={field.label}
                options={field.options ?? []}
                required={field.required}
              />
            )
          case 'checkboxInput':
            return (
              <CheckboxField
                key={field._key}
                name={field.name}
                label={field.label}
                required={field.required}
              />
            )
          default:
            return null
        }
      })}

      {state.status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={state.status === 'submitting'}
        className="w-full px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {state.status === 'submitting' ? 'Sender...' : submitButtonText}
      </button>
    </form>
  )
}
