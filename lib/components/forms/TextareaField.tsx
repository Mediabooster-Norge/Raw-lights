type TextareaFieldProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  rows?: number
}

export function TextareaField({
  name,
  label,
  placeholder,
  required,
  rows = 4
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
      />
    </div>
  )
}
