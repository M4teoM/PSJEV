import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra el menú al navegar
  useEffect(() => setOpen(false), [location.pathname])

  const linkBase = 'px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200'
  const linkLight = `${linkBase} text-slate-700 hover:bg-slate-100`
  const linkDark = `${linkBase} text-white/90 hover:text-white hover:bg-white/10`
  const navLink = scrolled ? linkLight : linkDark

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/v1-home" className="flex items-center gap-3 min-w-0">
          <img
            src="/img/PSJ.png"
            alt="PSJ"
            className="w-10 h-10 rounded-xl object-cover shadow flex-shrink-0"
          />
          <span
            className={`font-bold text-sm tracking-tight leading-tight hidden sm:block truncate ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}
          >
            Parques de San Jerónimo
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/v1-home" className={navLink}>Inicio</Link>
          <a href="/v1-home#servicios" className={navLink}>Servicios</a>
          <Link
            to="/v1-home/recarga"
            className="ml-3 px-5 py-2 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 transition-colors shadow"
          >
            ⚡ Recarga EV
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
          }`}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl px-4 py-3 flex flex-col gap-1">
          <Link to="/v1-home" className={linkLight}>Inicio</Link>
          <a href="/v1-home#servicios" className={linkLight}>Servicios</a>
          <Link
            to="/v1-home/recarga"
            className="mt-2 text-center py-3 bg-green-700 text-white font-bold rounded-xl"
          >
            ⚡ Recarga EV
          </Link>
        </div>
      )}
    </nav>
  )
}
