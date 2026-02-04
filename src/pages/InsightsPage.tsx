import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import { useGetGhostPosts } from "../hooks/useGetGhostPosts";
import { useI18n } from "../i18n/I18nProvider";
import { env } from "../lib/env";

function InsightsPage() {
	const navigate = useNavigate();
	const { copy } = useI18n();
	const page = copy.insightsPage;
	const shared = copy.shared;
	const { posts, loading, error, isConfigured } = useGetGhostPosts();
	const showGhostSection = isConfigured || env.isDev;
	const showMissingConfig = !isConfigured && env.isDev;
	const showEmptyState =
		!loading && !error && isConfigured && posts.length === 0;

	return (
		<div className="container-page flex flex-col gap-12">
			<section className="rounded-[26px] bg-white px-8 py-10 shadow-soft">
				<p className="text-xs uppercase tracking-[0.3em] text-slate-500">
					{page.heroSubtitle}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold text-ink">
					{page.heroTitle1}
				</h1>
				<h2 className="mt-3 font-display text-2xl font-semibold text-ink">
					{page.heroTitle2}
				</h2>
				<p className="mt-3 text-slate-700">{page.heroBody1}</p>
				<p className="mt-3 text-slate-700">{page.heroBody2}</p>
			</section>

			{showGhostSection && (
				<section className="rounded-[24px] border border-sand bg-white p-8 shadow-soft">
					<h2 className="font-display text-2xl font-semibold text-ink">
						{page.publishedTitle}
					</h2>
					<p className="mt-2 text-slate-700">{page.publishedBody}</p>
					<div className="mt-6">
						{loading && (
							<LoadingIndicator label={page.publishedLoading} />
						)}
						{showMissingConfig && (
							<p className="text-sm text-slate-500">
								{page.publishedMissingConfig}
							</p>
						)}
						{!loading && error && (
							<p className="text-sm text-rose-600">
								{page.publishedError}
							</p>
						)}
						{showEmptyState && (
							<p className="text-sm text-slate-500">
								{page.publishedEmpty}
							</p>
						)}
						{!loading && !error && posts.length > 0 && (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{posts.map((item) => (
									<a
										key={item.id}
										href={item.url}
										target="_blank"
										rel="noreferrer"
										className="group flex h-full flex-col rounded-2xl border border-sand bg-gradient-to-br from-white via-white to-mist p-4 shadow-sm transition hover:-translate-y-1 hover:border-ink hover:shadow-soft"
									>
										<div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand/40">
											{item.feature_image ? (
												<img
													src={item.feature_image}
													alt={item.feature_image_alt || item.title}
													className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
													loading="lazy"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-slate-500">
													{page.publishedNoImage}
												</div>
											)}
										</div>
										<div className="mt-3 flex items-start justify-between gap-3">
											<h3 className="min-w-0 font-display text-lg font-semibold text-ink leading-snug group-hover:underline">
												{item.title}
											</h3>
											<span className="mt-1 text-slate-400 transition group-hover:translate-x-1">
												→
											</span>
										</div>
									</a>
								))}
							</div>
						)}
					</div>
				</section>
			)}

			<section className="grid gap-6 grid-cols-1 md:grid-cols-2">
				<div className="glass-panel p-8">
					<h2 className="font-display text-2xl font-semibold text-ink">
						{page.featuredTitle}
					</h2>
					<p className="mt-3">{page.featuredIntro}</p>
					<p className="mt-3">{page.featuredBody}</p>
					<ul className="list-disc list-inside pl-5">
						{page.featuredList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<div className="mt-5 grid gap-3 md:grid-cols-2">
						{shared.insightArticles.map((article) => (
							<div
								key={article.title}
								className="rounded-xl border border-slate-800 bg-white px-4 py-4 shadow-sm"
							>
								<p className="text-sm uppercase tracking-wide text-slate-500">
									{article.lens}
								</p>
								<p className="mt-1 font-semibold font-display text-ink">
									{article.title}
								</p>
							</div>
						))}
					</div>
				</div>
				<div className="rounded-2xl border border-sand bg-white p-8 shadow-soft">
					<h3 className="text-2xl font-semibold font-display text-ink">
						{page.casesTitle}
					</h3>
					<p className="mt-2">{page.casesIntro1}</p>
					<p className="mt-2">{page.casesIntro2}</p>
					<p className="mt-2">{page.casesBody}</p>
					<ul className="list-disc list-inside pl-5">
						{page.casesList.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<div className="mt-4 space-y-3">
						{shared.caseReflections.map((item) => (
							<div
								key={item}
								className="rounded-xl bg-white text-ink font-semibold font-display p-5 border border-ink"
							>
								{item}
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="space-y-3">
				<h2 className="font-display text-2xl font-semibold text-ink">
					{page.areSelectiveTitle}
				</h2>
				<p>{page.areSelectiveBody1}</p>
				<p>{page.areSelectiveBody2}</p>
			</section>
			<section className="space-y-3">
				<h2 className="font-display text-2xl font-semibold text-ink">
					{page.invitationTitle}
				</h2>
				<p>{page.invitationBody}</p>
			</section>
			<div className="flex flex-col md:flex-row md:items-center gap-5">
				<button
					type="button"
					onClick={() => navigate("/diagnostic")}
					className="flex-1 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
				>
					{page.diagnosticCta}
				</button>
				<span className="text-center">OR</span>
				<button
					type="button"
					onClick={() => navigate("/apply")}
					className="flex-1 rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 bg-white"
				>
					{page.applyCta}
				</button>
			</div>
		</div>
	);
}

export default InsightsPage;
