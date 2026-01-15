import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import classNames from 'classnames'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Organization Transformation', to: '/organization-transformation' },
  { label: 'Future Talent Strategy', to: '/future-talent-strategy' },
  { label: 'Risk & Business Continuity', to: '/risk-and-business-continuity' },
  { label: 'Insights', to: '/insights' },
  { label: 'Work With Me', to: '/work-with-me' },
]

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
      <header className="sticky top-0 z-20 border-b border-sand/70 bg-white/90 backdrop-blur">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-sm font-semibold uppercase text-white shadow-soft">
              TB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                The Builder
              </p>
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                Strategic Advisory
              </p>
            </div>
          </div>

          <nav className="flex flex-1 flex-wrap items-center justify-end gap-2 text-sm md:gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'rounded-full px-3 py-2 transition-colors duration-200',
                    isActive
                      ? 'bg-ink text-white'
                      : 'text-slate-700 hover:bg-sand/60 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/apply"
              className="ml-1 inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Apply
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="pb-20 pt-8">
        <Outlet />
      </main>

      <footer className="border-t border-sand/70 bg-white py-10">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
            {footerLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="rounded-full border border-sand px-3 py-1 transition hover:border-ink hover:text-ink"
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
