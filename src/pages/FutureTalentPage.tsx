import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function FutureTalentPage() {
	const navigate = useNavigate();
	const { copy } = useI18n();
	const page = copy.future;

	return (
		<div className="container-page flex flex-col gap-12">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<p className="mt-3 text-lg text-slate-700">{page.heroBody}</p>
			</section>

			<section className="flex flex-col md:flex-row gap-8 md:gap-0 md:px-5 md:py-8 md:border-t md:border-b border-slate-800">
				<div className="flex-1 space-y-3">
					<h2 className="text-2xl font-semibold font-display text-ink">
						{page.problemTitle}
					</h2>
					<p>{page.problemIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.problemList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.problemNote}</p>
				</div>
				<div className="w-[1px] bg-slate-800 mx-7 hidden md:block" />
				<div className="flex-1 space-y-3">
					<h2 className="text-2xl font-semibold font-display text-ink">
						{page.futureTitle}
					</h2>
					<p>{page.futureIntro1}</p>
					<p>{page.futureIntro2}</p>
					<ul className="list-disc list-inside pl-5">
						{page.futureList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.futureNote}</p>
				</div>
			</section>

			<section>
				<div className="glass-panel p-8 space-y-3">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.approachTitle}
					</h3>
					<p>{page.approachBody}</p>
					<ul className="list-disc list-inside pl-5">
						{page.approachItems.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.approachNote}</p>
				</div>
			</section>

			<section>
				<h3 className="text-2xl font-semibold font-display text-ink text-center mb-5">
					{page.scopeTitle}
				</h3>
				<div className="mt-3 gap-7 grid grid-cols-2">
					<div className="flex bg-white border border-ink rounded-2xl p-8">
						<div className="space-y-2">
							<p className="text-lg font-semibold font-display uppercase text-ink underline-offset-4">
								{page.scopeIncludesIntro}
							</p>
							<ul className="list-disc list-inside pl-5">
								{page.scopeIncludes.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</div>
					<div className="flex bg-white border border-ink rounded-2xl p-8">
						<div className="space-y-2">
							<p className="text-lg font-semibold font-display uppercase text-ink underline-offset-4">
								{page.scopeExcludesIntro}
							</p>
							<ul className="list-disc list-inside pl-5">
								{page.scopeExcludes.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
							<p>{page.scopeExcludesNote}</p>
						</div>
					</div>
				</div>
			</section>

			<section className="grid gap-6 md:grid-cols-3">
				<div className="bg-white px-8 py-8 shadow-soft rounded-[24px] border border-slate-800 space-y-3">
					<h4 className="text-2xl font-semibold font-display text-ink">
						{page.critical.title}
					</h4>
					<ul className="list-disc list-inside pl-5">
						{page.critical.items.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div className="bg-white px-8 py-8 shadow-soft rounded-[24px] border border-slate-800 space-y-3">
					<h4 className="text-2xl font-semibold font-display text-ink">
						{page.designedFor.title}
					</h4>
					<p>{page.designedFor.intro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.designedFor.items.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.designedFor.note}</p>
				</div>
				<div className="bg-white px-8 py-8 shadow-soft rounded-[24px] border border-slate-800 space-y-3">
					<h4 className="text-2xl font-semibold font-display text-ink">
						{page.resilience.title}
					</h4>
					<p>{page.resilience.intro1}</p>
					<p>{page.resilience.intro2}</p>
					<ul className="list-disc list-inside pl-5">
						{page.resilience.items.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.resilience.note}</p>
				</div>
			</section>

			<section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
				<div className="max-w-2xl">
					<h3 className="font-display text-2xl font-semibold font-display text-ink">
						{page.ctaTitle}
					</h3>
					<p className="mt-2 text-slate-700">{page.ctaBody}</p>
				</div>
				<button
					type="button"
					onClick={() => navigate("/apply")}
					className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
				>
					{page.ctaButton}
				</button>
			</section>
		</div>
	);
}

export default FutureTalentPage;
