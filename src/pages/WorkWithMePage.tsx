import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function WorkWithMePage() {
	const navigate = useNavigate();
	const { copy } = useI18n();
	const page = copy.work;

	return (
		<div className="container-page flex flex-col gap-12">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<p className="mt-3">{page.heroBody1}</p>
				<p className="mt-3">{page.heroBody2}</p>
			</section>

			<section className="glass-panel p-8 space-y-3">
				<h2 className="text-2xl font-display font-semibold text-ink">
					{page.flowTitle}
				</h2>
				<p>{page.flowIntro}</p>
				<ol className="space-y-2">
					{page.flowSteps.map((step, index) => (
						<li key={step.title}>
							<h3 className="text-lg font-display font-semibold text-ink">
								{index + 1}. {step.title}
							</h3>
							<p className="pl-5">{step.description}</p>
						</li>
					))}
				</ol>
				<p>{page.flowNote}</p>
			</section>

			<section>
				<h2 className="text-2xl font-display font-semibold text-ink">
					{page.scopeTitle}
				</h2>
				<p>{page.scopeIntro}</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
					<div className="bg-white border border-ink rounded-2xl p-8">
						<p>{page.scopeIncludesIntro}</p>
						<ul className="list-disc list-inside pl-5">
							{page.scopeIncludes.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
					<div className="bg-white border border-ink rounded-2xl p-8">
						<p>{page.scopeExcludesIntro}</p>
						<ul className="list-disc list-inside pl-5">
							{page.scopeExcludes.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="flex flex-col md:flex-row gap-6 border border-ink rounded-2xl bg-white">
				<div className="space-y-3 p-8 flex-1">
					<h4 className="font-semibold font-display text-lg uppercase text-ink">
						{page.fitTitle}
					</h4>
					<ul className="list-disc list-inside pl-5">
						{page.fitList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div className="w-[1px] bg-ink" />
				<div className="space-y-3 p-8 flex-1">
					<h4 className="font-semibold font-display text-lg uppercase text-ink">
						{page.notFitTitle}
					</h4>
					<ul className="list-disc list-inside pl-5">
						{page.notFitList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-display font-semibold text-ink">
					{page.capacityTitle}
				</h2>
				<p className="mt-3">{page.capacityBody}</p>
			</section>

			<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
				<div className="grid gap-6 md:grid-cols-3">
					<div className="md:col-span-2 space-y-3">
						<h3 className="text-2xl font-semibold font-display text-ink">
							{page.ctaTitle}
						</h3>
						<p className=" text-slate-700">{page.ctaBody}</p>
						<button
							type="button"
							onClick={() => navigate("/apply")}
							className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
						>
							{page.ctaButton}
						</button>
					</div>
					<div className="flex flex-col gap-2 rounded-2xl bg-mist px-5 py-5 text-sm text-slate-600">
						<p className="font-semibold font-display text-ink">
							{page.ctaTitle}
						</p>
						<p>{page.applicationNote}</p>
					</div>
				</div>
			</section>
		</div>
	);
}

export default WorkWithMePage;
