function AboutPage() {
  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          About
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          The Builder — Strategic Advisory Practice
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Founded and led by Christine Manopo, The Builder helps leaders design
          organizations that endure growth pressure, leadership transition, and
          human disruption. The practice integrates organization design,
          leadership architecture, and continuity thinking to reduce dependency
          on individuals and strengthen long-term resilience.
        </p>
        <p className="mt-3 text-slate-700">
          Engagements are intentionally selective and advisory-led. The work is
          calm, text-led, and focused on clarity over theatrics.
        </p>
      </section>

      <section className="glass-panel px-8 py-8">
        <h3 className="text-lg font-semibold text-ink">How this shows up</h3>
        <ul className="mt-3 grid gap-3 text-slate-700 md:grid-cols-2">
          <li>Independent perspective focused on system-level decisions</li>
          <li>Confidential, discreet advisory for senior leadership</li>
          <li>Integration across structure, leadership, and continuity</li>
          <li>Commitment to depth over volume — fewer clients, greater rigor</li>
        </ul>
      </section>
    </div>
  )
}

export default AboutPage
