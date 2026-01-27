import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "../i18n/I18nProvider";
import {
	type DiagnosticFormInput,
	type DiagnosticFormValues,
	diagnosticRatingValues,
	diagnosticSchema,
} from "../schemas/diagnosticSchema";

function DiagnosticPage() {
	const { copy } = useI18n();
	const page = copy.diagnostic;
	const questions = copy.shared.diagnosticQuestions;
	const [score, setScore] = useState<number | null>(null);
	const [signal, setSignal] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<DiagnosticFormInput, undefined, DiagnosticFormValues>({
		resolver: zodResolver(diagnosticSchema),
		defaultValues: questions.reduce(
			(acc, question) => ({ ...acc, [question.id]: "3" }),
			{ reflection: "" } as DiagnosticFormInput,
		),
	});

	const grouped = useMemo(() => {
		const bySection: Record<string, typeof questions> = {};
		questions.forEach((question) => {
			if (!bySection[question.section]) bySection[question.section] = [];
			bySection[question.section].push(question);
		});
		return bySection;
	}, [questions]);

	const onSubmit = (values: DiagnosticFormValues) => {
		const total = questions.reduce(
			(sum, q) => sum + Number(values[q.id as keyof DiagnosticFormValues]),
			0,
		);
		setScore(total);
		if (total >= 48) {
			setSignal(page.scoreCopy.high);
		} else if (total >= 36) {
			setSignal(page.scoreCopy.moderate);
		} else {
			setSignal(page.scoreCopy.low);
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					Risk Readiness Diagnostic
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<p className="mt-3 max-w-3xl text-lg text-slate-700">{page.heroBody}</p>
				<div className="mt-4 grid gap-3 md:grid-cols-3">
					{page.meta.map((item) => (
						<div
							key={item}
							className="rounded-2xl bg-mist px-4 py-3 text-sm text-slate-700"
						>
							{item}
						</div>
					))}
				</div>
			</section>

			<section className="glass-panel px-6 py-8 md:px-10">
				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
						{page.whoTitle}
					</h3>
					<p className="text-slate-700">{page.whoBody}</p>
				</div>
				<div className="mt-6">
					<h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
						{page.receiveTitle}
					</h4>
					<ul className="mt-3 grid gap-2 text-slate-700 md:grid-cols-2">
						{page.receiveList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</section>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="glass-panel flex flex-col gap-8 px-6 py-8 md:px-10"
			>
				{Object.entries(grouped).map(([section, list]) => (
					<div key={section} className="space-y-4">
						<div className="flex flex-col gap-1">
							<h3 className="text-lg font-semibold text-ink">{section}</h3>
						</div>
						<div className="space-y-4">
							{list.map((question) => (
								<div
									key={question.id}
									className="rounded-2xl border border-sand bg-white px-4 py-4 shadow-sm"
								>
									<p className="text-sm font-medium text-ink">
										{question.text}
									</p>
									<div className="mt-3 grid gap-2 md:grid-cols-5">
										{diagnosticRatingValues.map((value) => (
											<label
												key={value}
												className="flex items-center gap-2 rounded-lg border border-sand px-3 py-2 text-xs font-semibold text-slate-700"
											>
												<input
													type="radio"
													value={value}
													className="accent-ink"
													{...register(
														question.id as keyof DiagnosticFormInput,
													)}
												/>
												<span>{value}</span>
											</label>
										))}
									</div>
									{errors[question.id as keyof DiagnosticFormInput] && (
										<p className="mt-2 text-sm text-amber-700">
											{
												errors[question.id as keyof DiagnosticFormInput]
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
					{page.optionalReflection}
					<textarea
						rows={4}
						className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
						{...register("reflection")}
					/>
				</label>

				<div className="flex flex-wrap gap-3">
					<button
						type="submit"
						className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
					>
						{page.primaryCta}
					</button>
					<button
						type="button"
						onClick={() => {
							reset();
							setScore(null);
							setSignal(null);
						}}
						className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
					>
						{page.reset}
					</button>
				</div>

				{score !== null && signal && (
					<div className="rounded-2xl border border-ink bg-mist px-5 py-4 text-sm text-ink">
						<p className="font-semibold">
							Score: {score} / 60 — {signal}
						</p>
						<p className="mt-1 text-slate-700">{page.scoreCopy.note}</p>
					</div>
				)}
			</form>
		</div>
	);
}

export default DiagnosticPage;
