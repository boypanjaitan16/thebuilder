import { useNavigate } from 'react-router-dom'

function FutureTalentPage() {
  const navigate = useNavigate()

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Future Talent Strategy & Leadership Development
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Designing leadership and talent systems aligned with future
          organizational demands — not past success.
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Many organizations invest heavily in leadership development programs.
          Yet when senior leaders leave, growth accelerates, or strategy shifts,
          the same questions resurface: Who is ready to lead next? And are we
          developing the right capabilities — or only reinforcing yesterday’s
          success?
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-ink">
            Why leadership development often disappoints leaders
          </h2>
          <p className="mt-3 text-slate-700">
            Familiar frustrations appear even after significant investment:
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>The same people are always relied on when things get difficult</li>
            <li>“High potentials” hesitate when real pressure hits</li>
            <li>Leadership gaps only become visible when someone leaves</li>
            <li>Programs feel encouraging, but daily behavior does not change</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            The issue is not a lack of training. It is the absence of clarity
            about what leadership is actually needed next.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">
            What leaders usually miss about future talent
          </h2>
          <p className="mt-3 text-slate-700">
            Growth, scale, and complexity demand different kinds of leadership:
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>Decisions affect more people and more money</li>
            <li>Mistakes carry greater consequences</li>
            <li>Coordination replaces individual excellence</li>
            <li>Authority must be shared without losing control</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Without alignment to these realities, organizations feel
            underprepared — even with capable people inside.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="glass-panel p-8">
          <h3 className="text-xl font-semibold text-ink">
            How this work helps leaders reduce leadership risk
          </h3>
          <p className="mt-3 text-slate-700">
            This work moves teams from hope-based development to intentional
            leadership design. Engagements clarify which roles are critical,
            where authority is vague, why potential leaders avoid stepping up,
            and which behaviors the system reinforces.
          </p>
          <p className="mt-3 text-slate-700">
            The outcome is not a list of competencies or training plans. It is
            clear leadership expectations and a more reliable pipeline aligned
            with future reality.
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
                <li>Future leadership role and capability design</li>
                <li>Talent and succession risk analysis</li>
                <li>Leadership pipeline and readiness architecture</li>
                <li>Advisory input on leadership strategy alignment</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                This work does not include
              </p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>Training program delivery</li>
                <li>Coaching packages</li>
                <li>Assessment center execution</li>
                <li>Ongoing talent management operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            When this becomes critical
          </h4>
          <p className="mt-3 text-slate-700">
            Growing faster than leadership capacity, founders who cannot step
            away without disruption, and promotions that feel risky rather than
            confident.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Who this is designed for
          </h4>
          <p className="mt-3 text-slate-700">
            CEOs, founders, boards, CHROs, and senior HR leaders seeking
            long-term leadership continuity.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Connection to resilience
          </h4>
          <p className="mt-3 text-slate-700">
            Integrated with Organization Transformation & Resilience and Risk &
            Business Continuity so leadership continuity is not left to chance.
          </p>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl font-semibold text-ink">
            Considering this work
          </h3>
          <p className="mt-2 text-slate-700">
            If you are questioning whether leadership and talent systems are
            prepared for the future, an advisory conversation may clarify the
            path forward.
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

export default FutureTalentPage
