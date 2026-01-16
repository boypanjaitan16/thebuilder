import { useI18n } from '../i18n/I18nProvider'

function AboutPage() {
  const { copy } = useI18n()
  const page = copy.about

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.body1}</p>
        <p className="mt-3 text-slate-700">{page.body2}</p>
      </section>

      <section className="glass-panel px-8 py-8">
        <h3 className="text-lg font-semibold text-ink">{page.showTitle}</h3>
        <ul className="mt-3 grid gap-3 text-slate-700 md:grid-cols-2">
          {page.showList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default AboutPage
