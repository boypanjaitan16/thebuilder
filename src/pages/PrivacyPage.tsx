import { useI18n } from "../i18n/I18nProvider";

function PrivacyPage() {
	const { copy } = useI18n();
	const page = copy.privacy;

	return (
		<div className="blueprint-page blueprint-page--privacy container-page flex flex-col gap-10">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.title}
				</h1>
				<p className="my-3">{page.intro}</p>
				<ul className="list-disc list-inside pl-5">
					{page.bullets.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export default PrivacyPage;
