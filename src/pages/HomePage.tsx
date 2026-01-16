import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

function HomePage() {
  const navigate = useNavigate()
  const { copy } = useI18n()
  const { home, shared } = copy

  const scrollToAreas = () => {
    const element = document.getElementById('areas-of-focus')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="container-page flex flex-col gap-16">
      <section className="mt-4 grid gap-10 rounded-[26px] bg-gradient-to-br from-white via-white to-mist px-6 py-10 shadow-soft md:grid-cols-2 md:items-center md:gap-14 md:px-10">
        <div className="flex flex-col gap-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            The Builder — Homepage
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            {home.hero.title}
          </h1>
          <p className="text-lg text-slate-700">
            {home.hero.subtitle}
          </p>
          <p className="text-slate-600">
            {home.hero.body1}
          </p>
          <p className="text-slate-600">{home.hero.body2}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToAreas}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              {home.hero.ctaPrimary}
            </button>
            <button
              type="button"
              onClick={() => navigate('/architecture')}
              className="rounded-full border border-sand px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-white"
            >
              {home.hero.ctaSecondary}
            </button>
          </div>
        </div>
        <div className="glass-panel relative overflow-hidden px-6 py-6">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-sand/60 blur-2xl" />
          <div className="absolute -bottom-10 right-0 h-36 w-36 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 text-sm text-slate-700">
            {home.hero.points.map((point, index) => (
              <div key={point} className="flex items-start gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      index === 0 ? '#0ea5e9' : index === 1 ? '#0f172a' : '#475569',
                  }}
                />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="areas-of-focus"
        className="flex flex-col gap-6 rounded-[26px] bg-white px-6 py-10 shadow-soft md:px-10"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Areas of Focus
            </p>
            <h2 className="font-display text-3xl font-semibold text-ink">
              {home.areas.title}
            </h2>
            <p className="mt-2 max-w-2xl text-slate-700">
              {home.areas.description}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-2 underline-offset-4"
            onClick={() => navigate('/architecture')}
          >
            {home.areas.linkLabel}
            <span aria-hidden>↗</span>
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {shared.areasOfFocus.map((area) => (
            <div
              key={area.slug}
              className="group flex h-full flex-col justify-between rounded-2xl border border-sand bg-gradient-to-br from-white via-white to-mist px-6 py-6 transition hover:-translate-y-1 hover:border-ink hover:shadow-soft"
            >
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {area.slug.replaceAll('-', ' ')}
                </p>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {area.title}
                </h3>
                <p className="text-slate-700">{area.summary}</p>
              </div>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink"
                onClick={() => navigate(area.to)}
              >
                {home.areas.cardCtaPrefix} {area.title.split(' & ')[0]}
                <span className="transition group-hover:translate-x-1">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div className="glass-panel p-8">
          <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Positioning
          </h3>
          <p className="mt-3 font-display text-2xl font-semibold text-ink">
            {home.positioning.title}
          </p>
          <p className="mt-4 text-slate-700">
            {home.positioning.body}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            {home.positioning.founderNote}
          </p>
        </div>
        <div className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {home.approach.title}
          </h3>
          <ul className="mt-4 space-y-3 text-slate-700">
            {home.approach.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            {home.approach.notThis}
          </p>
        </div>
      </section>

      <section className="grid gap-6 rounded-[26px] border border-sand bg-white px-6 py-10 shadow-soft md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500">
            How We Work
          </h3>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
            {home.howWeWork.title}
          </h2>
          <p className="mt-3 text-slate-700">
            {home.howWeWork.description}
          </p>
          <p className="mt-3 text-sm text-slate-600">
            {home.howWeWork.note}
          </p>
        </div>
        <div className="rounded-2xl bg-mist px-6 py-6">
          <h4 className="text-sm font-semibold text-ink">
            {home.insights.title}
          </h4>
          <p className="mt-2 text-sm text-slate-600">
            {home.insights.description}
          </p>
          <div className="mt-4 space-y-3">
            {shared.insightArticles.slice(0, 3).map((article) => (
              <div
                key={article.title}
                className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm"
              >
                <p className="font-semibold text-ink">{article.title}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {article.lens}
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/insights')}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink"
          >
            {home.insights.viewAll} <span aria-hidden>→</span>
          </button>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Primary Invitation
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
            {home.cta.title}
          </h3>
          <p className="mt-2 text-slate-700">
            {home.cta.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/apply')}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          {home.cta.button}
        </button>
      </section>
    </div>
  )
}

export default HomePage
