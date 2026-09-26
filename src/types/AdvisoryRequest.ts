export type AdvisoryRequest = {
	id: string;
	name: string;
	email: string;
	role: string;
	organization: string;
	size: string;
	industry: string;
	situation: string[] | null;
	description: string | null;
	expectation: string;
	decisionFlow: string;
	readiness: string;
	timeline: string;
	created_at: string;
};
