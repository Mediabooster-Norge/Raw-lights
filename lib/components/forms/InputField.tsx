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
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  )
}
