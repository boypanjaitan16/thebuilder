import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function RiskContinuityPage() {
  const navigate = useNavigate()
  const { copy } = useI18n()
  const page = copy.risk

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Risk & Business Continuity</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.heroTitle}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.heroBody}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">{page.invisibleTitle}</h2>
          <p className="mt-3 text-slate-700">{page.invisibleIntro}</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.invisibleList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">{page.requiresTitle}</h2>
          <p className="mt-3 text-slate-700">{page.requiresIntro}</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.requiresList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="glass-panel p-8">
          <h3 className="text-xl font-semibold text-ink">{page.beyondTitle}</h3>
          <p className="mt-3 text-slate-700">{page.beyondBody}</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">{page.protectionTitle}</h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            {page.protectionList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {page.whoTitle}
          </h4>
          <p className="mt-3 text-slate-700">{page.whoBody}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {page.closingTitle}
          </h4>
          <p className="mt-3 text-slate-700">{page.closingBody}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Integration
          </h4>
          <p className="mt-3 text-slate-700">{page.integration}</p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-semibold text-ink">{page.ctaTitle}</h3>
          <p className="mt-2 text-slate-700">{page.ctaBody}</p>
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

export default RiskContinuityPage
