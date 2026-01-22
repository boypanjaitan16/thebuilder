import en from "./locales/en.json";
import id from "./locales/id.json";

export type Language = "en" | "id";

type FocusArea = { slug: string; title: string; summary: string; to: string };
type InsightArticle = { title: string; lens: string };
type DiagnosticQuestion = { id: string; section: string; text: string };

export type Copy = {
	nav: {
		home: string;
		organization: string;
		future: string;
		risk: string;
		insights: string;
		work: string;
		apply: string;
		resources: string;
	};
	header: { tagline: string };
	footer: {
		line: string;
		about: string;
		privacyPolicy: string;
		resources: string;
		riskReadinessDiagnostic: string;
	};
	shared: {
		areasOfFocus: FocusArea[];
		insightArticles: InsightArticle[];
		caseReflections: string[];
		diagnosticQuestions: DiagnosticQuestion[];
	};
	home: {
		hero: {
			title: string;
			subtitle: string;
			body1: string;
			body2: string;
			body3: string;
			ctaPrimary: string;
			ctaSecondary: string;
			points: string[];
		};
		areas: {
			title: string;
			description: string;
			linkLabel: string;
			cardCtaPrefix: string;
		};
		positioning: { title: string; body: string; founderNote: string };
		approach: {
			title: string;
			description: string;
			bullets: string[];
			notThis: string;
		};
		howWeWork: {
			title: string;
			description1: string;
			description2: string;
			description3: string;
		};
		insights: { title: string; description: string; viewAll: string };
		cta: { title: string; description: string; button: string };
	};
	organization: {
		heroTitle: string;
		heroBody: string;
		coreProblemTitle: string;
		coreProblemIntro: string;
		coreProblemBullets: string[];
		resilienceTitle: string;
		resilienceIntro: string;
		resilienceList: string[];
		approachTitle: string;
		approachBody1: string;
		approachBody2: string;
		scopeTitle: string;
		scopeIncludes: string[];
		scopeExcludes: string[];
		relevance: string;
		designedFor: string;
		integration: string;
		ctaTitle: string;
		ctaBody: string;
	};
	future: {
		heroTitle: string;
		heroBody: string;
		problemTitle: string;
		problemIntro: string;
		problemList: string[];
		futureTitle: string;
		futureIntro: string;
		futureList: string[];
		approachTitle: string;
		approachBody: string;
		scopeTitle: string;
		scopeIncludes: string[];
		scopeExcludes: string[];
		whenTitle: string;
		whenBody: string;
		whoTitle: string;
		whoBody: string;
		integration: string;
		ctaTitle: string;
		ctaBody: string;
	};
	risk: {
		heroTitle: string;
		heroBody: string;
		invisibleTitle: string;
		invisibleIntro: string;
		invisibleList: string[];
		requiresTitle: string;
		requiresIntro: string;
		requiresList: string[];
		beyondTitle: string;
		beyondBody: string;
		protectionTitle: string;
		protectionList: string[];
		whoTitle: string;
		whoBody: string;
		closingTitle: string;
		closingBody: string;
		integration: string;
		ctaTitle: string;
		ctaBody: string;
	};
	insightsPage: {
		heroTitle: string;
		heroBody1: string;
		heroBody2: string;
		featuredTitle: string;
		featuredBody: string;
		themesNote: string;
		casesTitle: string;
		casesBody: string;
		editorialTitle: string;
		editorialBody: string;
		philosophy: string[];
		invitationTitle: string;
		invitationBody: string;
		diagnosticCta: string;
		applyCta: string;
	};
	work: {
		heroTitle: string;
		heroBody1: string;
		heroBody2: string;
		flowTitle: string;
		flowSteps: string[];
		scopeTitle: string;
		scopeIncludes: string[];
		scopeExcludes: string[];
		fitTitle: string;
		fitList: string[];
		notFitTitle: string;
		notFitList: string[];
		capacityTitle: string;
		capacityBody: string;
		applicationNote: string;
		ctaTitle: string;
		ctaBody: string;
		ctaButton: string;
	};
	apply: {
		heroTitle: string;
		intro1: string;
		intro2: string;
		contextNote: string;
		sections: {
			basic: string;
			context: string;
			readiness: string;
			closing: string;
		};
		form: {
			name: string;
			role: string;
			organization: string;
			size: string;
			sizeOptions: string[];
			industry: string;
			situationTitle: string;
			situationOptions: string[];
			description: string;
			expectation: string;
			expectationOptions: string[];
			decisionFlow: string;
			readinessTitle: string;
			readinessOptions: string[];
			timelineTitle: string;
			timelineOptions: string[];
			submit: string;
			successTitle: string;
			successBody: string;
		};
	};
	diagnostic: {
		heroTitle: string;
		heroBody: string;
		meta: string[];
		whoTitle: string;
		whoBody: string;
		receiveTitle: string;
		receiveList: string[];
		optionalReflection: string;
		primaryCta: string;
		reset: string;
		scoreCopy: { high: string; moderate: string; low: string; note: string };
	};
	about: {
		title: string;
		body1: string;
		body2: string;
		showTitle: string;
		showList: string[];
	};
	architecture: {
		title: string;
		body: string;
		principlesTitle: string;
		principles: string[];
		integrationNote: string;
	};
	privacy: { title: string; intro: string; bullets: string[] };
	notFound: { title: string; body: string; cta: string };
	riskReadiness: {
		heroTitle: string;
		heroBody: string;
		beforeTitle: string;
		beforeBody: string;
		designedForTitle: string;
		designedForList: string[];
		designedForNote: string;
		helpsTitle: string;
		helpsIntro: string;
		helpsList: string[];
		helpsNote: string;
		isTitle: string;
		isList: string[];
		isNotTitle: string;
		isNotList: string[];
		whyTitle: string;
		whyIntro: string;
		whyList: string[];
		receiveTitle: string;
		receiveList: string[];
		receiveNote: string;
		afterTitle: string;
		afterBody: string;
		limitedNote: string;
		primaryCta: string;
		secondaryCta: string;
	};
	resources: {
		heroSubtitle: string;
		heroTitle: string;
		heroBody: string;
		middleSectionTitle: string;
		middleSectionBody1: string;
		middleSectionBody2: string;
		middleSectionBody3: string;
		categories: {
			slug: string;
			title: string;
			body: string;
			items: string[];
			cta: string;
		}[];
		closingNote: string;
		closingTitle: string;
		closingCta: string;
	};
	resourcesFoundational: {
		heroSubtitle: string;
		heroTitle: string;
		heroBody: string;
		topicsBody: string;
		topicsNote: string;
		topicsList: string[];
		whatInsideTitle: string;
		learningModel: {
			title: string;
			items: string[];
		}[];
	};
	resourcesGuides: {
		heroSubtitle: string;
		heroTitle: string;
		heroBody: string;
		topicsNote: string;
		topicsBody: string;
		topicsList: string[];
		whatInsideTitle: string;
		whatInsideList: {
			title: string;
			subtitle: string;
		}[];
	};
	resourcesCourses: {
		heroSubtitle: string;
		heroTitle: string;
		heroBody: string;
		topicsBody: string;
		topicsList: string[];
		topicsNote: string;
		whatInsideTitle: string;
		whatInsideList: {
			title: string;
			subtitle: string;
		}[];
	};
};

export const translations: Record<Language, Copy> = {
	en: en as Copy,
	id: id as Copy,
};
