import { useI18n } from '../i18n/I18nProvider'

function ArchitecturePage() {
  const { copy } = useI18n()
  const page = copy.architecture
  const areas = copy.shared.areasOfFocus

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Our Integrated Architecture
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.body}</p>
      </section>

      <section className="glass-panel px-8 py-8">
        <h3 className="text-lg font-semibold text-ink">{page.principlesTitle}</h3>
        <ul className="mt-3 space-y-2 text-slate-700">
          {page.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {areas.map((area) => (
          <div
            key={area.slug}
            className="rounded-2xl border border-sand bg-white px-6 py-6 shadow-soft"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {area.slug.replaceAll('-', ' ')}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ink">{area.title}</h3>
            <p className="mt-2 text-slate-700">{area.summary}</p>
            <p className="mt-4 text-sm text-slate-600">{page.integrationNote}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default ArchitecturePage
