export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="h-10 bg-card border-t border-border flex items-center
                       justify-between px-4 lg:px-6 shrink-0">
      <p className="text-xs text-muted-foreground">
        © {year} College of Business Education — Digital Clearance System
      </p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <i className="fa-solid fa-shield-halved text-cbe-gold" />
        <span className="hidden sm:inline">Secured & Verified</span>
      </div>
    </footer>
  )
}
