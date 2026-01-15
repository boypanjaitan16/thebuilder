import { useNavigate } from 'react-router-dom'

function WorkWithMePage() {
  const navigate = useNavigate()

  const fitBullets = [
    'Are a CEO, founder, board member, or senior leader',
    'Are facing growth, transition, or leadership risk',
    'Want clarity before committing to large initiatives',
    'Are willing to address systemic issues, not surface symptoms',
    'Value thoughtful, independent advisory input',
  ]

  const notFitBullets = [
    'Looking for packaged training programs',
    'Needing immediate operational support',
    'Expecting hands-on execution or facilitation',
    'Primarily price-driven rather than outcome-driven',
  ]

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Work With Me
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Working Together
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          This work is designed for leaders and organizations seeking clarity at
          a system level, not additional execution support. Engagements are
          advisory in nature — focused on diagnosing systemic risk, redesigning
          structures, and enabling high-impact decisions with long-term
          consequences.
        </p>
        <p className="mt-3 text-slate-700">
          This is not operational consulting, project execution, or training
          delivery.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">
            How engagements typically work
          </h2>
          <ol className="mt-4 space-y-3 text-slate-700">
            <li>
              <span className="font-semibold text-ink">Initial alignment</span>{' '}
              — a short conversation to understand context, leadership
              challenges, and strategic intent.
            </li>
            <li>
              <span className="font-semibold text-ink">System diagnosis</span> —
              identifying structural risks related to continuity, decision flow,
              talent dependency, or organizational resilience.
            </li>
            <li>
              <span className="font-semibold text-ink">
                Architecture & advisory design
              </span>{' '}
              — clarifying options, trade-offs, and decisions required to
              strengthen the organization.
            </li>
            <li>
              <span className="font-semibold text-ink">
                Executive decision session(s)
              </span>{' '}
              — supporting senior leaders in making informed decisions, not
              managing implementation.
            </li>
          </ol>
          <p className="mt-4 text-sm text-slate-600">
            Implementation and operational follow-through are handled internally
            by the organization or trusted partners.
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
                <li>Strategic diagnosis and system analysis</li>
                <li>Organizational and leadership architecture design</li>
                <li>Executive-level advisory and decision support</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                This work does not include
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>Day-to-day HR operations</li>
                <li>Ongoing training delivery or facilitation</li>
                <li>Project management or execution</li>
                <li>Individual coaching programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            This work is a good fit if you…
          </h4>
          <ul className="mt-4 space-y-2 text-slate-700">
            {fitBullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            This work may not be a fit if you…
          </h4>
          <ul className="mt-4 space-y-2 text-slate-700">
            {notFitBullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[24px] border border-sand bg-white px-8 py-8 shadow-soft">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-ink">
              Capacity & investment
            </h3>
            <p className="mt-3 text-slate-700">
              Engagements are limited each year to maintain depth and focus.
              Most advisory work is designed for organizations ready to make a
              meaningful investment in strategic system design. Fees are
              typically structured from USD 10,000, depending on scope and
              context.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-mist px-5 py-5 text-sm text-slate-600">
            <p className="font-semibold text-ink">
              The application step (conversion gate)
            </p>
            <p>
              If the context aligns, you may request an initial advisory
              conversation. Due to limited capacity, not all applications can be
              accommodated.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Primary CTA
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
            Request an Advisory Conversation
          </h3>
          <p className="mt-2 text-slate-700">
            If your organization is navigating complexity, transition, or risk
            at a leadership level, an advisory conversation may be a useful
            place to begin.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/apply')}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          Apply to Work Together
        </button>
      </section>
    </div>
  )
}

export default WorkWithMePage
