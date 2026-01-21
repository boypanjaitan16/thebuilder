import { useI18n } from '../i18n/I18nProvider'

function ResourcesFoundationalPage() {
  const { copy } = useI18n()
  const page = copy.resourcesFoundational

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{page.heroSubtitle}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{page.heroTitle}</h1>
        <p className="mt-3 text-lg text-slate-700">{page.heroBody}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-ink">{page.whatInsideTitle}</h3>
        <p className='text-slate-700 mt-2'>{page.topicsBody}</p>
        <ul className="mt-3 list-disc list-inside">
          {page.topicsList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <p>{page.topicsNote}</p>
        <div className='grid grid-cols-2 gap-5 mt-5'>
          {page.learningModel.map((model) => (
            <div key={model.title} className="rounded-2xl bg-white p-6 pb-10 shadow-soft">
              <h4 className='font-semibold text-lg text-center'>{model.title}</h4>
              <div className='flex flex-col gap-3 mt-5'>
                {model.items.map((item) => (
                <div key={item} className='border border-slate-800 p-5 rounded-2xl'>
                  {item}
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ResourcesFoundationalPage
