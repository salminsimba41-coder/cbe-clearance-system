'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, totalItems)

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between px-4 py-3
                    border-t border-border">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium">{start}</span>–
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-border flex items-center
                     justify-center text-xs hover:bg-muted transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        {/* Pages */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              currentPage === page
                ? 'bg-cbe-primary text-white'
                : 'border border-border hover:bg-muted text-foreground'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Ellipsis */}
        {totalPages > 7 && (
          <span className="text-muted-foreground text-xs px-1">...</span>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-border flex items-center
                     justify-center text-xs hover:bg-muted transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  )
}
