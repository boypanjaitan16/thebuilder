import { Descriptions, Drawer } from "antd";
import { formatDate } from "../lib/date";
import type { AdvisoryRequest } from "../types/AdvisoryRequest";

type AdvisoryRequestDrawerProps = {
	open: boolean;
	advisoryRequest: AdvisoryRequest | null;
	onClose: () => void;
};

export function AdvisoryRequestDrawer({
	open,
	advisoryRequest,
	onClose,
}: AdvisoryRequestDrawerProps) {
	return (
		<Drawer title="Advisory request" open={open} onClose={onClose} width={480}>
			{advisoryRequest && (
				<Descriptions
					column={1}
					bordered
					size="small"
					items={[
						{ key: "name", label: "Name", children: advisoryRequest.name },
						{
							key: "email",
							label: "Email",
							children: (
								<a href={`mailto:${advisoryRequest.email}`}>
									{advisoryRequest.email}
								</a>
							),
						},
						{ key: "role", label: "Role", children: advisoryRequest.role },
						{
							key: "organization",
							label: "Organization",
							children: advisoryRequest.organization,
						},
						{
							key: "size",
							label: "Organization size",
							children: advisoryRequest.size,
						},
						{
							key: "industry",
							label: "Industry",
							children: advisoryRequest.industry,
						},
						{
							key: "situation",
							label: "Situation",
							children: advisoryRequest.situation?.length
								? advisoryRequest.situation.join(", ")
								: "—",
						},
						{
							key: "description",
							label: "Description",
							children: advisoryRequest.description || "—",
						},
						{
							key: "expectation",
							label: "Expectation",
							children: advisoryRequest.expectation,
						},
						{
							key: "decisionFlow",
							label: "Decision flow",
							children: advisoryRequest.decisionFlow,
						},
						{
							key: "readiness",
							label: "Readiness",
							children: advisoryRequest.readiness,
						},
						{
							key: "timeline",
							label: "Timeline",
							children: advisoryRequest.timeline,
						},
						{
							key: "created_at",
							label: "Submitted",
							children: formatDate(advisoryRequest.created_at),
						},
					]}
				/>
			)}
		</Drawer>
	);
}
