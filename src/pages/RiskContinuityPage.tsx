import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function RiskContinuityPage() {
	const navigate = useNavigate();
	const { copy } = useI18n();
	const page = copy.risk;

	return (
		<div className="container-page flex flex-col gap-12">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="my-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<p className="text-slate-700">{page.heroBody1}</p>
				<p className="text-slate-700">{page.heroBody2}</p>
				<p className="text-slate-700">{page.heroBody3}</p>
			</section>

			<section className="space-y-10">
				<div className="flex-1 space-y-3">
					<h2 className="text-2xl font-semibold font-display text-ink">
						{page.invisibleTitle}
					</h2>
					<p>{page.invisibleIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.invisibleList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.invisibleNote}</p>
				</div>
				<div className="w-[1px] bg-slate-800 mx-7 hidden md:block" />
				<div className="flex-1 space-y-3">
					<h2 className="text-2xl font-semibold font-display text-ink">
						{page.requiresTitle}
					</h2>
					<div>
						{page.requiresIntroList.map((intro) => (
							<p key={intro}>{intro}</p>
						))}
					</div>
					<div className="flex flex-col gap-5">
						{page.requiresList.map((item) => (
							<div
								key={item.title}
								className="bg-white rounded-2xl p-5 border border-slate-800 space-y-2"
							>
								<h5 className="font-semibold font-display text-lg">
									{item.title}
								</h5>
								<p>{item.description}</p>
							</div>
						))}
					</div>
					<p>{page.requiresNote}</p>
				</div>
			</section>

			<section>
				<div className="glass-panel p-8 space-y-3">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.beyondTitle}
					</h3>
					<p>{page.beyondIntro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.beyondList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.beyondNote}</p>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-5">
				<div className="bg-white rounded-2xl border border-slate-800 space-y-3 p-8">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.protection.title}
					</h3>
					<p>{page.protection.intro1}</p>
					<p>{page.protection.intro2}</p>
					<ul className="list-disc list-inside pl-5">
						{page.protection.list.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.protection.note}</p>
				</div>
				<div className="bg-white rounded-2xl border border-slate-800 space-y-3 p-8">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.relevant.title}
					</h3>
					<p>{page.relevant.intro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.relevant.list.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
				<div className="bg-white rounded-2xl border border-slate-800 space-y-3 p-8">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.expectation.title}
					</h3>
					<p>{page.expectation.body1}</p>
					<p>{page.expectation.body2}</p>
				</div>
				<div className="bg-white rounded-2xl border border-slate-800 space-y-3 p-8">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.risk.title}
					</h3>
					<p>{page.risk.intro}</p>
					<ul className="list-disc list-inside pl-5">
						{page.risk.list.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p>{page.risk.note}</p>
				</div>
			</section>

			<section className="glass-panel flex flex-col gap-4 px-8 py-8 md:flex-row md:items-center md:justify-between">
				<div className="max-w-2xl">
					<h3 className="font-display text-2xl font-semibold text-ink">
						{page.ctaTitle}
					</h3>
					<p className="mt-2 text-slate-700">{page.ctaBody}</p>
				</div>
				<button
					type="button"
					onClick={() => navigate("/apply")}
					className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
				>
					{copy.ctaButton}
				</button>
			</section>
		</div>
	);
}

export default RiskContinuityPage;
