import { Breadcrumb as AntdBreadCrumb } from "antd";
import { Link } from "react-router-dom";

export type AdminBreadcrumbItem = {
	label: string;
	to?: string;
};

type AdminBreadcrumbProps = {
	items: AdminBreadcrumbItem[];
	action?: React.ReactNode;
};

export function Breadcrumb({ items, action }: AdminBreadcrumbProps) {
	return (
		<div className="flex flex-row items-center gap-5 justify-between mb-5">
			<AntdBreadCrumb
				items={[
					{ title: <Link to="/admin">Admin</Link> },
					...items.map((item) => ({
						title: item.to ? (
							<Link to={item.to}>{item.label}</Link>
						) : (
							item.label
						),
					})),
				]}
			/>
			{action && action}
		</div>
	);
}
