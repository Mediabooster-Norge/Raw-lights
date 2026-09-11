type InputFieldProps = {
  type?: 'text' | 'email' | 'tel' | 'number'
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

export function InputField({
  type = 'text',
  name,
  label,
  placeholder,
  required
}: InputFieldProps) {
  return (
    <div className="raw-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        className="raw-field__input"
      />
    </div>
  )
}
