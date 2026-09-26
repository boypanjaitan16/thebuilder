import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Checkbox, Input, Radio, Select } from "antd";
import classNames from "classnames";
import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateAdvisoryRequest } from "../hooks/useCreateAdvisoryRequest";
import { useI18n } from "../i18n/I18nProvider";
import { toErrorMessage } from "../lib/errors";
import {
	type ApplyFormValues,
	type ApplyFormValuesInput,
	applySchema,
} from "../schemas/applySchema";

function ApplyPage() {
	const { copy, language } = useI18n();
	const text = copy.apply;
	const [submitted, setSubmitted] = useState<ApplyFormValues | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const { createAdvisoryRequest } = useCreateAdvisoryRequest();
	const {
		control,
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

	const situationOptions = useMemo(
		() => text.form.situationOptions.map((label) => ({ label, value: label })),
		[text.form.situationOptions],
	);

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
				noValidate
				className="glass-panel flex flex-col gap-8 px-6 py-8 md:px-10"
			>
				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold font-display uppercase text-slate-500">
						{text.sections.basic}
					</h3>
					<p className="text-sm text-slate-600">{text.contextNote}</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="name">{text.form.name}</label>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<Input
									id="name"
									type="text"
									status={errors.name ? "error" : undefined}
									{...field}
								/>
							)}
						/>
						{errors.name && <p className={errorColor}>{errors.name.message}</p>}
					</div>
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="email">{text.form.email}</label>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<Input
									id="email"
									type="email"
									status={errors.email ? "error" : undefined}
									{...field}
								/>
							)}
						/>
						{errors.email && (
							<p className={errorColor}>{errors.email.message}</p>
						)}
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="role">{text.form.role}</label>
						<Controller
							name="role"
							control={control}
							render={({ field }) => (
								<Input
									id="role"
									type="text"
									placeholder="e.g. CEO, Founder, Director, CHRO"
									status={errors.role ? "error" : undefined}
									{...field}
								/>
							)}
						/>
						{errors.role && <p className={errorColor}>{errors.role.message}</p>}
					</div>
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="organization">{text.form.organization}</label>
						<Controller
							name="organization"
							control={control}
							render={({ field }) => (
								<Input
									id="organization"
									type="text"
									status={errors.organization ? "error" : undefined}
									{...field}
								/>
							)}
						/>
						{errors.organization && (
							<p className={errorColor}>{errors.organization.message}</p>
						)}
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="size">{text.form.size}</label>
						<Controller
							name="size"
							control={control}
							render={({ field }) => (
								<Select
									id="size"
									status={errors.size ? "error" : undefined}
									placeholder={
										language === "en" ? "Select range" : "Pilih rentang"
									}
									options={text.form.sizeOptions.map((option) => ({
										label: option,
										value: option,
									}))}
									value={field.value || undefined}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
						{errors.size && <p className={errorColor}>{errors.size.message}</p>}
					</div>
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="industry">{text.form.industry}</label>
						<Controller
							name="industry"
							control={control}
							render={({ field }) => (
								<Input
									id="industry"
									type="text"
									status={errors.industry ? "error" : undefined}
									{...field}
								/>
							)}
						/>
						{errors.industry && (
							<p className={errorColor}>{errors.industry.message}</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold font-display uppercase text-slate-500">
						{text.sections.context}
					</h3>
					<p className="text-sm text-slate-600">{text.form.situationTitle}</p>
				</div>
				<div className="rounded-2xl border border-sand bg-white px-5 py-5 shadow-sm">
					<Controller
						name="situation"
						control={control}
						render={({ field }) => (
							<Checkbox.Group
								className="mt-3 grid gap-2 md:grid-cols-2"
								options={situationOptions}
								value={field.value ?? []}
								onChange={(checked) => {
									if (checked.length <= 2) field.onChange(checked);
								}}
							/>
						)}
					/>
					{errors.situation && (
						<p className={errorColor}>{errors.situation.message}</p>
					)}
					<div className="mt-4 flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="description">{text.form.description}</label>
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<Input.TextArea id="description" rows={4} {...field} />
							)}
						/>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="expectation">{text.form.expectation}</label>
						<Controller
							name="expectation"
							control={control}
							render={({ field }) => (
								<Select
									id="expectation"
									status={errors.expectation ? "error" : undefined}
									placeholder={
										language === "en" ? "Select an option" : "Pilih opsi"
									}
									options={text.form.expectationOptions.map((option) => ({
										label: option,
										value: option,
									}))}
									value={field.value || undefined}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
						{errors.expectation && (
							<p className={errorColor}>{errors.expectation.message}</p>
						)}
					</div>
					<div className="flex flex-col gap-2 text-sm font-medium text-ink">
						<label htmlFor="decisionFlow">{text.form.decisionFlow}</label>
						<Controller
							name="decisionFlow"
							control={control}
							render={({ field }) => (
								<Input
									id="decisionFlow"
									type="text"
									placeholder="e.g. leadership team discussion, founder-led, board-driven"
									status={errors.decisionFlow ? "error" : undefined}
									{...field}
								/>
							)}
						/>
						{errors.decisionFlow && (
							<p className={errorColor}>{errors.decisionFlow.message}</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold font-display uppercase text-slate-500">
						{text.sections.readiness}
					</h3>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<div
							className={classNames(
								"rounded-2xl border bg-white px-5 py-5 shadow-sm",
								errors.readiness?.message ? "border-red-600" : "border-sand",
							)}
						>
							<p className="text-sm font-semibold text-ink">
								{text.form.readinessTitle}
							</p>
							<Controller
								name="readiness"
								control={control}
								render={({ field }) => (
									<Radio.Group {...field} className="mt-3 flex flex-col gap-2">
										{text.form.readinessOptions.map((option) => (
											<Radio key={option} value={option}>
												{option}
											</Radio>
										))}
									</Radio.Group>
								)}
							/>
						</div>
						{errors.readiness && (
							<p className={errorColor}>{errors.readiness.message}</p>
						)}
					</div>
					<div>
						<div
							className={classNames(
								"rounded-2xl border bg-white px-5 py-5 shadow-sm",
								errors.timeline?.message ? "border-red-600" : "border-sand",
							)}
						>
							<p className="text-sm font-semibold text-ink">
								{text.form.timelineTitle}
							</p>
							<Controller
								name="timeline"
								control={control}
								render={({ field }) => (
									<Radio.Group {...field} className="mt-3 flex flex-col gap-2">
										{text.form.timelineOptions.map((option) => (
											<Radio key={option} value={option}>
												{option}
											</Radio>
										))}
									</Radio.Group>
								)}
							/>
						</div>
						{errors.timeline && (
							<p className={errorColor}>{errors.timeline.message}</p>
						)}
					</div>
				</div>

				{submitError && <Alert type="error" showIcon title={submitError} />}

				{submitted && (
					<Alert
						type="success"
						showIcon
						title={`${text.form.successTitle} ${text.form.successBody}`}
					/>
				)}

				<Button
					block
					type="primary"
					shape="round"
					size="large"
					htmlType="submit"
					loading={isSubmitting}
					icon={<Send size={16} />}
				>
					{text.form.submit}
				</Button>
			</form>
		</div>
	);
}

export default ApplyPage;
