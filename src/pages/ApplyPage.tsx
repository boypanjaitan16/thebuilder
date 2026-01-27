import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectBox } from "../components/forms/SelectBox";
import { TextInput } from "../components/forms/TextInput";
import { useI18n } from "../i18n/I18nProvider";
import {
	type ApplyFormValues,
	type ApplyFormValuesInput,
	applySchema,
} from "../schemas/applySchema";

function ApplyPage() {
	const { copy, language } = useI18n();
	const text = copy.apply;
	const [submitted, setSubmitted] = useState<ApplyFormValues | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<ApplyFormValuesInput, undefined, ApplyFormValues>({
		resolver: zodResolver(applySchema),
		defaultValues: {
			name: "",
			role: "",
			organization: "",
			size: "",
			industry: "",
			situation: [],
			description: "",
			expectation: "",
			decisionFlow: "",
			readiness: "",
			timeline: "",
		},
	});

	const selectedSituations = watch("situation") ?? [];
	const maxSituationReached = selectedSituations.length >= 2;

	const situationOptions = useMemo(
		() => text.form.situationOptions.map((label) => ({ label, value: label })),
		[text.form.situationOptions],
	);

	const onSubmit = (values: ApplyFormValues) => {
		setSubmitted(values);
	};

	const errorColor = "text-red-600";

	return (
		<div className="container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					Apply
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{text.heroTitle}
				</h1>
				<p className="mt-3">{text.intro1}</p>
				<p className="mt-3">{text.intro2}</p>
			</section>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="glass-panel flex flex-col gap-8 px-6 py-8 md:px-10"
			>
				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold font-display uppercase text-slate-500">
						{text.sections.basic}
					</h3>
					<p className="text-sm text-slate-600">{text.contextNote}</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<TextInput
						label={text.form.name}
						errorMessage={errors.name?.message}
						inputProps={{
							type: "text",
							...register("name"),
						}}
					/>
					<TextInput
						label={text.form.role}
						errorMessage={errors.role?.message}
						inputProps={{
							type: "text",
							placeholder: "e.g. CEO, Founder, Director, CHRO",
							...register("role"),
						}}
					/>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<TextInput
						label={text.form.organization}
						errorMessage={errors.organization?.message}
						inputProps={{
							type: "text",
							...register("organization"),
						}}
					/>
					<SelectBox
						label={text.form.size}
						placeholder={language === "en" ? "Select range" : "Pilih rentang"}
						options={text.form.sizeOptions.map((option) => ({
							label: option,
							value: option,
						}))}
						errorMessage={errors.size?.message}
						selectProps={{
							defaultValue: "",
							...register("size"),
						}}
					/>
				</div>
				<TextInput
					label={text.form.industry}
					errorMessage={errors.industry?.message}
					inputProps={{
						type: "text",
						...register("industry"),
					}}
				/>

				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold font-display uppercase text-slate-500">
						{text.sections.context}
					</h3>
					<p className="text-sm text-slate-600">{text.form.situationTitle}</p>
				</div>
				<div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
					<div className="mt-3 grid gap-2 md:grid-cols-2">
						{situationOptions.map(({ label, value }) => {
							const checked = selectedSituations.includes(value);
							return (
								<label
									key={value}
									className={classNames(
										"flex min-w-0 items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm transition",
										checked ? "border-ink bg-mist" : "border-sand bg-white",
										!checked && maxSituationReached
											? "opacity-60"
											: "opacity-100",
									)}
								>
									<input
										type="checkbox"
										className="mt-1 accent-ink"
										checked={checked}
										onChange={(event) => {
											const isChecked = event.target.checked;
											const current = selectedSituations || [];
											if (isChecked) {
												if (current.length >= 2) return;
												setValue("situation", [...current, value]);
											} else {
												setValue(
													"situation",
													current.filter((item) => item !== value),
												);
											}
										}}
									/>
									<span className="flex-1 break-words">{label}</span>
								</label>
							);
						})}
					</div>
					{errors.situation && (
						<p className={errorColor}>{errors.situation.message}</p>
					)}
					<label className="mt-4 flex flex-col gap-2 text-sm font-medium text-ink">
						{text.form.description}
						<textarea
							rows={4}
							className="rounded-xl border border-sand bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
							{...register("description")}
						/>
					</label>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<SelectBox
						label={text.form.expectation}
						placeholder={language === "en" ? "Select an option" : "Pilih opsi"}
						options={text.form.expectationOptions.map((option) => ({
							label: option,
							value: option,
						}))}
						errorMessage={errors.expectation?.message}
						selectProps={{
							defaultValue: "",
							...register("expectation"),
						}}
					/>
					<TextInput
						label={text.form.decisionFlow}
						errorMessage={errors.decisionFlow?.message}
						inputProps={{
							type: "text",
							placeholder:
								"e.g. leadership team discussion, founder-led, board-driven",
							...register("decisionFlow"),
						}}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold font-display uppercase text-slate-500">
						{text.sections.readiness}
					</h3>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<div
						className={classNames(
							"rounded-2xl border bg-white px-5 py-5 shadow-sm",
							errors.readiness?.message ? "border-red-600" : "border-sand",
						)}
					>
						<p className="text-sm font-semibold text-ink">
							{text.form.readinessTitle}
						</p>
						<div className="mt-3 space-y-2">
							{text.form.readinessOptions.map((option) => (
								<label
									key={option}
									className="flex min-w-0 items-start gap-3 rounded-xl border border-sand px-4 py-3 text-sm shadow-sm"
								>
									<input
										type="radio"
										value={option}
										className="mt-1 accent-ink"
										{...register("readiness")}
									/>
									<span className="flex-1 break-words">{option}</span>
								</label>
							))}
						</div>
						{errors.readiness && (
							<p className={errorColor}>{errors.readiness.message}</p>
						)}
					</div>
					<div
						className={classNames(
							"rounded-2xl border bg-white px-5 py-5 shadow-sm",
							errors.timeline?.message ? "border-red-600" : "border-sand",
						)}
					>
						<p className="text-sm font-semibold text-ink">
							{text.form.timelineTitle}
						</p>
						<div className="mt-3 space-y-2">
							{text.form.timelineOptions.map((option) => (
								<label
									key={option}
									className="flex min-w-0 items-start gap-3 rounded-xl border border-sand px-4 py-3 text-sm shadow-sm"
								>
									<input
										type="radio"
										value={option}
										className="mt-1 accent-ink"
										{...register("timeline")}
									/>
									<span className="flex-1 break-words">{option}</span>
								</label>
							))}
						</div>
						{errors.timeline && (
							<p className={errorColor}>{errors.timeline.message}</p>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
					<p className="text-sm text-slate-700">{text.sections.closing}</p>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{text.form.submit}
				</button>

				{submitted && (
					<div className="rounded-2xl border border-ink bg-mist px-5 py-4 text-sm text-ink">
						<p className="font-semibold">{text.form.successTitle}</p>
						<p className="mt-1">{text.form.successBody}</p>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>
								{submitted.name} — {submitted.role} at {submitted.organization}{" "}
								({submitted.size})
							</li>
							{submitted.readiness && <li>{submitted.readiness}</li>}
							{submitted.timeline && <li>{submitted.timeline}</li>}
						</ul>
					</div>
				)}
			</form>
		</div>
	);
}

export default ApplyPage;
