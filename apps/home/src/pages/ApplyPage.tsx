import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import classNames from "classnames";
import {
	CircleCheck,
	LoaderCircle,
	ScanSearch,
	Send,
	UserRound,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectBox } from "../components/forms/SelectBox";
import { TextInput } from "../components/forms/TextInput";
import { Notice } from "../components/Notice";
import { useCreateAdvisoryRequest } from "../hooks/useCreateAdvisoryRequest";
import {
	type ApplyFormValues,
	type ApplyFormValuesInput,
	applySchema,
} from "../schemas/applySchema";

const MAX_SITUATIONS = 2;

const toOptions = (values: string[]) =>
	values.map((value) => ({ label: value, value }));

function ApplyPage() {
	const { copy, language } = useI18n();
	const text = copy.apply;
	const [submitted, setSubmitted] = useState<ApplyFormValues | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const { createAdvisoryRequest } = useCreateAdvisoryRequest();
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ApplyFormValuesInput, undefined, ApplyFormValues>({
		resolver: zodResolver(applySchema),
		defaultValues: {
			name: "",
			email: "",
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

	const onSubmit = async (values: ApplyFormValues) => {
		setSubmitError(null);
		try {
			await createAdvisoryRequest(values);
			setSubmitted(values);
			reset();
		} catch (err) {
			setSubmitError(
				toErrorMessage(err, "Something went wrong. Please try again."),
			);
		}
	};

	const errorColor = "text-red-600";

	return (
		<div className="blueprint-page blueprint-page--apply container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{text.heroTitle}
				</h1>
				<p className="mt-3">{text.intro1}</p>
				<p className="mt-3">{text.intro2}</p>
			</section>

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="glass-panel flex flex-col gap-8 px-6 py-8 md:px-10"
			>
				<div className="flex flex-col gap-1">
					<h3 className="blueprint-form-heading font-semibold uppercase text-slate-500">
						<UserRound size={20} strokeWidth={1.5} aria-hidden="true" />
						{text.sections.basic}
					</h3>
					<p className="text-sm text-slate-600">{text.contextNote}</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<TextInput
						label={text.form.name}
						errorMessage={errors.name?.message}
						inputProps={{ type: "text", ...register("name") }}
					/>
					<TextInput
						label={text.form.email}
						errorMessage={errors.email?.message}
						inputProps={{ type: "email", ...register("email") }}
					/>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<TextInput
						label={text.form.role}
						errorMessage={errors.role?.message}
						inputProps={{
							type: "text",
							placeholder: "e.g. CEO, Founder, Director, CHRO",
							...register("role"),
						}}
					/>
					<TextInput
						label={text.form.organization}
						errorMessage={errors.organization?.message}
						inputProps={{ type: "text", ...register("organization") }}
					/>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<SelectBox
						label={text.form.size}
						options={toOptions(text.form.sizeOptions)}
						placeholder={language === "en" ? "Select range" : "Pilih rentang"}
						errorMessage={errors.size?.message}
						selectProps={register("size")}
					/>
					<TextInput
						label={text.form.industry}
						errorMessage={errors.industry?.message}
						inputProps={{ type: "text", ...register("industry") }}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="blueprint-form-heading font-semibold uppercase text-slate-500">
						<ScanSearch size={20} strokeWidth={1.5} aria-hidden="true" />
						{text.sections.context}
					</h3>
					<p className="text-sm text-slate-600">{text.form.situationTitle}</p>
				</div>
				<div>
					<Controller
						name="situation"
						control={control}
						render={({ field }) => {
							const selected = field.value ?? [];
							return (
								<div className="mt-3 grid gap-2 md:grid-cols-2">
									{text.form.situationOptions.map((option) => {
										const checked = selected.includes(option);
										const disabled =
											!checked && selected.length >= MAX_SITUATIONS;
										return (
											<label
												key={option}
												className={classNames(
													"flex items-start gap-2 text-sm text-ink",
													disabled && "cursor-not-allowed opacity-50",
												)}
											>
												<input
													type="checkbox"
													className="mt-1 accent-ink"
													value={option}
													checked={checked}
													disabled={disabled}
													onBlur={field.onBlur}
													onChange={(event) =>
														field.onChange(
															event.target.checked
																? [...selected, option]
																: selected.filter((value) => value !== option),
														)
													}
												/>
												<span>{option}</span>
											</label>
										);
									})}
								</div>
							);
						}}
					/>
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
						options={toOptions(text.form.expectationOptions)}
						placeholder={language === "en" ? "Select an option" : "Pilih opsi"}
						errorMessage={errors.expectation?.message}
						selectProps={register("expectation")}
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
					<h3 className="blueprint-form-heading font-semibold uppercase text-slate-500">
						<CircleCheck size={20} strokeWidth={1.5} aria-hidden="true" />
						{text.sections.readiness}
					</h3>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<fieldset
							className={classNames(
								"rounded-2xl border p-5 shadow-sm",
								errors.readiness?.message ? "border-red-600" : "border-primary",
							)}
						>
							<legend className="sr-only">{text.form.readinessTitle}</legend>
							<p className="text-sm font-semibold text-ink" aria-hidden="true">
								{text.form.readinessTitle}
							</p>
							<div className="mt-3 flex flex-col gap-2">
								{text.form.readinessOptions.map((option) => (
									<label
										key={option}
										className="flex items-start gap-2 text-sm text-ink"
									>
										<input
											type="radio"
											className="mt-1 accent-ink"
											value={option}
											{...register("readiness")}
										/>
										<span>{option}</span>
									</label>
								))}
							</div>
						</fieldset>
						{errors.readiness && (
							<p className={errorColor}>{errors.readiness.message}</p>
						)}
					</div>
					<div>
						<fieldset
							className={classNames(
								"rounded-2xl border p-5 shadow-sm",
								errors.timeline?.message ? "border-red-600" : "border-primary",
							)}
						>
							<legend className="sr-only">{text.form.timelineTitle}</legend>
							<p className="text-sm font-semibold text-ink" aria-hidden="true">
								{text.form.timelineTitle}
							</p>
							<div className="mt-3 flex flex-col gap-2">
								{text.form.timelineOptions.map((option) => (
									<label
										key={option}
										className="flex items-start gap-2 text-sm text-ink"
									>
										<input
											type="radio"
											className="mt-1 accent-ink"
											value={option}
											{...register("timeline")}
										/>
										<span>{option}</span>
									</label>
								))}
							</div>
						</fieldset>
						{errors.timeline && (
							<p className={errorColor}>{errors.timeline.message}</p>
						)}
					</div>
				</div>

				{submitError && <Notice type="error" title={submitError} />}

				{submitted && (
					<Notice
						type="success"
						title={`${text.form.successTitle} ${text.form.successBody}`}
					/>
				)}

				<button
					type="submit"
					disabled={isSubmitting}
					className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-[#102a35] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{isSubmitting ? (
						<LoaderCircle
							size={16}
							className="animate-spin"
							aria-hidden="true"
						/>
					) : (
						<Send size={16} aria-hidden="true" />
					)}
					{text.form.submit}
				</button>
			</form>
		</div>
	);
}

export default ApplyPage;
