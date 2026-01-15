import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { diagnosticQuestions } from '../data/content'

const ratingValues = ['1', '2', '3', '4', '5'] as const

const ratingOptions = [
  { value: '1', label: '1 — Not applicable / Never considered' },
  { value: '2', label: '2 — Partially true, but unclear' },
  { value: '3', label: '3 — Acknowledged, but untested' },
  { value: '4', label: '4 — Considered and reasonably prepared' },
  { value: '5', label: '5 — Intentionally designed and tested' },
]

const ratingSchema = z.enum(ratingValues)
const questionShape: Record<string, typeof ratingSchema> = {}
diagnosticQuestions.forEach((question) => {
  questionShape[question.id] = ratingSchema
})

const diagnosticSchema = z.object({
  ...questionShape,
  reflection: z.string().optional(),
})

type DiagnosticForm = z.infer<typeof diagnosticSchema>

function DiagnosticPage() {
  const [score, setScore] = useState<number | null>(null)
  const [signal, setSignal] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DiagnosticForm>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: diagnosticQuestions.reduce(
      (acc, question) => ({ ...acc, [question.id]: '3' }),
      { reflection: '' } as DiagnosticForm,
    ),
  })

  const grouped = useMemo(() => {
    const bySection: Record<string, typeof diagnosticQuestions> = {}
    diagnosticQuestions.forEach((question) => {
      if (!bySection[question.section]) bySection[question.section] = []
      bySection[question.section].push(question)
    })
    return bySection
  }, [])

  const onSubmit = (values: DiagnosticForm) => {
    const total = diagnosticQuestions.reduce((sum, q) => {
      const value = values[q.id as keyof DiagnosticForm]
      return sum + Number(value ?? 0)
    }, 0)
    setScore(total)
    if (total >= 48) {
      setSignal(
        'High structural readiness — strong alignment for strategic advisory conversations.',
      )
    } else if (total >= 36) {
      setSignal(
        'Moderate risk exposure — identifiable blind spots that benefit from focused or phased advisory work.',
      )
    } else {
      setSignal(
        'High dependency risk — deeper reflection recommended before larger engagements.',
      )
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Risk Readiness Diagnostic
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Before growth is tested, risk is felt quietly.
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Leaders often sense risk through hesitation, dependency, or the quiet
          realization that certain situations would be difficult to absorb. This
          diagnostic examines those signals with clarity before pressure forces
          decisions. It is a structured reflection on leadership, continuity,
          and resilience — not an assessment of people.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-mist px-4 py-3 text-sm text-slate-700">
            Total questions: 12
          </div>
          <div className="rounded-2xl bg-mist px-4 py-3 text-sm text-slate-700">
            Estimated time: 10–12 minutes
          </div>
          <div className="rounded-2xl bg-mist px-4 py-3 text-sm text-slate-700">
            Tone: reflective, not evaluative
          </div>
        </div>
      </section>

      <section className="glass-panel px-6 py-8 md:px-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Who this is for
          </h3>
          <p className="text-slate-700">
            Leaders who carry disproportionate responsibility, sense dependency
            on a few individuals, navigate growth or transition, or want clarity
            before larger engagements.
          </p>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            What you will receive
          </h4>
          <ul className="mt-3 grid gap-2 text-slate-700 md:grid-cols-2">
            <li>A structured diagnostic questionnaire</li>
            <li>A synthesized readiness overview</li>
            <li>Written observations on leadership and continuity patterns</li>
            <li>Signals indicating whether deeper advisory work is warranted</li>
          </ul>
        </div>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-panel flex flex-col gap-8 px-6 py-8 md:px-10"
      >
        {Object.entries(grouped).map(([section, questions]) => (
          <div key={section} className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-ink">{section}</h3>
            </div>
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-sand bg-white px-4 py-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-ink">{question.text}</p>
                  <div className="mt-3 grid gap-2 md:grid-cols-5">
                    {ratingOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 rounded-lg border border-sand px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <input
                          type="radio"
                          value={option.value}
                          className="accent-ink"
                          {...register(question.id as keyof DiagnosticForm)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors[question.id as keyof DiagnosticForm] && (
                    <p className="mt-2 text-sm text-red-600">
                      {
                        errors[question.id as keyof DiagnosticForm]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Optional open reflection
          <textarea
            rows={4}
            className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            placeholder="If one assumption about your readiness turned out to be incorrect, which area would concern you most?"
            {...register('reflection')}
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Begin the Diagnostic
          </button>
          <button
            type="button"
            onClick={() => {
              reset()
              setScore(null)
              setSignal(null)
            }}
            className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
          >
            Reset responses
          </button>
        </div>

        {score !== null && signal && (
          <div className="rounded-2xl border border-ink bg-mist px-5 py-4 text-sm text-ink">
            <p className="font-semibold">
              Score: {score} / 60 — {signal}
            </p>
            <p className="mt-1 text-slate-700">
              This conversation is designed for clarity and alignment, not
              obligation. If you would like to discuss the patterns surfaced
              here, you may continue to a private advisory conversation.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default DiagnosticPage
