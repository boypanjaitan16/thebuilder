import { useI18n } from '../i18n/I18nProvider'

function PrivacyPage() {
  const { copy } = useI18n()
  const page = copy.privacy

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Privacy Policy</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">{page.intro}</p>
        <ul className="mt-4 space-y-2 text-slate-700">
          {page.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default PrivacyPage
