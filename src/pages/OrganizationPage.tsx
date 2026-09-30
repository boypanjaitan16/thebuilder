import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function OrganizationPage() {
	const { copy } = useI18n();
	const { organization: org, brand } = copy;

	return (
		<div className="blueprint-page container-page flex flex-col gap-12">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{brand.organization.title}
				</h1>
				<p className="mt-3 text-lg text-slate-700">{org.heroBody}</p>
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-3xl font-semibold text-ink">
					{org.coreProblemTitle}
				</h2>
				<p>{org.coreProblemIntro}</p>
				<ul>
					{org.coreProblemBullets.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
				<p className="font-semibold">{org.coreProblemNote}</p>
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-3xl font-semibold text-ink">
					{org.resilienceTitle}
				</h2>
				<p>{org.resilienceIntro}</p>
				<ul>
					{org.resilienceList.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
				<p className="font-semibold">{org.resilienceNote}</p>
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-3xl font-semibold text-ink">
					{org.approachTitle}
				</h2>
				<p>{org.approachBody1}</p>
				<p>{org.approachBody2}</p>
				<p>{org.approachBody3}</p>
				<ul>
					{org.approachList.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
				<p className="font-semibold">{org.approachNote1}.</p>
				<p>{org.approachNote2}</p>
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-3xl font-semibold text-ink">
					{org.scopeTitle}
				</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<div className="rounded-2xl border border-slate-800 p-8">
						<h3 className="font-display text-2xl font-semibold">
							{org.scopeIncludesNote}
						</h3>
						<ul className="mt-4">
							{org.scopeIncludes.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
					<div className="rounded-2xl border border-slate-800 p-8">
						<h3 className="font-display text-2xl font-semibold">
							{org.scopeExcludesNote}
						</h3>
						<ul className="mt-4">
							{org.scopeExcludes.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="space-y-8">
				<h2 className="font-display text-3xl font-semibold text-ink">
					{brand.organization.fitLabel}
				</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<div className="rounded-2xl border border-slate-800 p-8">
						<h3 className="font-display text-2xl font-semibold">
							{org.relevance}
						</h3>
						<ul className="mt-4">
							{org.relevancePoints.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
					<div className="rounded-2xl border border-slate-800 p-8">
						<h3 className="font-display text-2xl font-semibold">
							{org.designedFor}
						</h3>
						<ul className="mt-4">
							{org.designedForPoints.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="mt-4">{org.designedForNote}</p>
					</div>
				</div>
				<div className="max-w-4xl space-y-4">
					<h3 className="font-display text-2xl font-semibold">
						{org.connectedAreasTitle}
					</h3>
					<p>{org.connectedAreasIntro}</p>
					<ul>
						{org.connectedAreasList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{org.connectedAreasNote}</p>
				</div>
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-3xl font-semibold text-ink">
					{org.ctaTitle}
				</h2>
				<p>{org.ctaBody}</p>
				<Link
					className="inline-flex rounded-full px-6 py-3 text-sm font-semibold"
					to="/apply"
				>
					{org.ctaButton}
					<span className="ml-4" aria-hidden="true">
						↗
					</span>
				</Link>
			</section>
		</div>
	);
}

export default OrganizationPage;
