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
    <div className="raw-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="raw-field__input"
      />
    </div>
  )
}
