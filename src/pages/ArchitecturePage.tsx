import { areasOfFocus } from '../data/content'

function ArchitecturePage() {
  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Our Integrated Architecture
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          How we work across these domains
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          The Builder operates as a single advisory system. Each domain addresses
          a different layer of fragility, but the work is designed to converge —
          ensuring decisions made in one area strengthen the others.
        </p>
      </section>

      <section className="glass-panel px-8 py-8">
        <h3 className="text-lg font-semibold text-ink">Principles</h3>
        <ul className="mt-3 space-y-2 text-slate-700">
          <li>Start with structure before adding programs or initiatives.</li>
          <li>Design for continuity and recovery, not just steady-state.</li>
          <li>Align leadership architecture with the organization&apos;s future
            reality, not past success.</li>
          <li>Reduce dependency on individuals by clarifying decision flow and
            accountability.</li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {areasOfFocus.map((area) => (
          <div
            key={area.slug}
            className="rounded-2xl border border-sand bg-white px-6 py-6 shadow-soft"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {area.slug.replaceAll('-', ' ')}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ink">
              {area.title}
            </h3>
            <p className="mt-2 text-slate-700">{area.summary}</p>
            <p className="mt-4 text-sm text-slate-600">
              Engagements are sequenced so that transformation design, leadership
              pipelines, and continuity safeguards reinforce each other rather
              than compete for attention.
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default ArchitecturePage
