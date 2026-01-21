import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function RiskReadinessDiagnosticPage() {
  const navigate = useNavigate()
  const { copy } = useI18n()
  const page = copy.riskReadiness

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Risk Readiness Diagnostic</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.heroTitle}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.heroBody}</p>
      </section>

      <section className="glass-panel px-8 py-6">
        <h2 className="text-xl font-semibold text-ink">{page.beforeTitle}</h2>
        <p className="mt-2 text-slate-700">{page.beforeBody}</p>
      </section>

      <section className="flex flex-col gap-6">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">{page.designedForTitle}</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.designedForList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-white/60 px-4 py-3 text-sm text-slate-700">
            {page.designedForNote}
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">{page.helpsTitle}</h2>
          <p className="mt-2 text-slate-700">{page.helpsIntro}</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.helpsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">{page.helpsNote}</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h3 className="text-lg font-semibold text-ink">{page.isTitle}</h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            {page.isList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">{page.isNotTitle}</h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            {page.isNotList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">{page.whyTitle}</h3>
          <p className="mt-3 text-slate-700">{page.whyIntro}</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {page.whyList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="glass-panel p-8">
          <h3 className="text-lg font-semibold text-ink">{page.receiveTitle}</h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            {page.receiveList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">{page.receiveNote}</p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-semibold text-ink">What happens after the diagnostic</h3>
          <p className="mt-2 text-slate-700">{page.afterBody}</p>
          <p className="mt-2 text-sm text-yellow-600 font-semibold">{page.limitedNote}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/diagnostic')}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            {page.primaryCta}
          </button>
        </div>
      </section>
    </div>
  )
}

export default RiskReadinessDiagnosticPage
