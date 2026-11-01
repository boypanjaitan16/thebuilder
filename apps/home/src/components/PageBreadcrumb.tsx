import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { Link } from "./LocalizedLink";

type BreadcrumbItem = { label: string; to?: string };

type PageBreadcrumbProps = {
	items: BreadcrumbItem[];
};

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
	const { copy } = useI18n();
	const allItems = [{ label: copy.breadcrumb.home, to: "/" }, ...items];
	return (
		<nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-600">
			<ol className="flex flex-wrap items-center gap-2">
				{allItems.map((item, index) => (
					<li
						key={`${item.label}-${index}`}
						className="inline-flex items-center gap-2"
					>
						{index > 0 && <span aria-hidden="true">/</span>}
						{item.to ? (
							<Link to={item.to}>{item.label}</Link>
						) : (
							<span aria-current="page">{item.label}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
