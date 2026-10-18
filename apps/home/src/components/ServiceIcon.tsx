import { type LucideIcon, Network, Shield, UsersRound } from "lucide-react";

const iconsByService: Record<string, LucideIcon> = {
	"organization-transformation": Network,
	"future-talent-strategy": UsersRound,
	"risk-and-business-continuity": Shield,
};

type ServiceIconProps = {
	slug: string;
};

export default function ServiceIcon({ slug }: ServiceIconProps) {
	const Icon = iconsByService[slug];
	if (!Icon) return null;

	return (
		<span className="blueprint-service-icon" aria-hidden="true">
			<Icon size={29} strokeWidth={1.5} />
		</span>
	);
}
