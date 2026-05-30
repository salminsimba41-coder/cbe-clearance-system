'use client'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <i className="fa-solid fa-magnifying-glass absolute left-3.5
                    top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2
                     text-muted-foreground hover:text-foreground
                     transition-colors"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>
      )}
    </div>
  )
}
