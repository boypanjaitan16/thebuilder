import { useI18n } from "../i18n/I18nProvider";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

type PageBreadcrumbProps = {
	items: BreadcrumbItem[];
};

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
	const { copy } = useI18n();
	return (
		<Breadcrumb items={[{ label: copy.breadcrumb.home, to: "/" }, ...items]} />
	);
}
