'use client'

interface Option {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = 'Filter...',
  className = '',
}: FilterSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <i className="fa-solid fa-filter absolute left-3.5 top-1/2
                    -translate-y-1/2 text-muted-foreground text-xs
                    pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base pl-9 pr-8 appearance-none cursor-pointer"
      >
        <option value="ALL">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2
                    -translate-y-1/2 text-muted-foreground text-xs
                    pointer-events-none" />
    </div>
  )
}
