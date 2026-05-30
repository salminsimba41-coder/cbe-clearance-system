export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cbe-primary-dark
                    via-cbe-primary to-cbe-primary-light flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60'
             viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'
             fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath
             d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6
             34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E
             %3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      />

      {/* Content */}
      <div className="relative flex flex-col flex-1 items-center justify-center p-4">
        {children}
      </div>

      {/* Footer */}
      <div className="relative pb-4 text-center">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} College of Business Education Tanzania
        </p>
      </div>
    </div>
  )
}
