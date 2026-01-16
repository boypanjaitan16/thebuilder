import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function InsightsPage() {
  const navigate = useNavigate()
  const { copy } = useI18n()
  const page = copy.insightsPage
  const shared = copy.shared

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Insights</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.heroTitle}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.heroBody1}</p>
        <p className="mt-3 text-slate-700">{page.heroBody2}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div className="glass-panel p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">{page.featuredTitle}</h2>
          <p className="mt-2 text-slate-700">{page.featuredBody}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {shared.insightArticles.map((article) => (
              <div
                key={article.title}
                className="rounded-xl border border-sand bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-sm uppercase tracking-wide text-slate-500">{article.lens}</p>
                <p className="mt-1 font-semibold text-ink">{article.title}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">{page.themesNote}</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">{page.casesTitle}</h3>
          <p className="mt-2 text-slate-700">{page.casesBody}</p>
          <div className="mt-4 space-y-3">
            {shared.caseReflections.map((item) => (
              <div key={item} className="rounded-xl bg-mist px-4 py-3 text-sm text-ink">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">{page.editorialBody}</p>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {page.editorialTitle}
          </h4>
          <p className="mt-3 text-slate-700">{page.editorialBody}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {page.philosophy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-sand bg-mist px-6 py-6">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {page.invitationTitle}
          </h4>
          <p className="mt-3 text-slate-700">{page.invitationBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/diagnostic')}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              {page.diagnosticCta}
            </button>
            <button
              type="button"
              onClick={() => navigate('/apply')}
              className="rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              {page.applyCta}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InsightsPage
