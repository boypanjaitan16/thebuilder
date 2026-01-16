import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import classNames from 'classnames'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Organization Transformation', to: '/organization-transformation' },
  { label: 'Future Talent Strategy', to: '/future-talent-strategy' },
  { label: 'Risk & Business Continuity', to: '/risk-and-business-continuity' },
  { label: 'Insights', to: '/insights' },
  { label: 'Work With Me', to: '/work-with-me' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-20 border-b border-sand/70 bg-white/80 backdrop-blur">
      <div className="container-page flex flex-col gap-5 py-5 px-5 xl:px-0">
        <div className='flex flex-row justify-between items-center'>
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-sm font-semibold uppercase text-white shadow-soft">
              TB
            </div>
            <div className="text-left leading-tight">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                The Builder
              </p>
              <p className="font-display text-lg font-semibold text-ink">
                Strategic Advisory
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-xl border border-sand bg-white text-ink shadow-sm transition hover:border-ink"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="relative h-4 w-4">
              <span
                className={classNames(
                  'absolute inset-x-0 top-0 h-0.5 bg-ink transition',
                  open && 'translate-y-2 rotate-45',
                )}
              />
              <span
                className={classNames(
                  'absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink transition',
                  open && 'opacity-0',
                )}
              />
              <span
                className={classNames(
                  'absolute inset-x-0 bottom-0 h-0.5 bg-ink transition',
                  open && '-translate-y-2 -rotate-45',
                )}
              />
            </div>
          </button>
          <NavLink
            to="/apply"
            className="items-center justify-center rounded-full border border-ink px-5 py-2 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hidden md:inline-flex"
          >
            Apply Now
          </NavLink>
        </div>

        <div
          className={classNames(
            'w-full flex-col md:w-auto md:flex-row md:items-center gap-5',
            open ? 'flex' : 'hidden md:flex',
          )}
        >
          <nav className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'rounded-md px-3 py-2 transition-all duration-150',
                    isActive
                      ? 'bg-ink text-white shadow-soft'
                      : 'text-slate-700 hover:bg-sand/70 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink
            to="/apply"
            className="inline-flex md:hidden items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft w-full"
          >
            Apply
          </NavLink>
        </div>
      </div>
    </header>
  )
}
