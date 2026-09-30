import { useI18n } from "../i18n/I18nProvider";

function AboutPage() {
	const { copy } = useI18n();
	const page = copy.about;

	return (
		<div className="blueprint-page blueprint-page--about container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.title}
				</h1>
				<p className="mt-3">{page.body1}</p>
				<p className="mt-3 text-slate-700">{page.body2}</p>
			</section>

			<section className="blueprint-about-story">
				<figure className="blueprint-about-image" aria-hidden="true">
					<img
						src={`${import.meta.env.BASE_URL}images/blueprint-about.webp`}
						alt=""
						width="1672"
						height="941"
						loading="lazy"
						decoding="async"
					/>
				</figure>
				<div className="blueprint-about-story-copy">
					<h2 className="font-display font-semibold text-ink">
						{page.showTitle}
					</h2>
					<ul className="blueprint-list blueprint-list--check">
						{page.showList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</section>
		</div>
	);
}

export default AboutPage;
