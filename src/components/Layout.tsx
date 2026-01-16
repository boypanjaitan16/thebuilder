import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'

const footerLinks = [
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/insights' },
  { label: 'Work With Me', to: '/work-with-me' },
  { label: 'Privacy Policy', to: '/privacy' },
]

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-mist text-ink">
      <Header />

      <main className="py-5 xl:py-10 px-5 xl:px-0">
        <Outlet />
      </main>

      <footer className="border-t border-sand/70 bg-white py-10">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-5 xl:px-0">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              The Builder
            </p>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Strategic advisory based in Indonesia. Working with organizations
              selectively to design resilient structures, leadership continuity,
              and human risk safeguards.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3 text-sm font-medium text-slate-700">
            {footerLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="md:rounded-full md:border border-sand md:px-3 md:py-1 hover:border-ink hover:text-ink"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
