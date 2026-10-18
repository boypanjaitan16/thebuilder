import {
	BookOpenText,
	ClipboardList,
	GraduationCap,
	type LucideIcon,
	Package,
} from "lucide-react";

const iconsByResource: Record<string, LucideIcon> = {
	"foundational-thinking": BookOpenText,
	"guides-playbooks": ClipboardList,
	"courses-deep-dives": GraduationCap,
	products: Package,
};

type ResourceIconProps = {
	slug: string;
};

export default function ResourceIcon({ slug }: ResourceIconProps) {
	const Icon = iconsByResource[slug];
	if (!Icon) return null;

	return (
		<span className="blueprint-resource-icon" aria-hidden="true">
			<Icon size={27} strokeWidth={1.5} />
		</span>
	);
}
