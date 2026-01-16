type Option = {
  label: string
  value: string
}

type SelectFieldProps = {
  name: string
  label: string
  options: Option[]
  required?: boolean
}

export function SelectField({
  name,
  label,
  options,
  required
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      >
        <option value="">Velg...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
