import { FormRenderer } from '@/lib/components/forms/FormRenderer'
import { BlockContainer } from './BlockContainer'

type FormBlockProps = {
  data: {
    heading?: string
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    form?: {
      _id: string
      title?: string
      submitLabel?: string
      successMessage?: string
      fields?: {
        _key: string
        name: string
        label: string
        fieldType?: string
        placeholder?: string
        required?: boolean
        options?: { label: string; value: string }[]
      }[]
    }
  }
}

export function FormBlock({ data }: FormBlockProps) {
  if (!data.form?._id) return null

  return (
    <BlockContainer background={data.background} spacing={data.spacing}>
      <div className="raw-shell raw-form-block">
      {data.heading && (
        <h2 className="raw-display">{data.heading}</h2>
      )}
      <FormRenderer
        formId={data.form._id}
        fields={data.form.fields ?? []}
        submitButtonText={data.form.submitLabel}
        successMessage={data.form.successMessage}
      />
      </div>
    </BlockContainer>
  )
}
