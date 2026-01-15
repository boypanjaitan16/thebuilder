import { useNavigate } from 'react-router-dom'
import { caseReflections, insightArticles } from '../data/content'

function InsightsPage() {
  const navigate = useNavigate()

  return (
    <div className="container-page flex flex-col gap-12">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Insights
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          How leaders think about fragility before it breaks.
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Most organizational issues surface quietly — through hesitation in
          decisions, over-reliance on certain people, leadership fatigue, or
          risks that are sensed but not articulated. These reflections help
          leaders see patterns more clearly, especially in moments of growth,
          transition, or increased responsibility.
        </p>
        <p className="mt-4 text-slate-700">
          This is not a content library. It is a curated collection drawn from
          advisory work across leadership, organizational structure, and
          business continuity.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div className="glass-panel p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Featured reflections
          </h2>
          <p className="mt-2 text-slate-700">
            Perspectives exploring how organizations become fragile — and how to
            design for resilience before disruption occurs.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {insightArticles.map((article) => (
              <div
                key={article.title}
                className="rounded-xl border border-sand bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-sm uppercase tracking-wide text-slate-500">
                  {article.lens}
                </p>
                <p className="mt-1 font-semibold text-ink">{article.title}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Themes are intentionally interrelated. In practice, they rarely fail
            in isolation.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Case reflections</h3>
          <p className="mt-2 text-slate-700">
            Situations observed through advisory work. Names, organizations, and
            identifying details are intentionally withheld.
          </p>
          <div className="mt-4 space-y-3">
            {caseReflections.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-mist px-4 py-3 text-sm text-ink"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Each reflection examines tension points and the insight that shifted
            how continuity, leadership, or risk was understood.
          </p>
        </div>
      </section>

      <section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Editorial philosophy
          </h4>
          <p className="mt-3 text-slate-700">
            Insights are published selectively, not frequently. The goal is
            clarity over visibility; pattern recognition over opinion;
            preparedness over prediction. Each reflection is shared only when it
            meaningfully contributes to how leaders think about responsibility,
            risk, and continuity.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Not labeled as a blog or forced into timelines</li>
            <li>No comment sections or social pressure</li>
            <li>Clean typography, minimal visuals</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-sand bg-mist px-6 py-6">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            When these patterns feel familiar
          </h4>
          <p className="mt-3 text-slate-700">
            If the situations described here resonate, they often point to
            structural or leadership risks worth examining more closely.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/diagnostic')}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Explore the Risk Readiness Diagnostic
            </button>
            <button
              type="button"
              onClick={() => navigate('/apply')}
              className="rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              Apply for a Private Advisory Conversation
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InsightsPage
