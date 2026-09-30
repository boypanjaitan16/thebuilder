import { Link } from "react-router-dom";
import { BlueprintDiagram } from "../components/BlueprintDiagram";
import { useI18n } from "../i18n/I18nProvider";

function HomePage() {
	const { copy } = useI18n();
	const { home, shared, brand: p } = copy;
	return (
		<>
			<section className="bp-hero">
				<div className="blueprint-wrap bp-hero-inner">
					<div className="bp-hero-copy">
						<p className="blueprint-kicker">
							<span>SYS / 001</span>
							{p.home.kicker}
						</p>
						<h1>{p.home.title}</h1>
						<p>{home.hero.subtitle}</p>
						<Link className="bp-button" to="/apply">
							{home.cta.button}
							<span aria-hidden="true">↗</span>
						</Link>
					</div>
					<BlueprintDiagram copy={copy} />
				</div>
			</section>
			<section className="blueprint-wrap bp-problem">
				<div className="bp-section-head">
					<span>01 / {p.home.problemLabel}</span>
					<h2>{p.home.problemLabel}</h2>
				</div>
				<div className="bp-problem-main">
					<strong>{home.hero.body2}</strong>
					<p>{home.hero.body1}</p>
				</div>
				<p className="bp-problem-note">{home.hero.body3}</p>
			</section>
			<section className="bp-layers" id="bp-layers">
				<div className="blueprint-wrap">
					<div className="bp-section-head">
						<span>02 / {p.home.areasLabel}</span>
						<h2>{p.home.areasLabel}</h2>
					</div>
					<p className="bp-section-deck">{home.areas.description}</p>
					<div className="bp-layer-grid">
						{shared.areasOfFocus.map((area, index) => (
							<Link to={area.to} className="bp-layer" key={area.slug}>
								<div className="bp-layer-top">
									<span>0{index + 1}</span>
									<span aria-hidden="true">↗</span>
								</div>
								<h3>{area.title}</h3>
								<p>{area.summary}</p>
								<span className="bp-layer-cta">{p.viewService}</span>
							</Link>
						))}
					</div>
				</div>
			</section>
			<section className="blueprint-wrap bp-approach">
				<div className="bp-section-head">
					<span>03 / {p.home.approachLabel}</span>
					<h2>{p.home.approachLabel}</h2>
				</div>
				<div className="bp-approach-grid">
					<div>
						<h3>{home.approach.title}</h3>
						<p className="bp-approach-positioning">{home.positioning.title}</p>
						<p>{home.positioning.body}</p>
						<small>{home.positioning.founderNote}</small>
						<p>{home.approach.notThis}</p>
					</div>
					<ol>
						{home.approach.bullets.map((item, index) => (
							<li key={item}>
								<span>0{index + 1}</span>
								{item}
							</li>
						))}
					</ol>
				</div>
				<div className="bp-engagement-note">
					<h3>{home.howWeWork.title}</h3>
					<p>{home.howWeWork.description1}</p>
					<p>{home.howWeWork.description2}</p>
					<p>{home.howWeWork.description3}</p>
				</div>
			</section>
			<section className="bp-insights">
				<div className="blueprint-wrap">
					<div className="bp-section-head">
						<span>04 / {p.home.insightsLabel}</span>
						<h2>{p.home.insightsLabel}</h2>
					</div>
					{shared.insightArticles.slice(0, 3).map((article, index) => (
						<Link className="bp-insight-row" to="/insights" key={article.title}>
							<span>0{index + 1}</span>
							<strong>{article.title}</strong>
							<small>{article.lens}</small>
						</Link>
					))}
					<Link className="blueprint-text-link" to="/insights">
						{home.insights.viewAll}
						<span aria-hidden="true">↗</span>
					</Link>
				</div>
			</section>
			<section className="bp-close">
				<div className="blueprint-wrap">
					<span>05 / {home.cta.title}</span>
					<h2>{home.cta.title}</h2>
					<p>{home.cta.description}</p>
					<Link className="bp-button" to="/apply">
						{home.cta.button}
						<span aria-hidden="true">↗</span>
					</Link>
				</div>
			</section>
		</>
	);
}

export default HomePage;
