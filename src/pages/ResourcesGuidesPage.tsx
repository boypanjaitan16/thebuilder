import { useI18n } from "../i18n/I18nProvider";

function ResourcesGuidesPage() {
	const { copy } = useI18n();
	const page = copy.resourcesGuides;

	return (
		<div className="container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<p className="mt-3">{page.heroBody}</p>
			</section>

			<section>
				<h3 className="text-xl font-semibold font-display text-ink">
					{page.whatInsideTitle}
				</h3>
				<p className="text-slate-700 mt-2">{page.topicsBody}</p>
				<ul className="mt-3 list-disc list-inside">
					{page.topicsList.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>
			<section>
				<p>{page.topicsNote}</p>
				<div className="grid grid-cols-2 gap-5 mt-5">
					{page.whatInsideList.map((item) => (
						<div
							key={item.title}
							className="rounded-2xl border border-slate-800 bg-white p-6 shadow-soft"
						>
							<h4 className="font-semibold font-display text-lg">
								{item.title}
							</h4>
							<p>{item.subtitle}</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default ResourcesGuidesPage;
