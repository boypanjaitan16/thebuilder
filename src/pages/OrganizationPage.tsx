import { useNavigate } from 'react-router-dom'

function OrganizationPage() {
  const navigate = useNavigate()

  const bullets = [
    'Decisions slowing down as complexity increases',
    'Leadership gaps during transition or expansion',
    'High dependency on founders, senior leaders, or a few key people',
    'Repeated “reorganization” without sustained improvement',
    'HR initiatives that feel disconnected from real business pressure',
  ]

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Organization Transformation & Resilience
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Designing organizational systems that remain effective under growth,
          leadership change, and disruption.
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Most organizations pursue transformation through new initiatives,
          restructuring, or leadership programs. Yet many still struggle when
          growth accelerates, key leaders leave, or decision pressure increases.
          The issue is rarely effort or intent — it is often the absence of
          intentional system design.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">
            Why transformation often fails to hold
          </h2>
          <p className="mt-3 text-slate-700">
            Organizations become fragile when performance depends too heavily on
            specific individuals rather than on structure.
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {bullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Transformation fails not because people resist change, but because
            systems were never designed to absorb it.
          </p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">
            What we mean by organizational resilience
          </h2>
          <p className="mt-3 text-slate-700">
            Resilience is not about culture slogans, engagement scores, or
            running more programs. It means:
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>Leadership continuity beyond individuals</li>
            <li>Clear decision flow under pressure</li>
            <li>Defined accountability that does not collapse during transition</li>
            <li>Talent systems aligned with future — not past — needs</li>
            <li>Reduced operational and human risk</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            It is the ability to keep performing when conditions are no longer
            ideal.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="glass-panel p-8">
          <h3 className="text-xl font-semibold text-ink">
            How this work helps leaders regain control
          </h3>
          <p className="mt-3 text-slate-700">
            When organizations struggle during growth or transition, the problem
            is rarely a lack of effort. More often, leaders operate in
            structures that no longer support clear decisions, accountability,
            or continuity.
          </p>
          <p className="mt-3 text-slate-700">
            Engagements explore where decisions slow, which roles carry too much
            responsibility, where dependency concentrates, why execution feels
            inconsistent, and what becomes fragile when leaders change. The
            outcome is not another program — it is clear direction and structure
            that reduces dependency and enables decisive action.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">Scope & boundaries</h3>
          <div className="mt-3 grid gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                This work includes
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>Organizational diagnosis and system mapping</li>
                <li>Leadership and role architecture design</li>
                <li>Advisory input on transformation direction</li>
                <li>Risk identification related to people and structure</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                This work does not include
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>Change management execution</li>
                <li>HR operations or implementation</li>
                <li>Training delivery or facilitation</li>
                <li>Ongoing program management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Relevance
          </h4>
          <p className="mt-3 text-slate-700">
            Most relevant when entering a new growth phase, facing leadership
            transition, or when founders and key leaders are critical
            bottlenecks.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Designed for
          </h4>
          <p className="mt-3 text-slate-700">
            CEOs, founders, boards, and senior leadership teams willing to
            address structural issues thoughtfully.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Connection to other areas
          </h4>
          <p className="mt-3 text-slate-700">
            Integrates with Future Talent Strategy & Leadership Development and
            Risk & Business Continuity to reduce structural dependency and
            strengthen continuity.
          </p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-semibold text-ink">
            Considering this work
          </h3>
          <p className="mt-2 text-slate-700">
            If you are navigating complexity, transition, or growth pressure,
            an advisory conversation may clarify the next structural decisions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/apply')}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          Request an Advisory Conversation
        </button>
      </section>
    </div>
  )
}

export default OrganizationPage
