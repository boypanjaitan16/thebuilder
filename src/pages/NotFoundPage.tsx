import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function NotFoundPage() {
  const { copy } = useI18n()

  return (
    <div className="container-page flex flex-col gap-6">
      <section className="glass-panel px-8 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{copy.notFound.title}</h1>
        <p className="mt-2 text-slate-700">{copy.notFound.body}</p>
        <Link
          to="/"
          className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          {copy.notFound.cta}
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage
