import classNames from "classnames";
import { CircleAlert, CircleCheck, Info } from "lucide-react";

type NoticeType = "error" | "success" | "info";

type NoticeProps = {
	type: NoticeType;
	title: string;
};

const styles: Record<NoticeType, string> = {
	error: "border-red-200 bg-red-50 text-red-700",
	success: "border-emerald-200 bg-emerald-50 text-emerald-800",
	info: "border-sky-200 bg-sky-50 text-sky-800",
};

const icons = {
	error: CircleAlert,
	success: CircleCheck,
	info: Info,
};

export function Notice({ type, title }: NoticeProps) {
	const Icon = icons[type];
	return (
		<div
			role={type === "error" ? "alert" : "status"}
			className={classNames(
				"flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
				styles[type],
			)}
		>
			<Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
			<p>{title}</p>
		</div>
	);
}
