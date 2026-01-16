import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function OrganizationPage() {
  const navigate = useNavigate()
  const { copy } = useI18n()
  const org = copy.organization

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Organization Transformation & Resilience
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          {org.heroTitle}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{org.heroBody}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">{org.coreProblemTitle}</h2>
          <p className="mt-3 text-slate-700">{org.coreProblemIntro}</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {org.coreProblemBullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">{copy.home.approach.notThis}</p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">{org.resilienceTitle}</h2>
          <p className="mt-3 text-slate-700">{org.resilienceIntro}</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {org.resilienceList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">{copy.risk.closingBody}</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="glass-panel p-8">
          <h3 className="text-xl font-semibold text-ink">{org.approachTitle}</h3>
          <p className="mt-3 text-slate-700">{org.approachBody1}</p>
          <p className="mt-3 text-slate-700">{org.approachBody2}</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">{org.scopeTitle}</h3>
          <div className="mt-3 grid gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {copy.work.scopeTitle}
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                {org.scopeIncludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {copy.work.notFitTitle}
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                {org.scopeExcludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Relevance
          </h4>
          <p className="mt-3 text-slate-700">{org.relevance}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Designed for
          </h4>
          <p className="mt-3 text-slate-700">{org.designedFor}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Connection to other areas
          </h4>
          <p className="mt-3 text-slate-700">{org.integration}</p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-semibold text-ink">
            {org.ctaTitle}
          </h3>
          <p className="mt-2 text-slate-700">{org.ctaBody}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/apply')}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          {copy.nav.apply}
        </button>
      </section>
    </div>
  )
}

export default OrganizationPage
