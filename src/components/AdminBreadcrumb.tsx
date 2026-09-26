import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

type AdminBreadcrumbProps = {
	items: BreadcrumbItem[];
	action?: React.ReactNode;
};

export function AdminBreadcrumb({ items, action }: AdminBreadcrumbProps) {
	return (
		<Breadcrumb
			items={[{ label: "Admin", to: "/admin" }, ...items]}
			action={action}
		/>
	);
}
