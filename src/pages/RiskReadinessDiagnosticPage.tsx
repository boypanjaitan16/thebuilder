import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function RiskReadinessDiagnosticPage() {
	const navigate = useNavigate();
	const { copy } = useI18n();
	const page = copy.riskReadiness;

	return (
		<div className="container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<h2 className="mt-3 font-display text-2xl font-semibold text-ink">
					{page.beforeTitle}
				</h2>
				<p className="mt-3">{page.heroBody}</p>
			</section>

			<section>
				<div className="space-y-3">
					<h2 className="text-2xl font-semibold font-display text-ink">
						{page.designedForTitle}
					</h2>
					<ul className="list-disc list-inside pl-5">
						{page.designedForList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.designedForNote}</p>
				</div>
			</section>

			<section>
				<div className="space-y-3">
					<h2 className="text-2xl font-semibold font-display text-ink">
						{page.helpsTitle}
					</h2>
					<p>{page.helpsIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.helpsList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.helpsNote}</p>
				</div>
			</section>

			<section className="grid gap-6 md:grid-cols-2">
				<div className="p-8 rounded-2xl border border-ink bg-white space-y-3">
					<h3 className="text-xl font-semibold font-display text-ink">
						{page.isTitle}
					</h3>
					<ul className="list-disc list-inside pl-5">
						{page.isList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div className="p-8 rounded-2xl border border-ink bg-white space-y-3">
					<h3 className="text-xl font-semibold font-display text-ink">
						{page.isNotTitle}
					</h3>
					<ul className="list-disc list-inside pl-5">
						{page.isNotList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div className="p-8 rounded-2xl border border-ink bg-white space-y-3">
					<h3 className="text-xl font-semibold font-display text-ink">
						{page.receiveTitle}
					</h3>
					<ul className="list-disc list-inside pl-5">
						{page.receiveList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.receiveNote}</p>
				</div>
				<div className="p-8 rounded-2xl border border-ink bg-white space-y-3">
					<h3 className="text-xl font-semibold font-display text-ink">
						{page.whyTitle}
					</h3>
					<p>{page.whyIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.whyList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</section>

			<section className="space-y-3">
				<h3 className="font-display text-2xl font-semibold text-ink">
					{page.afterTitle}
				</h3>
				<p>{page.afterBody}</p>
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
						<p>{page.limitedNote}</p>
					</div>
				</div>
			</section>
		</div>
	);
}

export default RiskReadinessDiagnosticPage;
