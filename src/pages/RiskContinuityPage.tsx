import { useNavigate } from 'react-router-dom'

function RiskContinuityPage() {
  const navigate = useNavigate()

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Risk & Business Continuity
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          When business continuity is tested, it is rarely by strategy.
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Most disruptions do not come from failed plans. They come from sudden,
          personal, and unplanned events leaders assume will never happen to
          them. Growth can be designed and processes can be improved — but
          continuity is tested when key people are no longer fully available.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">
            Where continuity quietly breaks
          </h2>
          <p className="mt-3 text-slate-700">
            For many organizations, continuity risk sits in people, not
            documents:
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>One or two individuals hold disproportionate decision authority</li>
            <li>Revenue momentum depends on the presence of specific leaders</li>
            <li>
              Financial commitments continue even when leadership capacity is
              disrupted
            </li>
            <li>No clear buffer exists when recovery takes longer than expected</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            These risks remain invisible — until they are triggered.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">
            What business continuity really requires
          </h2>
          <p className="mt-3 text-slate-700">
            Continuity is tested when key people cannot perform at full
            capacity and recovery takes longer than planned. True continuity
            requires leaders to design for three realities:
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>Leadership availability is not guaranteed.</li>
            <li>Financial obligations do not pause during recovery.</li>
            <li>Recovery timelines are unpredictable.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Without intentional safeguards, temporary situations quickly become
            structural strain.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="glass-panel p-8">
          <h3 className="text-xl font-semibold text-ink">
            Business continuity beyond documents
          </h3>
          <p className="mt-3 text-slate-700">
            This work examines continuity from a realistic leadership
            perspective, not a theoretical one. It explores which roles impact
            stability, the financial pressure of prolonged recovery, how long
            the business can operate without key leadership presence, and where
            assumptions replace safeguards.
          </p>
          <p className="mt-3 text-slate-700">
            The focus is not on fear-based planning, but on removing blind spots
            that compromise continuity.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">
            Protection as leadership responsibility
          </h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li>The business is not financially exposed during recovery.</li>
            <li>Leadership absence does not force rushed decisions.</li>
            <li>Personal disruption does not become organizational crisis.</li>
            <li>Recovery can happen without destabilizing the enterprise.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            When protection is integrated thoughtfully, continuity becomes
            calmer, clearer, and more controlled — even under pressure.
          </p>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Who this is for
          </h4>
          <p className="mt-3 text-slate-700">
            Organizations that depend on a small number of leaders, face
            increased financial exposure, or value stability beyond quarterly
            results.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Closing positioning
          </h4>
          <p className="mt-3 text-slate-700">
            Continuity is not pessimism. It is leadership maturity. Enduring
            organizations design for resilience while recovery takes place.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Integration
          </h4>
          <p className="mt-3 text-slate-700">
            Integrated with Organization Transformation & Resilience and Future
            Talent Strategy & Leadership Development to address risk at the
            structural, leadership, and financial levels.
          </p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-semibold text-ink">
            Considering this work
          </h3>
          <p className="mt-2 text-slate-700">
            If you are reviewing your approach to continuity, leadership risk,
            or long-term resilience, an advisory conversation may provide
            clarity.
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

export default RiskContinuityPage
