type CheckboxFieldProps = {
  name: string
  label: string
  required?: boolean
}

export function CheckboxField({
  name,
  label,
  required
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={name}
        name={name}
        required={required}
        className="mt-1 w-4 h-4 rounded border focus:ring-2 focus:ring-primary"
      />
      <label htmlFor={name} className="text-sm text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  )
}
