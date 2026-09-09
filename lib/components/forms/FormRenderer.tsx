'use client'

import { useState } from 'react'
import { InputField } from './InputField'
import { SelectField } from './SelectField'
import { TextareaField } from './TextareaField'
import { CheckboxField } from './CheckboxField'
import { t, useLocale } from '@/lib/i18n'
import { HONEYPOT_FIELD } from '@/lib/forms/honeypot'

type FormField = {
  _key: string
  _type?: string
  fieldType?: string
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

function fieldKind(field: FormField) {
  return field.fieldType ?? field._type ?? 'text'
}

export function FormRenderer({
  formId,
  fields,
  submitButtonText,
  successMessage
}: FormRendererProps) {
  const locale = useLocale()
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
        body: JSON.stringify({ formId, data, locale })
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      setState({ status: 'success', message: successMessage ?? t(locale, 'formDefaultSuccess') })
    } catch {
      setState({ status: 'error', message: t(locale, 'formError') })
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
    <form onSubmit={handleSubmit} className="relative space-y-6">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input
          id={HONEYPOT_FIELD}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {fields.map((field) => {
        const kind = fieldKind(field)
        switch (kind) {
          case 'text':
          case 'email':
          case 'tel':
          case 'textInput':
          case 'emailInput':
          case 'phoneInput':
            return (
              <InputField
                key={field._key}
                type={kind === 'email' || kind === 'emailInput' ? 'email' : kind === 'tel' || kind === 'phoneInput' ? 'tel' : 'text'}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
              />
            )
          case 'textarea':
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
          case 'select':
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
          case 'checkbox':
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
        {state.status === 'submitting' ? t(locale, 'formSending') : (submitButtonText ?? t(locale, 'formDefaultSubmit'))}
      </button>
    </form>
  )
}
