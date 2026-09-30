import { Link } from "react-router-dom";
import { BlueprintDiagram } from "../components/BlueprintDiagram";
import { useI18n } from "../i18n/I18nProvider";

function OrganizationPage() {
	const { copy } = useI18n();
	const { organization: org, brand: p } = copy;
	return (
		<>
			<section className="bp-hero bp-org-hero">
				<div className="blueprint-wrap bp-hero-inner">
					<div className="bp-hero-copy">
						<p className="blueprint-kicker">
							<span>SYS / 002</span>
							{p.organization.kicker}
						</p>
						<h1>{p.organization.title}</h1>
						<p>{org.heroBody}</p>
						<Link className="bp-button" to="/apply">
							{org.ctaButton}
							<span aria-hidden="true">↗</span>
						</Link>
					</div>
					<BlueprintDiagram copy={copy} />
				</div>
			</section>
			<section className="blueprint-wrap bp-org-problem">
				<div className="bp-section-head">
					<span>01 / {p.organization.problemLabel}</span>
					<h2>{p.organization.problemLabel}</h2>
				</div>
				<p className="bp-section-deck">{org.coreProblemIntro}</p>
				<div className="bp-signal-list">
					{org.coreProblemBullets.map((item, index) => (
						<div key={item}>
							<span>0{index + 1}</span>
							<strong>{item}</strong>
							<span aria-hidden="true">↗</span>
						</div>
					))}
				</div>
				<p className="bp-problem-note">{org.coreProblemNote}</p>
			</section>
			<section className="bp-org-system">
				<div className="blueprint-wrap">
					<div className="bp-section-head">
						<span>02 / {p.organization.systemLabel}</span>
						<h2>{p.organization.systemLabel}</h2>
					</div>
					<p className="bp-section-deck">{org.resilienceIntro}</p>
					<div className="bp-system-list">
						{org.resilienceList.map((item, index) => (
							<div key={item}>
								<span>0{index + 1}</span>
								<p>{item}</p>
							</div>
						))}
					</div>
					<p className="bp-system-note">{org.resilienceNote}</p>
				</div>
			</section>
			<section className="blueprint-wrap bp-org-method">
				<div className="bp-section-head">
					<span>03 / {p.organization.methodLabel}</span>
					<h2>{p.organization.methodLabel}</h2>
				</div>
				<div className="bp-approach-grid">
					<div>
						<h3>{org.approachTitle}</h3>
						<p>{org.approachBody1}</p>
						<p>{org.approachBody2}</p>
						<p>{org.approachBody3}</p>
					</div>
					<ol>
						{org.approachList.map((item, index) => (
							<li key={item}>
								<span>0{index + 1}</span>
								{item}
							</li>
						))}
					</ol>
				</div>
				<p className="bp-method-result">
					<strong>{org.approachNote1}.</strong> {org.approachNote2}
				</p>
			</section>
			<section className="bp-org-scope">
				<div className="blueprint-wrap">
					<div className="bp-section-head">
						<span>04 / {p.organization.scopeLabel}</span>
						<h2>{p.organization.scopeLabel}</h2>
					</div>
					<div className="bp-scope-grid">
						<div>
							<h3>+ {org.scopeIncludesNote}</h3>
							<ul>
								{org.scopeIncludes.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
						<div>
							<h3>− {org.scopeExcludesNote}</h3>
							<ul>
								{org.scopeExcludes.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>
			<section className="blueprint-wrap bp-org-fit">
				<div className="bp-section-head">
					<span>05 / {p.organization.fitLabel}</span>
					<h2>{p.organization.fitLabel}</h2>
				</div>
				<div className="bp-fit-grid">
					<div>
						<h3>{org.relevance}</h3>
						<ul>
							{org.relevancePoints.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
					<div>
						<h3>{org.designedFor}</h3>
						<ul>
							{org.designedForPoints.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p>{org.designedForNote}</p>
						<p>{org.connectedAreasIntro}</p>
						<ul>
							{org.connectedAreasList.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p>{org.connectedAreasNote}</p>
					</div>
				</div>
			</section>
			<section className="bp-close">
				<div className="blueprint-wrap">
					<span>06 / {org.ctaTitle}</span>
					<h2>{org.ctaTitle}</h2>
					<p>{org.ctaBody}</p>
					<Link className="bp-button" to="/apply">
						{org.ctaButton}
						<span aria-hidden="true">↗</span>
					</Link>
				</div>
			</section>
		</>
	);
}

export default OrganizationPage;
