import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function WorkWithMePage() {
  const navigate = useNavigate()
  const { copy } = useI18n()
  const page = copy.work

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Work With Me</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.heroTitle}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.heroBody1}</p>
        <p className="mt-3 text-slate-700">{page.heroBody2}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">{page.flowTitle}</h2>
          <ol className="mt-4 space-y-3 text-slate-700">
            {page.flowSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">{page.scopeTitle}</h3>
          <div className="mt-3 grid gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {page.scopeTitle}
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                {page.scopeIncludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {page.notFitTitle}
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                {page.scopeExcludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {page.fitTitle}
          </h4>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.fitList.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {page.notFitTitle}
          </h4>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.notFitList.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[24px] border border-sand bg-white px-8 py-8 shadow-soft">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-ink">{page.capacityTitle}</h3>
            <p className="mt-3 text-slate-700">{page.capacityBody}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-mist px-5 py-5 text-sm text-slate-600">
            <p className="font-semibold text-ink">{page.ctaTitle}</p>
            <p>{page.applicationNote}</p>
          </div>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Primary CTA
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{page.ctaTitle}</h3>
          <p className="mt-2 text-slate-700">{page.ctaBody}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/apply')}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          {page.ctaButton}
        </button>
      </section>
    </div>
  )
}

export default WorkWithMePage
