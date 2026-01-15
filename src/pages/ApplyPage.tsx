import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import classNames from 'classnames'

const situationOptions = [
  'Leadership transition or succession concerns',
  'Rapid growth or structural strain',
  'Dependency on key individuals',
  'Talent pipeline or leadership readiness gaps',
  'Organizational misalignment or decision bottlenecks',
  'Other (please specify)',
]

const sizeOptions = [
  'Under 50 employees',
  '50–200 employees',
  '200–1,000 employees',
  '1,000+ employees',
]

const readinessOptions = [
  'We are aware of this range and comfortable exploring fit',
  'We may need further internal discussion before committing',
  'This is likely outside our current scope',
]

const timelineOptions = [
  'Within the next 2–4 weeks',
  'Within the next 1–3 months',
  'Exploring only, no immediate timeline',
]

const formSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  role: z.string().min(1, 'Role / title is required'),
  organization: z.string().min(1, 'Organization name is required'),
  size: z.string().min(1, 'Organization size is required'),
  industry: z.string().optional(),
  situation: z.array(z.string()).max(2, 'Select up to two').optional(),
  situationDetail: z.string().optional(),
  description: z.string().optional(),
  expectation: z.string().optional(),
  decisionFlow: z.string().optional(),
  readiness: z.string().min(1, 'Please share your readiness'),
  timeline: z.string().min(1, 'Please choose a timeline'),
})

type FormValues = z.infer<typeof formSchema>

function ApplyPage() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      organization: '',
      size: '',
      industry: '',
      situation: [],
      situationDetail: '',
      description: '',
      expectation: '',
      decisionFlow: '',
      readiness: '',
      timeline: '',
    },
  })

  const selectedSituations = watch('situation') ?? []
  const maxSituationReached = selectedSituations.length >= 2

  const groupedSituations = useMemo(() => {
    return situationOptions.map((label) => ({
      label,
      value: label,
    }))
  }, [])

  const onSubmit = (values: FormValues) => {
    setSubmitted(values)
  }

  return (
    <div className="container-page flex flex-col gap-10">
      <section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Apply
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Request an Advisory Conversation
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          This application ensures clarity and alignment before any advisory
          engagement begins. The purpose of the initial conversation is not to
          sell a service, but to understand whether your context, leadership
          challenge, and expectations align with the nature of this work.
        </p>
        <p className="mt-3 text-slate-700">
          This work is advisory and system-focused. It is designed for
          organizations seeking clarity at a leadership and structural level —
          not for operational execution or training delivery.
        </p>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-panel flex flex-col gap-8 px-6 py-8 md:px-10"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            A. Basic information
          </h3>
          <p className="text-sm text-slate-600">
            Required to ensure the conversation is focused and relevant.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Full Name
            <input
              type="text"
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-sm text-amber-700">
                {errors.name.message}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Role / Title
            <input
              type="text"
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              placeholder="e.g. CEO, Founder, Director, CHRO"
              {...register('role')}
            />
            {errors.role && (
              <span className="text-sm text-amber-700">
                {errors.role.message}
              </span>
            )}
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Organization Name
            <input
              type="text"
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              {...register('organization')}
            />
            {errors.organization && (
              <span className="text-sm text-amber-700">
                {errors.organization.message}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Organization Size
            <select
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              defaultValue=""
              {...register('size')}
            >
              <option value="" disabled>
                Select range
              </option>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.size && (
              <span className="text-sm text-amber-700">
                {errors.size.message}
              </span>
            )}
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Industry / Sector
          <input
            type="text"
            className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            {...register('industry')}
          />
        </label>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            B. Context & challenge
          </h3>
          <p className="text-sm text-slate-600">
            Optional, but helps surface mindset and intent.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Which of the following best describes your current situation? (Select
            up to 2)
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {groupedSituations.map(({ label, value }) => {
              const checked = selectedSituations.includes(value)
              return (
                <label
                  key={value}
                  className={classNames(
                    'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm transition',
                    checked ? 'border-ink bg-mist' : 'border-sand bg-white',
                    !checked && maxSituationReached
                      ? 'opacity-60'
                      : 'opacity-100',
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-ink"
                    checked={checked}
                    onChange={(event) => {
                      const isChecked = event.target.checked
                      const current = selectedSituations || []
                      if (isChecked) {
                        if (current.length >= 2) return
                        setValue('situation', [...current, value])
                      } else {
                        setValue(
                          'situation',
                          current.filter((item) => item !== value),
                        )
                      }
                    }}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
          </div>
          {errors.situation && (
            <p className="mt-2 text-sm text-amber-700">
              {errors.situation.message}
            </p>
          )}
          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-ink">
            Briefly describe the situation or challenge you are facing.
            <textarea
              rows={4}
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              {...register('description')}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            C. System-level readiness
          </h3>
          <p className="text-sm text-slate-600">
            Helps align expectations for the advisory conversation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Which statement best reflects your expectation?
            <select
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              defaultValue=""
              {...register('expectation')}
            >
              <option value="">Select an option</option>
              <option value="Clarity before major decisions">
                We want clarity before making major decisions
              </option>
              <option value="External perspective on systemic risk">
                We want an external perspective on systemic risk
              </option>
              <option value="Validation or challenge">
                We want validation or challenge to our current thinking
              </option>
              <option value="Looking for execution">
                We are looking for someone to help execute solutions
              </option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            How do you typically make strategic decisions?
            <input
              type="text"
              placeholder="e.g. leadership team discussion, founder-led, board-driven"
              className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              {...register('decisionFlow')}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            D. Investment & commitment readiness
          </h3>
          <p className="text-sm text-slate-600">
            Required to ensure the conversation respects both sides&apos; time.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
            <p className="text-sm font-semibold text-ink">
              Advisory engagements generally start from USD 10,000. Which
              statement best reflects your readiness?
            </p>
            <div className="mt-3 space-y-2">
              {readinessOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-start gap-3 rounded-xl border border-sand px-4 py-3 text-sm shadow-sm"
                >
                  <input
                    type="radio"
                    value={option}
                    className="mt-1 accent-ink"
                    {...register('readiness')}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.readiness && (
              <p className="mt-2 text-sm text-amber-700">
                {errors.readiness.message}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
            <p className="text-sm font-semibold text-ink">
              What timeline are you considering for this conversation?
            </p>
            <div className="mt-3 space-y-2">
              {timelineOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-start gap-3 rounded-xl border border-sand px-4 py-3 text-sm shadow-sm"
                >
                  <input
                    type="radio"
                    value={option}
                    className="mt-1 accent-ink"
                    {...register('timeline')}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.timeline && (
              <p className="mt-2 text-sm text-amber-700">
                {errors.timeline.message}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
          <p className="text-sm text-slate-700">
            Thank you for providing this context. Applications are reviewed
            carefully to ensure alignment and respect for both parties’ time. If
            there is a potential fit, you will be contacted to schedule an
            initial advisory conversation.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Submit Application
        </button>

        {submitted && (
          <div className="rounded-2xl border border-ink bg-mist px-5 py-4 text-sm text-ink">
            <p className="font-semibold">Your application has been received.</p>
            <p className="mt-1">
              We will be in touch if there is alignment. Summary:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {submitted.name} — {submitted.role} at {submitted.organization} (
                {submitted.size})
              </li>
              {submitted.readiness && <li>{submitted.readiness}</li>}
              {submitted.timeline && <li>Timeline: {submitted.timeline}</li>}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}

export default ApplyPage
