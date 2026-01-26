import { useI18n } from "../i18n/I18nProvider";

function ArchitecturePage() {
	const { copy } = useI18n();
	const page = copy.architecture;
	const areas = copy.shared.areasOfFocus;

	return (
		<div className="container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					Our Integrated Architecture
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.title}
				</h1>
				<p className="mt-3">{page.body}</p>
			</section>

			<section>
				<h3 className="text-2xl font-semibold font-display text-ink">
					{page.principlesTitle}
				</h3>
				<ul className="list-disc list-inside pl-5 mt-3">
					{page.principles.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{areas.map((area) => (
					<div
						key={area.slug}
						className="rounded-2xl border border-ink bg-white p-6 shadow-soft"
					>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
							{area.slug.replaceAll("-", " ")}
						</p>
						<h3 className="mt-2 font-display text-xl font-semibold text-ink">
							{area.title}
						</h3>
						<p className="mt-2 text-slate-700">{area.summary}</p>
						<p className="mt-4 text-sm text-slate-600">
							{page.integrationNote}
						</p>
					</div>
				))}
			</section>
		</div>
	);
}

export default ArchitecturePage;
