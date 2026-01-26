import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function ResourcesPage() {
	const { copy } = useI18n();
	const navigate = useNavigate();
	const page = copy.resources;

	return (
		<div className="container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle}
				</h1>
				<p className="mt-3 text-slate-700">{page.heroBody}</p>
			</section>

			<section>
				<h2 className="font-semibold font-display text-2xl mb-5">
					{page.middleSectionTitle}
				</h2>
				<p>{page.middleSectionBody1}</p>
				<p>{page.middleSectionBody2}</p>
				<p>{page.middleSectionBody3}</p>
			</section>

			<section className="grid gap-6 md:grid-cols-3">
				{page.categories.map((category) => (
					<article
						key={category.slug}
						className="rounded-2xl border border-slate-800 bg-white p-6 shadow-soft transition hover:-translate-y-1"
					>
						<h2 className="font-display text-xl font-semibold text-ink">
							{category.title}
						</h2>
						<p className="mt-3 text-slate-700">{category.body}</p>
						<ul className="mt-4 list-disc list-inside">
							{category.items.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<button
							type="button"
							onClick={() => navigate(`/resources/${category.slug}`)}
							className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-slate-900"
						>
							{category.cta}
						</button>
					</article>
				))}
			</section>

			<section>
				<h3 className="font-display text-2xl font-semibold text-ink">
					{page.closingTitle}
				</h3>
				<p className="my-3 text-slate-700">{page.closingNote}</p>
				<button
					type="button"
					className="px-5 py-2 rounded-full bg-white text-ink border border-ink"
				>
					{page.closingCta} &rarr;
				</button>
			</section>
		</div>
	);
}

export default ResourcesPage;
