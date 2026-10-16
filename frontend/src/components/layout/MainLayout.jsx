
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-900/40"
          />

          <div className="relative z-10 h-full w-72 max-w-[85vw]">
            <Sidebar onNavigate={closeMobileMenu} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="min-w-0 flex-1 md:ml-64">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
