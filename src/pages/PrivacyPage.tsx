function PrivacyPage() {
  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Privacy Policy
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Respecting discretion and confidentiality.
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Advisory work is confidential by design. Information shared through
          this site or during conversations is used solely to assess alignment
          for potential engagements and is never sold or repurposed for
          marketing.
        </p>
        <ul className="mt-4 space-y-2 text-slate-700">
          <li>Only essential details are requested; optional fields remain optional.</li>
          <li>
            Data submitted through forms is reviewed privately and retained only
            as long as necessary to consider fit.
          </li>
          <li>
            If you would like your submission removed, you may request deletion
            at any time.
          </li>
        </ul>
      </section>
    </div>
  )
}

export default PrivacyPage
