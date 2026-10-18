import { Breadcrumb as AntdBreadCrumb } from "antd";
import { Link } from "react-router-dom";

export type BreadcrumbItem = {
	label: string;
	to?: string;
};

type BreadcrumbProps = {
	items: BreadcrumbItem[];
	action?: React.ReactNode;
};

export function Breadcrumb({ items, action }: BreadcrumbProps) {
	return (
		<div className="flex flex-row items-center gap-5 justify-between mb-5">
			<AntdBreadCrumb
				items={items.map((item) => ({
					title: item.to ? <Link to={item.to}>{item.label}</Link> : item.label,
				}))}
			/>
			{action && action}
		</div>
	);
}
