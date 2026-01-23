import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function OrganizationPage() {
	const navigate = useNavigate();
	const { copy } = useI18n();
	const org = copy.organization;

	return (
		<div className="container-page flex flex-col gap-12">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{org.subtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{org.heroTitle}
				</h1>
				<p className="mt-3 max-w-3xl text-lg text-slate-700">{org.heroBody}</p>
			</section>

			<section className="flex flex-col md:flex-row gap-8 md:gap-0 md:px-5 md:py-8 md:border-t md:border-b border-slate-800">
				<div className="flex-1 space-y-3">
					<h2 className="text-2xl font-semibold text-ink">
						{org.coreProblemTitle}
					</h2>
					<p className="text-slate-700">{org.coreProblemIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{org.coreProblemBullets.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p className="text-slate-600">{org.coreProblemNote}</p>
				</div>
				<div className="w-[1px] bg-slate-800 mx-7 hidden md:block" />
				<div className="flex-1 space-y-3">
					<h2 className="text-2xl font-semibold text-ink">
						{org.resilienceTitle}
					</h2>
					<p className="text-slate-700">{org.resilienceIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{org.resilienceList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p className="text-slate-600">{org.resilienceNote}</p>
				</div>
			</section>

			<section>
				<div className="glass-panel p-8 space-y-3">
					<h3 className="text-2xl font-semibold text-ink">
						{org.approachTitle}
					</h3>
					<p>{org.approachBody1}</p>
					<p>{org.approachBody2}</p>
					<p>{org.approachBody3}</p>
					<ul className="list-disc list-inside pl-5">
						{org.approachList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{org.approachNote1}</p>
					<p>{org.approachNote2}</p>
				</div>
			</section>

			<section>
				<h3 className="text-2xl font-semibold text-ink text-center mb-5">
					{org.scopeTitle}
				</h3>
				<div className="mt-3 gap-4 grid grid-cols-2">
					<div className="flex items-center justify-center">
						<div className="space-y-2">
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 underline underline-offset-4">
								{org.scopeIncludesNote}
							</p>
							<ul className="list-disc list-inside">
								{org.scopeIncludes.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<div className="space-y-2">
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 underline underline-offset-4">
								{org.scopeExcludesNote}
							</p>
							<ul className="list-disc list-inside">
								{org.scopeExcludes.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section className="grid gap-6 rounded-[24px] bg-white px-8 py-8 shadow-soft md:grid-cols-2">
				<div>
					<h4 className="text-2xl font-semibold text-ink">{org.relevance}</h4>
					<ul className="list-disc list-inside mt-5 pl-5">
						{org.relevancePoints.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="text-2xl font-semibold text-ink">{org.designedFor}</h4>
					<ul className="list-disc list-inside mt-5 pl-5">
						{org.designedForPoints.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p className="mt-3 text-slate-700">{org.designedForNote}</p>
				</div>
			</section>

			<section>
				<h3 className="text-2xl font-semibold text-ink mb-5">
					{org.connectedAreasTitle}
				</h3>
				<p>{org.connectedAreasIntro}</p>
				<ul className="list-disc list-inside pl-5">
					{org.connectedAreasList.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
				<p>{org.connectedAreasNote}</p>
			</section>

			<section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
				<div className="max-w-2xl">
					<h3 className="font-display text-2xl font-semibold text-ink">
						{org.ctaTitle}
					</h3>
					<p className="mt-2 text-slate-700">{org.ctaBody}</p>
				</div>
				<button
					type="button"
					onClick={() => navigate("/apply")}
					className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
				>
					{org.ctaButton}
				</button>
			</section>
		</div>
	);
}

export default OrganizationPage;
